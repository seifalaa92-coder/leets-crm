# MQL5 Expert Advisors

## Files

| File | Purpose |
|---|---|
| `DonchianTrend.mq5` | The core strategy (Sleeve A of `../02-STRATEGY.md`) |
| `SpreadLogger.mq5` | Cost measurement utility — **run this first** |

## Install

1. In MT5: **File → Open Data Folder**
2. Copy both `.mq5` files into `MQL5/Experts/`
3. In MetaEditor (F4): open each and press **F7** to compile
4. Back in MT5, refresh the Navigator; drag the EA onto any chart
5. Enable **Algo Trading** (toolbar) and, in the EA dialog, **Allow algorithmic trading**

The EA manages its whole universe from a single chart — you do not attach one instance per symbol. Attaching multiple instances with the same magic number will cause them to fight over the same positions.

## Order of operations

**1. Measure your costs first.** Run `SpreadLogger` on a demo account for one full week. Output lands in `MQL5/Files/spread_log_<account>.csv`. Feed the medians into `../backtest/run.py::DEFAULT_COSTS`. Everything downstream depends on this being real rather than assumed.

**2. Backtest in Python** (`../backtest/README.md`) — faster to iterate, and it walk-forwards.

**3. Then the Strategy Tester** for execution realism:

| Setting | Value |
|---|---|
| Modelling | **Every tick based on real ticks** |
| Modelling quality | must be **99%** |
| Period | 2015.01.01 → present |
| Deposit / leverage | your real intended values |
| Optimisation | Genetic, forward period enabled |

**4. Demo forward test ≥3 months** on your actual account type.

**5. Live at 25% of target risk** for 3 months before scaling.

## Inputs that matter most

| Input | Default | Notes |
|---|---|---|
| `InpSymbols` | 5 symbols | Base names, comma-separated. **Suffixes are resolved at runtime** — enter `EURUSD`, not `EURUSDm`. |
| `InpRiskPerTrade` | 0.005 | Hard-capped at 0.01 by `OnInit`. Start at 0.0025 live. |
| `InpEntryLookback` | 55 | One of only three optimised parameters |
| `InpExitLookback` | 20 | Must be < entry lookback (validated) |
| `InpATRMult` | 3.0 | Stop distance |
| `InpUsdBucketCap` | 0.015 | Net USD-directional risk cap — the one that stops six pairs becoming one 3× dollar bet |
| `InpDDStopTrading` | 0.10 | Closes everything and halts. **No override by design.** |

## Implementation details worth knowing

**Symbol resolution.** Exness appends account-type suffixes (`EURUSDm`, `EURUSDz`, …). `FindBrokerSymbol` prefix-matches against `SymbolsTotal()` and prefers the shortest match. Check the init log to confirm each base resolved to what you expect.

**Stops are broker-side, always.** Placed with the order, never held only in EA memory. VPS reboots and terminal crashes happen during volatility, not during calm.

**Stops ratchet only.** `ManagePosition` moves a stop only in the favourable direction. There is no code path that widens one — that is deliberate, and it is the line between a trend system and a martingale.

**Stop-distance clamping.** Distances are clamped to `SYMBOL_TRADE_STOPS_LEVEL × 1.1` to avoid "invalid stops" (error 4756), and trailing modifies respect `SYMBOL_TRADE_FREEZE_LEVEL`.

**Lot sizing rounds down.** If the correctly-sized position is below `SYMBOL_VOLUME_MIN`, the trade is **skipped**, not rounded up, and a log line says so. Frequent skips mean the account is too small for that symbol — see the affordability note in `../backtest/README.md`.

**One evaluation per D1 bar.** `OnTick` returns immediately unless `iTime(sym, PERIOD_D1, 0)` has changed. All signal reads use shift ≥ 1, so the forming bar is never used.

**Sizing uses `SYMBOL_TRADE_TICK_VALUE`**, so it works across FX, metals and index CFDs without per-symbol contract-size tables.

## Not implemented here

- **Sleeve B (fix reversion)** — deliberately omitted. Build it only after measuring your realised costs and confirming a positive post-cost expectancy (`../02-STRATEGY.md`, Sleeve B).
- **Portfolio volatility scaling** — present in the Python engine, not the EA. Add it once you have live volatility data; it is a refinement, not a prerequisite.

## Before going live

- [ ] Costs measured with `SpreadLogger` over a full week
- [ ] Python backtest walk-forward efficiency ≥ 0.5
- [ ] Strategy Tester at 99% modelling quality
- [ ] Verified each base symbol resolved correctly in the init log
- [ ] Confirmed the account is large enough for every symbol in the universe
- [ ] 3 months demo forward test
- [ ] VPS with auto-restart, alerting on kill-switch triggers
