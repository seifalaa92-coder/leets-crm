//+------------------------------------------------------------------+
//|                                              DonchianTrend.mq5   |
//|  Diversified time-series trend, volatility-targeted.             |
//|  Implements ../02-STRATEGY.md (Sleeve A) and ../03-RISK.md.      |
//+------------------------------------------------------------------+
//  Design notes that matter:
//   * Signals are evaluated ONCE per new D1 bar. No intrabar logic --
//     this removes a whole family of repainting bugs and caps trade
//     frequency, which is where retail bleeds (01-RESEARCH.md s4).
//   * Every position carries a BROKER-SIDE stop. A stop that lives only
//     in EA memory does not exist: VPS reboots happen during volatility.
//   * Symbols are resolved dynamically because Exness appends
//     account-type suffixes (EURUSDm, EURUSDz, ...). Hardcoding fails.
//   * Stop distances are clamped to SYMBOL_TRADE_STOPS_LEVEL, else the
//     server returns "invalid stops" (error 4756).
//+------------------------------------------------------------------+
#property copyright "Trading research package"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\SymbolInfo.mqh>

//--- Strategy (see 02-STRATEGY.md; keep optimised params to these three)
input group           "=== Strategy ==="
input int             InpEntryLookback   = 55;      // Donchian entry lookback (days)
input int             InpExitLookback    = 20;      // Donchian exit lookback (days)
input double          InpATRMult         = 3.0;     // Stop distance in ATRs
input int             InpATRPeriod       = 14;      // ATR period (fixed, do not optimise)

//--- Universe: comma-separated BASE names. Suffixes resolved at runtime.
input group           "=== Universe ==="
input string          InpSymbols         = "EURUSD,GBPUSD,USDJPY,AUDUSD,XAUUSD";

//--- Risk (see 03-RISK.md)
input group           "=== Risk ==="
input double          InpRiskPerTrade    = 0.005;   // Fraction of equity per trade
input double          InpUsdBucketCap    = 0.015;   // Max net USD-directional risk
input double          InpMetalsBucketCap = 0.010;
input double          InpTotalCap        = 0.030;   // Max aggregate open risk
input double          InpVolFloor        = 0.003;   // Min ATR/price to trade
input double          InpVolCeiling      = 0.050;   // Max ATR/price to trade

//--- Governors
input group           "=== Governors ==="
input double          InpDDHalveRisk     = 0.05;    // Halve risk below this DD
input double          InpDDStopTrading   = 0.10;    // Halt entirely below this DD
input double          InpDailyLossLimit  = 0.03;    // Stop for the day
input double          InpMaxSpreadMult   = 3.0;     // Skip if spread > N x median

//--- Portfolio volatility targeting (03-RISK.md s1)
input group           "=== Volatility target ==="
input bool            InpUseVolTarget    = true;
input double          InpTargetVol       = 0.10;    // Annualised portfolio vol
input double          InpVolScalarMin    = 0.5;
input double          InpVolScalarMax    = 1.5;     // Cap matters -- see below

//--- Execution
input group           "=== Execution ==="
input ulong           InpMagic           = 20260807;
input ulong           InpSlippagePoints  = 20;
input bool            InpAllowShorts     = true;

//+------------------------------------------------------------------+
//| Per-symbol runtime state                                          |
//+------------------------------------------------------------------+
struct SymbolState
{
   string   name;             // resolved broker symbol (with suffix)
   string   base;             // canonical name, e.g. "EURUSD"
   int      atr_handle;
   datetime last_bar;
   double   spread_sum;       // running mean spread, for the anomaly filter
   long     spread_n;
   int      consecutive_stops;
   datetime disabled_until;
};

CTrade         trade;
SymbolState    g_syms[];
double         g_peak_equity   = 0.0;
double         g_day_start_eq  = 0.0;
datetime       g_current_day   = 0;
bool           g_halted        = false;

