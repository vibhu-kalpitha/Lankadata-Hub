import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { Dashboard, DashboardDetail } from '../services/dashboardService';

export const Dashboards: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState<DashboardDetail[]>([]);
  const [popular, setPopular] = useState<Dashboard[]>([]);

  useEffect(() => {
    dashboardService.getDashboards().then(data => setTrending(data));
    dashboardService.getPopularDashboards().then(data => setPopular(data));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find matching dashboard
      const query = searchQuery.toLowerCase();
      const match = [...trending, ...popular].find(d => d.title.toLowerCase().includes(query));
      if (match) {
        navigate(`/dashboards/${match.id}`);
      } else {
        alert('No matching dashboards found. Try searching "GDP" or "Dengue".');
      }
    }
  };

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-12">
      
      {/* Header and Search */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
          Explore National Intelligence
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted leading-relaxed">
          Access over 5,000+ real-time dashboards covering every sector of the Sri Lankan economy, updated hourly from verified government nodes.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for dashboards, datasets, or API endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-lanka-bg-light border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-lg py-2.5 px-4 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue"
          />
          <button 
            type="submit" 
            className="bg-lanka-blue hover:bg-lanka-blue-hover text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-blue-glow transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Trending tags */}
        <div className="text-[10px] text-lanka-muted flex justify-center items-center gap-1.5 flex-wrap">
          <span className="font-bold text-lanka-darkText uppercase">Trending:</span>
          {['GDP Q4 2023', 'Monsoon Alerts', 'Colombo Stock Ex.'].map((tag, idx) => (
            <button 
              key={idx} 
              onClick={() => { setSearchQuery(tag); }}
              className="px-2 py-0.5 rounded bg-white/5 border border-lanka-border hover:border-lanka-border-hover transition-colors text-white"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Dashboards Row */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-lanka-cyan" />
            Trending Dashboards
          </h2>
          <Link to="/dashboards" className="text-[11px] text-lanka-cyan hover:underline">View All &gt;</Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          {trending.map((d) => (
            <Link 
              key={d.id} 
              to={`/dashboards/${d.id}`}
              className="flex-shrink-0 w-80 glass-panel p-5 space-y-4 hover:scale-[1.01] hover:shadow-cyan-glow transition-all duration-300"
            >
              {/* Card visual mock background */}
              <div className="h-36 rounded-lg bg-gradient-to-br from-[#0c182c] to-[#060a14] border border-lanka-border relative overflow-hidden flex items-center justify-center">
                <span className="text-[10px] font-bold text-lanka-darkText tracking-widest uppercase">
                  {d.category} Visual Stream
                </span>
                {d.live && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#091122]/90 border border-lanka-rose/30 px-1.5 py-0.5 rounded text-[8px] font-bold text-lanka-rose uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-lanka-rose animate-ping" />
                    <span>LIVE</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white truncate">{d.title}</h3>
                <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-lanka-darkText pt-2 border-t border-lanka-border">
                <span>{d.author}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {(d.views / 1000).toFixed(1)}k views
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Most Popular */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-lanka-blue-light" />
          Most Popular
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map((d) => (
            <Link 
              key={d.id} 
              to={`/dashboards/${d.id}`}
              className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors"
            >
              <span className="text-[9px] font-bold text-lanka-blue-light bg-lanka-blue-glow px-2 py-0.5 rounded uppercase tracking-wider">
                {d.category}
              </span>
              <h3 className="text-xs font-bold text-white">{d.title}</h3>
              <p className="text-[11px] text-lanka-muted leading-relaxed line-clamp-2">{d.description}</p>
              <div className="flex justify-between text-[9px] text-lanka-darkText pt-2 border-t border-lanka-border">
                <span>{d.author}</span>
                <span>{(d.views / 1000).toFixed(0)}k views</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Health & Wellbeing */}
      <section className="space-y-4">
        <div className="border-l-4 border-lanka-rose pl-3">
          <h2 className="text-base font-bold text-white">Health & Wellbeing</h2>
          <p className="text-[11px] text-lanka-darkText">National health indicators, hospital capacities, and disease tracking.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/dashboards/dengue-outbreak-dashboard"
            className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors"
          >
            <div className="h-28 rounded bg-[#101b2d] flex items-center justify-center text-[10px] text-lanka-rose font-bold uppercase">
              Critical Care Monitoring
            </div>
            <h3 className="text-xs font-bold text-white">Critical Care Monitoring</h3>
            <p className="text-[11px] text-lanka-muted line-clamp-2">Intensive Care Unit availability and equipment status.</p>
          </Link>
          <Link 
            to="/dashboards/dengue-outbreak-dashboard"
            className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors"
          >
            <div className="h-28 rounded bg-[#101b2d] flex items-center justify-center text-[10px] text-lanka-rose font-bold uppercase">
              Epidemiological Watch
            </div>
            <h3 className="text-xs font-bold text-white">Epidemiological Watch</h3>
            <p className="text-[11px] text-lanka-muted line-clamp-2">Public health surveillance and vaccination progress.</p>
          </Link>
          <div className="bg-[#0b101b]/40 border border-dashed border-lanka-border rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[220px]">
            <AlertCircle size={20} className="text-lanka-darkText" />
            <span className="text-xs font-bold text-white">Coming Soon</span>
            <span className="text-[10px] text-lanka-muted">Mental health indicators</span>
          </div>
          <div className="bg-[#0b101b]/40 border border-dashed border-lanka-border rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[220px]">
            <AlertCircle size={20} className="text-lanka-darkText" />
            <span className="text-xs font-bold text-white">Coming Soon</span>
            <span className="text-[10px] text-lanka-muted">Pharmaceutical supply registries</span>
          </div>
        </div>
      </section>

      {/* Economic Governance */}
      <section className="space-y-4">
        <div className="border-l-4 border-lanka-teal pl-3">
          <h2 className="text-base font-bold text-white">Economic Governance</h2>
          <p className="text-[11px] text-lanka-darkText">Fiscal policy, banking sectors, and trade balances.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/dashboards/national-gdp-growth"
            className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors text-center"
          >
            <span className="text-xs font-bold text-white block mt-3">Inflation Analysis</span>
            <span className="text-[10px] text-lanka-muted block mt-1">Consumer Price Index monthly shifts.</span>
          </Link>
          <Link 
            to="/dashboards/national-gdp-growth"
            className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors text-center"
          >
            <span className="text-xs font-bold text-white block mt-3">Foreign Reserves</span>
            <span className="text-[10px] text-lanka-muted block mt-1">Liquidity status and asset distribution.</span>
          </Link>
          <Link 
            to="/dashboards/national-gdp-growth"
            className="bg-lanka-card border border-lanka-border hover:border-lanka-border-hover rounded-xl p-5 space-y-3 transition-colors text-center"
          >
            <span className="text-xs font-bold text-white block mt-3">Retail Performance</span>
            <span className="text-[10px] text-lanka-muted block mt-1">SME growth and digital transaction trends.</span>
          </Link>
          <Link 
            to="/contact"
            className="bg-[#0b101b]/40 border border-dashed border-lanka-border rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[160px] hover:bg-white/5 transition-colors"
          >
            <span className="text-xl text-lanka-blue-light font-bold">+</span>
            <span className="text-xs font-bold text-white">Request Sector Dashboard</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Dashboards;
