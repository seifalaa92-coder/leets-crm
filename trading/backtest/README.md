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

# Parameter robustness: is the optimum a mesa or a spike?
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD GBPUSD --surface

# Monte Carlo: what drawdown could the SAME trades produce in a different order?
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD GBPUSD --monte-carlo 5000

# Cost stress test. If 2.0x kills it, it was never an edge.
trading/.venv/bin/python -m trading.backtest.run \
    --data trading/data --symbols EURUSD --cost-multiplier 2.0

# Weekly cost reconciliation once live (03-RISK.md s7)
trading/.venv/bin/python -m trading.backtest.reconcile \
    --history trading/data/history.csv --symbol EURUSD --assumed-cost-points 7.0

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
| `validate.py` | Parameter surfaces, Monte Carlo, daily-outcome distribution |
| `reconcile.py` | Live-vs-backtest cost reconciliation and tracking check |
| `run.py` | CLI |
| `test_backtest.py` | Integrity tests (31) |

## The three questions a single backtest cannot answer

**"Are these parameters real?"** → `--surface`. Evaluates a grid and scores whether the optimum sits on a plateau: the fraction of immediate neighbours retaining ≥70% of the best Sharpe. A genuine edge degrades gracefully as parameters move; an artifact falls off a cliff. Verdicts are `MESA` / `RIDGE` / `SPIKE`. Trade the centre of a flat region — it backtests worse and lives better.

**"How bad can the drawdown get?"** → `--monte-carlo N`. A backtest's max drawdown is *one sample*, not a bound; the same trades arriving in a different order routinely dig a much deeper hole. This resamples the trade sequence with replacement and compounds each path, giving a distribution of final equity and drawdown depth plus a risk-of-ruin estimate. **Size against the 95th percentile, not the observed path.** On the smoke data the observed max drawdown is ~5.8% while the 95th percentile of resampled paths is ~12.3% and the worst is ~20.6% — a factor of 3.5 between what the backtest showed and what the same edge can produce.

**"What does a profitable day actually look like?"** → printed automatically. Reports the share of winning/losing/flat days, mean win and loss size, and the longest losing streak. This is the direct, quantitative answer to the "consistent daily profits" question: a positive-expectancy system runs ~40–55% winning days with losing streaks of a week or more. A strategy showing 90%+ winning days is hiding losses in open positions, not avoiding them.

### When `--surface` and `--walk-forward` disagree

They can, and it is not a bug — they answer different questions. On the smoke data `--surface` returns `MESA` (plateau score 1.00) while `--walk-forward` returns `CURVE-FITTED` (efficiency ≈ 0).

- **Surface** measures stability *across parameters* at a fixed point in time: does the result survive nudging `n_entry` from 55 to 50?
- **Walk-forward** measures stability *across time* at chosen parameters: does the edge that existed in 2019–2021 still exist in 2022?

A strategy can be parameter-insensitive and still have no temporal edge — which is exactly the smoke data's situation, since every parameter set is harvesting the same weak synthetic autocorrelation, and none of it persists out of sample.

**Walk-forward is the one with veto power.** A mesa built on an edge that has decayed is a stable way of losing money. Use the surface to pick *where* on the plateau to sit, only after walk-forward has established there is something there.

## Cost reconciliation (once live)

`reconcile.py` compares realised costs from an MT5 trade-history export against the assumption in your backtest. `03-RISK.md` §7 calls this the check people skip and the one that catches degradation earliest — costs drift above the model long before the equity curve visibly rolls over.

Export from MT5: **Toolbox → History → right-click → Report**, or save the deals list as CSV. Column naming varies by build and language, so the loader accepts common aliases and fails loudly rather than guessing.

One honest limitation: commission and swap are reported explicitly by MT5, but **spread and slippage are baked into `profit` and cannot be separated from a history export alone**. To measure those you need requested-vs-fill logging (`../04-EXNESS-MT5-SETUP.md` §5). The tool reports what it can actually see and says so.

`tracking_check()` compares live Sharpe against the backtest's 95% confidence interval — and tells you plainly when the horizon is too short to conclude anything, which for the first year it always is.

## What the tests actually check

They do **not** test that the strategy makes money. They test that the harness isn't lying, which matters more — an engine with look-ahead bias reports an excellent strategy no matter what you feed it.

The key ones:

- `test_indicators_are_lagged` — every indicator on bar *t* uses only data through *t−1*
- `test_future_data_cannot_change_past_signals` — truncating the series leaves earlier signals identical
- `test_random_walk_loses_exactly_the_costs` — on a driftless random walk, gross ≈ 0 and net is strictly negative. A profit here would prove look-ahead.
- `test_position_size_rounds_down_never_up` — rounding up to the broker minimum silently overshoots risk
- `test_usd_bucket_nets_offsetting_positions` — long EURUSD + long USDCHF is a hedge, not double exposure
- `test_monte_carlo_drawdowns_ordered_by_severity` — a higher percentile must mean a *worse* outcome. Drawdowns are stored negative, so a naive `percentile(95)` returns the mildest case and silently inverts the advice to "size against the 95th percentile." This test exists because that bug was actually present.
- `test_monte_carlo_preserves_edge_sign` — a losing trade distribution must not resample into a winning one

## Two things the smoke test demonstrates

Running `--smoke` on synthetic data reproduces two real effects worth understanding before you use this on live data:

**1. Symbols can be silently unaffordable.** At `--equity 10000`, every XAUUSD signal is rejected: a 3-ATR gold stop risks more per minimum lot (0.01) than 0.5% of a $10k account. The engine correctly skips rather than rounding up, but the consequence is that the portfolio quietly loses an instrument — and diversification *is* the edge here. The preflight affordability check prints a warning; heed it.

**2. Walk-forward catches noise-fitting.** On near-random synthetic data, in-sample Sharpes come out uniformly positive (you're picking the best of 27 parameter sets) while out-of-sample Sharpes scatter around zero — efficiency ≈ 0, verdict `CURVE-FITTED`. That is the tool working correctly. If your *real* data produces the same verdict, believe it.

## Caveat on synthetic data

`synthetic_ohlc` generates an AR(1) random walk with a tunable trend knob. It exists solely so the pipeline can be exercised with no market data present. **Any result from it is meaningless as evidence** — the trend a trend-follower harvests is exactly the knob being set. Never quote a synthetic result as a backtest.
