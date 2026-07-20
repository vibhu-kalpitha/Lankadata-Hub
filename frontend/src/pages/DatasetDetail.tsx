import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Eye, Download, Database, Key, ChevronRight, LayoutGrid, Calendar, Clock, BarChart3, LineChart as LineIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

import { datasetService } from '../services/datasetService';
import type { DatasetDetail as DatasetDetailType } from '../services/datasetService';
import { TableSkeleton, ChartSkeleton } from '../components/SkeletonLoader';

export const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<DatasetDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    datasetService.getDatasetById(id).then((res) => {
      setDataset(res);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = (filename: string) => {
    // Generate dummy download file
    const element = document.createElement("a");
    const file = new Blob(["YEAR,REGION,INDICATOR VALUE,GROWTH %\n2024 (Projected),Western Province,12450.50 LKR B,+4.2%\n2023,Central Province,8210.20 LKR B,+2.8%\n2023,Southern Province,7430.80 LKR B,+3.1%"], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 w-full space-y-6 bg-lanka-bg">
        <ChartSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 bg-lanka-bg">
        <Database size={48} className="text-white/10 mx-auto" />
        <h2 className="text-xl font-black text-white">Dataset Not Found</h2>
        <p className="text-xs text-lanka-muted">The requested dataset does not exist or has been archived.</p>
        <Link to="/datasets" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-6 py-3 rounded-xl">
          Back to Datasets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">

      {/* ── Gradient Page Header ─────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/8 py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030b16] to-[#040c1a]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-lanka-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/datasets" className="hover:text-white transition-colors">Datasets</Link>
            <ChevronRight size={12} />
            <span className="text-white">{dataset.title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
              {dataset.category}
            </span>
            {dataset.live && (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                Live Updates
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {dataset.title}
          </h1>
          <p className="text-sm text-lanka-muted max-w-3xl leading-relaxed">{dataset.fullDescription}</p>
          <div className="flex items-center gap-6 mt-6 text-xs text-lanka-muted">
            <span className="flex items-center gap-1.5"><Eye size={14} className="text-cyan-400" /><strong className="text-white">{dataset.views.toLocaleString()}</strong> views</span>
            <span className="flex items-center gap-1.5"><Download size={14} className="text-teal-400" /><strong className="text-white">{dataset.downloads.toLocaleString()}</strong> downloads</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-lanka-muted" />{dataset.coverage}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Left/Right Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visualizations & Table Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Bar chart */}
            <div className="bg-[#050d1a] border border-white/10 rounded-2xl p-5 flex flex-col h-72">
              <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest flex items-center gap-1.5 mb-4">
                <BarChart3 size={12} className="text-cyan-400" />
                Quarterly Distribution
              </span>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataset.quarterlyDistribution}>
                    <XAxis dataKey="quarter" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <Bar dataKey="primary" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="secondary" fill="#00d2ff" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 justify-center text-[9px] text-lanka-muted">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-lanka-blue" />
                  <span>PRIMARY</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-lanka-cyan" />
                  <span>SECONDARY</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Line chart */}
            <div className="bg-[#050d1a] border border-white/10 rounded-2xl p-5 flex flex-col h-72">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest flex items-center gap-1.5">
                  <LineIcon size={12} className="text-teal-400" />
                  5-Year Growth Trend
                </span>
                <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2 py-0.5 rounded-full">
                  +12.4% YoY
                </span>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataset.growthTrend}>
                    <XAxis dataKey="year" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0b1424', border: '1px solid rgba(59,130,246,0.2)' }} />
                    <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Views / Downloads counters */}
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs">
            <span className="flex items-center gap-1.5 text-lanka-muted">
              <Eye size={14} className="text-cyan-400" />
              <strong className="text-white font-bold">{dataset.views.toLocaleString()}</strong> VIEWS
            </span>
            <span className="flex items-center gap-1.5 text-lanka-muted">
              <Download size={14} className="text-teal-400" />
              <strong className="text-white font-bold">{dataset.downloads.toLocaleString()}</strong> DOWNLOADS
            </span>
          </div>

          {/* Data Preview Table */}
          <div className="bg-[#050d1a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <span className="text-xs font-black text-white">Data Preview</span>
              <button className="text-[10px] font-bold text-cyan-400 hover:underline uppercase">View Fullscreen</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-lanka-border text-lanka-darkText font-bold bg-[#091122]/40">
                    {dataset.previewHeaders.map((h, i) => (
                      <th key={i} className="p-4 uppercase tracking-wider text-[10px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-lanka-border/50">
                  {dataset.previewRows.slice(0, expandedRows ? dataset.previewRows.length : 3).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      {dataset.previewHeaders.map((h, i) => {
                        const cellVal = row[h];
                        const isGrowthCell = h === 'GROWTH %';
                        const isNegative = String(cellVal).startsWith('-');
                        return (
                          <td 
                            key={i} 
                            className={`p-4 font-semibold ${
                              isGrowthCell 
                                ? isNegative ? 'text-lanka-rose' : 'text-lanka-cyan'
                                : 'text-slate-300'
                            }`}
                          >
                            {cellVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show more records toggle */}
            <div className="p-4 border-t border-lanka-border text-center bg-lanka-bg-light/10">
              <button 
                onClick={() => setExpandedRows(!expandedRows)}
                className="text-xs font-bold text-lanka-cyan hover:underline uppercase"
              >
                {expandedRows ? 'Show Less Records' : 'Show more records (45,000+ available)'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Downloads, Metadata, and Relationships */}
        <div className="space-y-5">
          
          {/* Download Resources Card */}
          <div className="bg-[#050d1a] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Download Resource</h3>
            
            {/* CSV File download link */}
            <div 
              onClick={() => handleDownload(`${dataset.id}.csv`)}
              className="flex items-center justify-between p-4 bg-lanka-blue/15 hover:bg-lanka-blue/20 border border-lanka-blue/35 rounded-xl cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-lanka-blue flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-lanka-cyan transition-colors truncate max-w-44">
                    {dataset.id.replace(/-/g, '_')}_2024.csv
                  </span>
                  <span className="text-[10px] text-lanka-muted block mt-0.5">12.4 MB • Updated 2h ago</span>
                </div>
              </div>
              <Download size={16} className="text-lanka-muted group-hover:text-white transition-colors" />
            </div>

            {/* Extra file types buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link 
                to="/documentation"
                className="flex items-center justify-center gap-1.5 bg-[#091122]/50 hover:bg-white/5 border border-lanka-border py-2 px-3 rounded-lg text-[10px] font-bold text-lanka-muted hover:text-white transition-colors"
              >
                <Key size={12} />
                <span>JSON API</span>
              </Link>
              <button 
                onClick={() => handleDownload(`${dataset.id}.sql`)}
                className="flex items-center justify-center gap-1.5 bg-[#091122]/50 hover:bg-white/5 border border-lanka-border py-2 px-3 rounded-lg text-[10px] font-bold text-lanka-muted hover:text-white transition-colors"
              >
                <Database size={12} />
                <span>SQL DUMP</span>
              </button>
            </div>
          </div>

          {/* Similar Datasets Card */}
          <div className="bg-[#050d1a] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Similar Datasets</h3>
            <div className="divide-y divide-lanka-border/50">
              {dataset.similarDatasets.map((d) => (
                <Link 
                  key={d.id} 
                  to={`/datasets/${d.id}`}
                  className="block py-3 first:pt-0 last:pb-0 hover:opacity-85 transition-opacity"
                >
                  <span className="text-xs font-bold text-white block">{d.title}</span>
                  <span className="text-[10px] text-lanka-muted block mt-0.5 line-clamp-1">{d.description}</span>
                </Link>
              ))}
            </div>
            <Link 
              to="/datasets" 
              className="text-[10px] font-bold text-lanka-cyan hover:underline uppercase flex items-center gap-1 pt-2 border-t border-lanka-border"
            >
              <span>View all related datasets</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          {/* Dataset Metadata Card */}
          <div className="bg-[#050d1a] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Dataset Metadata</h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">MAINTAINER</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <LayoutGrid size={12} className="text-lanka-cyan" />
                  {dataset.maintainer}
                </span>
              </div>
              
              <div>
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">FREQUENCY</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Clock size={12} className="text-lanka-teal" />
                  {dataset.frequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">COVERAGE</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Calendar size={12} className="text-lanka-muted" />
                  {dataset.coverage}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1.5">FORMAT</span>
                <div className="flex gap-1.5">
                  {dataset.formats.map((f, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-lanka-cyan bg-lanka-cyan-glow border border-lanka-cyan/20 px-1.5 py-0.5 rounded uppercase">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
