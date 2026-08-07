# Exness + MT5: Platform Reality and Connection

---

## 1. Why this session cannot reach MT5

| Requirement | Status here |
|---|---|
| Windows host (the official `MetaTrader5` Python package is Windows-only) | ✗ Linux container |
| MT5 terminal installed and logged in | ✗ Not present |
| `MetaTrader5` Python package | ✗ Not installed |
| MT5/broker MCP connector | ✗ None registered |
| Account credentials | ✗ None available |
| Network egress to broker endpoints | ✗ Proxy-filtered |

The `MetaTrader5` package works by attaching to a **running MT5 terminal process on the same Windows machine**. There is no remote/API mode — no terminal, no connection, regardless of credentials.

## 2. How to give me a real connection

Pick whichever fits how you want to work:

**Option A — you run the terminal, I write the code (recommended).**
You run MT5 + Python on a Windows machine or VPS. I develop and maintain the EA and the research code in this repo; you pull, run, and send me back the outputs (backtest reports, `ORDERS_HISTORY.csv`, tester logs). I iterate on the results. This needs no credential sharing at all, and it is how nearly all EA development actually works.

**Option B — an MCP bridge.**
Run an MT5 MCP server on your Windows machine and register it as a connector on your Claude account. Then a session with that connector enabled can query symbols, pull history, and (if you grant it) place orders. Note this is a live-trading capability — scope it read-only first.

**Option C — data only.**
Export CSVs from MT5 and put them somewhere I can read (this repo, or Google Drive — I do have a Drive connector in this session). I can then run the full Python research pipeline in `backtest/` on your real data. This gets you most of the value with none of the execution risk.

**A note on credentials:** don't paste account passwords or investor passwords into chat. Option A needs none. Option B uses a local bridge you control. Option C needs none. If you ever do need to share something, use an investor (read-only) password, never the master.

---

## 3. Exness account economics — pick before you backtest

Cost assumptions must match the account you will actually trade, or the backtest is fiction.

| Account | Min deposit | Spread (EURUSD) | Commission | Best for |
|---|---|---|---|---|
| **Standard** | low | ~1.0 pip | none | Learning; Sleeve A only |
| **Standard Cent** | low | ~1.0 pip | none | Testing with real-but-tiny money |
| **Pro** | ~$200 | from 0.1 pip | none | Sleeve A; instant execution on most instruments |
| **Raw Spread** | ~$200 | from 0.0 pip | ~$3.50/side/lot (~$7 round turn) | **Sleeve A + B** |
| **Zero** | ~$200 | 0.0 pip on ~30 symbols, 95% of the day | variable, $0.05–$600+/side/lot | Sleeve B, if the per-symbol commission works out |

*Figures from public sources — verify against your own account. Exness terms change, and spreads are variable, not fixed.*

**Recommendation:** **Raw Spread** for the core. The commission is explicit and predictable, which makes cost modelling accurate; variable spreads on commission-free accounts widen exactly when you most need a fill, and that widening is invisible in a naive backtest.

**Do not use the advertised "from 0.0 pips" number in your backtest.** That is a best-case marketing figure. Measure your own typical spread — §5 shows how — and use the median, then stress-test at 1.5× and 2×.

---

## 4. MT5 mechanics that will break a naive EA

Each of these is a real bug source, not theory:

**Symbol suffixes.** Exness appends account-type suffixes to symbol names (e.g. `EURUSDm`, `EURUSDz` — the exact scheme depends on account type). Hardcoding `"EURUSD"` fails silently or throws "unknown symbol." **Resolve symbols dynamically at startup** — the EA in `mql5/` does this.

**Stops level / freeze level.** `SYMBOL_TRADE_STOPS_LEVEL` is the minimum distance from current price at which a stop or limit may be placed; `SYMBOL_TRADE_FREEZE_LEVEL` is the distance within which an existing order can't be modified. Violating either returns error 4756 / "invalid stops." Always clamp your stop distance to at least the stops level.

**Filling modes.** Not all symbols accept `ORDER_FILLING_FOK`. Query `SYMBOL_FILLING_MODE` and pick a supported mode, or every order is rejected.

**Volume constraints.** Respect `volume_min`, `volume_max`, `volume_step`. Round *down* to the step (see `03-RISK.md` §1 — never up).

**Execution model.** Exness Pro uses instant execution on most instruments; others use market execution. Instant execution can requote; market execution can slip. Your EA needs a deviation/slippage parameter and must handle rejection gracefully rather than retrying in a tight loop.

**Server time ≠ your time ≠ GMT.** Broker server time typically has its own DST schedule. Sleeve B's entire edge is time-alignment dependent, so derive the fix time from server time programmatically and re-verify across both DST transitions.

**Triple swap Wednesday** on many symbols including XAUUSD. Model it.

**Hedging vs. netting.** Exness MT5 accounts are typically hedging-mode (multiple positions per symbol). The EA assumes one position per symbol and enforces it — verify `ACCOUNT_MARGIN_MODE` matches your expectation.

---

## 5. Measuring your real costs

Do this before trusting any backtest. It takes a week and it is the difference between a modelled edge and a real one.

1. Run the spread logger (`mql5/SpreadLogger.mq5`) on a demo account for **one full week**, all symbols in the universe
2. Compute the **median and 90th-percentile spread per symbol, per hour of the server day**
3. Use the median in the base backtest and the 90th percentile in the stress run
4. Once live, log **requested price vs. fill price** on every order — that difference is your true slippage
5. Compare realised total cost per round trip against your assumption **weekly**

The hour-of-day breakdown from step 2 is what parameterises the session filter in `02-STRATEGY.md`. You will likely find the Asian session unusable for EUR-crosses — wide spread relative to available range.

---

## 6. Backtest configuration in MT5 Strategy Tester

| Setting | Value |
|---|---|
| Modelling | **Every tick based on real ticks** |
| Modelling quality | must read **99%** — investigate anything lower |
| Period | 2015-01-01 → present |
| Deposit | your actual intended starting equity |
| Leverage | your actual account leverage |
| Optimisation | **Genetic**, with forward period enabled for walk-forward |
| Forward split | 70% in-sample / 30% out-of-sample minimum |

**Check tick data for gaps before trusting results.** Broker-supplied tick history can have missing stretches, and the tester will happily report a beautiful curve computed over data that does not exist.

Do not use "1-minute OHLC" mode. It cannot see intra-bar movement, so it systematically overstates results for any strategy with stops — which is every strategy here.

---

## 7. VPS and operations

- Host near the broker's servers (Exness's are typically London/Amsterdam) — latency matters for fills, not for D1 signals, but it matters a lot for Sleeve B
- Auto-restart MT5 on reboot, and have the EA reconcile open positions against expected state on startup
- **Every position must carry a broker-side stop.** VPS reboots happen during volatility, not during calm.
- Monitor: connection state, margin level, spread anomalies, EA heartbeat
- Alert to your phone on any kill-switch trigger (`03-RISK.md` §4)

---

## 8. What I need from you to go further

To take this from research package to validated system:

1. **Which account type** you have or intend to open (determines the cost model, and whether Sleeve B is viable at all)
2. **Account currency and starting equity** (determines position sizing and whether the universe is affordable at `volume_min`)
3. **Exact symbol names** from your Market Watch — a screenshot or a `SymbolsTotal()` dump
4. **D1 OHLC exports**, 2015→present, for the universe (see `backtest/README.md` for the format)
5. **A week of spread logs** from `mql5/SpreadLogger.mq5`

Give me 3 and 4 and I can run the full backtest and walk-forward here and report real numbers on your data, with no connection to your account needed.
