import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, Layers, TrendingUp, Zap, Activity, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceDot, PieChart, Pie, Cell
} from 'recharts';
import { apiService, type UsdComparisonResponse } from '../services/apiService';

const BLUE_ENERGY_MIX = [
  { name: 'Hydro Power', value: 42.5, gwh: '24.3 GWh', color: '#00E5FF' },
  { name: 'Thermal Power', value: 34.8, gwh: '19.9 GWh', color: '#38bdf8' },
  { name: 'Solar & Wind', value: 22.7, gwh: '13.0 GWh', color: '#60a5fa' }
];

const FALLBACK_RESERVOIRS = [
  { reservoir: 'Randenigala', water_level_m: 234.5, storage_pct: 85.0, rainfall_mm: 18.2, color: '#00E5FF' },
  { reservoir: 'Samanalawewa', water_level_m: 452.1, storage_pct: 81.0, rainfall_mm: 0.0, color: '#38bdf8' },
  { reservoir: 'Kotmale', water_level_m: 698.4, storage_pct: 79.5, rainfall_mm: 8.4, color: '#60a5fa' },
  { reservoir: 'Victoria', water_level_m: 431.8, storage_pct: 72.0, rainfall_mm: 5.0, color: '#0284c7' },
  { reservoir: 'Castlereigh', water_level_m: 154.2, storage_pct: 64.0, rainfall_mm: 12.5, color: '#1d4ed8' }
];

