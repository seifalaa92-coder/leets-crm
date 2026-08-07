"""
Performance metrics and walk-forward validation.

The number that decides whether a strategy is real is walk-forward efficiency,
not any in-sample result (01-RESEARCH.md section 5).
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from .engine import BacktestResult, CostModel, run_backtest
from .risk import RiskParams
from .strategy import StrategyParams

TRADING_DAYS = 252


@dataclass
class Metrics:
    total_return: float
    cagr: float
    ann_vol: float
    sharpe: float
    sortino: float
    max_drawdown: float
    calmar: float
    win_rate: float
    profit_factor: float
    avg_win_loss: float
    n_trades: int
    pct_profitable_days: float
    pct_profitable_months: float
    longest_flat_days: int
    total_costs: float

    def report(self) -> str:
        return "\n".join(
            [
                "=" * 46,
                "PERFORMANCE",
                "=" * 46,
                f"  Total return          {self.total_return:>12.2%}",
                f"  CAGR                  {self.cagr:>12.2%}",
                f"  Annualised vol        {self.ann_vol:>12.2%}",
                f"  Sharpe                {self.sharpe:>12.2f}",
                f"  Sortino               {self.sortino:>12.2f}",
                f"  Max drawdown          {self.max_drawdown:>12.2%}",
                f"  Calmar                {self.calmar:>12.2f}",
                "",
                f"  Trades                {self.n_trades:>12d}",
                f"  Win rate              {self.win_rate:>12.2%}",
                f"  Profit factor         {self.profit_factor:>12.2f}",
                f"  Avg win / avg loss    {self.avg_win_loss:>12.2f}",
                f"  Total costs paid      {self.total_costs:>12.2f}",
                "",
                f"  Profitable days       {self.pct_profitable_days:>12.2%}",
                f"  Profitable months     {self.pct_profitable_months:>12.2%}",
                f"  Longest flat stretch  {self.longest_flat_days:>9d} days",
                "=" * 46,
                "Sanity checks (02-STRATEGY.md):",
                f"  win rate in 35-45%?      {'yes' if 0.30 <= self.win_rate <= 0.50 else 'NO -- investigate'}",
                f"  avg win/loss >= 2.0?     {'yes' if self.avg_win_loss >= 2.0 else 'NO -- investigate'}",
                f"  Sharpe <= 1.5?           {'yes' if self.sharpe <= 1.5 else 'NO -- likely overfit or a bug'}",
                "=" * 46,
            ]
        )


def compute_metrics(res: BacktestResult) -> Metrics:
    eq = res.equity_curve
    rets = res.daily_returns

    if len(eq) < 2:
        raise ValueError("equity curve too short to compute metrics")

    total_return = eq.iloc[-1] / eq.iloc[0] - 1.0
    years = max((eq.index[-1] - eq.index[0]).days / 365.25, 1e-9)
    cagr = (eq.iloc[-1] / eq.iloc[0]) ** (1 / years) - 1.0

    ann_vol = float(rets.std(ddof=1)) * np.sqrt(TRADING_DAYS) if len(rets) > 1 else 0.0
    sharpe = (float(rets.mean()) * TRADING_DAYS / ann_vol) if ann_vol > 0 else 0.0

    downside = rets[rets < 0]
    dvol = float(downside.std(ddof=1)) * np.sqrt(TRADING_DAYS) if len(downside) > 1 else 0.0
    sortino = (float(rets.mean()) * TRADING_DAYS / dvol) if dvol > 0 else 0.0

    running_peak = eq.cummax()
    dd = eq / running_peak - 1.0
    max_dd = float(dd.min())
    calmar = cagr / abs(max_dd) if max_dd < 0 else 0.0

    wins = [t for t in res.trades if t.net_pnl > 0]
    losses = [t for t in res.trades if t.net_pnl <= 0]
    win_rate = len(wins) / len(res.trades) if res.trades else 0.0

    gross_win = sum(t.net_pnl for t in wins)
    gross_loss = abs(sum(t.net_pnl for t in losses))
    profit_factor = gross_win / gross_loss if gross_loss > 0 else float("inf")

    avg_win = gross_win / len(wins) if wins else 0.0
    avg_loss = gross_loss / len(losses) if losses else 0.0
    avg_win_loss = avg_win / avg_loss if avg_loss > 0 else float("inf")

    monthly = eq.resample("ME").last().pct_change().dropna()

    # Longest stretch without making a new equity high -- the number that
    # actually determines whether a trader sticks with the system.
    flat, longest = 0, 0
    peak = eq.iloc[0]
    for v in eq:
        if v >= peak:
            peak, flat = v, 0
        else:
            flat += 1
            longest = max(longest, flat)

    return Metrics(
        total_return=total_return,
        cagr=cagr,
        ann_vol=ann_vol,
        sharpe=sharpe,
        sortino=sortino,
        max_drawdown=max_dd,
        calmar=calmar,
        win_rate=win_rate,
        profit_factor=profit_factor,
        avg_win_loss=avg_win_loss,
        n_trades=len(res.trades),
        pct_profitable_days=float((rets > 0).mean()) if len(rets) else 0.0,
        pct_profitable_months=float((monthly > 0).mean()) if len(monthly) else 0.0,
        longest_flat_days=longest,
        total_costs=sum(t.costs for t in res.trades),
    )


# --------------------------------------------------------------------------
# Walk-forward validation
# --------------------------------------------------------------------------

@dataclass
class WalkForwardResult:
    in_sample_sharpes: list[float]
    out_sample_sharpes: list[float]
    efficiency: float
    windows: list[tuple[pd.Timestamp, pd.Timestamp, pd.Timestamp]]

    @property
    def verdict(self) -> str:
        if self.efficiency > 0.7:
            return "ROBUST -- proceed to Strategy Tester"
        if self.efficiency >= 0.5:
            return "MARGINAL -- reduce complexity before proceeding"
        return "CURVE-FITTED -- discard this parameter set"

    def report(self) -> str:
        lines = ["=" * 46, "WALK-FORWARD", "=" * 46]
        for i, (s, m, e) in enumerate(self.windows):
            lines.append(
                f"  {i + 1}: IS {s.date()}->{m.date()} "
                f"Sharpe {self.in_sample_sharpes[i]:+.2f} | "
                f"OOS ->{e.date()} Sharpe {self.out_sample_sharpes[i]:+.2f}"
            )
        lines += [
            "",
            f"  Walk-forward efficiency  {self.efficiency:.2f}",
            f"  Verdict: {self.verdict}",
            "=" * 46,
        ]
        return "\n".join(lines)


def walk_forward(
    data: dict[str, pd.DataFrame],
    costs: dict[str, CostModel],
    param_grid: list[StrategyParams],
    rp: RiskParams | None = None,
    train_years: int = 3,
    test_years: int = 1,
    initial_equity: float = 10_000.0,
) -> WalkForwardResult:
    """
    Rolling optimise-then-test.

    On each window the best parameter set is chosen on the training block and
    then applied, unchanged, to the next unseen block. Efficiency is the ratio
    of mean out-of-sample Sharpe to mean in-sample Sharpe -- below 0.5 means the
    optimisation was fitting noise.
    """
    rp = rp or RiskParams()
    all_dates = sorted(set().union(*(df.index for df in data.values())))
    start, end = all_dates[0], all_dates[-1]

    is_sharpes: list[float] = []
    oos_sharpes: list[float] = []
    windows: list[tuple[pd.Timestamp, pd.Timestamp, pd.Timestamp]] = []

    train_start = start
    while True:
        train_end = train_start + pd.DateOffset(years=train_years)
        test_end = train_end + pd.DateOffset(years=test_years)
        if test_end > end:
            break

        train = _slice(data, train_start, train_end)
        test = _slice(data, train_end, test_end)

        best_sharpe, best_params = -np.inf, param_grid[0]
        for params in param_grid:
            try:
                m = compute_metrics(run_backtest(train, costs, params, rp, initial_equity))
            except (ValueError, ZeroDivisionError):
                continue
            if m.sharpe > best_sharpe:
                best_sharpe, best_params = m.sharpe, params

        try:
            oos = compute_metrics(run_backtest(test, costs, best_params, rp, initial_equity))
        except (ValueError, ZeroDivisionError):
            train_start += pd.DateOffset(years=test_years)
            continue

        is_sharpes.append(best_sharpe)
        oos_sharpes.append(oos.sharpe)
        windows.append((train_start, train_end, test_end))
        train_start += pd.DateOffset(years=test_years)

    if not is_sharpes:
        raise ValueError(
            "no complete walk-forward window -- need at least "
            f"{train_years + test_years} years of data"
        )

    mean_is = float(np.mean(is_sharpes))
    mean_oos = float(np.mean(oos_sharpes))
    efficiency = mean_oos / mean_is if mean_is > 0 else 0.0

    return WalkForwardResult(is_sharpes, oos_sharpes, efficiency, windows)


def _slice(
    data: dict[str, pd.DataFrame], start: pd.Timestamp, end: pd.Timestamp
) -> dict[str, pd.DataFrame]:
    out = {}
    for sym, df in data.items():
        sub = df[(df.index >= start) & (df.index < end)]
        if len(sub) > 100:   # need enough history for the indicators to warm up
            out[sym] = sub
    return out


def regime_breakdown(res: BacktestResult) -> pd.DataFrame:
    """
    Per-regime performance. A strategy that only works in one regime is a bet on
    that regime; averaging it away hides that.
    """
    regimes = [
        ("2015-2018 rate compression", "2015-01-01", "2018-12-31"),
        ("2019-2021 ZIRP + COVID", "2019-01-01", "2021-12-31"),
        ("2022-2023 hiking cycle", "2022-01-01", "2023-12-31"),
        ("2024-2026 recent", "2024-01-01", "2026-12-31"),
    ]
    rets = res.daily_returns
    rows = []
    for name, s, e in regimes:
        sub = rets[(rets.index >= s) & (rets.index <= e)]
        if len(sub) < 20:
            continue
        vol = float(sub.std(ddof=1)) * np.sqrt(TRADING_DAYS)
        rows.append(
            {
                "regime": name,
                "days": len(sub),
                "return": (1 + sub).prod() - 1,
                "ann_vol": vol,
                "sharpe": float(sub.mean()) * TRADING_DAYS / vol if vol > 0 else 0.0,
            }
        )
    return pd.DataFrame(rows)