//--- Rolling daily returns for the volatility scalar.
#define VOL_WINDOW 20
double         g_daily_returns[VOL_WINDOW];
int            g_ret_count     = 0;
int            g_ret_head      = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   if(InpExitLookback >= InpEntryLookback)
   {
      Print("FATAL: ExitLookback must be < EntryLookback");
      return INIT_PARAMETERS_INCORRECT;
   }
   if(InpRiskPerTrade <= 0.0 || InpRiskPerTrade > 0.01)
   {
      Print("FATAL: RiskPerTrade must be in (0, 0.01]. See 03-RISK.md -- ",
            "above 1% per trade the drawdown maths stops being recoverable.");
      return INIT_PARAMETERS_INCORRECT;
   }

   trade.SetExpertMagicNumber(InpMagic);
   trade.SetDeviationInPoints(InpSlippagePoints);
   trade.SetAsyncMode(false);

   if(!ResolveUniverse())
      return INIT_FAILED;

   g_peak_equity  = AccountInfoDouble(ACCOUNT_EQUITY);
   g_day_start_eq = g_peak_equity;
   g_current_day  = DayStart(TimeCurrent());

   PrintFormat("Initialised with %d symbols, risk %.2f%%/trade, magic %I64u",
               ArraySize(g_syms), InpRiskPerTrade * 100.0, InpMagic);
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   for(int i = 0; i < ArraySize(g_syms); i++)
      if(g_syms[i].atr_handle != INVALID_HANDLE)
         IndicatorRelease(g_syms[i].atr_handle);
}

//+------------------------------------------------------------------+
//| Resolve base names to actual broker symbols.                      |
//| Exness appends account-type suffixes; a hardcoded "EURUSD" either  |
//| fails silently or throws "unknown symbol".                         |
//+------------------------------------------------------------------+
bool ResolveUniverse()
{
   string bases[];
   int n = StringSplit(InpSymbols, ',', bases);
   if(n <= 0)
   {
      Print("FATAL: no symbols configured");
      return false;
   }

   ArrayResize(g_syms, 0);

   for(int i = 0; i < n; i++)
   {
      string base = bases[i];
      StringTrimLeft(base);
      StringTrimRight(base);
      if(base == "")
         continue;

      string resolved = FindBrokerSymbol(base);
      if(resolved == "")
      {
         PrintFormat("WARN: no broker symbol matches '%s' -- skipping. Check "
                     "Market Watch for the exact name.", base);
         continue;
      }

      if(!SymbolSelect(resolved, true))
      {
         PrintFormat("WARN: could not select %s", resolved);
         continue;
      }

      SymbolState s;
      s.name              = resolved;
      s.base              = base;
      s.atr_handle        = iATR(resolved, PERIOD_D1, InpATRPeriod);
      s.last_bar          = 0;
      s.spread_sum        = 0.0;
      s.spread_n          = 0;
      s.consecutive_stops = 0;
      s.disabled_until    = 0;

      if(s.atr_handle == INVALID_HANDLE)
      {
         PrintFormat("WARN: ATR handle failed for %s", resolved);
         continue;
      }

      int sz = ArraySize(g_syms);
      ArrayResize(g_syms, sz + 1);
      g_syms[sz] = s;
      PrintFormat("  resolved %s -> %s", base, resolved);
   }

   if(ArraySize(g_syms) == 0)
   {
      Print("FATAL: no symbols resolved");
      return false;
   }
   if(ArraySize(g_syms) < 4)
      PrintFormat("WARN: only %d symbols. Diversification IS the edge here "
                  "(01-RESEARCH.md s2.1) -- expect materially lower Sharpe.",
                  ArraySize(g_syms));
   return true;
}

//+------------------------------------------------------------------+
string FindBrokerSymbol(const string base)
{
   if(SymbolInfoInteger(base, SYMBOL_SELECT) || SymbolSelect(base, true))
      return base;

   int total = SymbolsTotal(false);
   string best = "";
   for(int i = 0; i < total; i++)
   {
      string name = SymbolName(i, false);
      if(StringFind(name, base) == 0)          // prefix match: EURUSD -> EURUSDm
      {
         // Prefer the shortest match, i.e. the plainest suffix.
         if(best == "" || StringLen(name) < StringLen(best))
            best = name;
      }
   }
   return best;
}

//+------------------------------------------------------------------+
void OnTick()
{
   UpdateGovernors();

   for(int i = 0; i < ArraySize(g_syms); i++)
   {
      datetime bar = iTime(g_syms[i].name, PERIOD_D1, 0);
      if(bar == 0 || bar == g_syms[i].last_bar)
         continue;                              // not a new daily bar yet

      g_syms[i].last_bar = bar;
      ProcessSymbol(i);
   }
}

