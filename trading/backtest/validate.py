"""
Robustness validation: parameter surfaces and Monte Carlo resampling.

01-RESEARCH.md section 5 asks for two things that a single backtest number
cannot answer:

  1. "Prefer a robust plateau over a sharp optimum -- plot the parameter
     surface; you want a mesa, not a spike."
  2. How bad can the drawdown get on a path you did not happen to observe?

A backtest is ONE realisation of a stochastic process. Its max drawdown is a
sample, not a bound -- the trade sequence could easily have arrived in a worse
order. Monte Carlo resampling turns that single path into a distribution, which
is what you actually need to size risk and to set expectations about losing
streaks.
"""

from __future__ import annotations

import itertools
from dataclasses import dataclass

import numpy as np
import pandas as pd

from .engine import BacktestResult, CostModel, run_backtest
from .metrics import TRADING_DAYS, compute_metrics
from .risk import RiskParams
from .strategy import StrategyParams


# --------------------------------------------------------------------------
# Parameter surface
# --------------------------------------------------------------------------

@dataclass
class SurfaceResult:
    table: pd.DataFrame            # one row per parameter combination
    best: dict
    plateau_score: float           # 0..1; how stable the best point's neighbourhood is

    @property
    def verdict(self) -> str:
        if self.plateau_score >= 0.7:
            return "MESA -- parameters are robust"
        if self.plateau_score >= 0.4:
            return "RIDGE -- usable, but prefer the centre of the flat region"
        return "SPIKE -- the optimum is noise; do not trade these parameters"

    def report(self) -> str:
        lines = ["=" * 58, "PARAMETER SURFACE", "=" * 58]
        top = self.table.nlargest(10, "sharpe")
        lines.append(top.to_string(index=False, float_format=lambda v: f"{v:.3f}"))
        lines += [
            "",
            f"  Best: n_entry={self.best['n_entry']} n_exit={self.best['n_exit']} "
            f"atr_mult={self.best['atr_mult']}  Sharpe {self.best['sharpe']:.3f}",
            f"  Plateau score          {self.plateau_score:.2f}",
            f"  Verdict: {self.verdict}",
            "",
            "  A high Sharpe at an isolated point is the signature of curve",
            "  fitting. Trade the centre of a flat region instead -- it will",
            "  backtest worse and live better.",
            "=" * 58,
        ]
        return "\n".join(lines)


def parameter_surface(
    data: dict[str, pd.DataFrame],
    costs: dict[str, CostModel],
    entry_range: tuple[int, ...] = (40, 45, 50, 55, 60, 70, 80),
    exit_range: tuple[int, ...] = (10, 15, 20, 25, 30),
    atr_range: tuple[float, ...] = (2.5, 3.0, 3.5, 4.0),
    rp: RiskParams | None = None,
    initial_equity: float = 10_000.0,
) -> SurfaceResult:
    """
    Evaluate a parameter grid and measure whether the optimum sits on a plateau.

    The plateau score is the fraction of the best point's immediate neighbours
    (one grid step away in any single dimension) that retain at least 70% of its
    Sharpe. A genuine edge degrades gracefully as parameters move; an artifact
    falls off a cliff.
    """
    rp = rp or RiskParams()
    rows = []

    for ne, nx, am in itertools.product(entry_range, exit_range, atr_range):
        if nx >= ne:
            continue
        sp = StrategyParams(n_entry=ne, n_exit=nx, atr_mult=am)
        try:
            m = compute_metrics(run_backtest(data, costs, sp, rp, initial_equity))
        except (ValueError, ZeroDivisionError):
            continue
        rows.append(
            {
                "n_entry": ne,
                "n_exit": nx,
                "atr_mult": am,
                "sharpe": m.sharpe,
                "cagr": m.cagr,
                "max_dd": m.max_drawdown,
                "trades": m.n_trades,
            }
        )

    if not rows:
        raise ValueError("no parameter combination produced a valid backtest")

    table = pd.DataFrame(rows)
    best_row = table.loc[table["sharpe"].idxmax()]
    best = best_row.to_dict()

    plateau = _plateau_score(table, best, entry_range, exit_range, atr_range)
    return SurfaceResult(table=table, best=best, plateau_score=plateau)


def _plateau_score(
    table: pd.DataFrame,
    best: dict,
    entry_range: tuple[int, ...],
    exit_range: tuple[int, ...],
    atr_range: tuple[float, ...],
) -> float:
    """Fraction of immediate grid neighbours retaining >= 70% of the best Sharpe."""
    best_sharpe = best["sharpe"]
    if best_sharpe <= 0:
        return 0.0

    def neighbours(value, options):
        opts = sorted(options)
        i = opts.index(value)
        out = []
        if i > 0:
            out.append(opts[i - 1])
        if i < len(opts) - 1:
            out.append(opts[i + 1])
        return out

    candidates = []
    for ne in neighbours(int(best["n_entry"]), entry_range):
        candidates.append((ne, int(best["n_exit"]), float(best["atr_mult"])))
    for nx in neighbours(int(best["n_exit"]), exit_range):
        candidates.append((int(best["n_entry"]), nx, float(best["atr_mult"])))
    for am in neighbours(float(best["atr_mult"]), atr_range):
        candidates.append((int(best["n_entry"]), int(best["n_exit"]), am))

    found, held = 0, 0
    for ne, nx, am in candidates:
        match = table[
            (table["n_entry"] == ne)
            & (table["n_exit"] == nx)
            & (np.isclose(table["atr_mult"], am))
        ]
        if match.empty:
            continue
        found += 1
        if match.iloc[0]["sharpe"] >= 0.7 * best_sharpe:
            held += 1

    return held / found if found else 0.0


