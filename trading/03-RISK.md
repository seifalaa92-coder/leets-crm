# Risk Framework

**This is the highest-leverage document in the package.** Two traders running the identical signal, one with this framework and one without, produce completely different outcomes. The signal decides whether expectancy is positive; risk sizing decides whether you are still solvent when the expectancy pays out.

Historically, most retail account failures are not signal failures. They are position-sizing failures wearing a signal costume.

---

## 1. Volatility targeting (position sizing)

Fixed lot sizes are the standard retail mistake: the same 0.10 lots risks wildly different amounts on XAUUSD during a volatility spike than on EURUSD in a quiet week. Size by **risk**, not by lots.

### Per-trade sizing

```
risk_amount   = equity × risk_per_trade
stop_distance = ATR(14) × ATR_mult          (in price units)
lots          = risk_amount / (stop_distance × contract_value_per_point)
```

Then clamp to the symbol's `volume_min`, `volume_max`, and `volume_step` — and if the computed size rounds to below `volume_min`, **skip the trade**. Do not round up. Rounding 0.004 up to 0.01 on a small account is a 2.5× risk overshoot, and it happens on exactly the volatile instruments where it hurts most.

### Recommended settings

| Account equity | `risk_per_trade` | Rationale |
|---|---|---|
| Any (starting out) | **0.25%** | First 3 months live, regardless of backtest confidence |
| After 3 profitable months | 0.5% | |
| Established, validated | 0.75–1.0% | **Hard ceiling. Do not exceed 1%.** |

At 0.5% per trade with 6 concurrent positions, worst-case simultaneous stop-out is 3% of equity. That is survivable. At 3% per trade — a figure frequently recommended in retail material — the same event is an 18% loss, and two of them in a quarter ends the account's ability to recover mathematically.

### Portfolio volatility target

Target **10% annualised portfolio volatility** to start. Scale all positions by:

```
scalar = target_vol / realised_portfolio_vol_20d
capped to [0.5, 1.5]
```

The cap matters. Uncapped volatility scaling levers up aggressively into quiet markets, which is precisely when volatility regimes break — quiet periods precede violent ones far more often than the reverse.

---

## 2. Correlation clustering — the cap that actually binds

Six USD pairs is one dollar bet, not six bets. If you size each independently at 0.5%, your true risk on a dollar move is ~3%, not 0.5%. This is the single most common way a "properly sized" retail portfolio turns out to be 5× levered without the trader knowing.

### Bucket caps

| Bucket | Members | Max aggregate risk |
|---|---|---|
| USD-directional | EURUSD, GBPUSD, AUDUSD, USDCHF, USDCAD, USDJPY | **1.5% of equity** |
| Metals | XAUUSD, XAGUSD | 1.0% |
| Equity index | US500, USTEC, DE40 | 1.0% |
| **Total portfolio** | all open positions | **3.0% of equity** |

Compute bucket exposure as *net directional risk*, not gross. Long EURUSD and long USDCHF are approximately offsetting dollar bets (correlation ≈ −0.9); counting them as 2× exposure would wrongly block a genuinely hedged pair.

If a new signal would breach a cap: **skip it.** Do not scale down the existing positions to fit — that turns your exit logic into a function of unrelated signals and is very hard to reason about or debug.

---

## 3. Drawdown governors

Automatic, mechanical, no discretion. These exist specifically because judgment degrades exactly when it is most needed.

| Trigger | Action |
|---|---|
| **−5% from equity peak** | Halve `risk_per_trade`. No other change. |
| **−10% from equity peak** | Close all positions. Stop trading. Mandatory 5-day pause + full review. |
| **−15% from equity peak** | Full stop. Return to demo. Do not resume live until the cause is identified and the strategy re-validated. |
| **−3% in any single day** | Stop for the day. No new entries until the next session. |
| **3 consecutive stop-outs on one instrument** | Disable that instrument for 10 trading days. |

Recovery from the −5% governor: restore full risk only after equity makes a new peak, never on a partial bounce.

**Set these thresholds against the Monte Carlo distribution, not the backtest.** A backtest's max drawdown is one sample from a distribution, not a bound — the same trades in a different order routinely dig a much deeper hole. Run `backtest/run.py --monte-carlo 5000` and size against the **95th-percentile** drawdown. On the smoke dataset the observed path shows ~5.8% while the 95th percentile is ~12.3% and the worst resampled path reaches ~20.6%. If your governors are calibrated to the observed path, they will fire far earlier and more often than you expect.

