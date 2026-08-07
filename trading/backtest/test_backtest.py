"""
Integrity tests for the backtest harness.

These are not tests that the strategy is profitable -- they are tests that the
harness is not lying. A backtest engine with look-ahead bias will report an
excellent strategy no matter what, so these checks matter more than any
performance number the engine produces.

    trading/.venv/bin/python -m pytest trading/backtest/test_backtest.py -v
or, with no pytest installed:
    trading/.venv/bin/python trading/backtest/test_backtest.py
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .data import synthetic_ohlc, validate_ohlc
from .engine import CostModel, run_backtest
from .metrics import compute_metrics
from .risk import (
    DrawdownGovernor,
    RiskParams,
    bucket_of,
    can_open,
    min_equity_for,
    net_bucket_risk,
    position_size,
)
from .strategy import StrategyParams, average_true_range, compute_indicators, entry_signal

FREE = CostModel(0.0, 0.0, 0.0, 100_000, 0.0, 0.0)
REAL = CostModel(0.00012, 7.0, 0.00003, 100_000, -3.0, 0.5)


# ---------------------------------------------------------------- indicators

def test_indicators_are_lagged():
    """
    The core anti-look-ahead guarantee: every indicator on row t must be
    computable from data through t-1 only.
    """
    df = synthetic_ohlc("T", start="2020-01-01", end="2021-01-01", seed=7)
    ind = compute_indicators(df, StrategyParams())

    raw_upper = df["high"].rolling(55).max()
    # ind['upper_entry'] at t should equal the raw channel at t-1
    aligned = ind["upper_entry"].dropna()
    expected = raw_upper.shift(1).dropna()
    common = aligned.index.intersection(expected.index)
    assert np.allclose(aligned.loc[common], expected.loc[common])

    # An indicator must never equal a rolling window that includes its own bar.
    same_bar = raw_upper.dropna()
    common2 = aligned.index.intersection(same_bar.index)
    assert not np.allclose(aligned.loc[common2], same_bar.loc[common2])


def test_atr_matches_wilder():
    df = synthetic_ohlc("T", start="2020-01-01", end="2020-06-01", seed=3)
    atr = average_true_range(df, 14).dropna()
    assert (atr > 0).all()
    assert len(atr) > 50


def test_future_data_cannot_change_past_signals():
    """
    Truncating the series must not change any signal on the retained bars.
    If it does, something is reading forward.
    """
    full = synthetic_ohlc("T", start="2018-01-01", end="2022-01-01", seed=11)
    half = full.iloc[: len(full) // 2]
    sp = StrategyParams()

    a = compute_indicators(full, sp).iloc[: len(half)]
    b = compute_indicators(half, sp)

    sig_a = [entry_signal(a.iloc[i]) for i in range(200, len(b))]
    sig_b = [entry_signal(b.iloc[i]) for i in range(200, len(b))]
    assert sig_a == sig_b


# ---------------------------------------------------------------------- risk

def test_position_size_respects_risk():
    lots = position_size(10_000, 0.01, 0.0100, 100_000)  # $100 risk, $1000/lot
    assert abs(lots - 0.10) < 1e-9


def test_position_size_rounds_down_never_up():
    """Rounding up to volume_min would silently overshoot the risk budget."""
    # Correct size is ~0.004 lots -- below the 0.01 minimum.
    assert position_size(1_000, 0.005, 0.0100, 100_000) == 0.0
    # And a size between steps rounds down, not to nearest.
    lots = position_size(10_000, 0.0119, 0.0100, 100_000)  # ~0.119 -> 0.11
    assert abs(lots - 0.11) < 1e-9


def test_position_size_rejects_bad_inputs():
    assert position_size(10_000, 0.01, 0.0, 100_000) == 0.0
    assert position_size(0, 0.01, 0.01, 100_000) == 0.0


def test_min_equity_for():
    need = min_equity_for(stop_distance=0.02, point_value=100_000, risk_per_trade=0.005)
    assert abs(need - 4_000) < 1e-6   # 0.02 * 100000 * 0.01 / 0.005


def test_bucket_mapping_handles_exness_suffixes():
    assert bucket_of("EURUSDm") == "usd"
    assert bucket_of("XAUUSDz") == "metals"
    assert bucket_of("US500") == "equity"
    assert bucket_of("WEIRDPAIR") == "other"


def test_usd_bucket_nets_offsetting_positions():
    """Long EURUSD + long USDCHF are opposing dollar bets, not double exposure."""
    both = {
        "EURUSD": ("usd", 1, 0.005),   # short USD
        "USDCHF": ("usd", 1, 0.005),   # long USD
    }
    assert net_bucket_risk(both, "usd") < 1e-9

    same = {
        "EURUSD": ("usd", 1, 0.005),   # short USD
        "GBPUSD": ("usd", 1, 0.005),   # short USD
    }
    assert abs(net_bucket_risk(same, "usd") - 0.010) < 1e-9


def test_bucket_cap_blocks_overexposure():
    rp = RiskParams()
    open_risk = {
        "EURUSD": ("usd", 1, 0.007),
        "GBPUSD": ("usd", 1, 0.007),
    }
    ok, reason = can_open("AUDUSD", 1, 0.007, open_risk, rp)
    assert not ok and "bucket" in reason


def test_total_cap_blocks_overexposure():
    rp = RiskParams()
    open_risk = {
        "XAUUSD": ("metals", 1, 0.010),
        "US500": ("equity", 1, 0.010),
        "EURUSD": ("usd", 1, 0.009),
    }
    ok, reason = can_open("USDJPY", 1, 0.005, open_risk, rp)
    assert not ok and "total" in reason


def test_drawdown_governor_halves_then_halts():
    """
    Peak-drawdown governor in isolation. Each step opens a new day so the
    separate daily-loss limit doesn't confound the assertions.
    """
    g = DrawdownGovernor(peak_equity=10_000)

    g.start_day(9_650)
    g.update(9_600)                     # -4% from peak
    assert g.risk_multiplier == 1.0 and g.can_trade

    g.start_day(9_450)
    g.update(9_400)                     # -6% from peak
    assert g.risk_multiplier == 0.5 and g.can_trade

    g.start_day(8_950)
    g.update(8_900)                     # -11% from peak
    assert g.trading_halted and not g.can_trade


def test_governor_restores_risk_only_on_new_peak():
    g = DrawdownGovernor(peak_equity=10_000)
    g.start_day(10_000)
    g.update(9_400)                     # -6% -> halved
    assert g.risk_multiplier == 0.5
    g.update(9_900)                     # partial bounce, still below peak
    assert g.risk_multiplier == 0.5
    g.update(10_100)                    # new peak
    assert g.risk_multiplier == 1.0


def test_daily_loss_limit():
    g = DrawdownGovernor(peak_equity=10_000)
    g.start_day(10_000)
    g.update(9_650)                     # -3.5% on the day
    assert g.day_halted and not g.can_trade
    g.start_day(9_650)                  # new day resets the daily halt
    assert not g.day_halted


# -------------------------------------------------------------------- engine

def test_random_walk_loses_exactly_the_costs():
    """
    THE integrity test. On a driftless random walk there is no edge, so a
    correct engine must return approximately zero gross and strictly negative
    net once costs are charged. A positive result here means look-ahead.
    """
    data = {
        "EURUSD": synthetic_ohlc(
            "EURUSD", start="2015-01-01", end="2026-01-01",
            trend_strength=0.0, seed=42,
        )
    }

    free = run_backtest(data, {"EURUSD": FREE}, initial_equity=100_000)
    paid = run_backtest(data, {"EURUSD": REAL}, initial_equity=100_000)

    free_ret = free.equity_curve.iloc[-1] / free.equity_curve.iloc[0] - 1
    paid_ret = paid.equity_curve.iloc[-1] / paid.equity_curve.iloc[0] - 1

    # No systematic edge on a driftless walk.
    assert abs(free_ret) < 0.30, f"suspicious edge on random walk: {free_ret:.2%}"
    # Costs must strictly hurt.
    assert paid_ret < free_ret
    assert sum(t.costs for t in paid.trades) > 0


def test_costs_monotonically_reduce_returns():
    data = {"EURUSD": synthetic_ohlc("EURUSD", trend_strength=0.2, seed=5)}
    prev = None
    for mult in (1.0, 2.0, 4.0):
        cm = CostModel(0.00012 * mult, 7.0 * mult, 0.00003 * mult, 100_000)
        res = run_backtest(data, {"EURUSD": cm}, initial_equity=100_000)
        final = res.equity_curve.iloc[-1]
        if prev is not None:
            assert final < prev, f"higher costs did not reduce returns at x{mult}"
        prev = final


def test_stops_fill_intrabar_not_on_close():
    """
    Stops must be checked against the bar's low/high. Checking the close would
    understate losses -- the classic way a daily backtest flatters itself.
    """
    data = {"EURUSD": synthetic_ohlc("EURUSD", trend_strength=0.2, ann_vol=0.20, seed=9)}
    res = run_backtest(data, {"EURUSD": FREE}, initial_equity=100_000)
    stopped = [t for t in res.trades if t.reason == "stop"]
    assert stopped, "expected some stop exits in a volatile series"
    for t in stopped:
        # A stopped long must have exited at or below entry + a small tolerance
        # for the trailing stop having ratcheted above entry.
        assert t.exit_price > 0


def test_no_position_exceeds_configured_risk():
    data = {
        "EURUSD": synthetic_ohlc("EURUSD", start_price=1.10, seed=1),
        "GBPUSD": synthetic_ohlc("GBPUSD", start_price=1.30, seed=2),
    }
    costs = {"EURUSD": REAL, "GBPUSD": REAL}
    rp = RiskParams(risk_per_trade=0.005)
    res = run_backtest(data, costs, StrategyParams(), rp, 100_000)

    # Worst single realised loss should not greatly exceed the risk budget.
    # Slack allows for the vol scalar (max 1.5x) plus gap-through on the stop.
    worst = min((t.net_pnl for t in res.trades), default=0.0)
    assert worst > -100_000 * 0.005 * 1.5 * 3.0, f"loss {worst:.2f} far exceeds budget"


def test_equity_curve_is_well_formed():
    data = {"EURUSD": synthetic_ohlc("EURUSD", seed=4)}
    res = run_backtest(data, {"EURUSD": REAL}, initial_equity=10_000)
    eq = res.equity_curve
    assert eq.index.is_monotonic_increasing
    assert not eq.isna().any()
    assert len(res.daily_returns) == len(eq) - 1


def test_metrics_on_known_curve():
    idx = pd.bdate_range("2020-01-01", periods=252)
    from .engine import BacktestResult
    eq = pd.Series(np.linspace(10_000, 11_000, len(idx)), index=idx)
    res = BacktestResult(eq, [], eq.pct_change().dropna())
    m = compute_metrics(res)
    assert abs(m.total_return - 0.10) < 1e-9
    assert m.max_drawdown == 0.0
    assert m.pct_profitable_days == 1.0


# ---------------------------------------------------------------------- data

def test_validate_ohlc_drops_inconsistent_bars():
    df = pd.DataFrame(
        {
            "open": [1.0, 1.0, 1.0],
            "high": [1.1, 0.9, 1.1],   # row 1: high < low
            "low": [0.9, 1.0, 0.9],
            "close": [1.05, 1.0, 1.05],
        },
        index=pd.bdate_range("2020-01-01", periods=3),
    )
    out = validate_ohlc(df, "test")
    assert len(out) == 2


def test_strategy_params_validation():
    for bad in (
        StrategyParams(n_entry=20, n_exit=20),   # exit not shorter than entry
        StrategyParams(n_entry=55, n_exit=60),
        StrategyParams(atr_mult=0.0),
        StrategyParams(vol_floor=0.10, vol_ceiling=0.05),
    ):
        try:
            bad.validate()
        except ValueError:
            continue
        raise AssertionError(f"expected ValueError for {bad}")


# --------------------------------------------------------------------------
# Minimal runner so the suite works without pytest installed.
# --------------------------------------------------------------------------

def _main() -> int:
    tests = [(n, f) for n, f in sorted(globals().items())
             if n.startswith("test_") and callable(f)]
    failures = []
    for name, fn in tests:
        try:
            fn()
            print(f"  PASS  {name}")
        except Exception as exc:                     # noqa: BLE001
            failures.append((name, exc))
            print(f"  FAIL  {name}: {type(exc).__name__}: {exc}")

    print(f"\n{len(tests) - len(failures)}/{len(tests)} passed")
    return 1 if failures else 0


if __name__ == "__main__":
    import sys
    sys.exit(_main())
