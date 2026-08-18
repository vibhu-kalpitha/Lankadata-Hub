import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceDot
} from 'recharts';
import { apiService, type UsdComparisonResponse } from '../services/apiService';

export const USDExchangeRateComparison: React.FC = () => {
  const [data, setData] = useState<UsdComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    const res = await apiService.getUsdExchangeRates();
    setData(res);
    setLoading(false);
  };

  const banks = data?.banks || [];
  const bestBuy = data?.best_buy_ranking || banks;
  const bestSell = data?.best_sell_ranking || banks;
  const trendData = data?.trend_analysis || [];

  const maxTrendPoint = trendData.length > 0
    ? trendData.reduce((prev, curr) => (curr.sell_stream > prev.sell_stream ? curr : prev), trendData[0])
    : null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-6">
      {/* ── Section Title Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-gradient-to-b from-lanka-cyan to-blue-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Daily Dashboard
            </h2>
            <span className="text-xs text-lanka-muted font-mono hidden sm:inline-block ml-2">
              USD Dashboard - Tactical Data Stack
            </span>
          </div>
          <p className="text-xs text-lanka-muted mt-0.5 ml-4">
            Daily monitoring of USD buy/sell rates comparison across major banks.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={fetchExchangeRates}
            className={`p-2 rounded-xl bg-[#08172e] border-0 hover:bg-[#0c2242] text-slate-300 hover:text-white transition-all ${
              loading ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Refresh Data from PostgreSQL"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── ONE BIG UNIFIED DEV BOX (Borderless, Compact Past Height: h-[340px]) ── */}
      <div className="relative rounded-2xl bg-[#030914] p-3.5 h-[340px] min-h-[340px] max-h-[340px] overflow-hidden select-none shadow-2xl flex flex-col justify-between">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* 3 INNER COLUMNS INSIDE THE BIG DEV BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch flex-1 overflow-hidden">

          {/* ── 1. LEFT COLUMN: BANK DATA STACK (lg:col-span-4) ── */}
          <div className="lg:col-span-4 bg-[#051120]/80 rounded-xl p-3 flex flex-col justify-between h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 shrink-0">
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-cyan-400" />
                BANK DATA STACK
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">Live Stream</span>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar py-1.5">
              {banks.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="bg-white/[0.035] border border-white/[0.04] rounded-lg p-2 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="truncate max-w-[120px]">{b.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      SPREAD: <span className="text-cyan-300 font-bold">{b.spread_pct}</span>
                    </span>
                  </div>

                  {/* Clean Buy / Sell Rate Bars with bold focused numbers */}
                  <div className="grid grid-cols-2 gap-1.5 font-mono">
                    <div className="flex items-center justify-between bg-[#071933] rounded-md px-2 py-1">
                      <span className="text-[10px] text-slate-300 font-medium">Buy</span>
                      <span className="text-xs sm:text-sm font-black text-white">{b.buy.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#062642] rounded-md px-2 py-1">
                      <span className="text-[10px] text-cyan-300 font-medium">Sell</span>
                      <span className="text-xs sm:text-sm font-black text-cyan-300">{b.sell.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. MIDDLE COLUMN: MULTI-YEAR TREND CHART FROM cbsl_usd_exchange_rates (lg:col-span-5) ── */}
          <div className="lg:col-span-5 bg-[#051120]/80 rounded-xl p-2.5 flex flex-col justify-between h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1 shrink-0">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={12} className="text-cyan-400" />
                HISTORICAL TREND (2020 - TODAY)
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-bold">CBSL Stream</span>
            </div>

            <div className="w-full flex-1 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sellWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="buyWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{ background: '#07162b', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff' }}
                    labelFormatter={(label) => `Year: ${label}`}
                  />

                  <Area
                    type="monotone"
                    dataKey="sell_stream"
                    name="CBSL Average Sell Rate"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#sellWave)"
                  />
                  <Area
                    type="monotone"
                    dataKey="buy_stream"
                    name="CBSL Average Buy Rate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#buyWave)"
                  />

                  {maxTrendPoint && (
                    <ReferenceDot
                      x={maxTrendPoint.year}
                      y={maxTrendPoint.sell_stream}
                      r={3.5}
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── 3. RIGHT COLUMN: RATE RANKING - BEST 2 BANKS ONLY WITH HIGH FOCUS NUMBERS (lg:col-span-3) ── */}
          <div className="lg:col-span-3 bg-[#051120]/80 rounded-xl p-3 flex flex-col justify-between h-full overflow-hidden gap-2">
            
            {/* BEST BUY RATE (TOP 2 BANKS ONLY) */}
            <div className="flex flex-col flex-1 justify-center">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block border-b border-white/[0.08] pb-1 mb-2 shrink-0">
                BEST BUY RATE
              </span>
              <div className="space-y-1.5">
                {bestBuy.slice(0, 2).map((b) => (
                  <div key={b.id} className="flex items-center justify-between font-mono bg-white/[0.04] border border-white/[0.05] p-2 rounded-lg">
                    <span className="font-bold text-xs text-white truncate max-w-[55%]">{b.name}</span>
                    <span className="text-sm sm:text-base font-black text-cyan-300">{b.buy.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BEST SELL RATE (TOP 2 BANKS ONLY) */}
            <div className="flex flex-col flex-1 justify-center pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest block border-b border-white/[0.08] pb-1 mb-2 shrink-0">
                BEST SELL RATE
              </span>
              <div className="space-y-1.5">
                {bestSell.slice(0, 2).map((b) => (
                  <div key={b.id} className="flex items-center justify-between font-mono bg-white/[0.04] border border-white/[0.05] p-2 rounded-lg">
                    <span className="font-bold text-xs text-white truncate max-w-[55%]">{b.name}</span>
                    <span className="text-sm sm:text-base font-black text-blue-300">{b.sell.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar Inside Big Dev Box with View Full Dashboard Button */}
        <div className="flex items-center justify-end border-t border-white/[0.06] pt-2 mt-1 shrink-0">
          <Link
            to="/dashboards/usd-exchange-rates"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white text-[11px] font-bold shadow-cyan-glow transition-all active:scale-95"
          >
            View Full Dashboard <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  );
};
