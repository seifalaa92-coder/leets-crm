"""
CLI entry point.

    python -m trading.backtest.run --smoke
    python -m trading.backtest.run --data ./data --symbols EURUSD GBPUSD XAUUSD
    python -m trading.backtest.run --data ./data --symbols EURUSD GBPUSD --walk-forward
"""

from __future__ import annotations

import argparse
import itertools
import sys

import pandas as pd

from .data import load_universe, synthetic_ohlc
from .engine import CostModel, run_backtest
from .metrics import compute_metrics, regime_breakdown, walk_forward
from .risk import RiskParams
from .strategy import StrategyParams
from .validate import daily_outcome_distribution, monte_carlo_trades, parameter_surface

# Placeholder cost models. REPLACE WITH YOUR OWN MEASURED VALUES before
# believing any output -- see 04-EXNESS-MT5-SETUP.md section 5. These assume a
# USD account on an Exness Raw Spread account (~$7/lot round turn).
DEFAULT_COSTS: dict[str, CostModel] = {
    "EURUSD": CostModel(0.00012, 7.0, 0.00003, 100_000, -3.0, 0.5),
    "GBPUSD": CostModel(0.00015, 7.0, 0.00004, 100_000, -3.5, 0.3),
    "AUDUSD": CostModel(0.00015, 7.0, 0.00004, 100_000, -2.0, -0.5),
    "USDCAD": CostModel(0.00018, 7.0, 0.00005, 100_000, -1.5, -1.5),
    "USDCHF": CostModel(0.00018, 7.0, 0.00005, 100_000, 1.0, -5.0),
    "USDJPY": CostModel(0.015, 7.0, 0.004, 1_000, 4.0, -8.0),
    "XAUUSD": CostModel(0.20, 7.0, 0.05, 100, -12.0, 4.0),
}


def _costs_for(symbols: list[str]) -> dict[str, CostModel]:
    out = {}
    for s in symbols:
        base = s.upper().rstrip("MZ") if s.upper() not in DEFAULT_COSTS else s.upper()
        model = DEFAULT_COSTS.get(s.upper()) or DEFAULT_COSTS.get(base)
        if model is None:
            print(f"  warn: no cost model for {s}; using EURUSD as a placeholder")
            model = DEFAULT_COSTS["EURUSD"]
        out[s] = model
    return out


