import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity, Zap, ArrowRight, TrendingUp, Globe,
  BarChart2, CloudRain, Terminal
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip
} from 'recharts';

import { SriLankaMap } from '../components/SriLankaMap';
import { SriLankaPhysicalMap } from '../components/SriLankaPhysicalMap';
import { USDExchangeRateComparison } from '../components/USDExchangeRateComparison';
import { srilankaService } from '../services/srilankaService';
import { fetchProvinces } from '../services/provinceService';
import type { Province } from '../services/provinceService';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '../services/datasetService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysStats, setTodaysStats] = useState<any>(null);
  const [latestDatasets, setLatestDatasets] = useState<Dataset[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [provincesError, setProvincesError] = useState<string | null>(null);

  useEffect(() => {
    setTodaysStats(srilankaService.getTodaysStats());
    datasetService.getLatestDatasets(3).then(d => setLatestDatasets(d));

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

  const gdpAreaData = [
    { y: '2019', v: 2.3 }, { y: '2020', v: -3.6 }, { y: '2021', v: 3.5 },
    { y: '2022', v: -7.8 }, { y: '2023', v: 2.9 }, { y: '2024', v: 4.2 },
  ];

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

              {/* Terminal command search bar */}
              <div className="w-full max-w-lg pt-2">
                <form onSubmit={handleSearchSubmit} className="relative group">
                  <div className="relative flex items-center bg-[#07182b]/95 hover:bg-[#07182b] border border-[#38bdf8]/40 hover:border-[#38bdf8]/80 rounded-2xl p-2 pl-4 shadow-[0_0_30px_rgba(3,15,30,0.8)] backdrop-blur-md transition-all">
                    <span className="text-cyan-400 text-xs mr-2 select-none">✦</span>
                    <Terminal size={17} className="text-[#38bdf8] flex-shrink-0 mr-3" />
                    <input
                      type="text"
                      placeholder="EXECUTE COMMAND_"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-mono text-white placeholder-slate-500 tracking-wider focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-[#13304d] hover:bg-[#1a4066] border border-[#38bdf8]/40 text-[#38bdf8] hover:text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all uppercase shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      SEARCH
                    </button>
                  </div>
                </form>

                {/* Telemetry micro stats */}
                <div className="flex items-center gap-6 mt-3 px-1 text-[10px] font-mono font-bold text-slate-400/80 tracking-widest uppercase select-none">
                  <span>NODES: <span className="text-cyan-400">1,422</span></span>
                  <span>LATENCY: <span className="text-teal-400">14MS</span></span>
                  <span>STATUS: <span className="text-emerald-400">ONLINE</span></span>
                </div>
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
          TODAY'S SRI LANKA STATS
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-black text-white">Today's Sri Lanka</h2>
            </div>
            <p className="text-[12px] text-lanka-muted ml-3">Mission control — live national benchmarks updated continuously.</p>
          </div>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/25 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            ✦ Grand Stable
          </span>
        </div>

        {todaysStats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Temp */}
            <div className="group relative bg-gradient-to-br from-sky-900/30 to-[#050f20] border border-sky-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-sky-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-sky-500/30 group-hover:text-sky-500/60 transition-colors"><CloudRain size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-sky-400/80 uppercase tracking-widest">{todaysStats.environment.label}</span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-white">{todaysStats.environment.value}</span>
                  <span className="text-xl font-bold text-sky-400 ml-1">{todaysStats.environment.unit}</span>
                </div>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.environment.desc}</span>
            </div>

            {/* Fuel */}
            <div className="group relative bg-gradient-to-br from-amber-900/25 to-[#050f20] border border-amber-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-amber-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-amber-500/30 group-hover:text-amber-500/60 transition-colors"><Zap size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest">{todaysStats.fuelMarket.label}</span>
                <div className="mt-2 space-y-1">
                  {todaysStats.fuelMarket.prices.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span className="text-lanka-muted">{p.name}</span>
                      <span className="text-white font-bold">{p.price} LKR</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[9px] text-lanka-darkText">{todaysStats.fuelMarket.source}</span>
            </div>

            {/* Forex */}
            <div className="group relative bg-gradient-to-br from-green-900/25 to-[#050f20] border border-green-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-green-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-green-500/30 group-hover:text-green-500/60 transition-colors"><TrendingUp size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-green-400/80 uppercase tracking-widest">{todaysStats.forexRate.label}</span>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">{todaysStats.forexRate.value}</span>
                  <span className="text-xs text-green-400 ml-2 font-bold">{todaysStats.forexRate.change}</span>
                </div>
              </div>
              <span className="text-[9px] text-lanka-darkText uppercase">{todaysStats.forexRate.desc}</span>
            </div>

            {/* Health */}
            <div className="group relative bg-gradient-to-br from-red-900/25 to-[#050f20] border border-red-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-red-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-red-500/30 group-hover:text-red-500/60 transition-colors"><Activity size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-red-400/80 uppercase tracking-widest">{todaysStats.publicHealth.label}</span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-red-400">{todaysStats.publicHealth.value}</span>
                </div>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.publicHealth.desc}</span>
            </div>

            {/* Stock */}
            <div className="group relative bg-gradient-to-br from-violet-900/25 to-[#050f20] border border-violet-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-violet-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-violet-500/30 group-hover:text-violet-500/60 transition-colors"><BarChart2 size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-violet-400/80 uppercase tracking-widest">{todaysStats.stockMarket.label}</span>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white">{todaysStats.stockMarket.value}</span>
                  <span className="text-xs text-green-400 ml-2 font-bold">{todaysStats.stockMarket.change}</span>
                </div>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.stockMarket.desc}</span>
            </div>

            {/* Power */}
            <div className="group relative bg-gradient-to-br from-cyan-900/25 to-[#050f20] border border-cyan-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-cyan-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-cyan-500/30 group-hover:text-cyan-500/60 transition-colors"><Zap size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest">{todaysStats.powerStatus.label}</span>
                <div className="mt-3 flex items-center gap-2">
                  <Zap size={16} className="text-cyan-400 animate-pulse" />
                  <span className="text-3xl font-black text-white">{todaysStats.powerStatus.value}</span>
                </div>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.powerStatus.desc}</span>
            </div>

            {/* Tea */}
            <div className="group relative bg-gradient-to-br from-emerald-900/25 to-[#050f20] border border-emerald-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-emerald-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div>
                <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest">{todaysStats.teaAuction.label}</span>
                <div className="mt-3">
                  <span className="text-xl font-black text-white">{todaysStats.teaAuction.value} LKR</span>
                </div>
              </div>
              <span className="text-[9px] text-lanka-darkText uppercase">{todaysStats.teaAuction.source}</span>
            </div>

            {/* Tourism */}
            <div className="group relative bg-gradient-to-br from-pink-900/25 to-[#050f20] border border-pink-700/30 rounded-2xl p-5 flex flex-col justify-between h-40 hover:border-pink-500/50 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="absolute top-3 right-3 text-pink-500/30 group-hover:text-pink-500/60 transition-colors"><Globe size={28} /></div>
              <div>
                <span className="text-[9px] font-bold text-pink-400/80 uppercase tracking-widest">{todaysStats.tourism.label}</span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-white">{todaysStats.tourism.value}</span>
                </div>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.tourism.desc}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-lanka-muted">Loading live stats…</div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════
          GDP AREA CHART BANNER
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden border border-lanka-border bg-gradient-to-r from-[#050f20] to-[#060d1b] p-6">
          <div className="absolute right-0 top-0 w-80 h-full bg-blue-600/10 blur-[80px] pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <span className="text-[10px] font-bold text-lanka-blue-light uppercase tracking-widest block mb-1">Economic Indicator</span>
              <h3 className="text-xl font-black text-white">Sri Lanka GDP Growth</h3>
              <p className="text-xs text-lanka-muted mt-1 leading-relaxed">Annual GDP growth rate (%) from 2019 to projected 2024.</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black text-teal-400">4.2%</span>
                <span className="text-sm text-teal-400 mb-1 font-bold">▲ projected 2024</span>
              </div>
            </div>
            <div className="md:col-span-2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gdpAreaData}>
                  <defs>
                    <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="y" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#071428', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: 11 }}
                    formatter={(v: any) => [`${v}%`, 'GDP Growth']}
                  />
                  <Area type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gdpGrad)" dot={{ fill: '#0ea5e9', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
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

        {/* ── 50% / 50% Dual Map Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left 50%: Provincial Intelligence Map & Data */}
          <div className="flex flex-col h-full">
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

          {/* Right 50%: Physical Geography Map (Rivers, Forests, Mountains, Total Area) */}
          <div className="flex flex-col h-full">
            <SriLankaPhysicalMap />
          </div>
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