//+------------------------------------------------------------------+
//| Drawdown and daily-loss governors (03-RISK.md s3).                |
//| Mechanical by design: at -10% every instinct says size up, and    |
//| that instinct is what makes a drawdown terminal.                  |
//+------------------------------------------------------------------+
void UpdateGovernors()
{
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);

   datetime today = DayStart(TimeCurrent());
   if(today != g_current_day)
   {
      // Record yesterday's return before resetting the day.
      if(g_current_day != 0 && g_day_start_eq > 0.0)
      {
         g_daily_returns[g_ret_head] = equity / g_day_start_eq - 1.0;
         g_ret_head = (g_ret_head + 1) % VOL_WINDOW;
         if(g_ret_count < VOL_WINDOW)
            g_ret_count++;
      }
      g_current_day  = today;
      g_day_start_eq = equity;
   }

   if(equity > g_peak_equity)
      g_peak_equity = equity;

   if(g_peak_equity <= 0.0)
      return;

   double dd = 1.0 - equity / g_peak_equity;

   if(dd >= InpDDStopTrading && !g_halted)
   {
      g_halted = true;
      PrintFormat("HALT: drawdown %.2f%% >= %.2f%%. Closing all and stopping. "
                  "Manual review required before resuming.",
                  dd * 100.0, InpDDStopTrading * 100.0);
      CloseAllPositions("drawdown halt");
   }
}

//+------------------------------------------------------------------+
double RiskMultiplier()
{
   if(g_halted)
      return 0.0;

   double equity = AccountInfoDouble(ACCOUNT_EQUITY);

   if(g_day_start_eq > 0.0 &&
      (1.0 - equity / g_day_start_eq) >= InpDailyLossLimit)
      return 0.0;                                // stopped for the day

   if(g_peak_equity > 0.0 &&
      (1.0 - equity / g_peak_equity) >= InpDDHalveRisk)
      return 0.5;

   return 1.0;
}

//+------------------------------------------------------------------+
//| Portfolio volatility scalar (03-RISK.md s1).                      |
//|                                                                   |
//| The upper cap is not cosmetic: uncapped vol targeting levers up    |
//| hardest into quiet markets, which is exactly when volatility       |
//| regimes tend to break.                                             |
//+------------------------------------------------------------------+
double VolScalar()
{
   if(!InpUseVolTarget || g_ret_count < 10)
      return 1.0;

   double sum = 0.0;
   for(int i = 0; i < g_ret_count; i++)
      sum += g_daily_returns[i];
   double mean = sum / g_ret_count;

   double sq = 0.0;
   for(int i = 0; i < g_ret_count; i++)
   {
      double d = g_daily_returns[i] - mean;
      sq += d * d;
   }
   if(g_ret_count < 2)
      return 1.0;

   double realised = MathSqrt(sq / (g_ret_count - 1)) * MathSqrt(252.0);
   if(realised <= 1e-9)
      return InpVolScalarMax;

   double scalar = InpTargetVol / realised;
   return MathMax(InpVolScalarMin, MathMin(InpVolScalarMax, scalar));
}

//+------------------------------------------------------------------+
void ProcessSymbol(const int idx)
{
   string sym = g_syms[idx].name;

   double atr = GetATR(idx);
   if(atr <= 0.0)
      return;

   if(HasPosition(sym))
   {
      ManagePosition(idx, atr);
      return;
   }

   if(RiskMultiplier() <= 0.0)
      return;
   if(TimeCurrent() < g_syms[idx].disabled_until)
      return;
   if(SpreadAnomalous(idx))
      return;

   TryEntry(idx, atr);
}

//+------------------------------------------------------------------+
double GetATR(const int idx)
{
   double buf[];
   // Shift 1: use the COMPLETED bar's ATR, never the forming bar.
   if(CopyBuffer(g_syms[idx].atr_handle, 0, 1, 1, buf) != 1)
      return 0.0;
   return buf[0];
}

