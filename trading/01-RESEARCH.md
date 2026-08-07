# What Actually Worked, 2015–2026

An evidence review of systematic strategies, filtered for what a retail account on Exness MT5 can actually execute. Sources at the bottom; claims that rest on a single source are marked.

The organising question is not "what makes money in a backtest" — everything makes money in a backtest. It is: **which effects have out-of-sample evidence, and which of those survive retail transaction costs?** Most fail the second test, and that is the part almost every strategy guide omits.

---

## 1. The headline finding: the classic FX factors stopped working

This is the most important result in the review, and it directly contradicts the usual advice.

The three canonical systematic FX strategies — **carry** (long high-yield currencies, short low-yield), **momentum** (buy recent winners), and **value** (buy currencies cheap vs. PPP) — have a documented multi-decade record. But the record broke:

| Period | Carry Sharpe | Momentum Sharpe | Value Sharpe |
|---|---|---|---|
| 2000–2010 | 0.21 | 0.75 | 0.14 |
| 2010–present | **negative** | **negative** | **negative** |

*(Verdad Capital, "Understanding Systematic FX Strategies")*

The carry decline post-2008 is independently documented in the peer-reviewed literature (Journal of International Financial Markets, 2021). The mechanism is not mysterious: carry is compensation for crash risk in an environment of dispersed interest rates. A decade of near-zero rates across the G10 collapsed the rate dispersion that carry feeds on, and central-bank put behaviour changed the crash dynamics carry was being paid for.

**Implication:** if you are building a system today and it is fundamentally a carry or a cross-sectional FX momentum bet, you are trading a factor whose live out-of-sample record over the exact 10-year window you asked about is *negative*. Do not build on it. This is also a warning about the whole exercise — "worked for 10 years" is a survivorship filter that tends to select things right before they stop working.

---

## 2. What *does* have durable evidence

### 2.1 Time-series momentum (trend following) — strongest evidence, weakest in FX alone

The most robustly documented systematic effect in existence. Moskowitz, Ooi & Pedersen (2012) found a composite Sharpe of ~1.28 across 58 liquid futures 1985–2009 vs. 0.38 for buy-and-hold. Hurst, Ooi & Pedersen (2017) extended it to **67 markets back to 1880** and found positive returns in *every ten-year sub-period* — through the Great Depression, WWII, and 1970s stagflation. It was strongly positive in 2008 when equities collapsed.

Three caveats that matter enormously for you:

1. **The Sharpe comes from diversification, not from the signal.** Any single instrument's trend Sharpe is ~0.2–0.4. The 1.28 is what you get from combining ~58 low-correlated markets. A retail account trading 3 pairs gets a fraction of it.
2. **2010–2020 was a poor decade for trend**, particularly in FX, for the same rate-compression reason as carry. It recovered strongly in 2022.
3. **The payoff is positively skewed** — many small losses, few large wins. Win rate is typically 35–45%. This is the *opposite* of the "small consistent daily profits" feel you described, and it is precisely why it survives while grid systems don't.

**Verdict: usable, and it is the core of the strategy in `02-STRATEGY.md`** — but only if diversified across as many uncorrelated instruments as the account can carry, and only with realistic expectations about flat periods.

### 2.2 Intraday reversals around FX benchmark fixings — strong statistics, thin margins

The most interesting recent finding. Krohn et al., **Journal of Finance (2024)**, "Foreign Exchange Fixings and Returns around the Clock":

- The dollar systematically **appreciates into the fix and depreciates after it**, tracing a "W-shaped" intraday return pattern
- Effect measured across the **top nine traded currencies over 21 years**
- t-statistics of ~4.1 (run-up) and ~5.5 (reversal, ~4.8% annualised) — these are very strong for finance
- Crucially: the reversal is **tightly aligned to the publication times of the benchmark rates**. Move the reversal window away from the fix and the return degrades uniformly. That specificity is what makes it credible rather than data-mined.

There is a related documented effect at the **London/Frankfurt open**, where market makers unwind order imbalances left over from the previous US session, creating predictable high-frequency returns.

The honest caveat: these are effects of a **few basis points per event**. The paper measures returns on mid-prices. A retail Exness account pays spread + commission + slippage on every leg. A 3-basis-point edge against a 1.5-pip round-trip cost on EURUSD is not a business. This becomes tradeable only on the tightest-cost account types (Raw Spread / Zero) and only on the most liquid symbols.

