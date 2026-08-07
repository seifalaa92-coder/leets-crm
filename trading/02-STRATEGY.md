# Strategy Specification

Two sleeves. The **core** carries ~80–100% of the risk budget and is where the durable evidence is. The **satellite** is optional, capped, and only worth running on a tight-cost account.

Everything here follows from `01-RESEARCH.md`. Where a choice looks conservative, the reason is the cost table in §4 of that document.

---

## Sleeve A — Core: Diversified Time-Series Trend (Donchian breakout, volatility-targeted)

**Why this and not something cleverer.** Time-series momentum is the only effect with positive returns in every ten-year sub-period back to 1880 across 67 markets. Donchian breakout is the most parameter-sparse way to express it — three parameters total, which is inside the 2–3 cap that keeps walk-forward efficiency honest. Cleverer usually means more parameters, which means the backtest improves and the live result degrades.

### Instruments

Diversification is the entire source of the Sharpe ratio, so trade the widest genuinely-uncorrelated set the account supports. Suggested starting universe on Exness MT5:

| Symbol | Bucket | Notes |
|---|---|---|
| EURUSD | USD-major | Tightest costs, core holding |
| GBPUSD | USD-major | |
| USDJPY | USD-major | Rate-differential sensitive; trends well |
| AUDUSD | USD-major / commodity | |
| USDCHF | USD-major | Correlated ~−0.9 to EURUSD — see clustering cap |
| XAUUSD | Metals | Best trender in the set; **triple swap Wednesdays** |
| USDCAD | USD-major / oil | |
| US500 / USTEC | Equity index | Check symbol names and CFD financing on your account |

**Correlation clustering is the trap here.** Six USD pairs is not six independent bets — it is roughly one dollar bet in six costumes. Enforce the bucket caps in `03-RISK.md` or the volatility target will be silently exceeded by 2–3×.

Minimum viable universe: **4 instruments across at least 2 buckets.** Below that, expect roughly half the Sharpe and much lumpier equity.

### Timeframe and execution timing

- Signals computed on **D1 bars**
- Evaluated **once per day**, shortly after the daily bar closes (Exness server time, typically 00:00 server / broker rollover)
- Orders placed at market on the next tick
- **No intrabar signal evaluation.** This is deliberate — it removes a large family of look-ahead and repainting bugs, and it caps trade frequency, which is where retail bleeds.

### Entry rules

Long when:
```
Close > highest(High, N_entry) of the prior N_entry bars (excluding current)
AND  ATR(14) / Close  is between vol_floor and vol_ceiling
AND  no existing position in this symbol
AND  bucket exposure cap not breached (see 03-RISK.md)
```

Short: mirror image on `lowest(Low, N_entry)`.

The ATR band filter is not an optimised parameter — it is a sanity gate. It skips instruments that are either dead (no movement to capture, costs dominate) or in a volatility explosion (gaps, spread blowouts, unreliable fills). Set `vol_floor = 0.3%` and `vol_ceiling = 5.0%` of price and leave them alone.

### Exit rules

Whichever triggers first:

1. **Trailing ATR stop** — `3.0 × ATR(14)` from the highest close since entry (longs) / lowest close (shorts). Ratchets in the favourable direction only, never loosens.
2. **Donchian exit** — close crosses below `lowest(Low, N_exit)` for longs, above `highest(High, N_exit)` for shorts.
3. **Hard initial stop** — placed at entry, `3.0 × ATR(14)` away, as a broker-side order. This one exists so that a disconnected VPS, a platform crash, or a weekend gap cannot produce an unbounded loss. **It is never widened. Ever.**

There is no take-profit. Trend following makes its money from the small number of trades that run far; a take-profit truncates exactly the right tail that pays for all the small losses. Adding one raises the win rate and lowers the expectancy — it feels better and performs worse.

### Parameters

Only three are optimised. Start here, and validate by walk-forward rather than by picking the peak:

| Parameter | Default | Sane range | Notes |
|---|---|---|---|
| `N_entry` | 55 | 40–80 | Donchian entry lookback (days) |
| `N_exit` | 20 | 10–30 | Donchian exit lookback; must be < `N_entry` |
| `ATR_mult` | 3.0 | 2.5–4.0 | Trailing + initial stop distance |

