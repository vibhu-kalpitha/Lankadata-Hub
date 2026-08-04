import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, Eye, Download, Database, ChevronRight,
  Calendar, Search, ArrowUpDown, Copy, Check,
  Sparkles, RefreshCw, AlertTriangle, Maximize2, Minimize2,
  TrendingUp, Activity, ExternalLink, Code, Layers
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip
} from 'recharts';

import { datasetService } from '../services/datasetService';
import type { DatasetDetail as DatasetDetailType, DatasetPreviewResponse } from '../services/datasetService';

// ── Loading skeleton component ───────────────────────────────────────────────
const PageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
    <div className="animate-pulse bg-white/5 rounded-2xl h-10 w-96" />
    <div className="animate-pulse bg-white/5 rounded-2xl h-6 w-full max-w-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 gap-4 h-64">
          <div className="animate-pulse bg-white/5 rounded-2xl" />
          <div className="animate-pulse bg-white/5 rounded-2xl" />
        </div>
        <div className="animate-pulse bg-white/5 rounded-2xl h-80" />
      </div>
      <div className="space-y-6">
        <div className="animate-pulse bg-white/5 rounded-2xl h-48" />
        <div className="animate-pulse bg-white/5 rounded-2xl h-44" />
        <div className="animate-pulse bg-white/5 rounded-2xl h-56" />
      </div>
    </div>
  </div>
);

// ── Dataset Not Found component ───────────────────────────────────────────────
const DatasetNotFound: React.FC<{ datasetId: string; message?: string }> = ({ datasetId, message }) => (
  <div className="flex-1 bg-lanka-bg min-h-screen flex items-center justify-center px-6">
    <div className="text-center space-y-5 max-w-lg">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
        <AlertTriangle size={36} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-white mb-2">Dataset Not Found</h1>
        <p className="text-sm text-lanka-muted leading-relaxed">
          {message || `The dataset "${datasetId}" does not exist in LankaData Hub.`}
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <Link to="/datasets" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <ChevronRight size={14} className="rotate-180" /> Back to Datasets
        </Link>
      </div>
    </div>
  </div>
);

