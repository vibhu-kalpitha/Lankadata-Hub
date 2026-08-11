import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap, ArrowRight, TrendingUp, TrendingDown, Globe,
  CloudRain, MapPin, Building2, RefreshCw, Search
} from 'lucide-react';

import { SriLankaMap } from '../components/SriLankaMap';
import { USDExchangeRateComparison } from '../components/USDExchangeRateComparison';
import { fetchProvinces } from '../services/provinceService';
import type { Province } from '../services/provinceService';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '../services/datasetService';
import { apiService } from '../services/apiService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysLiveData, setTodaysLiveData] = useState<any>(null);
  const [latestDatasets, setLatestDatasets] = useState<Dataset[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [provincesError, setProvincesError] = useState<string | null>(null);

  useEffect(() => {
    datasetService.getLatestDatasets(3).then(d => setLatestDatasets(d));

    apiService.getTodaysSriLankaStats().then(data => {
      if (data) setTodaysLiveData(data);
    });

    // Fetch provinces from FastAPI → PostgreSQL
    fetchProvinces()
      .then(data => {
        setProvinces(data);
        const defaultWestern = data.find(p => p.province === 'Western') ?? data[0] ?? null;
        setSelectedProvince(defaultWestern);
        setProvincesLoading(false);
      })
      .catch(err => {
        console.error('Failed to load provinces:', err);
        setProvincesError('Could not load province data. Please try again.');
        setProvincesLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/datasets?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="flex-1 bg-lanka-bg grid-bg overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO HEADER SECTION (Clean Suitable Dark Design)
      ══════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-8 pb-8 md:pt-12 md:pb-10 overflow-hidden">
        {/* Subtle, Clean Design Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Deep dark gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020712] via-[#051328] to-[#040d1a]" />
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />

          {/* Minimalist Grid Pattern */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Seamless gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#040d1a] via-[#040d1a]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Content container */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE: Left-aligned hero title & command search */}
            <div className="lg:col-span-6 text-left space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">
                LankaData <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">Hub</span>
              </h1>

              <p className="text-sm sm:text-base text-lanka-muted max-w-lg leading-relaxed">
                Sri Lanka's central platform for real-time national intelligence & open data core.
              </p>

              {/* Search bar under LankaData Hub Title */}
              <div className="w-full max-w-lg pt-2">
                <form onSubmit={handleSearchSubmit} className="relative group">
                  <div className="relative flex items-center bg-[#07182b]/95 hover:bg-[#07182b] border border-[#38bdf8]/40 hover:border-[#38bdf8]/80 rounded-full p-1.5 pl-5 pr-2 shadow-[0_0_30px_rgba(3,15,30,0.8)] backdrop-blur-md transition-all">
                    <Search size={18} className="text-[#38bdf8] flex-shrink-0 mr-3" />
                    <input
                      type="text"
                      placeholder="Search datasets, indicators..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#13304d] hover:bg-[#1a4066] border border-[#38bdf8]/40 text-[#38bdf8] hover:text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-full transition-all uppercase shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      SEARCH
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT SIDE: Edge-to-Edge 3D Sri Lanka Hologram Map Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#38bdf8]/35 shadow-[0_0_50px_rgba(56,189,248,0.25)] bg-[#040e1a] group w-full h-[260px] sm:h-[320px] lg:h-[340px]">
                <img
                  src="/srilanka-subtle-cyan.png"
                  alt="Sri Lanka National Intelligence Hologram Core"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040c18] via-transparent to-transparent opacity-70 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          USD EXCHANGE RATE COMPARISON DASHBOARD STREAM
      ══════════════════════════════════════════════════ */}
      <USDExchangeRateComparison />

      {/* ══════════════════════════════════════════════════
          TODAY'S SRI LANKA - MISSION CONTROL 3-DEV-BOX CARD SECTION
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-5 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-black text-white tracking-tight">Today's Sri Lanka</h2>
            </div>
            <p className="text-[12px] text-lanka-muted ml-3 font-medium">Mission control — live national benchmarks updated continuously.</p>
          </div>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/25 px-3 py-1 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
            ✦ LIVE DATA FEED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── DEV BOX 1: ENVIRONMENT & WEATHER ── */}
          <div className="relative rounded-3xl overflow-hidden border border-sky-500/35 bg-[#040e1e]/90 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(56,189,248,0.15)] min-h-[460px] group transition-all duration-300 hover:border-sky-400/60">
            {/* Background Backdrop Image with Rich Visible Opacity */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundImage: `url('/weather-bg-card.png')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040e1e]/60 via-[#040e1e]/80 to-[#040e1e] pointer-events-none" />

            <div className="relative z-10">
              {/* Header Tag */}
              <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs uppercase tracking-widest mb-6">
                <CloudRain size={16} className="text-sky-400" />
                <span>ENVIRONMENT & WEATHER</span>
              </div>

              {/* Current Environment Display */}
              <div className="space-y-1 mb-6">
                <span className="text-[9px] font-mono font-bold text-sky-300/70 tracking-widest uppercase block">CURRENT ENVIRONMENT</span>
                <div className="flex items-baseline">
                  <span className="text-5xl font-black text-white tracking-tight">{todaysLiveData?.weather?.temp || '29.40'}</span>
                  <span className="text-2xl font-bold text-sky-400 ml-1.5">{todaysLiveData?.weather?.unit || '°C'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 pt-1.5 font-medium">
                  <MapPin size={12} className="text-sky-400" />
                  <span>{todaysLiveData?.weather?.location || 'Colombo • Partly Cloudy'}</span>
                </div>
              </div>
            </div>

            {/* Inner Glass Card for Climate Indicators (Colombo) */}
            <div className="relative z-10 bg-[#07162c]/85 backdrop-blur-md border border-sky-500/25 rounded-2xl p-4 space-y-2.5 shadow-inner">
              <span className="text-[9px] font-mono font-bold text-sky-400/90 tracking-widest uppercase block mb-1">
                CLIMATE INDICATORS (COLOMBO)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Max Temp */}
                <div className="bg-[#040e1a]/80 border border-sky-500/15 rounded-xl p-2">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">MAX TEMP</span>
                  <span className="text-sm font-black text-white">{todaysLiveData?.weather?.temp_max || '31.8'} °C</span>
                </div>

                {/* Min Temp */}
                <div className="bg-[#040e1a]/80 border border-sky-500/15 rounded-xl p-2">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">MIN TEMP</span>
                  <span className="text-sm font-black text-white">{todaysLiveData?.weather?.temp_min || '24.2'} °C</span>
                </div>

                {/* Precipitation */}
                <div className="bg-[#040e1a]/80 border border-sky-500/15 rounded-xl p-2">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">PRECIPITATION</span>
                  <span className="text-sm font-black text-cyan-300">{todaysLiveData?.weather?.precipitation || '12.5'} mm</span>
                </div>

                {/* Max Wind Speed */}
                <div className="bg-[#040e1a]/80 border border-sky-500/15 rounded-xl p-2">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">MAX WIND SPEED</span>
                  <span className="text-sm font-black text-white">{todaysLiveData?.weather?.wind_max || '18.3'} km/h</span>
                </div>
              </div>
            </div>
          </div>


          {/* ── DEV BOX 2: ECONOMY & MARKETS ── */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/35 bg-[#040e1e]/90 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(74,222,128,0.15)] min-h-[460px] group transition-all duration-300 hover:border-emerald-400/60">
            {/* Background Backdrop Image with Rich Visible Opacity */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundImage: `url('/colombo-skyline-bg.png')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040e1e]/60 via-[#040e1e]/80 to-[#040e1e] pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Header Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
                  <Building2 size={16} className="text-emerald-400" />
                  <span>ECONOMY & MARKETS</span>
                </div>
                <RefreshCw size={12} className="text-emerald-400/60 animate-spin" />
              </div>

              {/* Forex Section (cbsl_usd_exchange_rates) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-300/70 tracking-widest uppercase">FOREX (USD/LKR)</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    {todaysLiveData?.economy?.forex?.trend === 'down' ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                    {todaysLiveData?.economy?.forex?.change || '+0.02%'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#051424]/80 border border-emerald-500/20 rounded-xl p-2.5 my-1.5">
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">BUYING RATE</span>
                    <span className="text-base font-black text-white">{todaysLiveData?.economy?.forex?.buy || '301.50'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">SELLING RATE</span>
                    <span className="text-base font-black text-white">{todaysLiveData?.economy?.forex?.sell || '306.80'}</span>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  CBSL • CENTRAL BANK OFFICIAL RATE
                </span>
              </div>

              {/* Stock Market Section (colombo_stock_market_live) */}
              <div className="pt-3 border-t border-emerald-500/15">
                <span className="text-[9px] font-mono font-bold text-emerald-300/70 tracking-widest uppercase block mb-1.5">STOCK MARKET</span>

                <div className="grid grid-cols-2 gap-3 mb-2.5">
                  {/* ASPI */}
                  <div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                      CSE: ASPI
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-white">{todaysLiveData?.economy?.stock?.value || '21,370.1'}</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        {todaysLiveData?.economy?.stock?.trend === 'down' ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
                        {todaysLiveData?.economy?.stock?.change || '+1.5%'}
                      </span>
                    </div>
                  </div>

                  {/* S&P SL20 */}
                  <div className="border-l border-emerald-500/15 pl-3">
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                      S&P SL20
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-white">{todaysLiveData?.economy?.stock?.sp_sl20_value || '3,120.5'}</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        {todaysLiveData?.economy?.stock?.sp_sl20_trend === 'down' ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
                        {todaysLiveData?.economy?.stock?.sp_sl20_change || '+0.8%'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Micro Telemetry Stats for Stock Market */}
                <div className="grid grid-cols-3 gap-1 bg-[#051424]/80 border border-emerald-500/20 rounded-xl p-2 text-[9px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">TURNOVER</span>
                    <span className="text-white font-bold">{todaysLiveData?.economy?.stock?.turnover_lkr || '2.4B LKR'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">VOLUME</span>
                    <span className="text-white font-bold">{todaysLiveData?.economy?.stock?.volume_traded || '45.2M'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">TRADES</span>
                    <span className="text-white font-bold">{todaysLiveData?.economy?.stock?.trades_count || '14,210'}</span>
                  </div>
                </div>
              </div>

              {/* Fuel Section (fuel_prices table) */}
              <div className="pt-3 border-t border-emerald-500/15">
                <span className="text-[9px] font-mono font-bold text-emerald-300/70 tracking-widest uppercase block mb-1.5">FUEL (LKR/L)</span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>95 Octane</span>
                    <span className="font-bold text-white">{todaysLiveData?.economy?.fuel?.petrol_95 || '365.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>92 Octane</span>
                    <span className="font-bold text-white">{todaysLiveData?.economy?.fuel?.petrol_92 || '311.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Auto Diesel</span>
                    <span className="font-bold text-white">{todaysLiveData?.economy?.fuel?.auto_diesel || '283.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ── DEV BOX 3: INFRASTRUCTURE ── */}
          <div className="relative rounded-3xl overflow-hidden border border-rose-500/35 bg-[#040e1e]/90 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(244,63,94,0.15)] min-h-[460px] group transition-all duration-300 hover:border-rose-400/60">
            {/* Background Backdrop Image with Rich Visible Opacity */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundImage: `url('/infrastructure-bg.png')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040e1e]/60 via-[#040e1e]/80 to-[#040e1e] pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Header Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-widest">
                  <Globe size={16} className="text-rose-400" />
                  <span>INFRASTRUCTURE</span>
                </div>
                <Zap size={14} className="text-rose-400 animate-pulse" />
              </div>

              {/* Power Status */}
              <div>
                <span className="text-[9px] font-mono font-bold text-rose-300/70 tracking-widest uppercase block mb-1">POWER STATUS</span>
                <div className="text-4xl font-black text-white mb-2">{todaysLiveData?.infrastructure?.power?.value || '100%'}</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-full" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  {todaysLiveData?.infrastructure?.power?.status || 'Grid stability: High'}
                </span>
              </div>

              {/* Public Health */}
              <div className="pt-4 border-t border-rose-500/15">
                <span className="text-[9px] font-mono font-bold text-rose-300/70 tracking-widest uppercase block mb-1">PUBLIC HEALTH</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-black text-white">{todaysLiveData?.infrastructure?.health?.value || '1,245'}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    <TrendingDown size={10} />
                    {todaysLiveData?.infrastructure?.health?.change || '-0.2%'}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                  {todaysLiveData?.infrastructure?.health?.label || 'Weekly Hospitalizations'}
                </span>
              </div>

              {/* Tourism */}
              <div className="pt-4 border-t border-rose-500/15">
                <span className="text-[9px] font-mono font-bold text-rose-300/70 tracking-widest uppercase block mb-1">TOURISM</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-black text-white">{todaysLiveData?.infrastructure?.tourism?.value || '4,820'}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <TrendingUp size={10} />
                    {todaysLiveData?.infrastructure?.tourism?.change || '+2.4%'}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                  {todaysLiveData?.infrastructure?.tourism?.label || 'Daily Arrivals'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DISCOVER SRI LANKA
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Section header — Centered */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Discover Sri Lanka</h2>
          <p className="text-xs sm:text-sm text-lanka-muted leading-relaxed">
            The macroeconomic and demographic portrait of the Pearl of the Indian Ocean.
          </p>
        </div>

        {/* ── Full Width Provincial Intelligence Map ── */}
        <div className="w-full">
          {provincesLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-lanka-muted py-24 bg-[#050d1a]/90 border border-lanka-border rounded-2xl">
              <div className="w-8 h-8 border-2 border-lanka-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-wider font-semibold">Loading provincial map data…</span>
            </div>
          ) : provincesError ? (
            <div className="p-8 text-center bg-[#050d1a]/90 border border-lanka-border rounded-2xl">
              <p className="text-sm text-red-400">{provincesError}</p>
            </div>
          ) : (
            <SriLankaMap
              provinces={provinces}
              selectedProvince={selectedProvince}
              onHoverProvince={setSelectedProvince}
              onSelectProvince={setSelectedProvince}
            />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST DATASETS
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-violet-400 rounded-full" />
              <h2 className="text-2xl font-black text-white">Latest Published Datasets</h2>
            </div>
          </div>
          <Link to="/datasets" className="text-xs text-lanka-cyan hover:text-white flex items-center gap-1 border border-lanka-border hover:border-lanka-border-hover px-3 py-1.5 rounded-xl transition-all">
            Explore All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestDatasets.map(d => (
            <div
              key={d.id}
              className="group relative bg-gradient-to-br from-[#071428] to-[#050d1a] border border-lanka-border hover:border-lanka-border-hover rounded-2xl p-5 flex flex-col justify-between h-52 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/10 transition-colors" />
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-black bg-white/5 border border-lanka-border text-slate-300 px-2.5 py-1 rounded-full uppercase tracking-wider">{d.category}</span>
                  {d.live && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />LIVE
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-black text-white leading-tight mb-2">{d.title}</h4>
                <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-lanka-border">
                <div className="flex gap-1.5">
                  {d.formats.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[8px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded uppercase">{f}</span>
                  ))}
                </div>
                <Link to={`/datasets/${d.id}`} className="text-[11px] font-bold text-lanka-blue-light hover:text-white flex items-center gap-1 transition-colors">
                  View <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
