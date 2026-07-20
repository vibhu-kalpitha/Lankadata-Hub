import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap, Database, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

import { SriLankaMap } from '../components/SriLankaMap';
import { srilankaService } from '../services/srilankaService';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '../services/datasetService';
import { dashboardService } from '../services/dashboardService';
import type { DashboardDetail } from '../services/dashboardService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysStats, setTodaysStats] = useState<any>(null);
  const [discoverStats, setDiscoverStats] = useState<any[]>([]);
  const [latestDatasets, setLatestDatasets] = useState<Dataset[]>([]);
  const [trendingDashboards, setTrendingDashboards] = useState<DashboardDetail[]>([]);
  const [currentDashboardIdx, setCurrentDashboardIdx] = useState(0);

  useEffect(() => {
    // Load statistics and data from services
    setTodaysStats(srilankaService.getTodaysStats());
    setDiscoverStats(srilankaService.getDiscoverStats());
    
    datasetService.getLatestDatasets(3).then(data => setLatestDatasets(data));
    dashboardService.getDashboards().then(data => setTrendingDashboards(data));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/datasets?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePrevDashboard = () => {
    if (trendingDashboards.length === 0) return;
    setCurrentDashboardIdx(prev => (prev === 0 ? trendingDashboards.length - 1 : prev - 1));
  };

  const handleNextDashboard = () => {
    if (trendingDashboards.length === 0) return;
    setCurrentDashboardIdx(prev => (prev === trendingDashboards.length - 1 ? 0 : prev + 1));
  };

  // Pie chart variables for Dengue case distribution in first dashboard
  const denguePieData = [
    { name: 'Western', value: 55, color: '#2563eb' },
    { name: 'Central', value: 25, color: '#38bdf8' },
    { name: 'Southern', value: 20, color: '#f43f5e' }
  ];

  // Bar chart data for case trends
  const dengueBarData = [
    { month: 'SEP', cases: 12000 },
    { month: 'OCT', cases: 19000 },
    { month: 'NOV', cases: 24000 },
    { month: 'DEC', cases: 32000 },
    { month: 'JAN', cases: 40000 },
    { month: 'FEB', cases: 42891 }
  ];

  // General bar/pie rendering logic for active dashboard card
  const activeDb = trendingDashboards[currentDashboardIdx];

  return (
    <div className="flex-1 bg-lanka-bg grid-bg pb-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          LankaData Hub
        </h1>
        <p className="text-sm md:text-base text-lanka-muted max-w-2xl mx-auto mb-8 leading-relaxed">
          Sri Lanka's central platform for real-time national datasets, interactive dashboards, and developer APIs.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative mb-6">
          <input
            type="text"
            placeholder="Search for datasets, indicators, or regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-lanka-bg-light/80 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-full py-3.5 pl-6 pr-12 text-sm text-white placeholder-lanka-darkText focus:outline-none focus:ring-2 focus:ring-lanka-blue/50 shadow-glass transition-all"
          />
          <button type="submit" className="absolute right-4 top-3.5 text-lanka-muted hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </form>
      </section>

      {/* Trending Dashboards Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Trending Dashboards</h2>
            <p className="text-[11px] text-lanka-darkText mt-1">
              Explore our featured real-time visual statistics capturing critical trends across the island, updated every minute.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevDashboard}
              className="p-1.5 rounded-lg border border-lanka-border bg-lanka-card hover:bg-lanka-bg-light text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextDashboard}
              className="p-1.5 rounded-lg border border-lanka-border bg-lanka-card hover:bg-lanka-bg-light text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {activeDb ? (
          <div className="glass-panel p-6 rounded-2xl flex flex-col xl:flex-row gap-6 relative overflow-hidden">
            {/* Left side: Metadata */}
            <div className="w-xl-2/5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-lanka-rose animate-ping" />
                  <span className="text-[10px] font-bold text-lanka-rose tracking-wider uppercase">
                    Live Data Stream
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{activeDb.title}</h3>
                <p className="text-xs text-lanka-muted mt-2 leading-relaxed">{activeDb.description}</p>
              </div>

              {/* Mini Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-3">
                {activeDb.metrics?.map((m, idx) => (
                  <div key={idx} className="bg-lanka-bg-light/40 border border-lanka-border rounded-xl p-3">
                    <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">
                      {m.title}
                    </span>
                    <span className={`text-base font-bold ${
                      m.type === 'CASES' || m.type === 'ZONES' ? 'text-lanka-rose' : 'text-lanka-teal'
                    }`}>
                      {m.value}
                    </span>
                    <span className="text-[9px] text-lanka-darkText block mt-0.5">{m.change}</span>
                  </div>
                ))}
              </div>

              <Link 
                to={`/dashboards/${activeDb.id}`}
                className="inline-flex items-center justify-center gap-2 bg-lanka-blue hover:bg-lanka-blue-hover text-white text-xs font-semibold px-6 py-3 rounded-lg shadow-blue-glow w-full md:w-fit transition-all active:scale-95"
              >
                <span>View Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right side: Recharts Visualization preview matches the design details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Pie Distribution preview */}
              <div className="bg-lanka-bg-light/40 border border-lanka-border rounded-xl p-4 flex flex-col items-center justify-center h-64">
                <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider mb-2">
                  Case Distribution by Province
                </span>
                <div className="w-full h-44 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={denguePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {denguePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center percentage */}
                  <div className="absolute text-center">
                    <span className="text-lg font-bold text-white block">Western</span>
                    <span className="text-[10px] text-lanka-muted block">55.0%</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-2 text-[10px]">
                  {denguePieData.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-lanka-muted">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart Trends preview */}
              <div className="bg-lanka-bg-light/40 border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-64">
                <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider mb-2">
                  Weekly Case Trends (Grid)
                </span>
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dengueBarData}>
                      <XAxis 
                        dataKey="month" 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                        {dengueBarData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === dengueBarData.length - 1 ? '#f43f5e' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-lanka-muted text-sm glass-panel">
            Loading trending intelligence dashboards...
          </div>
        )}
      </section>

      {/* Today's Sri Lanka Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-lanka-blue rounded-full" />
              Today's Sri Lanka
            </h2>
            <p className="text-[11px] text-lanka-darkText mt-1">
              Mission control for real-time national indicators and economic benchmarks.
            </p>
          </div>
          <span className="text-[9px] bg-lanka-teal-glow text-lanka-teal border border-lanka-teal/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Sri Lanka Grand Stable
          </span>
        </div>

        {todaysStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Environment Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.environment.label}</span>
                <span>{todaysStats.environment.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-white">{todaysStats.environment.value}</span>
                <span className="text-lg font-bold text-lanka-cyan">{todaysStats.environment.unit}</span>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.environment.desc}</span>
            </div>

            {/* Fuel Prices Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.fuelMarket.label}</span>
                <span>{todaysStats.fuelMarket.updatedTime}</span>
              </div>
              <div className="my-2 space-y-1">
                {todaysStats.fuelMarket.prices.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold">
                    <span className="text-lanka-muted">{p.name}</span>
                    <span className="text-white font-bold">{p.price} LKR</span>
                  </div>
                ))}
              </div>
              <span className="text-[9px] text-lanka-darkText">{todaysStats.fuelMarket.source}</span>
            </div>

            {/* Forex Rate Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.forexRate.label}</span>
                <span>{todaysStats.forexRate.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-white">{todaysStats.forexRate.value}</span>
                <span className="text-xs text-lanka-teal ml-1 font-bold">{todaysStats.forexRate.change}</span>
              </div>
              <span className="text-[9px] text-lanka-darkText uppercase">{todaysStats.forexRate.desc}</span>
            </div>

            {/* Public Health Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.publicHealth.label}</span>
                <span>{todaysStats.publicHealth.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-lanka-rose">{todaysStats.publicHealth.value}</span>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.publicHealth.desc}</span>
            </div>

            {/* Stock Market Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.stockMarket.label}</span>
                <span>{todaysStats.stockMarket.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-2xl font-extrabold text-white">{todaysStats.stockMarket.value}</span>
                <span className="text-xs text-lanka-teal ml-1 font-bold">{todaysStats.stockMarket.change}</span>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.stockMarket.desc}</span>
            </div>

            {/* Power Status Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.powerStatus.label}</span>
                <span>{todaysStats.powerStatus.updatedTime}</span>
              </div>
              <div className="my-2 flex items-center gap-2">
                <Zap size={16} className="text-lanka-cyan animate-pulse" />
                <span className="text-3xl font-extrabold text-white">{todaysStats.powerStatus.value}</span>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.powerStatus.desc}</span>
            </div>

            {/* Tea Auction Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.teaAuction.label}</span>
                <span>{todaysStats.teaAuction.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-2xl font-extrabold text-white">{todaysStats.teaAuction.value} LKR</span>
              </div>
              <span className="text-[9px] text-lanka-darkText uppercase">{todaysStats.teaAuction.source}</span>
            </div>

            {/* Tourism Card */}
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-36">
              <div className="flex justify-between text-[9px] font-bold text-lanka-darkText">
                <span>{todaysStats.tourism.label}</span>
                <span>{todaysStats.tourism.updatedTime}</span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-white">{todaysStats.tourism.value}</span>
              </div>
              <span className="text-[10px] text-lanka-muted">{todaysStats.tourism.desc}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-lanka-muted">Loading live benchmark stats...</div>
        )}
      </section>

      {/* Discover Sri Lanka Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Discover Sri Lanka</h2>
          <p className="text-xs text-lanka-muted mt-1 leading-relaxed max-w-xl mx-auto">
            A deep dive into the macroeconomic and demographic landscape of the pearl of the Indian Ocean.
          </p>
        </div>

        {/* Interactive Province Map */}
        <div className="mb-6">
          <SriLankaMap />
        </div>

        {/* General Discover Cards Grid & Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {discoverStats.map((stat, idx) => (
            <div key={idx} className="bg-lanka-card/40 border border-lanka-border rounded-xl p-4 text-center">
              <span className="text-[9px] font-semibold text-lanka-darkText tracking-wider uppercase block mb-1">
                {stat.label}
              </span>
              <span className="text-xl font-bold text-white block">
                {stat.value} {stat.unit && <span className="text-xs text-lanka-muted">{stat.unit}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* National Symbols Row */}
        <div className="bg-[#091122]/50 border border-lanka-border rounded-xl p-4 flex flex-wrap justify-around gap-6 mt-6 text-center">
          {srilankaService.getFooterMetrics().map((m, idx) => (
            <div key={idx}>
              <span className="text-[9px] font-semibold text-lanka-darkText uppercase block">{m.label}</span>
              <span className="text-xs font-bold text-white mt-1 block">{m.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Developer API Marketplace Teaser */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="glass-panel p-8 rounded-2xl bg-gradient-to-r from-lanka-bg-light to-[#09152b] border border-lanka-border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-lanka-blue-glow rounded-full filter blur-3xl opacity-35 pointer-events-none"></div>
          
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lanka-blue-glow border border-lanka-blue/30 rounded-full text-[10px] text-lanka-blue-light font-bold tracking-wider uppercase">
              <Activity size={10} />
              Developer Portal
            </span>
            <h3 className="text-2xl font-bold text-white">Developer API Marketplace</h3>
            <p className="text-xs text-lanka-muted leading-relaxed">
              Access trusted Sri Lankan datasets through our secure, high-performance REST APIs. Perfect for developers building fintech, research tools, or regional dashboards.
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-lanka-muted">
                <ShieldCheck size={14} className="text-lanka-cyan" />
                <span>Secure API Keys</span>
              </div>
              <div className="flex items-center gap-2 text-lanka-muted">
                <Zap size={14} className="text-lanka-cyan" />
                <span>Fast REST APIs</span>
              </div>
              <div className="flex items-center gap-2 text-lanka-muted">
                <Database size={14} className="text-lanka-cyan" />
                <span>JSON Responses</span>
              </div>
              <div className="flex items-center gap-2 text-lanka-muted">
                <Activity size={14} className="text-lanka-cyan" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link 
              to="/apis"
              className="bg-lanka-blue hover:bg-lanka-blue-hover text-white text-center text-xs font-semibold px-6 py-3 rounded-lg shadow-blue-glow transition-all active:scale-95"
            >
              Get API Access
            </Link>
            <Link 
              to="/documentation"
              className="bg-white/5 hover:bg-white/10 text-white text-center border border-lanka-border text-xs font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Datasets Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Latest Published Datasets</h2>
          <Link to="/datasets" className="text-xs text-lanka-cyan hover:underline flex items-center gap-1">
            <span>Explore All Datasets</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestDatasets.map((d) => (
            <div key={d.id} className="glass-panel p-5 flex flex-col justify-between h-48 hover:scale-[1.01] transition-all">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold bg-[#1e293b] border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full uppercase">
                    {d.category}
                  </span>
                  <span className="text-[9px] text-lanka-darkText">{d.updatedAt}</span>
                </div>
                <h4 className="text-base font-bold text-white truncate">{d.title}</h4>
                <p className="text-xs text-lanka-muted mt-2 line-clamp-2 leading-relaxed">{d.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-lanka-border">
                <div className="flex gap-1.5">
                  {d.formats.map((f, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-lanka-cyan bg-lanka-cyan-glow border border-lanka-cyan/20 px-1.5 py-0.5 rounded uppercase">
                      {f}
                    </span>
                  ))}
                </div>
                <Link to={`/datasets/${d.id}`} className="text-xs font-bold text-lanka-blue-light hover:underline">
                  View Data
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