Fixed, not optimised: `ATR_period = 14`, `vol_floor = 0.003`, `vol_ceiling = 0.05`.

If the walk-forward surface shows a sharp optimum rather than a plateau, that parameter set is noise — widen the range and take the centre of the flat region instead.

### Expected behaviour — so you don't abandon it at the wrong moment

| Metric | Realistic expectation |
|---|---|
| Win rate | **35–45%** |
| Average win / average loss | 2.0–3.0× |
| Trades | 2–6 per week across the whole universe |
| Profitable months | ~55–60% |
| Longest flat/losing stretch | **6–10 weeks, routinely; occasionally longer** |
| Annual return at 10% vol target | 8–15% |
| Max drawdown | 15–25% |

Read that win-rate row again. **You will lose on most individual trades.** That is not the system failing, it is the system working — the losses are small and the wins are large. The most common way this strategy fails in practice is the trader overriding it during a normal flat stretch.

---

## Sleeve B — Satellite: London-fix intraday reversion (optional, capped)

Only run this if **all** of the following are true, otherwise skip it entirely:

- Account type is **Raw Spread or Zero** (Standard/Pro costs eat the entire edge)
- You have measured your actual realised round-trip cost on EURUSD over ≥200 live trades
- That measured cost is comfortably below the per-event edge in your own backtest
- The sleeve is capped at **≤20% of total risk budget**

### Basis

Krohn et al. (Journal of Finance, 2024): the dollar appreciates into FX benchmark fixings and reverses after, with t-stats around 4.1 and 5.5. The effect is *tightly aligned to fix publication times* — displacing the window degrades returns uniformly, which is what makes it credible rather than data-mined.

### Rules

- **Instrument:** EURUSD only (highest liquidity, tightest cost — the edge is basis points, so this is not negotiable)
- **Reference time:** the 16:00 London fix. Convert to your Exness **server time** and re-verify across both DST transitions — this is the single most common implementation bug in this sleeve, and getting it wrong by an hour destroys the edge.
- **Entry:** at fix time + 2 minutes, take a position *against* the direction of the price move over the preceding 60 minutes
- **Exit:** time-based, fix + 90 minutes. No trailing stop — the effect is a time-localised reversion, not a trend.
- **Protective stop:** 1.5 × ATR(14, M15), broker-side
- **Skip days:** high-impact scheduled data within ±30 min; month-end and quarter-end (fixing flows are abnormal and much larger); the day before and after major holidays

### Honest assessment

The statistical evidence is genuinely strong — stronger than most things retail traders act on. The *economic* margin after retail costs is thin, and it may be zero on your account. Backtest it, measure the cost, and if the post-cost expectancy is not clearly positive, **do not run it.** A sleeve with zero expectancy and real variance is strictly worse than no sleeve.

---

## What is deliberately not in this strategy

Each of these was considered and rejected for a specific reason, not overlooked:

- **No grid, no martingale, no averaging down** — unbounded loss against capped gain (`01-RESEARCH.md` §3)
- **No carry or cross-sectional FX momentum** — negative live record 2010–present, the exact window in question
- **No take-profit on the core** — truncates the right tail that funds the strategy
- **No news trading** — retail execution quality inverts at exactly the wrong moment
- **No indicator confluence stack** — every extra parameter is a degree of freedom for overfitting
- **No intraday signals on the core** — cost drag scales with frequency, edge does not

---

## Implementation checklist

- [ ] Export D1 data 2015–2026 for the universe from MT5
- [ ] Run `backtest/` with your measured costs
- [ ] Walk-forward validate; **reject if WFE < 0.5**
- [ ] Re-run at 1.5× and 2× costs; reject if it collapses
- [ ] Segment results by regime (2015–18 / 2019–21 / 2022–23 / 2024–26)
- [ ] MT5 Strategy Tester, real ticks, 99% modelling quality
- [ ] Demo forward test ≥3 months on your live account type
- [ ] Live at 25% risk for 3 months
- [ ] Scale only if live tracks backtest within expected variance