**Verdict: usable as a small satellite sleeve, capped, and only after you have measured your actual realised cost per round trip.** Not as a core.

### 2.3 Intraday volatility seasonality — real, and useful as a filter rather than a signal

Intraday seasonality in FX volume, volatility, and spreads is thoroughly documented (Tokyo / London / New York session structure, USDJPY and EURUSD studies). This is not an edge by itself — everyone knows it — but it is extremely useful as a **filter**: it tells you when spreads are wide relative to available movement, i.e. when *not* to trade. The Asian session for EUR-crosses is the clearest example: low range, proportionally wide spread, negative expectancy for almost any breakout logic.

**Verdict: use as a trading-window filter. This is one of the cheapest real improvements available to a retail system.**

---

## 3. What to avoid, with the reason

| Approach | Why it fails |
|---|---|
| **Grid / martingale / averaging down** | Profit per cycle is capped (grid spacing − costs); loss is unbounded. Doubling lots means 5 levels against you is 1+2+4+8+16 = 31 lots of exposure, not 5. Produces a beautiful curve until one sustained trend ends the account. Also inflates apparent win rate by never closing losers, which is why the statistics look great right up to zero. |
| **"No stop loss" systems** | Same payoff structure as above with extra steps. |
| **High-frequency scalping at retail** | You are paying spread + commission to compete with participants who are *paid* the spread and are co-located. The cost hurdle per trade is a large fraction of the entire per-trade edge. Frequency multiplies costs linearly and edge sub-linearly. |
| **Multi-indicator confluence systems** | Every added parameter is another degree of freedom to overfit. Standard guidance is a hard cap of **2–3 optimised parameters**. Systems with 8 indicators are memorising the sample. |
| **News trading on retail execution** | Spreads widen 5–20× and slippage is asymmetric at exactly the moment you need fills. The broker's execution model, not your signal, determines the outcome. |
| **Copy trading / signal subscriptions** | You inherit someone else's payoff skew without seeing it. Most impressive signal-provider curves are §1 grid systems. |

---

## 4. The cost hurdle — the calculation almost nobody does

This determines whether a strategy is viable more than the signal does. Do it before writing any code.

```
Edge per trade (pips) must exceed:  spread + commission + slippage
```

Rough Exness economics (verify against your live account — see `04-EXNESS-MT5-SETUP.md`):

| Account | Spread (EURUSD) | Commission | Approx. round-trip cost |
|---|---|---|---|
| Standard | ~1.0 pip | none | ~1.0 pip |
| Pro | from 0.1 pip | none | ~0.4–0.7 pip typical |
| Raw Spread | from 0.0 pip | ~$3.50/lot/side ($7 round turn) | ~0.7 pip equivalent |
| Zero | 0.0 pip on ~30 symbols, 95% of day | variable, $0.05–$600+/side/lot | instrument-dependent |

Now apply it. A strategy with a genuine **2-pip average edge** trading:

- **5 times/day** → 25 trades/week → cost drag ≈ 17.5–25 pips/week. Edge ≈ 50 pips/week. Half your gross is gone.
- **1 time/day** → cost drag ≈ 3.5–5 pips/week against 10 pips gross. Same ratio, but far less exposure to slippage variance and execution failure.

**This is why the strategy in this package trades a handful of times per week, not per day.** Trade frequency is the one variable where retail structurally loses and where reducing it is free. Every strategy design decision in `02-STRATEGY.md` that looks conservative traces back to this table.

Add: **swap costs**. Exness charges triple swap on Wednesdays for many symbols including XAUUSD. A trend system holding positions for weeks pays swap continuously — for some pairs this is a meaningful negative carry that must be in the backtest, not discovered live.

---

## 5. Validation methodology — non-negotiable

Getting this wrong is how a good strategy becomes a losing account.

**Backtest data quality.** In the MT5 Strategy Tester, use **"Every tick based on real ticks"** and verify **modelling quality is 99%**. "1-minute OHLC" mode does not reproduce the intra-bar movement that triggers your stops, so it systematically overstates results for any strategy with a stop or take-profit. Broker-supplied tick data can also have gaps — check for them.

**Parameter discipline.** Cap optimised parameters at **2–3**. Prefer a robust plateau over a sharp optimum: if the best parameter is 14 and 13 or 15 perform badly, 14 is noise. Plot the parameter surface; you want a mesa, not a spike.

**Walk-forward analysis.** Not a single train/test split — a rolling one. Optimise on a block, test on the *next unseen* block, slide forward, repeat. The number to trust is **walk-forward efficiency** = out-of-sample performance ÷ in-sample performance.