**Why mechanical.** At −10% every instinct says "size up to recover faster." That instinct is what converts a recoverable drawdown into a terminal one. The governor exists to overrule you, so it must not have an override.

---

## 4. Kill switches (technical, not P&L)

Halt all trading and alert immediately on any of these:

- **Spread > 3× the 20-day median** for the symbol → do not enter; existing broker-side stops remain in place
- **Connection lost > 60 seconds** → no new entries on reconnect until data continuity is verified
- **Slippage > 2× expected** on 3 consecutive fills → execution conditions have changed; stop and investigate
- **Equity ≠ balance + floating P&L** (reconciliation failure) → stop immediately; this indicates a platform or accounting problem
- **Any position without a broker-side stop** → close it or attach a stop now
- **Server time drift** detected → halt Sleeve B (its entire edge is time-alignment dependent)

The broker-side stop rule deserves emphasis: a stop that exists only in your EA's memory does not exist. VPS reboots, terminal crashes, and disconnections all happen, and they preferentially happen during volatile conditions.

---

## 5. Margin and leverage

Exness offers very high leverage. **Available leverage is not a position-sizing input.** It determines only whether a trade is *possible*, never whether it is *correct*. Size from the risk formula in §1; if the result requires more than 10:1 effective leverage, the risk parameters are wrong, not the leverage limit.

Maintain **margin level > 500%** at all times. If it approaches 300%, you are already far outside this framework — reduce, and treat it as an incident to review, not a normal state.

---

## 6. Swap and financing

For a strategy holding positions for weeks, swap is not a rounding error:

- Exness charges **triple swap on Wednesdays** for many symbols including XAUUSD
- Some pairs carry meaningfully negative swap in one direction — this can turn a marginally profitable long-hold into a loser
- Index CFDs carry financing charges

**Model swap in the backtest.** Discovering it live is an expensive way to learn the number. Pull the actual per-symbol swap values from MT5 symbol properties rather than assuming.

---

## 7. Review cadence

| Frequency | What |
|---|---|
| Daily | Reconcile equity/balance; confirm every open position has a broker-side stop; check for anomalous spreads |
| Weekly | Realised vs. expected cost per round trip; slippage distribution |
| Monthly | Live vs. backtest tracking; drawdown vs. expectation; per-instrument attribution |
| Quarterly | Full walk-forward re-validation on data including the newest quarter |

The weekly cost review is the one people skip and the one that catches real degradation earliest. If realised costs drift above backtest assumptions, expectancy is quietly eroding — and this shows up in costs long before it shows up in the equity curve.

Use `backtest/reconcile.py` for it:

```bash
trading/.venv/bin/python -m trading.backtest.reconcile \
    --history trading/data/history.csv --symbol EURUSD --assumed-cost-points 7.0
```

It reports realised median and p90 cost per round trip against your model, with a verdict of `OK` (≤1.1×), `DRIFT` (≤1.5× — re-run the backtest at the higher figure), or `BROKEN` (>1.5× — expectancy is likely gone). Note it can only see commission and swap; spread and slippage are baked into `profit` and need requested-vs-fill logging to isolate.

For the monthly live-vs-backtest comparison, `reconcile.tracking_check()` puts live Sharpe against the backtest's 95% confidence interval — and will tell you when the horizon is too short to conclude anything, which for the first year it always is. Judge execution quality and cost drift instead; those converge in weeks rather than years.

---

## 8. The reframe on "small consistent daily profits"

Taking the original goal seriously — here is what genuinely moves the profitable-day percentage, and what only appears to:

**Legitimately raises the share of profitable days:**
- More uncorrelated instruments (the single biggest lever)
- Volatility targeting (stabilises daily P&L magnitude)
- Bucket caps (prevents one macro factor from dominating the day)

**Appears to, but imports tail risk — do not do these:**
- Removing or widening stops
- Adding a take-profit to raise the win rate
- Averaging into losers
- Increasing frequency to "smooth" results

The first list can plausibly get you to ~55% profitable days. The second list gets you to 90% profitable days and one catastrophic week. The gap between those two outcomes is the entire difference between the traders who are still trading in ten years and the 74–89% in the ESMA disclosures.

Judge the system on **quarters, not days.** Daily P&L at a 10% annual volatility target is almost entirely noise — the signal-to-noise ratio of a single day is far too low to contain information about whether the strategy is working.