# --------------------------------------------------------------------------
# Monte Carlo
# --------------------------------------------------------------------------

@dataclass
class MonteCarloResult:
    final_equities: np.ndarray
    max_drawdowns: np.ndarray
    initial_equity: float
    ruin_threshold: float

    @property
    def risk_of_ruin(self) -> float:
        return float((self.final_equities <= self.initial_equity * self.ruin_threshold).mean())

    @property
    def prob_loss(self) -> float:
        return float((self.final_equities < self.initial_equity).mean())

    def report(self) -> str:
        fe = self.final_equities / self.initial_equity - 1.0
        # Drawdowns are stored negative; report magnitudes so that a higher
        # percentile means a WORSE outcome, which is how the numbers read.
        dd = np.abs(self.max_drawdowns)
        q = lambda a, p: float(np.percentile(a, p))  # noqa: E731

        return "\n".join(
            [
                "=" * 58,
                f"MONTE CARLO  ({len(fe):,} resampled paths)",
                "=" * 58,
                "  Total return distribution:",
                f"    5th pct   {q(fe, 5):>10.2%}",
                f"    25th pct  {q(fe, 25):>10.2%}",
                f"    median    {q(fe, 50):>10.2%}",
                f"    75th pct  {q(fe, 75):>10.2%}",
                f"    95th pct  {q(fe, 95):>10.2%}",
                "",
                "  Max drawdown distribution (depth, worse = larger):",
                f"    median    {q(dd, 50):>10.2%}",
                f"    75th pct  {q(dd, 75):>10.2%}",
                f"    95th pct  {q(dd, 95):>10.2%}",
                f"    worst     {float(dd.max()):>10.2%}",
                "",
                f"  P(ending below start)     {self.prob_loss:>8.2%}",
                f"  P(losing {(1 - self.ruin_threshold):.0%}+ of capital) {self.risk_of_ruin:>8.2%}",
                "=" * 58,
                "  Size risk against the 95th-percentile drawdown, not the one",
                "  your backtest happened to produce. The same trades in a",
                "  different order routinely give a much deeper hole.",
                "=" * 58,
            ]
        )


def monte_carlo_trades(
    res: BacktestResult,
    initial_equity: float = 10_000.0,
    n_paths: int = 5_000,
    ruin_threshold: float = 0.5,
    seed: int = 0,
) -> MonteCarloResult:
    """
    Bootstrap the trade sequence to get drawdown and return distributions.

    Trades are resampled with replacement and replayed in random order. This
    holds the strategy's per-trade P&L distribution fixed while destroying the
    particular ordering the backtest happened to see -- which is exactly the
    part of a backtest that does not generalise.

    Returns are compounded so that sizing scales with equity, matching the live
    percentage-risk model rather than assuming fixed stakes.
    """
    if not res.trades:
        raise ValueError("no trades to resample")

    # Convert to fractional P&L so compounding is well defined.
    eq = res.equity_curve
    scale = eq.iloc[0] if len(eq) else initial_equity
    pnl_fractions = np.array([t.net_pnl / scale for t in res.trades], dtype=float)

    rng = np.random.default_rng(seed)
    n = len(pnl_fractions)

    finals = np.empty(n_paths)
    max_dds = np.empty(n_paths)

    for i in range(n_paths):
        draw = rng.choice(pnl_fractions, size=n, replace=True)
        equity = initial_equity
        peak = initial_equity
        worst = 0.0
        for frac in draw:
            equity *= (1.0 + frac)
            if equity <= 0:
                equity = 0.0
                worst = -1.0
                break
            peak = max(peak, equity)
            worst = min(worst, equity / peak - 1.0)
        finals[i] = equity
        max_dds[i] = worst

    return MonteCarloResult(finals, max_dds, initial_equity, ruin_threshold)


def daily_outcome_distribution(res: BacktestResult) -> str:
    """
    Answer the 'small consistent daily profits' question with numbers.

    Reports the actual distribution of daily P&L and the length of losing
    streaks, so expectations are set by data rather than by hope.
    """
    r = res.daily_returns
    if len(r) < 20:
        return "insufficient data for a daily distribution"

    # Longest run of consecutive negative days.
    longest, current = 0, 0
    for v in r:
        if v < 0:
            current += 1
            longest = max(longest, current)
        else:
            current = 0

    losing = r[r < 0]
    winning = r[r > 0]

    return "\n".join(
        [
            "=" * 58,
            "DAILY OUTCOME DISTRIBUTION",
            "=" * 58,
            f"  Profitable days           {float((r > 0).mean()):>10.2%}",
            f"  Flat days (no position)   {float((r == 0).mean()):>10.2%}",
            f"  Losing days               {float((r < 0).mean()):>10.2%}",
            "",
            f"  Mean winning day          {float(winning.mean()) if len(winning) else 0:>10.3%}",
            f"  Mean losing day           {float(losing.mean()) if len(losing) else 0:>10.3%}",
            f"  Worst day                 {float(r.min()):>10.3%}",
            f"  Best day                  {float(r.max()):>10.3%}",
            "",
            f"  Longest losing streak     {longest:>7d} days",
            f"  Daily volatility          {float(r.std(ddof=1)):>10.3%}",
            f"  Annualised volatility     {float(r.std(ddof=1)) * np.sqrt(TRADING_DAYS):>10.2%}",
            "=" * 58,
            "  This is what 'consistent daily profit' actually looks like for a",
            "  system with positive expectancy. If a strategy shows 90%+",
            "  profitable days, it is hiding losses in open positions rather",
            "  than avoiding them -- check for a missing or widening stop.",
            "=" * 58,
        ]
    )
