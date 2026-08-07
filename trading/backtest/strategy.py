"""
Core strategy logic: Donchian time-series trend with ATR trailing stop.

Deliberately parameter-sparse (3 optimised parameters) per 01-RESEARCH.md section 5 --
every extra degree of freedom trades backtest beauty for live degradation.

Signals are computed on closed daily bars only. Every indicator is shifted by one
bar before use so that a decision at bar t can only ever see data through t-1.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd


@dataclass
class StrategyParams:
    # --- optimised (keep to 3, see 01-RESEARCH.md section 5) ---
    n_entry: int = 55           # Donchian entry lookback (days)
    n_exit: int = 20            # Donchian exit lookback (days)
    atr_mult: float = 3.0       # trailing + initial stop distance in ATRs

    # --- fixed, not optimised ---
    atr_period: int = 14
    vol_floor: float = 0.003    # min ATR/price; below this, costs dominate
    vol_ceiling: float = 0.05   # max ATR/price; above this, fills are unreliable

    def validate(self) -> None:
        if self.n_exit >= self.n_entry:
            raise ValueError(
                f"n_exit ({self.n_exit}) must be < n_entry ({self.n_entry}); "
                "otherwise the exit channel triggers before the entry can develop"
            )
        if self.atr_mult <= 0 or self.atr_period < 2:
            raise ValueError("atr_mult must be > 0 and atr_period >= 2")
        if not 0 <= self.vol_floor < self.vol_ceiling:
            raise ValueError("require 0 <= vol_floor < vol_ceiling")


def average_true_range(df: pd.DataFrame, period: int) -> pd.Series:
    """Wilder's ATR. Expects columns: high, low, close."""
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [
            df["high"] - df["low"],
            (df["high"] - prev_close).abs(),
            (df["low"] - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    # Wilder smoothing == EWM with alpha = 1/period
    return tr.ewm(alpha=1.0 / period, adjust=False, min_periods=period).mean()


def compute_indicators(df: pd.DataFrame, p: StrategyParams) -> pd.DataFrame:
    """
    Attach indicator columns to a single instrument's daily OHLC frame.

    Every returned indicator is shifted one bar: the value on row t describes the
    state as of the close of t-1. That makes look-ahead structurally impossible
    rather than something to remember not to do.
    """
    p.validate()
    out = df.copy()

    atr = average_true_range(out, p.atr_period)

    # Donchian channels over the *prior* n bars, excluding the current bar.
    upper_entry = out["high"].rolling(p.n_entry).max()
    lower_entry = out["low"].rolling(p.n_entry).min()
    upper_exit = out["high"].rolling(p.n_exit).max()
    lower_exit = out["low"].rolling(p.n_exit).min()

    out["atr"] = atr.shift(1)
    out["upper_entry"] = upper_entry.shift(1)
    out["lower_entry"] = lower_entry.shift(1)
    out["upper_exit"] = upper_exit.shift(1)
    out["lower_exit"] = lower_exit.shift(1)

    # Volatility gate, also lagged.
    vol_ratio = (atr / out["close"]).shift(1)
    out["vol_ok"] = (vol_ratio >= p.vol_floor) & (vol_ratio <= p.vol_ceiling)
    out["vol_ratio"] = vol_ratio

    return out


def entry_signal(row: pd.Series) -> int:
    """
    Return +1 (long), -1 (short) or 0 (no signal) for a closed bar.

    Breakout is evaluated on the close against the prior channel, consistent with
    the once-per-day evaluation in 02-STRATEGY.md -- no intrabar triggering.
    """
    if not bool(row.get("vol_ok", False)):
        return 0
    if pd.isna(row.get("upper_entry")) or pd.isna(row.get("lower_entry")):
        return 0

    close = row["close"]
    if close > row["upper_entry"]:
        return 1
    if close < row["lower_entry"]:
        return -1
    return 0


@dataclass
class Position:
    symbol: str
    direction: int          # +1 long, -1 short
    entry_date: pd.Timestamp
    entry_price: float
    lots: float
    stop: float             # current (broker-side) stop price
    atr_at_entry: float
    high_water: float       # best close seen since entry, in the trade's favour
    bars_held: int = 0
    accrued_swap: float = 0.0   # account-currency swap paid/earned so far
    entry_cost: float = 0.0     # cost already charged at entry

    def update_trailing_stop(self, close: float, atr: float, atr_mult: float) -> None:
        """
        Ratchet the stop in the favourable direction only. It never loosens --
        see 02-STRATEGY.md: widening a stop is how a trend system becomes a
        martingale.
        """
        if self.direction > 0:
            self.high_water = max(self.high_water, close)
            self.stop = max(self.stop, self.high_water - atr_mult * atr)
        else:
            self.high_water = min(self.high_water, close)
            self.stop = min(self.stop, self.high_water + atr_mult * atr)


def exit_signal(pos: Position, row: pd.Series, p: StrategyParams) -> str | None:
    """
    Decide whether an open position closes on this bar.

    Returns the reason ('stop' | 'donchian') or None. Stop is checked against the
    bar's low/high rather than its close, because a broker-side stop fills
    intrabar -- checking the close would understate losses, which is the classic
    way a daily backtest flatters a strategy.
    """
    if pos.direction > 0:
        if row["low"] <= pos.stop:
            return "stop"
        if not pd.isna(row.get("lower_exit")) and row["close"] < row["lower_exit"]:
            return "donchian"
    else:
        if row["high"] >= pos.stop:
            return "stop"
        if not pd.isna(row.get("upper_exit")) and row["close"] > row["upper_exit"]:
            return "donchian"
    return None