//+------------------------------------------------------------------+
//| Spread anomaly filter -- do not enter into a blown-out spread.    |
//+------------------------------------------------------------------+
bool SpreadAnomalous(const int idx)
{
   string sym = g_syms[idx].name;
   double spread = (double)SymbolInfoInteger(sym, SYMBOL_SPREAD);
   if(spread <= 0.0)
      return false;

   g_syms[idx].spread_sum += spread;
   g_syms[idx].spread_n++;

   if(g_syms[idx].spread_n < 50)
      return false;                              // not enough history yet

   double mean = g_syms[idx].spread_sum / (double)g_syms[idx].spread_n;
   if(spread > mean * InpMaxSpreadMult)
   {
      PrintFormat("%s: spread %.0f > %.1fx mean %.1f -- skipping entry",
                  sym, spread, InpMaxSpreadMult, mean);
      return true;
   }
   return false;
}

//+------------------------------------------------------------------+
void TryEntry(const int idx, const double atr)
{
   string sym = g_syms[idx].name;

   double close = iClose(sym, PERIOD_D1, 1);
   if(close <= 0.0)
      return;

   // Volatility gate: skip dead markets (costs dominate) and volatility
   // explosions (fills unreliable).
   double vol_ratio = atr / close;
   if(vol_ratio < InpVolFloor || vol_ratio > InpVolCeiling)
      return;

   // Donchian channel over bars 2..EntryLookback+1, i.e. EXCLUDING the bar
   // whose close we are testing. Including it would make the breakout
   // trivially self-satisfying.
   int hi = iHighest(sym, PERIOD_D1, MODE_HIGH, InpEntryLookback, 2);
   int lo = iLowest(sym, PERIOD_D1, MODE_LOW,  InpEntryLookback, 2);
   if(hi < 0 || lo < 0)
      return;

   double upper = iHigh(sym, PERIOD_D1, hi);
   double lower = iLow(sym, PERIOD_D1, lo);

   int dir = 0;
   if(close > upper)
      dir = 1;
   else if(close < lower && InpAllowShorts)
      dir = -1;

   if(dir == 0)
      return;

   double stop_distance = ClampStopDistance(sym, InpATRMult * atr);
   double lots = CalcLots(sym, stop_distance);
   if(lots <= 0.0)
   {
      PrintFormat("%s: signal skipped -- correctly-sized lot is below the "
                  "broker minimum. Account too small for this symbol.", sym);
      return;
   }

   double new_risk = RiskFractionOf(sym, stop_distance, lots);
   if(!BucketCapsAllow(sym, dir, new_risk))
      return;

   double ask = SymbolInfoDouble(sym, SYMBOL_ASK);
   double bid = SymbolInfoDouble(sym, SYMBOL_BID);
   int    dg  = (int)SymbolInfoInteger(sym, SYMBOL_DIGITS);

   bool ok;
   if(dir > 0)
   {
      double sl = NormalizeDouble(ask - stop_distance, dg);
      ok = trade.Buy(lots, sym, 0.0, sl, 0.0, "donchian");
   }
   else
   {
      double sl = NormalizeDouble(bid + stop_distance, dg);
      ok = trade.Sell(lots, sym, 0.0, sl, 0.0, "donchian");
   }

   if(!ok)
      PrintFormat("%s: order failed, retcode=%d (%s)",
                  sym, trade.ResultRetcode(), trade.ResultRetcodeDescription());
   else
      PrintFormat("%s: %s %.2f lots, stop distance %.5f (%.2f ATR), risk %.3f%%",
                  sym, dir > 0 ? "BUY" : "SELL", lots, stop_distance,
                  InpATRMult, new_risk * 100.0);
}

