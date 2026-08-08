"""
Live-vs-backtest reconciliation.

03-RISK.md section 7 calls the weekly cost review the check people skip and the
one that catches degradation earliest: realised costs drift above backtest
assumptions long before the equity curve visibly rolls over. This module does
that comparison from an MT5 trade-history export.

Usage:
    python -m trading.backtest.reconcile --history trading/data/history.csv \\
        --symbol EURUSD --assumed-cost-points 1.5
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd


@dataclass
class CostReport:
    symbol: str
    n_trades: int
    realised_cost_points: float       # median round-trip cost, in points
    p90_cost_points: float
    assumed_cost_points: float
    total_commission: float
    total_swap: float
    gross_pnl: float
    net_pnl: float

    @property
    def cost_ratio(self) -> float:
        if self.assumed_cost_points <= 0:
            return float("nan")
        return self.realised_cost_points / self.assumed_cost_points

    @property
    def verdict(self) -> str:
        r = self.cost_ratio
        if np.isnan(r):
            return "no assumption supplied"
        if r <= 1.1:
            return "OK -- realised costs match the model"
        if r <= 1.5:
            return "DRIFT -- re-run the backtest with the higher figure"
        return "BROKEN -- costs far exceed the model; expectancy is likely gone"

    def report(self) -> str:
        cost_drag = (
            abs(self.gross_pnl - self.net_pnl) / abs(self.gross_pnl)
            if self.gross_pnl
            else float("nan")
        )
        return "\n".join(
            [
                "=" * 58,
                f"COST RECONCILIATION -- {self.symbol}",
                "=" * 58,
                f"  Closed trades             {self.n_trades:>12d}",
                f"  Realised cost (median)    {self.realised_cost_points:>12.2f} points",
                f"  Realised cost (p90)       {self.p90_cost_points:>12.2f} points",
                f"  Assumed in backtest       {self.assumed_cost_points:>12.2f} points",
                f"  Ratio realised/assumed    {self.cost_ratio:>12.2f}",
                "",
                f"  Total commission          {self.total_commission:>12.2f}",
                f"  Total swap                {self.total_swap:>12.2f}",
                f"  Gross P&L                 {self.gross_pnl:>12.2f}",
                f"  Net P&L                   {self.net_pnl:>12.2f}",
                f"  Cost drag on gross        {cost_drag:>12.1%}",
                "",
                f"  Verdict: {self.verdict}",
                "=" * 58,
            ]
        )


def load_mt5_history(path: str | Path) -> pd.DataFrame:
    """
    Load an MT5 trade-history export.

    In MT5: Toolbox -> History tab -> right-click -> Report -> XLSX/HTML, or
    save the deals list as CSV. Column names vary by build and language, so we
    normalise the ones we need and fail loudly if they're absent.
    """
    df = pd.read_csv(Path(path), sep=None, engine="python")
    df.columns = [str(c).strip().strip("<>").lower().replace(" ", "_") for c in df.columns]

    aliases = {
        "symbol": ("symbol", "item"),
        "volume": ("volume", "size", "lots"),
        "profit": ("profit", "pnl"),
        "commission": ("commission", "fee"),
        "swap": ("swap", "storage"),
        "price": ("price", "open_price"),
        "type": ("type", "direction"),
    }

    resolved: dict[str, str] = {}
    for canonical, options in aliases.items():
        for opt in options:
            if opt in df.columns:
                resolved[canonical] = opt
                break

    for required in ("symbol", "volume", "profit"):
        if required not in resolved:
            raise ValueError(
                f"{path}: could not find a '{required}' column. "
                f"Available: {sorted(df.columns)}"
            )

    out = pd.DataFrame(
        {
            "symbol": df[resolved["symbol"]].astype(str).str.strip(),
            "volume": pd.to_numeric(df[resolved["volume"]], errors="coerce"),
            "profit": pd.to_numeric(df[resolved["profit"]], errors="coerce"),
        }
    )
    for optional in ("commission", "swap", "price"):
        col = resolved.get(optional)
        out[optional] = (
            pd.to_numeric(df[col], errors="coerce").fillna(0.0) if col else 0.0
        )

    return out.dropna(subset=["volume", "profit"])


def reconcile(
    history: pd.DataFrame,
    symbol: str,
    point_value: float,
    point_size: float,
    assumed_cost_points: float = 0.0,
) -> CostReport:
    """
    Compare realised per-trade costs against the backtest assumption.

    Realised cost per trade is taken as commission + swap expressed in points,
    which is the part MT5 reports explicitly. Spread and slippage show up inside
    'profit' and cannot be separated from a history export alone -- to measure
    those you need requested-vs-fill logging (see 04-EXNESS-MT5-SETUP.md s5).
    """
    sub = history[history["symbol"].str.upper().str.startswith(symbol.upper())]
    if sub.empty:
        raise ValueError(f"no trades found for {symbol}")

    if point_value <= 0 or point_size <= 0:
        raise ValueError("point_value and point_size must be positive")

    # Cost in account currency per trade, converted to points.
    cost_ccy = sub["commission"].abs() + sub["swap"].abs()
    lots = sub["volume"].replace(0, np.nan)
    cost_points = (cost_ccy / (lots * point_value * point_size)).dropna()

    gross = float(sub["profit"].sum())
    net = float(sub["profit"].sum() + sub["commission"].sum() + sub["swap"].sum())

    return CostReport(
        symbol=symbol,
        n_trades=len(sub),
        realised_cost_points=float(cost_points.median()) if len(cost_points) else 0.0,
        p90_cost_points=float(np.percentile(cost_points, 90)) if len(cost_points) else 0.0,
        assumed_cost_points=assumed_cost_points,
        total_commission=float(sub["commission"].sum()),
        total_swap=float(sub["swap"].sum()),
        gross_pnl=gross,
        net_pnl=net,
    )


def tracking_check(
    live_returns: pd.Series,
    backtest_sharpe: float,
    backtest_vol: float,
) -> str:
    """
    Is live performance inside the range the backtest implies, or has the edge gone?

    The honest answer over a few months is almost always "cannot tell yet" --
    the confidence interval on a Sharpe estimate is very wide at short horizons.
    Saying so is more useful than a false verdict, so that is what this returns.
    """
    n = len(live_returns)
    if n < 20:
        return "Insufficient live history (need 20+ days)."

    years = n / 252.0
    live_vol = float(live_returns.std(ddof=1)) * np.sqrt(252)
    live_sharpe = (float(live_returns.mean()) * 252 / live_vol) if live_vol > 0 else 0.0

    # Standard error of a Sharpe estimate is roughly sqrt((1 + S^2/2) / T).
    se = np.sqrt((1.0 + backtest_sharpe**2 / 2.0) / max(years, 1e-9))
    lo, hi = backtest_sharpe - 1.96 * se, backtest_sharpe + 1.96 * se

    inside = lo <= live_sharpe <= hi
    lines = [
        "=" * 58,
        "LIVE TRACKING",
        "=" * 58,
        f"  Live days                 {n:>12d}  ({years:.2f} years)",
        f"  Live Sharpe               {live_sharpe:>12.2f}",
        f"  Backtest Sharpe           {backtest_sharpe:>12.2f}",
        f"  95% CI at this horizon    [{lo:.2f}, {hi:.2f}]",
        f"  Live vol / backtest vol   {(live_vol / backtest_vol if backtest_vol else float('nan')):>12.2f}",
        "",
    ]

    if inside:
        lines.append("  Live is INSIDE the expected range -- keep going.")
    else:
        lines.append("  Live is OUTSIDE the expected range -- investigate before scaling.")

    if years < 1.0:
        lines += [
            "",
            "  Note: at this horizon the CI is very wide, so 'inside the range'",
            "  is weak evidence. It takes years, not months, to distinguish a",
            "  working strategy from a lucky one. Judge execution quality and",
            "  cost drift instead -- those converge much faster.",
        ]

    lines.append("=" * 58)
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Reconcile live costs vs backtest")
    ap.add_argument("--history", required=True, help="MT5 trade history CSV")
    ap.add_argument("--symbol", required=True)
    ap.add_argument("--point-value", type=float, default=100_000.0,
                    help="account ccy per lot per 1.0 price move")
    ap.add_argument("--point-size", type=float, default=0.00001,
                    help="SYMBOL_POINT for this instrument")
    ap.add_argument("--assumed-cost-points", type=float, default=0.0)
    args = ap.parse_args(argv)

    hist = load_mt5_history(args.history)
    rep = reconcile(hist, args.symbol, args.point_value, args.point_size,
                    args.assumed_cost_points)
    print(rep.report())
    return 0


if __name__ == "__main__":
    sys.exit(main())
