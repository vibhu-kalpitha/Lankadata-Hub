import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Sparkles, TrendingUp, ChevronRight, Search, Activity, BarChart2, Heart } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { Dashboard, DashboardDetail } from '../services/dashboardService';

const categoryGradient: Record<string, string> = {
  Economy: 'from-blue-600/25 to-blue-900/10 border-blue-500/30',
  Health:  'from-rose-600/25 to-rose-900/10 border-rose-500/30',
  Weather: 'from-sky-600/25 to-sky-900/10  border-sky-500/30',
};
const categoryIcon: Record<string, React.ReactNode> = {
  Economy: <TrendingUp size={16} className="text-blue-400" />,
  Health:  <Activity   size={16} className="text-rose-400"  />,
  Weather: <BarChart2  size={16} className="text-sky-400"   />,
};
const categoryAccent: Record<string, string> = {
  Economy: 'text-blue-300',
  Health:  'text-rose-300',
  Weather: 'text-sky-300',
};

export const Dashboards: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState<DashboardDetail[]>([]);
  const [popular, setPopular] = useState<Dashboard[]>([]);

  useEffect(() => {
    dashboardService.getDashboards().then(d => setTrending(d));
    dashboardService.getPopularDashboards().then(d => setPopular(d));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const match = [...trending, ...popular].find(d => d.title.toLowerCase().includes(q));
    if (match) navigate(`/dashboards/${match.id}`);
  };

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">

      {/* ── Hero Header ─────────────────────────────────── */}
      <div className="relative overflow-hidden py-8 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#030b16] via-[#050f20] to-[#040c1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-3">
            <Sparkles size={10} /> National Intelligence Dashboards
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Explore National{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Intelligence</span>
          </h1>
          <p className="text-xs text-lanka-muted max-w-lg mx-auto mb-6">
            5,000+ real-time dashboards covering every sector of the Sri Lankan economy, updated hourly from verified government sources.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-30 group-hover:opacity-60 blur transition-opacity" />
            <div className="relative flex items-center bg-[#040c1a] rounded-2xl border border-lanka-border">
              <Search size={16} className="absolute left-4 text-lanka-muted" />
              <input type="text" placeholder="Search dashboards, e.g. GDP, Dengue, Monsoon…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-11 pr-28 text-sm text-white placeholder-lanka-darkText focus:outline-none" />
              <button type="submit" className="absolute right-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all">
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['GDP Q4 2023', 'Monsoon Alerts', 'Colombo Stock Ex.', 'Dengue Tracker'].map(tag => (
              <button key={tag} onClick={() => setSearchQuery(tag)}
                className="text-[11px] text-lanka-muted hover:text-white border border-lanka-border hover:border-lanka-border-hover bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* ── Trending Dashboards ──────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
              <div>
                <h2 className="text-xl font-black text-white">Trending Dashboards</h2>
                <p className="text-[11px] text-lanka-muted mt-0.5">Featured real-time intelligence panels</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map(d => (
              <Link key={d.id} to={`/dashboards/${d.id}`}
                className="group relative bg-gradient-to-br from-[#060f1e] to-[#040b16] border border-lanka-border hover:border-lanka-border-hover rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                {/* Visual preview */}
                <div className={`h-40 bg-gradient-to-br ${categoryGradient[d.category] || 'from-slate-600/20 to-slate-900/10 border-slate-500/30'} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="text-center z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-lanka-border mb-2">
                      {categoryIcon[d.category] || <BarChart2 size={20} className="text-white/60" />}
                    </div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{d.category} Stream</p>
                  </div>
                  {d.live && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-red-500/40 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      <span className="text-[9px] font-black text-red-400 uppercase">Live</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-lanka-border px-2 py-1 rounded-full text-[9px] text-white/60">
                    {(d.views / 1000).toFixed(1)}k views
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-black text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors">{d.title}</h3>
                  <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed mb-4">{d.description}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-lanka-border">
                    <span className="text-[10px] text-lanka-darkText">{d.author}</span>
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${categoryAccent[d.category] || 'text-white/60'}`}>
                      View Dashboard <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Most Popular ──────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-400" /> Most Popular
              </h2>
              <p className="text-[11px] text-lanka-muted mt-0.5">Highest viewed dashboards this month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popular.map(d => (
              <Link key={d.id} to={`/dashboards/${d.id}`}
                className="group bg-[#050d1a] border border-lanka-border hover:border-lanka-border-hover rounded-2xl p-5 space-y-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                <span className={`text-[9px] font-black px-2 py-1 rounded-full border uppercase tracking-wider ${categoryGradient[d.category] ? `bg-gradient-to-r ${categoryGradient[d.category]} ${categoryAccent[d.category]}` : 'bg-white/5 border-lanka-border text-white/50'}`}>
                  {d.category}
                </span>
                <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-tight">{d.title}</h3>
                <p className="text-[11px] text-lanka-muted leading-relaxed line-clamp-2">{d.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-lanka-border text-[10px] text-lanka-darkText">
                  <span>{d.author}</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{(d.views / 1000).toFixed(0)}k</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Health & Wellbeing ────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-rose-400 to-pink-600 rounded-full" />
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Heart size={18} className="text-rose-400" /> Health & Wellbeing
              </h2>
              <p className="text-[11px] text-lanka-muted mt-0.5">Hospital capacities, disease tracking, vaccination metrics.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Critical Care Monitoring', desc: 'ICU availability and real-time equipment status across all hospitals.', id: 'dengue-outbreak-dashboard' },
              { title: 'Epidemiological Watch', desc: 'Public health surveillance, outbreak alerts, and vaccination progress.', id: 'dengue-outbreak-dashboard' },
            ].map((card, i) => (
              <Link key={i} to={`/dashboards/${card.id}`}
                className="group bg-gradient-to-br from-rose-900/20 to-[#050d1a] border border-rose-500/20 hover:border-rose-500/40 rounded-2xl p-5 space-y-3 transition-all hover:scale-[1.02]">
                <div className="h-24 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Activity size={28} className="text-rose-400/50 group-hover:text-rose-400 transition-colors" />
                </div>
                <h3 className="text-xs font-black text-white group-hover:text-rose-300 transition-colors">{card.title}</h3>
                <p className="text-[11px] text-lanka-muted line-clamp-2">{card.desc}</p>
              </Link>
            ))}
            {['Mental Health Indicators', 'Pharmaceutical Supply'].map((label, i) => (
              <div key={i} className="border border-dashed border-lanka-border rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 min-h-[200px] bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl border border-dashed border-lanka-border flex items-center justify-center">
                  <span className="text-xl text-white/20">+</span>
                </div>
                <span className="text-xs font-bold text-white/40">Coming Soon</span>
                <span className="text-[10px] text-white/25">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Economic Governance ───────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-cyan-600 rounded-full" />
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-400" /> Economic Governance
              </h2>
              <p className="text-[11px] text-lanka-muted mt-0.5">Fiscal policy, banking sectors, and trade balances.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Inflation Analysis', desc: 'Consumer Price Index monthly shifts.' },
              { title: 'Foreign Reserves', desc: 'Liquidity status and asset distribution.' },
              { title: 'Retail Performance', desc: 'SME growth and digital transaction trends.' },
            ].map((card, i) => (
              <Link key={i} to="/dashboards/national-gdp-growth"
                className="group bg-gradient-to-br from-teal-900/20 to-[#050d1a] border border-teal-500/20 hover:border-teal-500/40 rounded-2xl p-5 space-y-3 transition-all hover:scale-[1.02]">
                <div className="h-20 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <BarChart2 size={24} className="text-teal-400/50 group-hover:text-teal-400 transition-colors" />
                </div>
                <h3 className="text-xs font-black text-white group-hover:text-teal-300 transition-colors">{card.title}</h3>
                <p className="text-[11px] text-lanka-muted">{card.desc}</p>
              </Link>
            ))}
            <Link to="/contact"
              className="border border-dashed border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 min-h-[200px] transition-all">
              <span className="text-2xl font-black text-blue-400">+</span>
              <span className="text-xs font-bold text-white">Request a Dashboard</span>
              <span className="text-[10px] text-lanka-muted">Submit a sector data request</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboards;