def _affordability_check(data, costs, sp: StrategyParams, rp: RiskParams, equity: float) -> None:
    """
    Warn about symbols the account is too small to trade at the configured risk.

    Diversification is the entire source of this strategy's Sharpe ratio
    (01-RESEARCH.md section 2.1), so silently dropping instruments because the
    minimum lot doesn't fit is a real degradation, not a detail.
    """
    from .risk import min_equity_for
    from .strategy import compute_indicators

    unaffordable = []
    for sym, df in data.items():
        atr = compute_indicators(df, sp)["atr"].median()
        if pd.isna(atr):
            continue
        cm = costs[sym]
        need = min_equity_for(sp.atr_mult * atr, cm.point_value,
                              rp.risk_per_trade, cm.volume_min)
        if need > equity:
            unaffordable.append((sym, need))

    if unaffordable:
        print("  WARNING -- these symbols cannot be traded at this equity/risk:")
        for sym, need in sorted(unaffordable, key=lambda kv: -kv[1]):
            print(f"    {sym:<10} needs ~{need:,.0f} equity (have {equity:,.0f})")
        print("  They will be skipped, reducing diversification. Either raise")
        print("  equity, use a Cent account, or drop them from the universe.\n")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Donchian trend portfolio backtest")
    ap.add_argument("--data", help="directory of {SYMBOL}.csv MT5 exports")
    ap.add_argument("--symbols", nargs="+", default=["EURUSD", "GBPUSD", "XAUUSD"])
    ap.add_argument("--equity", type=float, default=10_000.0)
    ap.add_argument("--risk", type=float, default=0.005, help="risk per trade")
    ap.add_argument("--n-entry", type=int, default=55)
    ap.add_argument("--n-exit", type=int, default=20)
    ap.add_argument("--atr-mult", type=float, default=3.0)
    ap.add_argument("--cost-multiplier", type=float, default=1.0,
                    help="stress test: 1.5 and 2.0 must not kill the strategy")
    ap.add_argument("--walk-forward", action="store_true")
    ap.add_argument("--surface", action="store_true",
                    help="parameter robustness: mesa vs spike")
    ap.add_argument("--monte-carlo", type=int, default=0, metavar="N",
                    help="resample the trade sequence over N paths")
    ap.add_argument("--smoke", action="store_true",
                    help="run on synthetic data (plumbing check only)")
    args = ap.parse_args(argv)

    if args.smoke:
        print("SMOKE TEST -- synthetic data. Results carry no information about")
        print("the market; this only verifies the pipeline runs end to end.\n")
        data = {
            "EURUSD": synthetic_ohlc("EURUSD", start_price=1.10, ann_vol=0.08, seed=1),
            "GBPUSD": synthetic_ohlc("GBPUSD", start_price=1.30, ann_vol=0.09, seed=2),
            "XAUUSD": synthetic_ohlc("XAUUSD", start_price=1200, ann_vol=0.16, seed=3),
        }
    elif args.data:
        print(f"Loading from {args.data} ...")
        data = load_universe(args.data, args.symbols)
    else:
        ap.error("supply --data DIR or --smoke")
        return 2

    costs = _costs_for(list(data))
    if args.cost_multiplier != 1.0:
        m = args.cost_multiplier
        print(f"\nStress test: costs x{m}")
        costs = {
            s: CostModel(
                c.spread_price * m, c.commission_per_lot * m, c.slippage_price * m,
                c.point_value, c.swap_long, c.swap_short,
                c.volume_min, c.volume_max, c.volume_step,
            )
            for s, c in costs.items()
        }

    sp = StrategyParams(n_entry=args.n_entry, n_exit=args.n_exit, atr_mult=args.atr_mult)
    rp = RiskParams(risk_per_trade=args.risk)

    if args.walk_forward:
        grid = [
            StrategyParams(n_entry=ne, n_exit=nx, atr_mult=am)
            for ne, nx, am in itertools.product((40, 55, 80), (10, 20, 30), (2.5, 3.0, 4.0))
            if nx < ne
        ]
        print(f"\nWalk-forward over {len(grid)} parameter sets ...")
        print(walk_forward(data, costs, grid, rp, initial_equity=args.equity).report())
        return 0

    if args.surface:
        print("\nEvaluating parameter surface ...")
        print(parameter_surface(data, costs, rp=rp, initial_equity=args.equity).report())
        return 0

    print(f"\nUniverse: {', '.join(sorted(data))}")
    print(f"Params: n_entry={sp.n_entry} n_exit={sp.n_exit} atr_mult={sp.atr_mult}")
    print(f"Risk: {rp.risk_per_trade:.2%}/trade, vol target {rp.target_vol:.0%}\n")

    _affordability_check(data, costs, sp, rp, args.equity)

    res = run_backtest(data, costs, sp, rp, args.equity)
    print(compute_metrics(res).report())

    if res.rejections:
        print("\nEntry rejections (risk caps working as intended):")
        for reason, n in sorted(res.rejections.items(), key=lambda kv: -kv[1]):
            print(f"  {reason:<28} {n}")

    print()
    print(daily_outcome_distribution(res))

    if args.monte_carlo > 0 and res.trades:
        print()
        print(monte_carlo_trades(res, args.equity, n_paths=args.monte_carlo).report())

    regimes = regime_breakdown(res)
    if not regimes.empty:
        print("\nBy regime:")
        print(regimes.to_string(index=False, float_format=lambda v: f"{v:.3f}"))

    print("\nReminder: a backtest is a hypothesis. Walk-forward it, stress the")
    print("costs, then demo for 3 months before risking money.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