export const USDExchangeRateComparison: React.FC = () => {
  const navigate = useNavigate();
  const [usdData, setUsdData] = useState<UsdComparisonResponse | null>(null);
  const [cebData, setCebData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  // 7-second Auto-Swipe Timer for 3 Slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const fetchAllData = async () => {
    setLoading(true);
    const [uRes, cRes] = await Promise.all([
      apiService.getUsdExchangeRates(),
      apiService.getCebPowerGridStats()
    ]);
    if (uRes) setUsdData(uRes);
    if (cRes) setCebData(cRes);
    setLoading(false);
  };

  const banks = usdData?.banks || [];
  const bestBuy = usdData?.best_buy_ranking || banks;
  const bestSell = usdData?.best_sell_ranking || banks;
  const trendData = usdData?.trend_analysis || [];

  const maxTrendPoint = trendData.length > 0
    ? trendData.reduce((prev, curr) => (curr.sell_stream > prev.sell_stream ? curr : prev), trendData[0])
    : null;

  const cebSummary = cebData?.summary || {
    total_daily_generation_gwh: 57.29,
    current_peak_demand_mw: 2925.8,
    avg_hydro_storage_pct: 78.4,
    grid_frequency_hz: 50.02,
    grid_status: 'Optimal Stable'
  };

  const majorReservoirs = (cebData?.major_reservoirs && cebData.major_reservoirs.length > 0)
    ? cebData.major_reservoirs
    : FALLBACK_RESERVOIRS;

  const slideTitles = [
    'Lanka Metro Transit Network',
    'USD Exchange Rates Intelligence',
    'CEB National Power Grid Intelligence'
  ];

  const slideRoutes = [
    '/metro-analysis',
    '/dashboards/usd-exchange-rates',
    '/dashboards/ceb-power-grid'
  ];

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    navigate(slideRoutes[activeSlide]);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-6">
      {/* ── Section Title Header & Navigation Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-gradient-to-b from-[#00E5FF] to-blue-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Daily Dashboard
            </h2>
          </div>
          <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5 ml-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {slideTitles[activeSlide]}
          </p>
        </div>

        {/* Sleek Arrow & Pagination Navigation Controls */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Dot Pagination Indicators */}
          <div className="flex items-center gap-1.5 bg-[#08172e] border border-slate-800 px-2.5 py-1.5 rounded-xl">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Go to Dashboard ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
            className="p-2 rounded-xl bg-[#08172e] border border-slate-800 hover:bg-[#0c2242] text-cyan-400 hover:text-white transition-all active:scale-95"
            title="Previous Dashboard"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % 3)}
            className="p-2 rounded-xl bg-[#08172e] border border-slate-800 hover:bg-[#0c2242] text-cyan-400 hover:text-white transition-all active:scale-95"
            title="Next Dashboard"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={fetchAllData}
            className={`p-2 rounded-xl bg-[#08172e] border border-slate-800 hover:bg-[#0c2242] text-slate-400 hover:text-white transition-all ${
              loading ? 'animate-spin text-[#00E5FF]' : ''
            }`}
            title="Refresh Telemetry Data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── ONE BIG UNIFIED CLICKABLE DEV BOX CAROUSEL ── */}
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-2xl bg-[#030914] p-3.5 h-[340px] min-h-[340px] max-h-[340px] overflow-hidden select-none shadow-2xl flex flex-col justify-between cursor-pointer border border-white/[0.04] group"
      >
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* ════════════════════════════════════════════════════════════════════
            SLIDE 0: LANKA METRO TRANSIT NETWORK (NOW 1ST DASHBOARD PREVIEW)
        ════════════════════════════════════════════════════════════════════ */}
        {activeSlide === 0 && (
          <div className="flex flex-col justify-between h-full animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 overflow-hidden">

              {/* ── 1. LEFT SIDE: CARD WITH UPLOADED MAROON HEADER BAR + BUS PHOTO (lg:col-span-4) ── */}
              <div className="lg:col-span-4 relative rounded-xl overflow-hidden border border-[#5a151e]/50 bg-[#030914] shadow-xl flex flex-col h-full">
                <img
                  src="/lanka-metro-header-card.jpg"
                  alt="Lanka Metro Transit Official Header"
                  className="w-full h-full object-cover object-center select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* ── 2. RIGHT SIDE: RICH PREVIEW DETAILS & HUB HIGHLIGHTS (lg:col-span-8) ── */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full py-0.5 pr-2">
                
                {/* Header Title & Subtitle */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-black text-white bg-gradient-to-r from-[#7a121d] to-[#b91c1c]">
                      OFFICIAL TRANSIT
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                      WESTERN PROVINCE NETWORK
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                    Lanka Metro Transit Network
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Integrated high-frequency urban bus transit system across Sri Lanka's capital region.
                  </p>
                </div>

                {/* Main Body: WHAT IS METRO? & WHY METRO? + 4 BENCHMARK STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  {/* What is Metro? */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>WHAT IS METRO?</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                      Sri Lanka's official rapid bus network operating high-frequency trips on dedicated color-coded corridors (<span className="text-cyan-300 font-bold">CM01–CM08</span>).
                    </p>
                  </div>

                  {/* Why Metro? */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>WHY METRO?</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                      Eliminates schedule delays, provides fixed fare structures, and connects major railway terminals with live digital tracking.
                    </p>
                  </div>

                  {/* 4 Stat Boxes Stack */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="bg-[#051120] border border-white/[0.06] rounded-lg p-1.5">
                      <span className="text-[8.5px] text-slate-400 uppercase block font-bold">ACTIVE ROUTES</span>
                      <span className="font-extrabold text-cyan-300 text-xs">7 Corridors</span>
                    </div>
                    <div className="bg-[#051120] border border-white/[0.06] rounded-lg p-1.5">
                      <span className="text-[8.5px] text-slate-400 uppercase block font-bold">METRO BUSES</span>
                      <span className="font-extrabold text-white text-xs">100+ Fleet</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="bg-[#051120] border border-white/[0.06] rounded-lg p-1.5">
                      <span className="text-[8.5px] text-slate-400 uppercase block font-bold">DESIGNATED HALTS</span>
                      <span className="font-extrabold text-sky-300 text-xs">60+ Stops</span>
                    </div>
                    <div className="bg-[#051120] border border-white/[0.06] rounded-lg p-1.5">
                      <span className="text-[8.5px] text-slate-400 uppercase block font-bold">DESTINATIONS</span>
                      <span className="font-extrabold text-white text-xs">11 Western Hubs</span>
                    </div>
                  </div>
                </div>

                {/* RICH PREVIEW DETAILS (Key Corridors & Multi-Modal Hubs) */}
                <div className="grid grid-cols-2 gap-2 bg-[#051424]/90 border border-cyan-500/20 rounded-xl p-2 my-1 text-[10px]">
                  <div className="space-y-1 border-r border-white/10 pr-2">
                    <span className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase tracking-wide block">
                      KEY CORRIDORS
                    </span>
                    <div className="space-y-0.5 text-slate-300 font-medium">
                      <div className="flex justify-between">
                        <span>• CM01: Makumbura ↔ Fort</span>
                        <span className="text-cyan-300 font-mono">23.3 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• CM03: Kadawatha ↔ Makumbura</span>
                        <span className="text-cyan-300 font-mono">34.8 km</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pl-1">
                    <span className="text-[8.5px] font-mono font-bold text-sky-300 uppercase tracking-wide block">
                      MULTI-MODAL HUBS
                    </span>
                    <div className="space-y-0.5 text-slate-300 font-medium">
                      <div>• Fort / Pettah Rail & Bus Terminal</div>
                      <div>• Kadawatha & Makumbura MMC Hubs</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Source on left + Unified Dashboard Button on right */}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-1.5 mt-0.5 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    Source: <span className="text-slate-300 font-bold">Data from Lanka Metro Web (lankametro.lk)</span>
                  </span>

                  <Link
                    to="/metro-analysis"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white text-[11px] font-bold shadow-cyan-glow transition-all active:scale-95 shrink-0"
                  >
                    View Full Dashboard <ArrowRight size={12} />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SLIDE 1: USD EXCHANGE RATE COMPARISON DASHBOARD
        ════════════════════════════════════════════════════════════════════ */}
        {activeSlide === 1 && (
          <div className="flex flex-col justify-between h-full animate-fadeIn">
            {/* 3 INNER COLUMNS */}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          SPREAD: <span className="text-cyan-300 font-bold">{b.spread_pct}</span>
                        </span>
                      </div>

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

              {/* ── 2. MIDDLE COLUMN: MULTI-YEAR TREND CHART (lg:col-span-5) ── */}
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
                    <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
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

                      <XAxis dataKey="year" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#07162b', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff' }}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Area type="monotone" dataKey="sell_stream" name="CBSL Average Sell Rate" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#sellWave)" />
                      <Area type="monotone" dataKey="buy_stream" name="CBSL Average Buy Rate" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#buyWave)" />

                      {maxTrendPoint && (
                        <ReferenceDot x={maxTrendPoint.year} y={maxTrendPoint.sell_stream} r={3.5} fill="#06b6d4" stroke="#ffffff" strokeWidth={1.5} />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── 3. RIGHT COLUMN: RATE RANKING (lg:col-span-3) ── */}
              <div className="lg:col-span-3 bg-[#051120]/80 rounded-xl p-3 flex flex-col justify-between h-full overflow-hidden gap-2">
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

                <div className="flex flex-col flex-1 justify-center pt-2 border-t border-white/[0.08]">
                  <span className="text-xs font-black text-sky-400 uppercase tracking-widest block border-b border-white/[0.08] pb-1 mb-2 shrink-0">
                    BEST SELL RATE
                  </span>
                  <div className="space-y-1.5">
                    {bestSell.slice(0, 2).map((b) => (
                      <div key={b.id} className="flex items-center justify-between font-mono bg-white/[0.04] border border-white/[0.05] p-2 rounded-lg">
                        <span className="font-bold text-xs text-white truncate max-w-[55%]">{b.name}</span>
                        <span className="text-sm sm:text-base font-black text-sky-300">{b.sell.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar for Slide 1 */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 mt-1 shrink-0">
              <span className="text-[10px] font-mono text-slate-400">
                Source: <span className="text-slate-300 font-bold">Central Bank of Sri Lanka (CBSL)</span>
              </span>

              <Link
                to="/dashboards/usd-exchange-rates"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white text-[11px] font-bold shadow-cyan-glow transition-all active:scale-95"
              >
                View Full Dashboard <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SLIDE 2: CEB NATIONAL POWER GRID INTELLIGENCE DASHBOARD
        ════════════════════════════════════════════════════════════════════ */}
        {activeSlide === 2 && (
          <div className="flex flex-col justify-between h-full animate-fadeIn">
            {/* 3 INNER COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch flex-1 overflow-hidden">

              {/* ── 1. LEFT COLUMN: TOP KPI CARDS & GRID STATS (lg:col-span-4) ── */}
              <div className="lg:col-span-4 bg-[#051120]/80 rounded-xl p-3 flex flex-col justify-between h-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 shrink-0">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={13} className="text-[#00E5FF]" />
                    CEB POWER GRID BENCHMARKS
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 flex-1 my-1">
                  <div className="bg-white/[0.035] border border-white/[0.05] rounded-xl p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Total Generation</span>
                    <span className="text-base font-black text-[#00E5FF] font-mono">{cebSummary.total_daily_generation_gwh} GWh</span>
                    <span className="text-[8px] text-slate-400 font-mono">public.daily_energy</span>
                  </div>

                  <div className="bg-[#051120] border border-white/[0.05] rounded-xl p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Peak Demand</span>
                    <span className="text-base font-black text-sky-300 font-mono">{cebSummary.current_peak_demand_mw} MW</span>
                    <span className="text-[8px] text-slate-400 font-mono">public.peak_demand</span>
                  </div>

                  <div className="bg-[#051120] border border-white/[0.05] rounded-xl p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Hydro Storage</span>
                    <span className="text-base font-black text-cyan-400 font-mono">{cebSummary.avg_hydro_storage_pct}%</span>
                    <span className="text-[8px] text-slate-400 font-mono">public.major_reservoirs</span>
                  </div>

                  <div className="bg-[#051120] border border-white/[0.05] rounded-xl p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Grid Frequency</span>
                    <span className="text-base font-black text-blue-300 font-mono">{cebSummary.grid_frequency_hz} Hz</span>
                    <span className="text-[8px] text-cyan-400 font-mono">✦ Optimal Stable</span>
                  </div>
                </div>
              </div>

              {/* ── 2. MIDDLE COLUMN: GENERATION MIX (lg:col-span-4) ── */}
              <div className="lg:col-span-4 bg-[#051120]/80 rounded-xl p-2.5 flex flex-col justify-between h-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-1 shrink-0">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={12} className="text-cyan-400" />
                    ENERGY GENERATION MIX (CEB)
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">CEB Stream</span>
                </div>

                <div className="flex items-center gap-3 flex-1 py-1">
                  <div className="w-1/2 h-[120px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={BLUE_ENERGY_MIX}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {BLUE_ENERGY_MIX.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.75} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#07162b', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-1/2 space-y-1.5 text-[10px]">
                    {BLUE_ENERGY_MIX.map((item, idx) => (
                      <div key={idx} className="flex flex-col bg-white/[0.03] p-1.5 rounded-md border border-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-white">
                            <span className="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: item.color }} />
                            {item.name}
                          </span>
                          <span className="font-mono font-black text-cyan-300/90">{item.value}%</span>
                        </div>
                        <span className="text-[8.5px] font-mono text-slate-400 ml-3.5">{item.gwh}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 3. RIGHT COLUMN: MAJOR RESERVOIRS WATER LEVEL & STORAGE (lg:col-span-4) ── */}
              <div className="lg:col-span-4 bg-[#051120]/80 rounded-xl p-3 flex flex-col justify-between h-full overflow-hidden gap-1.5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-1 shrink-0">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets size={13} className="text-[#00E5FF]" />
                    MAJOR RESERVOIRS WATER LEVEL & STORAGE
                  </span>
                  <span className="text-[8.5px] font-mono text-slate-400">public.major_reservoirs</span>
                </div>

                <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar my-0.5">
                  {majorReservoirs.slice(0, 4).map((r: any, i: number) => {
                    const storage = r.storage_pct || r.storage || 75;
                    const waterM = r.water_level_m || r.waterlevel || 150;
                    const rain = r.rainfall_mm || r.rainfall || 0;
                    const name = r.reservoir || r.name || 'Reservoir';
                    const barColor = i === 0 ? '#00E5FF' : i === 1 ? '#38bdf8' : i === 2 ? '#60a5fa' : '#0284c7';

                    return (
                      <div key={i} className="space-y-0.5 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.04]">
                        <div className="flex items-center justify-between text-[9.5px] font-bold">
                          <span className="text-white flex items-center gap-1 truncate max-w-[110px]">
                            {name}
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[9px]">
                            <span className="text-slate-300 font-bold">{waterM}m</span>
                            <span className="text-cyan-300 font-black">{storage}%</span>
                            <span className="text-slate-400 text-[8px]">{rain}mm</span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 opacity-75"
                            style={{ width: `${Math.min(100, storage)}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Bar for Slide 2 */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 mt-1 shrink-0">
              <span className="text-[10px] font-mono text-slate-400">
                Source: <span className="text-slate-300 font-bold">Ceylon Electricity Board (CEB) Telemetry</span>
              </span>

              <Link
                to="/dashboards/ceb-power-grid"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-600 hover:to-cyan-400 text-white text-[11px] font-bold shadow-cyan-glow transition-all active:scale-95"
              >
                View Full Dashboard <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
