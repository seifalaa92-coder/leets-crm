"""
Data loading, plus a synthetic generator for exercising the pipeline.

The synthetic generator exists ONLY so the code can be smoke-tested with no
market data present. Results from it are meaningless as evidence -- it is a
random process with a drift knob, and any strategy will look however the knob
is set. Never quote a synthetic result as a backtest.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

REQUIRED = ["open", "high", "low", "close"]


def load_mt5_csv(path: str | Path, symbol: str | None = None) -> pd.DataFrame:
    """
    Load an MT5 CSV export.

    MT5 (File -> Save As from a chart, or the History Center) writes tab- or
    comma-separated files with headers like:
        <DATE>  <TIME>  <OPEN>  <HIGH>  <LOW>  <CLOSE>  <TICKVOL>  <VOL>  <SPREAD>

    Returns a DataFrame indexed by date with lowercase open/high/low/close
    (plus 'spread' in points when present -- use it to calibrate CostModel).
    """
    path = Path(path)
    df = pd.read_csv(path, sep=None, engine="python")
    df.columns = [c.strip().strip("<>").lower() for c in df.columns]

    if "date" in df.columns:
        stamp = df["date"].astype(str)
        if "time" in df.columns:
            stamp = stamp + " " + df["time"].astype(str)
        df["datetime"] = pd.to_datetime(stamp, format="mixed", dayfirst=False)
    elif "datetime" in df.columns:
        df["datetime"] = pd.to_datetime(df["datetime"], format="mixed")
    else:
        raise ValueError(f"{path}: no <DATE> or <DATETIME> column found")

    df = df.set_index("datetime").sort_index()

    missing = [c for c in REQUIRED if c not in df.columns]
    if missing:
        raise ValueError(f"{path}: missing required columns {missing}")

    keep = REQUIRED + (["spread"] if "spread" in df.columns else [])
    out = df[keep].astype(float)

    if symbol:
        out.attrs["symbol"] = symbol
    return validate_ohlc(out, str(path))


def validate_ohlc(df: pd.DataFrame, label: str = "") -> pd.DataFrame:
    """
    Reject data problems that silently corrupt a backtest.

    Broker-supplied history genuinely does contain gaps and bad bars; the tester
    will happily compute a beautiful curve over data that does not exist.
    """
    if df.empty:
        raise ValueError(f"{label}: empty dataset")

    if df.index.has_duplicates:
        n = int(df.index.duplicated().sum())
        df = df[~df.index.duplicated(keep="first")]
        print(f"  warn {label}: dropped {n} duplicate timestamps")

    bad = (
        (df["high"] < df["low"])
        | (df["high"] < df["open"]) | (df["high"] < df["close"])
        | (df["low"] > df["open"]) | (df["low"] > df["close"])
    )
    if bad.any():
        print(f"  warn {label}: dropped {int(bad.sum())} inconsistent OHLC bars")
        df = df[~bad]

    if (df[REQUIRED] <= 0).any().any():
        raise ValueError(f"{label}: non-positive prices present")

    # Flag calendar gaps beyond a long weekend / holiday run.
    gaps = df.index.to_series().diff().dt.days
    big = gaps[gaps > 5]
    if len(big):
        print(f"  warn {label}: {len(big)} gaps > 5 days (largest {int(big.max())}d)")

    return df


def load_universe(directory: str | Path, symbols: list[str]) -> dict[str, pd.DataFrame]:
    """Load {symbol}.csv for each symbol from a directory."""
    directory = Path(directory)
    out: dict[str, pd.DataFrame] = {}
    for sym in symbols:
        for candidate in (directory / f"{sym}.csv", directory / f"{sym}_D1.csv"):
            if candidate.exists():
                out[sym] = load_mt5_csv(candidate, sym)
                print(f"  loaded {sym}: {len(out[sym])} bars "
                      f"{out[sym].index[0].date()} -> {out[sym].index[-1].date()}")
                break
        else:
            print(f"  warn: no CSV found for {sym} in {directory}")
    if not out:
        raise FileNotFoundError(f"no data loaded from {directory}")
    return out


def synthetic_ohlc(
    symbol: str,
    start: str = "2015-01-01",
    end: str = "2026-08-01",
    start_price: float = 1.10,
    ann_vol: float = 0.08,
    trend_strength: float = 0.15,
    seed: int = 0,
) -> pd.DataFrame:
    """
    Generate a trending random walk on business days. SMOKE TESTING ONLY.

    trend_strength adds autocorrelation to daily returns, which is precisely the
    property a trend system harvests -- so a good result here demonstrates the
    plumbing works, and nothing whatsoever about the market.
    """
    rng = np.random.default_rng(seed)
    dates = pd.bdate_range(start, end)
    n = len(dates)
    daily_vol = ann_vol / np.sqrt(252)

    rets = np.zeros(n)
    shock = rng.normal(0, daily_vol, n)
    for i in range(1, n):
        rets[i] = trend_strength * rets[i - 1] + shock[i]

    close = start_price * np.exp(np.cumsum(rets))
    intrabar = np.abs(rng.normal(0, daily_vol * 0.6, n)) * close

    open_ = np.empty(n)
    open_[0] = start_price
    open_[1:] = close[:-1]

    high = np.maximum(open_, close) + intrabar
    low = np.minimum(open_, close) - intrabar

    df = pd.DataFrame(
        {"open": open_, "high": high, "low": low, "close": close}, index=dates
    )
    df.attrs["symbol"] = symbol
    return df