//+------------------------------------------------------------------+
//| Trailing stop + Donchian exit. The stop RATCHETS ONLY.            |
//| Widening a stop is how a trend system becomes a martingale.       |
//+------------------------------------------------------------------+
void ManagePosition(const int idx, const double atr)
{
   string sym = g_syms[idx].name;
   if(!PositionSelect(sym))
      return;
   if(PositionGetInteger(POSITION_MAGIC) != (long)InpMagic)
      return;

   long   type = PositionGetInteger(POSITION_TYPE);
   double sl   = PositionGetDouble(POSITION_SL);
   int    dg   = (int)SymbolInfoInteger(sym, SYMBOL_DIGITS);
   bool   isLong = (type == POSITION_TYPE_BUY);

   // --- Donchian exit on the completed bar
   int hi = iHighest(sym, PERIOD_D1, MODE_HIGH, InpExitLookback, 2);
   int lo = iLowest(sym, PERIOD_D1, MODE_LOW,  InpExitLookback, 2);
   double close = iClose(sym, PERIOD_D1, 1);

   if(hi >= 0 && lo >= 0 && close > 0.0)
   {
      double exit_upper = iHigh(sym, PERIOD_D1, hi);
      double exit_lower = iLow(sym, PERIOD_D1, lo);

      if((isLong && close < exit_lower) || (!isLong && close > exit_upper))
      {
         if(trade.PositionClose(sym))
         {
            PrintFormat("%s: donchian exit", sym);
            g_syms[idx].consecutive_stops = 0;
         }
         return;
      }
   }

   // --- Trailing stop
   double stop_distance = ClampStopDistance(sym, InpATRMult * atr);
   double price = isLong ? SymbolInfoDouble(sym, SYMBOL_BID)
                         : SymbolInfoDouble(sym, SYMBOL_ASK);
   double candidate = isLong ? price - stop_distance : price + stop_distance;
   candidate = NormalizeDouble(candidate, dg);

   bool improves = isLong ? (candidate > sl) : (candidate < sl);
   if(!improves)
      return;

   // Respect the freeze level, or the modify is rejected.
   double freeze = SymbolInfoInteger(sym, SYMBOL_TRADE_FREEZE_LEVEL)
                   * SymbolInfoDouble(sym, SYMBOL_POINT);
   if(MathAbs(price - candidate) <= freeze)
      return;

   if(!trade.PositionModify(sym, candidate, PositionGetDouble(POSITION_TP)))
      PrintFormat("%s: trail modify failed, retcode=%d",
                  sym, trade.ResultRetcode());
}

//+------------------------------------------------------------------+
//| Clamp a stop distance to the broker's minimum (error 4756 guard). |
//+------------------------------------------------------------------+
double ClampStopDistance(const string sym, const double desired)
{
   double point   = SymbolInfoDouble(sym, SYMBOL_POINT);
   double min_dist = SymbolInfoInteger(sym, SYMBOL_TRADE_STOPS_LEVEL) * point;
   // A small buffer above the stated minimum: the level can move between
   // our check and the server's.
   min_dist *= 1.1;
   return MathMax(desired, min_dist);
}

//+------------------------------------------------------------------+
//| Risk-based lot sizing (03-RISK.md s1).                            |
//| Rounds DOWN to the volume step -- never up. Rounding 0.004 up to  |
//| 0.01 is a 2.5x risk overshoot on exactly the volatile symbols     |
//| where it hurts most.                                              |
//+------------------------------------------------------------------+
double CalcLots(const string sym, const double stop_distance)
{
   if(stop_distance <= 0.0)
      return 0.0;

   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double risk   = equity * InpRiskPerTrade * RiskMultiplier() * VolScalar();
   if(risk <= 0.0)
      return 0.0;

   double tick_value = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE);
   double tick_size  = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_SIZE);
   if(tick_value <= 0.0 || tick_size <= 0.0)
      return 0.0;

   // Loss (account ccy) per 1.0 lot if the stop is hit.
   double loss_per_lot = (stop_distance / tick_size) * tick_value;
   if(loss_per_lot <= 0.0)
      return 0.0;

   double raw = risk / loss_per_lot;

   double vmin = SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN);
   double vmax = SymbolInfoDouble(sym, SYMBOL_VOLUME_MAX);
   double vstep = SymbolInfoDouble(sym, SYMBOL_VOLUME_STEP);
   if(vstep <= 0.0)
      vstep = 0.01;

   double lots = MathFloor(raw / vstep) * vstep;

   if(lots < vmin)
      return 0.0;                                // skip, do NOT round up
   return MathMin(lots, vmax);
}

//+------------------------------------------------------------------+
double RiskFractionOf(const string sym, const double stop_distance,
                      const double lots)
{
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   if(equity <= 0.0)
      return 1.0;

   double tick_value = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE);
   double tick_size  = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_SIZE);
   if(tick_value <= 0.0 || tick_size <= 0.0)
      return 1.0;

   return ((stop_distance / tick_size) * tick_value * lots) / equity;
}

