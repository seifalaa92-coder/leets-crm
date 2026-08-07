"""
Portfolio backtest engine.

Design constraints that matter for honesty of results:
  * Signals use only data through the previous close (enforced in strategy.py).
  * Entries fill on the NEXT bar's open, never on the signal bar's close.
  * Stops are checked against the bar's low/high, so they fill intrabar.
  * Costs (spread + commission + slippage) are charged on entry AND exit.
  * Swap accrues per night held, with triple-swap Wednesdays.

Each of those, omitted, makes a backtest look better than reality. They are the
difference between a modelled edge and a real one.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from .risk import (
    DrawdownGovernor,
    RiskParams,
    bucket_of,
    can_open,
    position_size,
)
from .strategy import (
    Position,
    StrategyParams,
    compute_indicators,
    entry_signal,
    exit_signal,
)


@dataclass
class CostModel:
    """
    Per-symbol trading costs. Populate from your OWN measured spreads
    (04-EXNESS-MT5-SETUP.md section 5), not from advertised 'from 0.0 pips'.
    """

    spread_price: float          # typical spread in price units (median)
    commission_per_lot: float    # account currency, per lot, ROUND TURN
    slippage_price: float        # expected slippage in price units, per side
    point_value: float           # account ccy P&L per 1.0 lot per 1.0 price move
    swap_long: float = 0.0       # account ccy per lot per night, long
    swap_short: float = 0.0      # account ccy per lot per night, short
    volume_min: float = 0.01
    volume_max: float = 100.0
    volume_step: float = 0.01

    def entry_cost(self, lots: float) -> float:
        """Half the spread + slippage + half the round-turn commission."""
        return (
            (self.spread_price / 2.0 + self.slippage_price) * lots * self.point_value
            + self.commission_per_lot * lots / 2.0
        )

    def exit_cost(self, lots: float) -> float:
        return self.entry_cost(lots)


@dataclass
class Trade:
    symbol: str
    direction: int
    entry_date: pd.Timestamp
    exit_date: pd.Timestamp
    entry_price: float
    exit_price: float
    lots: float
    gross_pnl: float
    costs: float
    swap: float
    net_pnl: float
    reason: str
    bars_held: int


@dataclass
class BacktestResult:
    equity_curve: pd.Series
    trades: list[Trade]
    daily_returns: pd.Series
    rejections: dict[str, int] = field(default_factory=dict)


def _swap_nights(prev: pd.Timestamp, cur: pd.Timestamp) -> float:
    """
    Swap nights accrued between two consecutive daily bars.

    Wednesday rollover is charged triple on many Exness symbols including
    XAUUSD; for a strategy holding positions for weeks this is not a rounding
    error (03-RISK.md section 6).
    """
    nights = max((cur.normalize() - prev.normalize()).days, 0)
    if nights == 0:
        return 0.0
    total = 0.0
    for i in range(nights):
        day = (prev.normalize() + pd.Timedelta(days=i + 1))
        total += 3.0 if day.weekday() == 2 else 1.0  # Wednesday == 2
    return total


def run_backtest(
    data: dict[str, pd.DataFrame],
    costs: dict[str, CostModel],
    sp: StrategyParams | None = None,
    rp: RiskParams | None = None,
    initial_equity: float = 10_000.0,
) -> BacktestResult:
    """
    Run the portfolio backtest.

    data  : symbol -> DataFrame indexed by date with columns open/high/low/close
    costs : symbol -> CostModel

    Returns equity curve, trade list, daily returns and a tally of why entries
    were rejected (useful for spotting a universe that is too small to ever fill
    its risk budget).
    """
    sp = sp or StrategyParams()
    rp = rp or RiskParams()
    sp.validate()

    missing = set(data) - set(costs)
    if missing:
        raise ValueError(f"no CostModel supplied for: {sorted(missing)}")

    ind = {sym: compute_indicators(df, sp) for sym, df in data.items()}

    # Union of all dates so instruments with different holiday calendars align.
    all_dates = sorted(set().union(*(df.index for df in ind.values())))

    equity = initial_equity
    gov = DrawdownGovernor(peak_equity=initial_equity)
    open_positions: dict[str, Position] = {}
    open_risk: dict[str, tuple[str, int, float]] = {}
    trades: list[Trade] = []
    curve: list[tuple[pd.Timestamp, float]] = []
    rejections: dict[str, int] = {}
    pending: list[tuple[str, int]] = []   # signals to fill at next bar's open
    prev_date: pd.Timestamp | None = None

    # Rolling window of daily returns for the volatility scalar.
    ret_window: list[float] = []

    for date in all_dates:
        gov.start_day(equity)
        day_open_equity = equity

        # --- 1. Fill yesterday's signals at today's open -------------------
        for sym, direction in pending:
            df = ind[sym]
            if date not in df.index:
                continue
            row = df.loc[date]
            cm = costs[sym]
            atr = row["atr"]
            if pd.isna(atr) or atr <= 0:
                continue

            stop_distance = sp.atr_mult * atr
            vol_scalar = _vol_scalar(ret_window, rp)
            lots = position_size(
                equity=equity,
                risk_per_trade=rp.risk_per_trade * gov.risk_multiplier,
                stop_distance=stop_distance,
                point_value=cm.point_value,
                volume_min=cm.volume_min,
                volume_max=cm.volume_max,
                volume_step=cm.volume_step,
                vol_scalar=vol_scalar,
            )
            if lots <= 0:
                rejections["below_min_lot"] = rejections.get("below_min_lot", 0) + 1
                continue

            risk_frac = (stop_distance * cm.point_value * lots) / equity
            ok, reason = can_open(sym, direction, risk_frac, open_risk, rp)
            if not ok:
                key = reason.split(":")[0]
                rejections[key] = rejections.get(key, 0) + 1
                continue

            fill = row["open"] + direction * (cm.spread_price / 2.0 + cm.slippage_price)
            stop = fill - direction * stop_distance

            open_positions[sym] = Position(
                symbol=sym,
                direction=direction,
                entry_date=date,
                entry_price=fill,
                lots=lots,
                stop=stop,
                atr_at_entry=atr,
                high_water=fill,
                entry_cost=cm.entry_cost(lots),
            )
            open_risk[sym] = (bucket_of(sym), direction, risk_frac)
            equity -= open_positions[sym].entry_cost

        pending = []

        # --- 2. Manage open positions --------------------------------------
        for sym in list(open_positions):
            pos = open_positions[sym]
            df = ind[sym]
            if date not in df.index or date == pos.entry_date:
                continue
            row = df.loc[date]
            cm = costs[sym]

            # Swap accrues for nights held.
            if prev_date is not None:
                nights = _swap_nights(prev_date, date)
                rate = cm.swap_long if pos.direction > 0 else cm.swap_short
                swap = nights * rate * pos.lots
                pos.accrued_swap += swap
                equity += swap

            pos.bars_held += 1
            reason = exit_signal(pos, row, sp)

            if reason is not None:
                # A stop fills at the stop price (plus slippage); a Donchian
                # exit is a decision on the close, filled at that close.
                if reason == "stop":
                    raw = pos.stop
                else:
                    raw = row["close"]
                fill = raw - pos.direction * (cm.spread_price / 2.0 + cm.slippage_price)

                gross = (fill - pos.entry_price) * pos.direction * pos.lots * cm.point_value
                exit_cost = cm.exit_cost(pos.lots)
                equity += gross - exit_cost

                trades.append(
                    Trade(
                        symbol=sym,
                        direction=pos.direction,
                        entry_date=pos.entry_date,
                        exit_date=date,
                        entry_price=pos.entry_price,
                        exit_price=fill,
                        lots=pos.lots,
                        gross_pnl=gross,
                        costs=pos.entry_cost + exit_cost,
                        swap=pos.accrued_swap,
                        net_pnl=gross - exit_cost - pos.entry_cost + pos.accrued_swap,
                        reason=reason,
                        bars_held=pos.bars_held,
                    )
                )
                del open_positions[sym]
                open_risk.pop(sym, None)
            else:
                atr = row["atr"]
                if not pd.isna(atr) and atr > 0:
                    pos.update_trailing_stop(row["close"], atr, sp.atr_mult)

        # --- 3. Generate tomorrow's signals --------------------------------
        gov.update(equity + _floating_pnl(open_positions, ind, costs, date))
        if gov.can_trade:
            for sym, df in ind.items():
                if sym in open_positions or date not in df.index:
                    continue
                sig = entry_signal(df.loc[date])
                if sig != 0:
                    pending.append((sym, sig))

        marked = equity + _floating_pnl(open_positions, ind, costs, date)
        curve.append((date, marked))

        if day_open_equity > 0:
            ret_window.append(marked / day_open_equity - 1.0)
            if len(ret_window) > 20:
                ret_window.pop(0)

        prev_date = date

    eq = pd.Series(dict(curve)).sort_index()
    return BacktestResult(
        equity_curve=eq,
        trades=trades,
        daily_returns=eq.pct_change().dropna(),
        rejections=rejections,
    )


def _vol_scalar(ret_window: list[float], rp: RiskParams) -> float:
    """
    Scale exposure toward the target volatility, capped both ways.

    The upper cap matters: uncapped vol targeting levers up hardest into quiet
    markets, which is exactly when volatility regimes tend to break.
    """
    if len(ret_window) < 10:
        return 1.0
    realised = float(np.std(ret_window, ddof=1)) * np.sqrt(252)
    if realised <= 1e-9:
        return rp.vol_scalar_max
    return float(np.clip(rp.target_vol / realised, rp.vol_scalar_min, rp.vol_scalar_max))


def _floating_pnl(
    positions: dict[str, Position],
    ind: dict[str, pd.DataFrame],
    costs: dict[str, CostModel],
    date: pd.Timestamp,
) -> float:
    total = 0.0
    for sym, pos in positions.items():
        df = ind[sym]
        if date not in df.index:
            continue
        close = df.loc[date, "close"]
        cm = costs[sym]
        total += (close - pos.entry_price) * pos.direction * pos.lots * cm.point_value
    return total
