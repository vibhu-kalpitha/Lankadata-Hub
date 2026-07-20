import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Download, Share2, FileText, ArrowRight, Award, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { dashboardService } from '../services/dashboardService';
import type { DashboardDetail as DashboardDetailType } from '../services/dashboardService';
import { ChartSkeleton } from '../components/SkeletonLoader';

export const DashboardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dashboard, setDashboard] = useState<DashboardDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dashboardService.getDashboardById(id).then((res) => {
      setDashboard(res);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = (filename: string) => {
    const element = document.createElement("a");
    const file = new Blob(["MOCK REPORT DATA\nCompiled by LankaData Hub Analyst Team."], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Dashboard link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 w-full bg-lanka-bg grid-bg">
        <ChartSkeleton />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 bg-lanka-bg grid-bg">
        <h2 className="text-xl font-bold text-white">Dashboard Not Found</h2>
        <p className="text-xs text-lanka-muted font-sans">The requested dashboard is not currently available.</p>
        <Link to="/dashboards" className="inline-block bg-lanka-blue text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Back to Dashboard Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-bold bg-lanka-blue-glow text-lanka-blue-light border border-lanka-blue/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          LIVE INTELLIGENCE
        </span>
        <span className="text-[9px] text-lanka-darkText flex items-center gap-1">
          <Calendar size={10} />
          Last Updated: {dashboard.updatedAt}
        </span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight m-0">
          {dashboard.title}
        </h1>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Embed Chart & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Visualization Container */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 flex flex-col min-h-[380px]">
            <div className="flex justify-between items-center mb-4 border-b border-lanka-border pb-3">
              <span className="text-xs font-bold text-white">
                {id === 'dengue-outbreak-dashboard' ? 'Weekly Outbreak Case Curve' : 'Real-time GDP Growth Rate (%)'}
              </span>
              <div className="flex gap-4 text-[9px] text-lanka-muted font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lanka-blue-light/50" />
                  <span>PROJECTED</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lanka-cyan" />
                  <span>ACTUAL</span>
                </div>
              </div>
            </div>

            {/* Interactive chart */}
            <div className="flex-1 w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.chartData}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b1424', border: '1px solid rgba(59,130,246,0.2)' }} />
                  <Area type="monotone" dataKey="Projected" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" />
                  <Area type="monotone" dataKey="Actual" stroke="#00d2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboard.metrics.map((m, idx) => (
              <div key={idx} className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col justify-between h-28 hover:border-lanka-border-hover transition-colors">
                <span className="text-[9px] font-bold text-lanka-darkText uppercase block">{m.title}</span>
                <span className="text-xl md:text-2xl font-extrabold text-white block mt-1">{m.value}</span>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-[10px] font-bold ${
                    m.isPositive ? 'text-lanka-teal' : 'text-lanka-rose'
                  }`}>
                    {m.change}
                  </span>
                  <span className="text-[8px] text-lanka-darkText font-mono uppercase">
                    {m.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Insights, Reports, Actions */}
        <div className="space-y-6">
          
          {/* National Insights Card */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-lanka-cyan" />
              National Insights
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-300">
              {dashboard.insights.map((insight, idx) => (
                <li key={idx} className="flex gap-2.5 pl-1.5 border-l-2 border-lanka-cyan/60 pb-1">
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Reports Card */}
          {dashboard.relatedReports.length > 0 && (
            <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Related Reports</h3>
              <div className="space-y-3">
                {dashboard.relatedReports.map((r, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleDownload(r.title + '.' + r.type.toLowerCase())}
                    className="flex items-center justify-between p-3 bg-lanka-bg-light/45 hover:bg-white/5 border border-lanka-border rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-red-950/20 text-lanka-rose border border-lanka-rose/15 flex items-center justify-center font-bold text-[10px]">
                        {r.type}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block truncate max-w-40">{r.title}</span>
                        <span className="text-[9px] text-lanka-muted block mt-0.5">{r.size}</span>
                      </div>
                    </div>
                    <Download size={14} className="text-lanka-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Analysis Card */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Export Analysis</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDownload(`${dashboard.id}_analysis.pdf`)}
                className="flex items-center justify-center gap-2 bg-[#091122]/50 hover:bg-white/5 border border-lanka-border py-2 px-3 rounded-lg text-[10px] font-bold text-lanka-muted hover:text-white transition-colors"
              >
                <FileText size={12} className="text-lanka-rose" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => handleDownload(`${dashboard.id}_analysis.xlsx`)}
                className="flex items-center justify-center gap-2 bg-[#091122]/50 hover:bg-white/5 border border-lanka-border py-2 px-3 rounded-lg text-[10px] font-bold text-lanka-muted hover:text-white transition-colors"
              >
                <FileText size={12} className="text-lanka-teal" />
                <span>Export Excel</span>
              </button>
            </div>

            <button 
              onClick={handleShare}
              className="w-full inline-flex items-center justify-center gap-2 bg-lanka-blue/20 hover:bg-lanka-blue/30 text-lanka-blue-light text-xs font-semibold py-2.5 rounded-lg border border-lanka-blue/35 transition-colors shadow-blue-glow active:scale-95"
            >
              <Share2 size={14} />
              <span>Share Dashboard</span>
            </button>
          </div>

          {/* Developer API Access Card */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-lanka-blue-light" />
              Developer API
            </h3>
            <p className="text-[11px] text-lanka-muted leading-relaxed">
              Access raw economic data updates programmatically via our REST API endpoints.
            </p>
            <div className="bg-lanka-bg-light border border-lanka-border p-2 rounded-lg font-mono text-[9px] text-lanka-cyan truncate">
              GET {dashboard.apiEndpoint}
            </div>
            <Link 
              to="/apis" 
              className="text-[10px] font-bold text-lanka-cyan hover:underline uppercase flex items-center gap-1 mt-2"
            >
              <span>Get API Keys</span>
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardDetail;