//+------------------------------------------------------------------+
//| Correlation-bucket caps (03-RISK.md s2).                          |
//| Six USD pairs is one dollar bet in six costumes -- without this   |
//| a "properly sized" portfolio runs several times its target risk.  |
//+------------------------------------------------------------------+
string BucketOf(const string base)
{
   if(base == "XAUUSD" || base == "XAGUSD")
      return "metals";
   if(base == "US500" || base == "USTEC" || base == "DE40" || base == "UK100")
      return "equity";
   if(StringFind(base, "USD") >= 0)
      return "usd";
   return "other";
}

//--- +1 if a LONG position in this symbol is long the dollar.
int UsdSign(const string base)
{
   if(StringFind(base, "USD") == 0)   // USDxxx
      return 1;
   return -1;                          // xxxUSD
}

bool BucketCapsAllow(const string sym, const int dir, const double new_risk)
{
   string base   = BaseOf(sym);
   string bucket = BucketOf(base);

   double total = new_risk;
   double net_usd = (bucket == "usd") ? dir * UsdSign(base) * new_risk : 0.0;
   double gross_bucket = (bucket != "usd") ? new_risk : 0.0;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || !PositionSelectByTicket(ticket))
         continue;
      if(PositionGetInteger(POSITION_MAGIC) != (long)InpMagic)
         continue;

      string psym  = PositionGetString(POSITION_SYMBOL);
      string pbase = BaseOf(psym);
      double psl   = PositionGetDouble(POSITION_SL);
      double popen = PositionGetDouble(POSITION_PRICE_OPEN);
      double plots = PositionGetDouble(POSITION_VOLUME);
      if(psl <= 0.0)
         continue;

      double prisk = RiskFractionOf(psym, MathAbs(popen - psl), plots);
      int    pdir  = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? 1 : -1;

      total += prisk;

      string pbucket = BucketOf(pbase);
      if(pbucket != bucket)
         continue;

      if(bucket == "usd")
         net_usd += pdir * UsdSign(pbase) * prisk;   // net, so hedges offset
      else
         gross_bucket += prisk;
   }

   if(total > InpTotalCap)
   {
      PrintFormat("%s: entry blocked -- total risk %.3f%% > cap %.3f%%",
                  sym, total * 100.0, InpTotalCap * 100.0);
      return false;
   }

   if(bucket == "usd" && MathAbs(net_usd) > InpUsdBucketCap)
   {
      PrintFormat("%s: entry blocked -- net USD risk %.3f%% > cap %.3f%%",
                  sym, MathAbs(net_usd) * 100.0, InpUsdBucketCap * 100.0);
      return false;
   }

   if(bucket == "metals" && gross_bucket > InpMetalsBucketCap)
   {
      PrintFormat("%s: entry blocked -- metals risk %.3f%% > cap %.3f%%",
                  sym, gross_bucket * 100.0, InpMetalsBucketCap * 100.0);
      return false;
   }

   return true;
}

//+------------------------------------------------------------------+
string BaseOf(const string sym)
{
   for(int i = 0; i < ArraySize(g_syms); i++)
      if(g_syms[i].name == sym)
         return g_syms[i].base;
   return sym;
}

//+------------------------------------------------------------------+
bool HasPosition(const string sym)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || !PositionSelectByTicket(ticket))
         continue;
      if(PositionGetInteger(POSITION_MAGIC) == (long)InpMagic &&
         PositionGetString(POSITION_SYMBOL) == sym)
         return true;
   }
   return false;
}

//+------------------------------------------------------------------+
void CloseAllPositions(const string reason)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || !PositionSelectByTicket(ticket))
         continue;
      if(PositionGetInteger(POSITION_MAGIC) != (long)InpMagic)
         continue;

      string sym = PositionGetString(POSITION_SYMBOL);
      if(!trade.PositionClose(sym))
         PrintFormat("%s: close failed (%s), retcode=%d",
                     sym, reason, trade.ResultRetcode());
   }
}

//+------------------------------------------------------------------+
datetime DayStart(const datetime t)
{
   MqlDateTime d;
   TimeToStruct(t, d);
   d.hour = 0; d.min = 0; d.sec = 0;
   return StructToTime(d);
}
//+------------------------------------------------------------------+