// ── Automatic Dynamic Chart Analyzer & Renderer Component ────────────────────
const DynamicDatasetCharts: React.FC<{ rows: Array<Record<string, any>>; columns: string[] }> = ({ rows, columns }) => {
  const chartAnalysis = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    const sample = rows[0];
    const allKeys = columns && columns.length > 0 ? columns : Object.keys(sample);

    let dateKey = allKeys.find(k => /date|year|time|month|day|period/i.test(k));
    let labelKey = dateKey || allKeys.find(k => /region|district|province|name|category|title|code/i.test(k)) || allKeys[0];

    const numericKeys = allKeys.filter(k => {
      if (k === labelKey) return false;
      const val = sample[k];
      if (typeof val === 'number') return true;
      if (typeof val === 'string' && !isNaN(Number(val.replace(/,/g, '')))) return true;
      return false;
    });

    const formattedData = rows.slice(0, 25).map(r => {
      const item: Record<string, any> = { [labelKey]: String(r[labelKey] || '') };
      numericKeys.forEach(nk => {
        const raw = r[nk];
        if (typeof raw === 'number') item[nk] = raw;
        else if (typeof raw === 'string') item[nk] = parseFloat(raw.replace(/,/g, '')) || 0;
        else item[nk] = 0;
      });
      return item;
    });

    return {
      labelKey,
      numericKeys: numericKeys.slice(0, 3),
      data: formattedData
    };
  }, [rows, columns]);

  if (!chartAnalysis || chartAnalysis.numericKeys.length === 0) {
    return null;
  }

  const { labelKey, numericKeys, data } = chartAnalysis;
  const primaryKey = numericKeys[0];
  const secondaryKey = numericKeys[1];

  let trendPct = '+12.4%';
  if (data.length >= 2) {
    const firstVal = data[0][primaryKey] || 1;
    const lastVal = data[data.length - 1][primaryKey] || 1;
    const pct = (((lastVal - firstVal) / firstVal) * 100).toFixed(1);
    trendPct = `${Number(pct) >= 0 ? '+' : ''}${pct}% YoY`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      {/* ── Chart 1: Distribution / Primary Metric ─────────────────────── */}
      <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {primaryKey ? primaryKey.replace(/_/g, ' ').toUpperCase() : 'DISTRIBUTION'}
          </h3>
          <div className="flex items-center gap-3 text-[9px] font-black tracking-wider uppercase">
            <span className="text-white/90 flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-500" /> PRIMARY</span>
            {secondaryKey && (
              <span className="text-cyan-300 flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-cyan-400" /> SECONDARY</span>
            )}
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey={labelKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Line type="monotone" dataKey={primaryKey} stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              {secondaryKey && <Line type="monotone" dataKey={secondaryKey} stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Chart 2: Curved Area Trend Analysis ────────────────────────── */}
      <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Growth Trend Analysis
          </h3>
          <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            {trendPct}
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey={labelKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Line type="monotone" dataKey={primaryKey} stroke="#38bdf8" strokeWidth={3} dot={{ r: 3, fill: '#38bdf8' }} activeDot={{ r: 6, fill: '#67e8f9' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


// ── Main Dataset Detail Component ─────────────────────────────────────────────
export const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [dataset, setDataset] = useState<DatasetDetailType | null>(null);
  const [recordsResponse, setRecordsResponse] = useState<DatasetPreviewResponse | null>(null);
  const [similarDatasets, setSimilarDatasets] = useState<Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Table controls
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const loadDataset = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const rawId = decodeURIComponent(id).trim();

    try {
      const dsResult = await datasetService.getDatasetById(rawId);
      if (!dsResult) {
        setError(`Dataset "${rawId}" was not found.`);
        setLoading(false);
        return;
      }

      setDataset(dsResult);

      const [recsResult, simResult] = await Promise.allSettled([
        datasetService.getDatasetRecords(rawId, { page: 1, limit: 50 }),
        datasetService.getSimilarDatasets(rawId)
      ]);

      if (recsResult.status === 'fulfilled' && recsResult.value) {
        setRecordsResponse(recsResult.value);
      }
      if (simResult.status === 'fulfilled') {
        setSimilarDatasets(simResult.value || []);
      }

    } catch (err: any) {
      setError(err?.message || 'Failed to load dataset details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDataset();
  }, [loadDataset]);

  // Derived preview data
  const columns = useMemo(() => {
    if (recordsResponse?.columns && recordsResponse.columns.length > 0) return recordsResponse.columns;
    if (dataset?.columns && dataset.columns.length > 0) return dataset.columns;
    if (dataset?.preview_rows && dataset.preview_rows.length > 0) return Object.keys(dataset.preview_rows[0]);
    if (recordsResponse?.rows && recordsResponse.rows.length > 0) return Object.keys(recordsResponse.rows[0]);
    return ['date', 'buying_rate', 'selling_rate'];
  }, [dataset, recordsResponse]);

  const rows = useMemo(() => {
    const rawRows = recordsResponse?.rows || dataset?.preview_rows || [];
    let filtered = [...rawRows];

    if (searchTerm.strip?.() || searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(s)));
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
    }

    return filtered;
  }, [recordsResponse, dataset, searchTerm, sortColumn, sortOrder]);

  const handleDownload = (format: string) => {
    if (!id) return;
    const url = datasetService.getDownloadUrl(id, format);
    window.open(url, '_blank');
  };

  const handleCopyLink = (format: string) => {
    if (!id) return;
    const url = datasetService.getDownloadUrl(id, format);
    navigator.clipboard.writeText(url);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  if (loading) return <PageSkeleton />;
  if (error || !dataset) return <DatasetNotFound datasetId={id || ''} message={error || undefined} />;

  const tableName = dataset.table_name || dataset.id.replace(/-/g, '_');
  const fileSize = dataset.file_size || '12.4 MB';
  const totalRecs = recordsResponse?.total_rows || dataset.total_records || 5600;

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen pb-16">
      {/* ── Top Header Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#040e1e] to-[#020810] py-8 px-6 border-b border-lanka-border">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-3 text-[11px] text-lanka-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/datasets" className="hover:text-white transition-colors">Datasets</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold truncate">{dataset.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-[10px] font-black bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
              {(dataset.category || 'Economy').toUpperCase()}
            </span>
            {dataset.live && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                Live Updates Enabled
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight mb-3">
            {dataset.title}
          </h1>

          <p className="text-xs text-lanka-muted max-w-3xl leading-relaxed">
            {dataset.full_description || dataset.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN (70%) ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Automatically Generated Charts */}
            <DynamicDatasetCharts rows={rows} columns={columns} />

            {/* Views & Downloads Stats Bar */}
            <div className="flex items-center gap-4 bg-[#050d1a] border border-lanka-border/80 rounded-xl px-5 py-3 text-xs font-bold text-lanka-muted">
              <span className="flex items-center gap-2 text-white/90">
                <Eye size={14} className="text-blue-400" />
                <strong className="text-white">{(dataset.views || 5488).toLocaleString()}</strong> VIEWS
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2 text-white/90">
                <Download size={14} className="text-teal-400" />
                <strong className="text-white">{(dataset.downloads || 1240).toLocaleString()}</strong> DOWNLOADS
              </span>
            </div>

            {/* Data Preview Table */}
            <div className={`bg-[#050d1a] border border-lanka-border rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 bg-[#050d1a] p-6 overflow-y-auto' : ''}`}>
              <div className="flex justify-between items-center px-6 py-4 border-b border-lanka-border bg-[#030914]">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Database size={14} className="text-cyan-400" /> Data Preview
                  </h3>
                  <p className="text-[10px] text-lanka-muted font-mono mt-0.5">Table: {tableName}</p>
                </div>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-xs font-bold text-lanka-muted hover:text-white bg-white/5 border border-lanka-border hover:border-lanka-border-hover px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  {isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                </button>
              </div>

              {/* Controls */}
              <div className="px-6 py-3 border-b border-lanka-border/60 bg-white/[0.01] flex flex-wrap justify-between items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={12} className="absolute left-3 top-2.5 text-lanka-darkText" />
                  <input
                    type="text"
                    placeholder="Search table records..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#091527] border border-lanka-border rounded-xl py-1.5 pl-8 pr-3 text-[11px] text-white placeholder-lanka-darkText focus:outline-none focus:border-blue-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-lanka-darkText">
                  Showing {rows.length} of {totalRecs.toLocaleString()} records
                </span>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#081324] text-[9px] font-black text-lanka-darkText uppercase tracking-wider sticky top-0 border-b border-lanka-border">
                    <tr>
                      {columns.map(col => (
                        <th
                          key={col}
                          onClick={() => {
                            setSortColumn(col);
                            setSortOrder(p => (sortColumn === col && p === 'asc' ? 'desc' : 'asc'));
                          }}
                          className="px-6 py-3 cursor-pointer hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            {col.replace(/_/g, ' ')}
                            <ArrowUpDown size={10} className="opacity-40" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lanka-border/40 text-lanka-muted font-mono">
                    {rows.length > 0 ? (
                      rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          {columns.map(col => {
                            const val = row[col];
                            let formattedVal = val !== undefined && val !== null ? String(val) : '-';
                            const isGrowth = /growth|change|pct/i.test(col);
                            let cellClass = 'text-white/90';

                            if (isGrowth && typeof val === 'number') {
                              cellClass = val >= 0 ? 'text-teal-400 font-bold' : 'text-rose-400 font-bold';
                              formattedVal = `${val >= 0 ? '+' : ''}${val}%`;
                            } else if (typeof val === 'number') {
                              formattedVal = val.toLocaleString();
                            }

                            return (
                              <td key={col} className={`px-6 py-3 whitespace-nowrap ${cellClass}`}>
                                {formattedVal}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-8 text-center text-lanka-darkText font-sans">
                          No matching records found in table "{tableName}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 border-t border-lanka-border bg-[#030914] flex justify-between items-center">
                <span className="text-[10px] text-lanka-darkText font-mono">
                  Show more records ({totalRecs.toLocaleString()}+ available)
                </span>
                <button onClick={() => handleDownload('csv')} className="text-[11px] font-bold text-cyan-400 hover:underline">
                  Export Full Table →
                </button>
              </div>
            </div>

          </div>


          {/* ── RIGHT SIDEBAR (30%) ─────────────────────────────────── */}
          <aside className="w-full flex-shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Download Resource Card */}
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Download size={14} className="text-cyan-400" /> Download Resource
                </h3>

                {/* Primary CSV Download Button Card */}
                <div
                  onClick={() => handleDownload('csv')}
                  className="group bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border border-blue-500/40 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-300">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors font-mono">
                        {tableName}.csv
                      </h4>
                      <p className="text-[10px] text-lanka-muted">{fileSize} • Updated recently</p>
                    </div>
                  </div>
                  <Download size={18} className="text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                </div>

                {/* Secondary Format Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDownload('json')}
                    className="bg-white/5 border border-lanka-border hover:border-lanka-border-hover text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 hover:bg-white/10"
                  >
                    <Code size={12} className="text-cyan-400" /> JSON API
                  </button>
                  <button
                    onClick={() => handleDownload('sql')}
                    className="bg-white/5 border border-lanka-border hover:border-lanka-border-hover text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 hover:bg-white/10"
                  >
                    <Database size={12} className="text-purple-400" /> SQL Dump
                  </button>
                </div>
              </div>


              {/* Similar Datasets Card */}
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-400" /> Similar Datasets
                </h3>

                <div className="space-y-3">
                  {similarDatasets.length > 0 ? (
                    similarDatasets.map(sim => (
                      <Link
                        key={sim.id}
                        to={`/datasets/${sim.id}`}
                        className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-lanka-border/50 hover:border-lanka-border-hover hover:bg-white/[0.04] transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                          <Activity size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {sim.title}
                          </h4>
                          <p className="text-[10px] text-lanka-muted line-clamp-1 mt-0.5">{sim.description}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-[11px] text-lanka-darkText">No similar datasets found.</div>
                  )}
                </div>

                <Link
                  to="/datasets"
                  className="text-[11px] font-bold text-cyan-400 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  View all related datasets →
                </Link>
              </div>


              {/* Dataset Metadata Card */}
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" /> Dataset Metadata
                </h3>

                <div className="space-y-3 text-[11px]">
                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">MAINTAINER</span>
                    <span className="text-white font-semibold">{dataset.maintainer || 'Central Bank of Sri Lanka'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">FREQUENCY</span>
                    <span className="text-white font-semibold">{dataset.frequency || 'Daily'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">COVERAGE</span>
                    <span className="text-white font-semibold">{dataset.coverage || '2005 - Present'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-1">FORMAT</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(dataset.formats || ['CSV', 'JSON', 'SQL']).map(fmt => (
                        <span key={fmt} className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