- WFE > 0.7 → robust
- WFE 0.5–0.7 → marginal, reduce complexity
- WFE < 0.5 → curve-fitted, discard

A smooth rising backtest and a nose-diving forward test is the diagnostic signature of overfitting.

**Cost sensitivity.** Re-run the backtest with costs at 1.5× and 2× your assumed level. If the strategy dies, it was never an edge — it was a cost-model artifact. Real strategies degrade gracefully.

**Regime segmentation.** Report results separately for 2015–2018, 2019–2021 (rate compression + COVID), 2022–2023 (rate hikes, strong trend), 2024–2026. A strategy that only works in one regime is a bet on that regime. Say so explicitly rather than averaging it away.

---

## 6. Conclusions carried into the strategy design

1. **Do not build on carry or cross-sectional FX momentum.** Negative live record over the exact window in question.
2. **Time-series trend is the only core with century-scale out-of-sample evidence** — but its Sharpe comes from diversification, so trade the widest set of uncorrelated instruments the account supports.
3. **Accept positive skew.** Low win rate, occasional large wins. This payoff shape is *why* it survives. Any change that raises the win rate by widening or removing stops is converting a surviving strategy into a blow-up strategy.
4. **Trade rarely.** The cost table in §4 is the binding constraint on retail, and frequency is the one thing fully under your control.
5. **Filter by session.** Free improvement from documented intraday spread/volatility seasonality.
6. **Fixing-reversal as a capped satellite**, only on tight-cost accounts, only after measuring realised costs.
7. **Risk sizing does more work than the signal.** See `03-RISK.md` — it is the highest-leverage document in this package.

---

## Sources

- [Time Series Momentum — Moskowitz, Ooi & Pedersen (NYU Stern)](https://w4.stern.nyu.edu/facdir/lpederse/papers/TimeSeriesMomentum.pdf)
- [Time Series Momentum (AQR)](https://www.aqr.com/Insights/Research/Journal-Article/Time-Series-Momentum)
- [Time Series Momentum — the historical evidence (Alpha Architect)](https://alphaarchitect.com/time-series-momentum-aka-trend-following-the-historical-evidence/)
- [Time Series Momentum Effect (Quantpedia)](https://quantpedia.com/strategies/time-series-momentum-effect)
- [Understanding Systematic FX Strategies (Verdad)](https://verdadcap.com/archive/understanding-systematic-fx-strategies)
- [Currency carry trade: decline in performance after the 2008 GFC (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S1042443121001670)
- [FX Carry + Value + Momentum over 200+ Years (Quantpedia)](https://quantpedia.com/fx-carry-value-momentum-strategies-over-their-200-year-history/)
- [Foreign Exchange Fixings and Returns around the Clock — Krohn et al., Journal of Finance (2024)](https://onlinelibrary.wiley.com/doi/10.1111/jofi.13306)
- [The Overnight Drift — Boyarchenko, Larsen & Whelan, NY Fed Staff Report 917](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr917.pdf)
- [Intra-Day Seasonality in FX Markets (ResearchGate)](https://www.researchgate.net/publication/46444432_Intra-Day_Seasonality_in_Activities_of_the_Foreign_Exchange_Markets_Evidence_from_the_Electronic_Broking_System)
- [Why Most Grid EAs Fail (MQL5 Articles)](https://www.mql5.com/en/articles/21833)
- [The Risks of Grid EAs: Hidden Drawdowns (EATested)](https://eatested.com/installing-expert-advisors/risks-of-using-grid-expert-advisors/)
- [Mastering MT5 Strategy Tester (MQL5 Blogs)](https://www.mql5.com/en/blogs/post/766653)
- [How to Backtest a Strategy in MT5 — Advanced Guide (For Traders)](https://fortraders.com/blog/backtest-strategy-in-mt5-advanced-guide)
- [Exness account types comparison (Traders Union)](https://tradersunion.com/brokers/forex/view/exness/account-types-compared/)
- [Exness: What trading account type should I use?](https://get.exness.help/hc/en-us/articles/360014664779-What-trading-account-type-should-I-use)
- [ESMA CFD restrictions (Finance Magnates)](https://www.financemagnates.com/forex/brokers/esma-renews-cfds-restrictions-for-retail-clients/)
- [What percentage of forex traders lose money (Traderslog)](https://www.traderslog.com/what-percentage-of-traders-lose-money)
