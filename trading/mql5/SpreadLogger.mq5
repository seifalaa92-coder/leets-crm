//+------------------------------------------------------------------+
//|                                              SpreadLogger.mq5    |
//|  Measure your ACTUAL trading costs, per symbol, per hour of day.  |
//+------------------------------------------------------------------+
//  Run this on a demo account for one full week before trusting any
//  backtest. The advertised "from 0.0 pips" is a best-case marketing
//  number; what you need is your own median and 90th percentile, broken
//  down by hour of the server day (04-EXNESS-MT5-SETUP.md s5).
//
//  Output: MQL5/Files/spread_log_<account>.csv
//    symbol,server_hour,samples,median_points,p90_points,max_points
//
//  Feed the median into CostModel for the base backtest and the p90 into
//  the stress run. The hour-of-day breakdown is what parameterises the
//  session filter -- expect to find the Asian session unusable for
//  EUR-crosses (wide spread relative to available range).
//+------------------------------------------------------------------+
#property copyright "Trading research package"
#property version   "1.00"
#property strict

input string InpSymbols      = "EURUSD,GBPUSD,USDJPY,AUDUSD,XAUUSD";
input int    InpSampleSecs   = 10;     // sampling interval
input int    InpFlushMins    = 30;     // how often to rewrite the CSV

#define MAX_SAMPLES 20000

struct SymbolLog
{
   string name;
   double samples[24][MAX_SAMPLES];    // [server hour][sample]
   int    counts[24];
};

SymbolLog g_logs[];
datetime  g_last_sample = 0;
datetime  g_last_flush  = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   string bases[];
   int n = StringSplit(InpSymbols, ',', bases);
   if(n <= 0)
   {
      Print("FATAL: no symbols configured");
      return INIT_PARAMETERS_INCORRECT;
   }

   ArrayResize(g_logs, 0);

   for(int i = 0; i < n; i++)
   {
      string base = bases[i];
      StringTrimLeft(base);
      StringTrimRight(base);
      if(base == "")
         continue;

      string resolved = FindBrokerSymbol(base);
      if(resolved == "" || !SymbolSelect(resolved, true))
      {
         PrintFormat("WARN: could not resolve '%s'", base);
         continue;
      }

      int sz = ArraySize(g_logs);
      ArrayResize(g_logs, sz + 1);
      g_logs[sz].name = resolved;
      for(int h = 0; h < 24; h++)
         g_logs[sz].counts[h] = 0;

      PrintFormat("  logging %s -> %s", base, resolved);
   }

   if(ArraySize(g_logs) == 0)
   {
      Print("FATAL: no symbols resolved");
      return INIT_FAILED;
   }

   PrintFormat("Sampling every %ds. Let this run for a FULL WEEK, then use "
               "the medians in your cost model.", InpSampleSecs);
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason) { WriteCsv(); }

//+------------------------------------------------------------------+
void OnTick()
{
   datetime now = TimeCurrent();

   if(now - g_last_sample >= InpSampleSecs)
   {
      g_last_sample = now;
      Sample(now);
   }

   if(now - g_last_flush >= InpFlushMins * 60)
   {
      g_last_flush = now;
      WriteCsv();
   }
}

//+------------------------------------------------------------------+
void Sample(const datetime now)
{
   MqlDateTime d;
   TimeToStruct(now, d);
   int hour = d.hour;
   if(hour < 0 || hour > 23)
      return;

   for(int i = 0; i < ArraySize(g_logs); i++)
   {
      // Compute from live bid/ask rather than SYMBOL_SPREAD so the value is
      // exact rather than rounded to whole points.
      double ask = SymbolInfoDouble(g_logs[i].name, SYMBOL_ASK);
      double bid = SymbolInfoDouble(g_logs[i].name, SYMBOL_BID);
      double pt  = SymbolInfoDouble(g_logs[i].name, SYMBOL_POINT);
      if(ask <= 0.0 || bid <= 0.0 || pt <= 0.0)
         continue;

      double spread_points = (ask - bid) / pt;
      if(spread_points <= 0.0)
         continue;

      int c = g_logs[i].counts[hour];
      if(c >= MAX_SAMPLES)
         continue;                                // bucket full

      g_logs[i].samples[hour][c] = spread_points;
      g_logs[i].counts[hour] = c + 1;
   }
}

//+------------------------------------------------------------------+
void WriteCsv()
{
   string path = StringFormat("spread_log_%I64d.csv",
                              AccountInfoInteger(ACCOUNT_LOGIN));
   int fh = FileOpen(path, FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(fh == INVALID_HANDLE)
   {
      PrintFormat("ERROR: could not open %s (%d)", path, GetLastError());
      return;
   }

   FileWrite(fh, "symbol", "server_hour", "samples",
             "median_points", "p90_points", "max_points");

   for(int i = 0; i < ArraySize(g_logs); i++)
   {
      for(int h = 0; h < 24; h++)
      {
         int c = g_logs[i].counts[h];
         if(c == 0)
            continue;

         double vals[];
         ArrayResize(vals, c);
         for(int k = 0; k < c; k++)
            vals[k] = g_logs[i].samples[h][k];
         ArraySort(vals);

         double median = vals[c / 2];
         double p90    = vals[(int)MathMin(c - 1, (int)MathFloor(c * 0.90))];
         double mx     = vals[c - 1];

         FileWrite(fh, g_logs[i].name, h, c,
                   DoubleToString(median, 2),
                   DoubleToString(p90, 2),
                   DoubleToString(mx, 2));
      }
   }

   FileClose(fh);
   PrintFormat("Wrote %s", path);
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
      if(StringFind(name, base) == 0)
         if(best == "" || StringLen(name) < StringLen(best))
            best = name;
   }
   return best;
}
//+------------------------------------------------------------------+
