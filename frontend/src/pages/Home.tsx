import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Activity,
  Zap, Database, ArrowRight, TrendingUp, Globe,
  BarChart2, CloudRain, Cpu, Terminal
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis,
  ResponsiveContainer, AreaChart, Area, Tooltip
} from 'recharts';

import { SriLankaMap } from '../components/SriLankaMap';
import { srilankaService } from '../services/srilankaService';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '../services/datasetService';
import { dashboardService } from '../services/dashboardService';
import type { DashboardDetail } from '../services/dashboardService';

/* ─── Animated counter hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysStats, setTodaysStats] = useState<any>(null);
  const [discoverStats, setDiscoverStats] = useState<any[]>([]);
  const [latestDatasets, setLatestDatasets] = useState<Dataset[]>([]);
  const [trendingDashboards, setTrendingDashboards] = useState<DashboardDetail[]>([]);
  const [currentDashboardIdx, setCurrentDashboardIdx] = useState(0);

  const datasetsCount  = useCountUp(2480);
  const dashboardCount = useCountUp(184);
  const apiCount       = useCountUp(56);
  const updateCount    = useCountUp(99);

  useEffect(() => {
    setTodaysStats(srilankaService.getTodaysStats());
    setDiscoverStats(srilankaService.getDiscoverStats());
    datasetService.getLatestDatasets(3).then(d => setLatestDatasets(d));
    dashboardService.getDashboards().then(d => setTrendingDashboards(d));
  }, []);

  /* auto-rotate dashboard carousel */
  useEffect(() => {
    if (!trendingDashboards.length) return;
    const t = setInterval(() => {
      setCurrentDashboardIdx(p => (p + 1) % trendingDashboards.length);
    }, 7000);
    return () => clearInterval(t);
  }, [trendingDashboards]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/datasets?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const prev = () =>
    setCurrentDashboardIdx(p => (p === 0 ? trendingDashboards.length - 1 : p - 1));
  const next = () =>
    setCurrentDashboardIdx(p => (p === trendingDashboards.length - 1 ? 0 : p + 1));

  /* Chart data */
  const denguePieData = [
    { name: 'Western',  value: 55, color: '#2563eb' },
    { name: 'Central',  value: 25, color: '#38bdf8' },
    { name: 'Southern', value: 20, color: '#f43f5e' },
  ];
  const dengueBarData = [
    { month: 'SEP', cases: 12000 },
    { month: 'OCT', cases: 19000 },
    { month: 'NOV', cases: 24000 },
    { month: 'DEC', cases: 32000 },
    { month: 'JAN', cases: 40000 },
    { month: 'FEB', cases: 42891 },
  ];
  const gdpAreaData = [
    { y: '2019', v: 2.3 }, { y: '2020', v: -3.6 }, { y: '2021', v: 3.5 },
    { y: '2022', v: -7.8 }, { y: '2023', v: 2.9 }, { y: '2024', v: 4.2 },
  ];

  const activeDb = trendingDashboards[currentDashboardIdx];

  const platformStats = [
    { icon: Database,   label: 'Datasets',        value: datasetsCount,  suffix: '+', color: 'text-lanka-blue-light' },
    { icon: BarChart2,  label: 'Dashboards',       value: dashboardCount, suffix: '+', color: 'text-lanka-cyan'       },
    { icon: Cpu,        label: 'REST APIs',         value: apiCount,       suffix: '+', color: 'text-purple-400'       },
    { icon: Activity,   label: '% Uptime',          value: updateCount,    suffix: '%', color: 'text-lanka-teal'       },
  ];

  return (
    <div className="flex-1 bg-lanka-bg grid-bg overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO HEADER SECTION (Clean Suitable Dark Design)
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[440px] md:min-h-[480px] flex flex-col items-center justify-center px-6 pt-10 pb-16 overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
            {/* LEFT SIDE: Left-aligned hero title & command search */}
            <div className="lg:col-span-6 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[11px] font-black text-cyan-400 tracking-[0.2em] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                NATIONAL INTELLIGENCE CORE
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">
                LankaData<br />
                <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">Hub</span>
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
              <div className="relative rounded-3xl overflow-hidden border border-[#38bdf8]/35 shadow-[0_0_50px_rgba(56,189,248,0.25)] bg-[#040e1a] group w-full h-[320px] sm:h-[380px]">
                <img
                  src="/srilanka-subtle-cyan.png"
                  alt="Sri Lanka National Intelligence Hologram Core"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040c18] via-transparent to-transparent opacity-70 pointer-events-none" />
                <div className="absolute top-4 right-4 bg-[#07192e]/85 border border-[#38bdf8]/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 select-none z-10">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-black text-cyan-300 tracking-wider uppercase">SRI LANKA CORE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform stats counter row (Centered across bottom) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl mx-auto">
            {platformStats.map((s, i) => (
              <div key={i} className="text-center group bg-[#071a2e]/60 border border-lanka-border hover:border-[#38bdf8]/30 rounded-2xl p-3 backdrop-blur-sm transition-all">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-lanka-border group-hover:border-[#38bdf8]/30 mb-1.5 transition-colors">
                  <s.icon size={16} className={s.color} />
                </div>
                <div className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value.toLocaleString()}{s.suffix}</div>
                <div className="text-[10px] text-lanka-darkText uppercase tracking-wider mt-0.5 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRENDING DASHBOARDS  (Compacted & Streamlined)
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        {/* Section header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 bg-gradient-to-b from-lanka-blue to-cyan-400 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Trending Dashboards</h2>
            </div>
            <p className="text-[11px] text-lanka-muted ml-3">
              Featured intelligence panels — updated every minute from verified national sources.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-1.5 rounded-xl border border-lanka-border bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button onClick={next} className="p-1.5 rounded-xl border border-lanka-border bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {activeDb ? (
          <div className="relative rounded-3xl overflow-hidden border border-lanka-border">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050f20] via-[#071428] to-[#050e1c]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative p-5 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

              {/* ── LEFT: Info panel ──────────────────────────────── */}
              <div className="xl:col-span-3 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[9px] font-black text-red-400 tracking-widest uppercase">Live Data Stream</span>
                  </div>

                  {/* Dashboard pagination dots */}
                  <div className="flex gap-1.5 mb-3">
                    {trendingDashboards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentDashboardIdx(i)}
                        className={`rounded-full transition-all ${i === currentDashboardIdx ? 'w-5 h-1.5 bg-lanka-cyan' : 'w-1.5 h-1.5 bg-white/20'}`}
                      />
                    ))}
                  </div>

                  <h3 className="text-lg font-black text-white leading-tight mb-1">{activeDb.title}</h3>
                  <p className="text-[11px] text-lanka-muted leading-relaxed line-clamp-2">{activeDb.description}</p>
                </div>

                {/* Metrics mini grid */}
                <div className="grid grid-cols-1 gap-2">
                  {activeDb.metrics?.slice(0, 3).map((m: any, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-lanka-border rounded-xl p-2.5 flex items-center justify-between hover:bg-white/8 transition-colors">
                      <span className="text-[10px] font-semibold text-lanka-muted">{m.title}</span>
                      <span className={`text-xs font-black ${
                        m.type === 'CASES' || m.type === 'ZONES' ? 'text-red-400' : 'text-lanka-teal'
                      }`}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/dashboards/${activeDb.id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[11px] font-bold px-5 py-2.5 rounded-xl shadow-blue-glow transition-all active:scale-95"
                >
                  View Full Dashboard <ArrowRight size={12} />
                </Link>
              </div>

              {/* ── CENTRE: Sri Lanka Map ─────────────────────────── */}
              <div className="xl:col-span-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={12} className="text-lanka-cyan" />
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider">Province Heatmap</span>
                </div>
                <div className="flex-1 bg-white/[0.03] border border-lanka-border rounded-2xl overflow-hidden min-h-[220px]">
                  <SriLankaMap compact />
                </div>
              </div>

              {/* ── RIGHT: Charts ─────────────────────────────────── */}
              <div className="xl:col-span-5 grid grid-rows-2 gap-3">

                {/* Pie chart card */}
                <div className="bg-white/[0.03] border border-lanka-border rounded-2xl p-3 flex gap-3 items-center">
                  <div className="w-28 h-28 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={denguePieData} cx="50%" cy="50%" innerRadius={34} outerRadius={48} paddingAngle={3} dataKey="value">
                          {denguePieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-white">55%</span>
                      <span className="text-[8px] text-lanka-muted">West</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-bold text-lanka-darkText uppercase tracking-wider mb-2">Case Distribution</p>
                    {denguePieData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-[10px] text-lanka-muted">{d.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar chart card */}
                <div className="bg-white/[0.03] border border-lanka-border rounded-2xl p-3 flex flex-col">
                  <p className="text-[9px] font-bold text-lanka-darkText uppercase tracking-wider mb-2">Weekly Case Trends</p>
                  <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dengueBarData} barSize={14}>
                        <XAxis dataKey="month" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#071428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }}
                          labelStyle={{ color: '#94a3b8' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="cases" radius={[3, 3, 0, 0]}>
                          {dengueBarData.map((_e, i) => (
                            <Cell key={i} fill={i === dengueBarData.length - 1 ? '#f43f5e' : '#2563eb'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-lanka-muted text-xs glass-panel rounded-3xl">
            Loading trending dashboards...
          </div>
        )}
      </section>

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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Discover Sri Lanka</h2>
          <p className="text-xs text-lanka-muted max-w-xl mx-auto leading-relaxed">
            The macroeconomic and demographic portrait of the Pearl of the Indian Ocean.
          </p>
        </div>
        <div className="mb-6">
          <SriLankaMap />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {discoverStats.map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-lanka-border hover:border-lanka-border-hover rounded-2xl p-4 text-center transition-all hover:scale-[1.02]">
              <span className="text-[9px] font-bold text-lanka-darkText uppercase tracking-widest block mb-2">{s.label}</span>
              <span className="text-2xl font-black text-white">{s.value}</span>
              {s.unit && <span className="text-xs text-lanka-muted ml-1">{s.unit}</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#050d1a]/70 border border-lanka-border rounded-2xl p-5 flex flex-wrap justify-around gap-6 text-center">
          {srilankaService.getFooterMetrics().map((m, i) => (
            <div key={i}>
              <span className="text-[9px] font-bold text-lanka-darkText uppercase tracking-widest block">{m.label}</span>
              <span className="text-xs font-black text-white mt-1 block">{m.value}</span>
            </div>
          ))}
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
