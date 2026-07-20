import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, ChevronLeft, ChevronRight, Activity, ShieldCheck,
  Zap, Database, ArrowRight, TrendingUp, Globe, Users,
  BarChart2, CloudRain, Layers, Cpu
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

/* ─── Floating orb decoration ────────────────────────────────────────────── */
const Orb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`} />
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysStats, setTodaysStats] = useState<any>(null);
  const [discoverStats, setDiscoverStats] = useState<any[]>([]);
  const [latestDatasets, setLatestDatasets] = useState<Dataset[]>([]);
  const [trendingDashboards, setTrendingDashboards] = useState<DashboardDetail[]>([]);
  const [currentDashboardIdx, setCurrentDashboardIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  const datasetsCount  = useCountUp(2480);
  const dashboardCount = useCountUp(184);
  const apiCount       = useCountUp(56);
  const updateCount    = useCountUp(99);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
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

  const categoryBadges = [
    { icon: TrendingUp,  label: 'Economy',      color: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',    text: 'text-blue-300' },
    { icon: Activity,    label: 'Health',       color: 'from-rose-600/20 to-rose-900/20 border-rose-500/30',    text: 'text-rose-300' },
    { icon: CloudRain,   label: 'Weather',      color: 'from-sky-600/20 to-sky-900/20 border-sky-500/30',       text: 'text-sky-300'  },
    { icon: Layers,      label: 'Agriculture',  color: 'from-green-600/20 to-green-900/20 border-green-500/30', text: 'text-green-300'},
    { icon: Globe,       label: 'Tourism',      color: 'from-amber-600/20 to-amber-900/20 border-amber-500/30', text: 'text-amber-300'},
    { icon: Users,       label: 'Population',   color: 'from-violet-600/20 to-violet-900/20 border-violet-500/30',text:'text-violet-300'},
  ];

  return (
    <div className="flex-1 bg-lanka-bg grid-bg overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background orbs */}
        <Orb className="w-[600px] h-[600px] bg-blue-600/15 top-[-150px] left-[-200px]" />
        <Orb className="w-[500px] h-[500px] bg-cyan-500/10  top-[100px]  right-[-150px]" />
        <Orb className="w-[300px] h-[300px] bg-purple-500/10 bottom-[80px] left-[30%]" />

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#38bdf8 1px,transparent 1px),linear-gradient(90deg,#38bdf8 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Live indicator pill */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lanka-teal/30 bg-lanka-teal/10
          text-lanka-teal text-[11px] font-bold tracking-widest uppercase mb-6
          transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-lanka-teal animate-ping" />
          Live  •  Real-Time National Intelligence
        </div>

        {/* Main heading */}
        <div className={`text-center max-w-4xl transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
            Sri Lanka's
            <span className="block bg-gradient-to-r from-lanka-blue-light via-lanka-cyan to-teal-400 bg-clip-text text-transparent">
              Open Data Hub
            </span>
          </h1>
          <p className="text-base md:text-lg text-lanka-muted max-w-2xl mx-auto leading-relaxed mb-10">
            Trusted national datasets, real-time dashboards, and REST APIs —<br className="hidden md:block" />
            powering research, policy, and innovation across the island.
          </p>
        </div>

        {/* Search bar */}
        <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-lanka-blue via-lanka-cyan to-teal-500 rounded-2xl opacity-40 group-hover:opacity-70 blur transition-opacity duration-300" />
            <div className="relative flex items-center bg-[#040d1a] rounded-2xl border border-white/10">
              <Search size={18} className="absolute left-5 text-lanka-muted" />
              <input
                type="text"
                placeholder="Search datasets, indicators, regions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-36 text-sm text-white placeholder-lanka-darkText focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-blue-glow"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['GDP Growth', 'Dengue Stats', 'Fuel Prices', 'Population Census', 'Weather Data'].map(q => (
              <button
                key={q}
                onClick={() => navigate(`/datasets?search=${encodeURIComponent(q)}`)}
                className="text-[11px] text-lanka-muted hover:text-white border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Platform stats counter row */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-3xl transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {platformStats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 mb-2 transition-colors">
                <s.icon size={16} className={s.color} />
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value.toLocaleString()}{s.suffix}</div>
              <div className="text-[10px] text-lanka-darkText uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-lanka-darkText text-[10px] animate-bounce">
          <ChevronRight size={16} className="rotate-90" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORY BADGES
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {categoryBadges.map((c, i) => (
            <Link
              key={i}
              to={`/categories/${c.label.toLowerCase()}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${c.color} border text-[12px] font-semibold ${c.text} hover:scale-105 transition-all`}
            >
              <c.icon size={13} />
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRENDING DASHBOARDS  (with Sri Lanka Map)
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Section header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 bg-gradient-to-b from-lanka-blue to-cyan-400 rounded-full" />
              <h2 className="text-2xl font-black text-white">Trending Dashboards</h2>
            </div>
            <p className="text-[12px] text-lanka-muted ml-3">
              Featured intelligence panels — updated every minute from verified national sources.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {activeDb ? (
          <div className="relative rounded-3xl overflow-hidden border border-white/10">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050f20] via-[#071428] to-[#050e1c]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">

              {/* ── LEFT: Info panel ──────────────────────────────── */}
              <div className="xl:col-span-3 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-black text-red-400 tracking-widest uppercase">Live Data Stream</span>
                  </div>

                  {/* Dashboard pagination dots */}
                  <div className="flex gap-1.5 mb-4">
                    {trendingDashboards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentDashboardIdx(i)}
                        className={`rounded-full transition-all ${i === currentDashboardIdx ? 'w-6 h-2 bg-lanka-cyan' : 'w-2 h-2 bg-white/20'}`}
                      />
                    ))}
                  </div>

                  <h3 className="text-xl font-black text-white leading-tight mb-2">{activeDb.title}</h3>
                  <p className="text-xs text-lanka-muted leading-relaxed">{activeDb.description}</p>
                </div>

                {/* Metrics mini grid */}
                <div className="grid grid-cols-1 gap-2.5">
                  {activeDb.metrics?.slice(0, 4).map((m: any, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between hover:bg-white/8 transition-colors">
                      <span className="text-[10px] font-semibold text-lanka-muted">{m.title}</span>
                      <span className={`text-sm font-black ${
                        m.type === 'CASES' || m.type === 'ZONES' ? 'text-red-400' : 'text-lanka-teal'
                      }`}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/dashboards/${activeDb.id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-blue-glow transition-all active:scale-95"
                >
                  View Full Dashboard <ArrowRight size={13} />
                </Link>
              </div>

              {/* ── CENTRE: Sri Lanka Map ─────────────────────────── */}
              <div className="xl:col-span-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={13} className="text-lanka-cyan" />
                  <span className="text-[11px] font-bold text-lanka-darkText uppercase tracking-wider">Province Heatmap</span>
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                  <SriLankaMap />
                </div>
              </div>

              {/* ── RIGHT: Charts ─────────────────────────────────── */}
              <div className="xl:col-span-5 grid grid-rows-2 gap-4">

                {/* Pie chart card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-36 h-36 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={denguePieData} cx="50%" cy="50%" innerRadius={44} outerRadius={62} paddingAngle={4} dataKey="value">
                          {denguePieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-black text-white">55%</span>
                      <span className="text-[9px] text-lanka-muted">West</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider mb-3">Case Distribution</p>
                    {denguePieData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-[11px] text-lanka-muted">{d.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar chart card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col">
                  <p className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider mb-3">Weekly Case Trends</p>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dengueBarData} barSize={16}>
                        <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#071428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                          labelStyle={{ color: '#94a3b8' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
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
          <div className="text-center py-20 text-lanka-muted text-sm glass-panel rounded-3xl">
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
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#050f20] to-[#060d1b] p-6">
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
                    contentStyle={{ background: '#071428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
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
            <div key={i} className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-4 text-center transition-all hover:scale-[1.02]">
              <span className="text-[9px] font-bold text-lanka-darkText uppercase tracking-widest block mb-2">{s.label}</span>
              <span className="text-2xl font-black text-white">{s.value}</span>
              {s.unit && <span className="text-xs text-lanka-muted ml-1">{s.unit}</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#050d1a]/70 border border-white/8 rounded-2xl p-5 flex flex-wrap justify-around gap-6 text-center">
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
          <Link to="/datasets" className="text-xs text-lanka-cyan hover:text-white flex items-center gap-1 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-xl transition-all">
            Explore All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestDatasets.map(d => (
            <div
              key={d.id}
              className="group relative bg-gradient-to-br from-[#071428] to-[#050d1a] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between h-52 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/10 transition-colors" />
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-black bg-white/10 border border-white/15 text-slate-300 px-2.5 py-1 rounded-full uppercase tracking-wider">{d.category}</span>
                  {d.live && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />LIVE
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-black text-white leading-tight mb-2">{d.title}</h4>
                <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/8">
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

      {/* ══════════════════════════════════════════════════
          DEVELOPER API BANNER
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-16">
        <div className="relative rounded-3xl overflow-hidden border border-white/10">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#030b17] via-[#071428] to-[#0a1a35]" />
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #1d4ed8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0891b2 0%, transparent 40%)',
            }}
          />

          <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-4">
                <Activity size={10} /> Developer Portal
              </span>
              <h3 className="text-3xl font-black text-white mb-3">
                Build with Sri Lanka's<br />
                <span className="bg-gradient-to-r from-lanka-blue-light to-cyan-400 bg-clip-text text-transparent">
                  most trusted APIs
                </span>
              </h3>
              <p className="text-sm text-lanka-muted leading-relaxed mb-6">
                Secure, high-performance REST APIs for developers building fintech tools, research platforms, or regional dashboards.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  [ShieldCheck, 'Secure Bearer Tokens'],
                  [Zap,         'Sub-100ms Response'],
                  [Database,    'JSON / CSV / SQL'],
                  [Activity,    '99.9% Uptime SLA'],
                ].map(([Icon, label], i) => (
                  <div key={i} className="flex items-center gap-2 text-lanka-muted">
                    {/* @ts-ignore */}
                    <Icon size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>{label as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link to="/apis" className="bg-gradient-to-r from-lanka-blue to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-center text-sm font-bold px-8 py-3.5 rounded-2xl shadow-blue-glow transition-all active:scale-95">
                Get API Access
              </Link>
              <Link to="/documentation" className="bg-white/5 hover:bg-white/10 text-white text-center border border-white/15 hover:border-white/25 text-sm font-bold px-8 py-3.5 rounded-2xl transition-all">
                View Documentation
              </Link>

              {/* Code snippet teaser */}
              <div className="mt-2 bg-[#020811] border border-white/10 rounded-xl p-3 font-mono text-[10px] text-slate-400 select-text">
                <span className="text-cyan-400">GET</span>{' '}
                <span className="text-white">/api/v1/economy/gdp-growth</span><br />
                <span className="text-green-400">Authorization:</span>{' '}
                <span className="text-slate-500">Bearer YOUR_KEY</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
