# MT5 / Exness Systematic Trading — Research Package

## Status of the MT5 connection

**This session is not connected to MT5.** I checked before writing anything:

| Check | Result |
|---|---|
| `MetaTrader5` Python package | Not installed (`ModuleNotFoundError`) |
| MT5 / MetaTrader / Exness MCP connector | None registered (`ListConnectors` → empty) |
| MT5 terminal, `.mq5` files, account credentials on disk | None found |
| Environment variables for broker/account | None set |
| Host OS | Linux container. The official `MetaTrader5` Python package is **Windows-only**; it cannot bind to a terminal here. |

This container is a fresh clone of the `leets-crm` Next.js repo with no market-data or broker access, and outbound network egress is filtered (several research sources I tried were blocked by the proxy).

So I could not read your account, pull quotes, place orders, or run a backtest against your live data. What I *can* do — and did — is the study you asked for, plus the code to execute it once a connection exists. See `04-EXNESS-MT5-SETUP.md` for exactly what has to be true for me to connect.

## The other thing you need to know up front

You asked for "small profits daily but consistently." I want to be straight with you, because this is the single most expensive assumption in retail trading:

**No strategy produces small consistent daily profits.** The strategies that *appear* to — grid, martingale, averaging-down, "no stop loss" systems — produce a smooth equity curve for weeks or months and then return all of it plus the account in a few days. That is not bad luck, it is the arithmetic of the payoff: profit per cycle is capped at the grid spacing, loss per cycle is unbounded. Industry data puts grid-EA blow-up rates ~18% above single-entry strategies, and ESMA-mandated broker disclosures consistently show **74–89% of retail CFD accounts lose money**.

What is actually achievable is *positive expectancy with bounded drawdown, measured over quarters.* A realistic well-built retail system looks like:

- Sharpe 0.5–0.9, not 3.0
- ~50–55% of **days** profitable, ~60% of **months** profitable
- 15–25% peak-to-trough drawdown at a 10–15% annual return target
- Losing streaks of 6–10 weeks that are entirely normal and must not be overridden

I have built the package around that target, not the daily-profit target. If you want, the daily-profit framing can be partially satisfied by *volatility targeting* (which smooths P&L) and *diversification* (which raises the fraction of profitable days) — both are in the design. What cannot be done is removing losing days without importing tail risk.

## Contents

| File | What it is |
|---|---|
| `01-RESEARCH.md` | Evidence review: what actually worked 2015–2026, what stopped working, and why. With sources. |
| `02-STRATEGY.md` | The concrete strategy specification — entries, exits, filters, parameters, instruments. |
| `03-RISK.md` | Position sizing, volatility targeting, drawdown governors, kill switches. |
| `04-EXNESS-MT5-SETUP.md` | Exness account-type economics, MT5 symbol/execution mechanics, and how to give this session a real connection. |
| `backtest/` | Python research harness. Data-agnostic — reads CSV exported from MT5. |
| `mql5/` | The EA implementing the specification, for the MT5 Strategy Tester and live. |

## Read order

1. `01-RESEARCH.md` — so you know why the strategy is what it is
2. `03-RISK.md` — this matters more than the strategy
3. `02-STRATEGY.md` — the rules
4. `04-EXNESS-MT5-SETUP.md` — before running anything with money

## Recommended path before any real capital

1. Export data from MT5 → run `backtest/` over 2015–2026 with realistic costs
2. Walk-forward validate (see `01-RESEARCH.md` §5) — reject if walk-forward efficiency < 0.5
3. MT5 Strategy Tester on **"Every tick based on real ticks"**, modelling quality 99%
4. Demo forward test on your actual Exness account type for **at least 3 months**
5. Live at 25% of target risk for 3 months, then scale

Steps 1–4 cost nothing but time. Skipping them is what the 74–89% do.
