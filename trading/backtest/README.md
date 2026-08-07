# Backtest Harness

Python research pipeline for the strategy in `../02-STRATEGY.md`. Data-agnostic: it reads CSVs you export from MT5, so it needs no broker connection.

## Setup

```bash
cd trading
python3 -m venv .venv
.venv/bin/pip install pandas numpy
```

## Run

```bash
# From the repo root.

# Plumbing check on synthetic data (no market meaning -- see caveat below)
trading/.venv/bin/python -m trading.backtest.run --smoke

# Real backtest
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD GBPUSD USDJPY XAUUSD --equity 10000

# Walk-forward validation -- the number that actually decides anything
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD GBPUSD --walk-forward

# Cost stress test. If 2.0x kills it, it was never an edge.
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD --cost-multiplier 2.0

# Integrity tests
trading/.venv/bin/python -m trading.backtest.test_backtest
```

## Getting the data out of MT5

In MT5: **Tools → Options → Charts**, raise "Max bars in chart", then open a D1 chart per symbol and use **File → Save As** (or the History Center). Save one file per symbol into `trading/data/` named `EURUSD.csv`, `GBPUSD.csv`, etc.

Expected format (the loader handles tab- or comma-separated, and both `<DATE> <TIME>` and a single `<DATETIME>`):

```
<DATE>	<TIME>	<OPEN>	<HIGH>	<LOW>	<CLOSE>	<TICKVOL>	<VOL>	<SPREAD>
2015.01.02	00:00:00	1.20983	1.21048	1.20040	1.20050	48122	0	12
```

The `<SPREAD>` column, if present, is loaded — useful for calibrating `CostModel`, though a week of `SpreadLogger` data is better since it captures intraday variation.

## Before you believe any number

Set your **own** cost models in `run.py::DEFAULT_COSTS`. The shipped values are placeholders for an Exness Raw Spread USD account and are almost certainly wrong for yours. Measure with `../mql5/SpreadLogger.mq5` first — this single step separates a modelled edge from a real one.

## Modules

| File | Purpose |
|---|---|
| `strategy.py` | Donchian signals, ATR, trailing stop. All indicators lagged one bar. |
| `risk.py` | Position sizing, correlation buckets, drawdown governors |
| `engine.py` | Portfolio backtest loop with costs, slippage, swap |
| `metrics.py` | Performance stats, walk-forward, regime breakdown |
| `data.py` | MT5 CSV loading, validation, synthetic generator |
| `run.py` | CLI |
| `test_backtest.py` | Integrity tests (22) |

## What the tests actually check

They do **not** test that the strategy makes money. They test that the harness isn't lying, which matters more — an engine with look-ahead bias reports an excellent strategy no matter what you feed it.

The key ones:

- `test_indicators_are_lagged` — every indicator on bar *t* uses only data through *t−1*
- `test_future_data_cannot_change_past_signals` — truncating the series leaves earlier signals identical
- `test_random_walk_loses_exactly_the_costs` — on a driftless random walk, gross ≈ 0 and net is strictly negative. A profit here would prove look-ahead.
- `test_position_size_rounds_down_never_up` — rounding up to the broker minimum silently overshoots risk
- `test_usd_bucket_nets_offsetting_positions` — long EURUSD + long USDCHF is a hedge, not double exposure

## Two things the smoke test demonstrates

Running `--smoke` on synthetic data reproduces two real effects worth understanding before you use this on live data:

**1. Symbols can be silently unaffordable.** At `--equity 10000`, every XAUUSD signal is rejected: a 3-ATR gold stop risks more per minimum lot (0.01) than 0.5% of a $10k account. The engine correctly skips rather than rounding up, but the consequence is that the portfolio quietly loses an instrument — and diversification *is* the edge here. The preflight affordability check prints a warning; heed it.

**2. Walk-forward catches noise-fitting.** On near-random synthetic data, in-sample Sharpes come out uniformly positive (you're picking the best of 27 parameter sets) while out-of-sample Sharpes scatter around zero — efficiency ≈ 0, verdict `CURVE-FITTED`. That is the tool working correctly. If your *real* data produces the same verdict, believe it.

## Caveat on synthetic data

`synthetic_ohlc` generates an AR(1) random walk with a tunable trend knob. It exists solely so the pipeline can be exercised with no market data present. **Any result from it is meaningless as evidence** — the trend a trend-follower harvests is exactly the knob being set. Never quote a synthetic result as a backtest.
