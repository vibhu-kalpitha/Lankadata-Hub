import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, Eye, Download, Database, Key, ChevronRight,
  Calendar, Clock, Search, ArrowUpDown, Copy, Check,
  Building2, Layers, Table as TableIcon, Sparkles, RefreshCw,
  AlertTriangle, Loader2, LineChart as LineIcon
} from 'lucide-react';
import {
  LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

import { datasetService } from '../services/datasetService';
import type { DatasetDetail as DatasetDetailType, DatasetPreviewResponse } from '../services/datasetService';

// ── Loading skeleton components ───────────────────────────────────────────────
const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

const PageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
    <SkeletonBox className="h-8 w-64" />
    <SkeletonBox className="h-4 w-full max-w-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonBox className="h-40" />
        <SkeletonBox className="h-72" />
        <SkeletonBox className="h-72" />
        <SkeletonBox className="h-64" />
      </div>
      <div className="space-y-6">
        <SkeletonBox className="h-48" />
        <SkeletonBox className="h-40" />
        <SkeletonBox className="h-56" />
      </div>
    </div>
  </div>
);

// ── Dataset Not Found page ────────────────────────────────────────────────────
const DatasetNotFound: React.FC<{ datasetId: string; message?: string }> = ({ datasetId, message }) => (
  <div className="flex-1 bg-lanka-bg min-h-screen flex items-center justify-center px-6">
    <div className="text-center space-y-5 max-w-lg">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
        <AlertTriangle size={36} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-white mb-2">Dataset Not Found</h1>
        <p className="text-sm text-lanka-muted leading-relaxed">
          {message || `The dataset "${datasetId}" does not exist or has been removed from the database.`}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/datasets"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110 transition-all"
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to All Datasets
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white/5 border border-lanka-border text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

// ── Error page (API connection failure) ───────────────────────────────────────
const APIError: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex-1 bg-lanka-bg min-h-screen flex items-center justify-center px-6">
    <div className="text-center space-y-5 max-w-lg">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
        <AlertTriangle size={36} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-white mb-2">Connection Error</h1>
        <p className="text-sm text-lanka-muted leading-relaxed">{message}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
        >
          <RefreshCw size={14} />
          Retry
        </button>
        <Link
          to="/datasets"
          className="inline-flex items-center gap-2 bg-white/5 border border-lanka-border text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
        >
          Back to Datasets
        </Link>
      </div>
    </div>
  </div>
);

// ── Main Dataset Detail Component ─────────────────────────────────────────────
export const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // State
  const [dataset, setDataset] = useState<DatasetDetailType | null>(null);
  const [recordsResponse, setRecordsResponse] = useState<DatasetPreviewResponse | null>(null);
  const [similarDatasets, setSimilarDatasets] = useState<Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ type: 'not_found' | 'api_error'; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Table / UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [copiedApi, setCopiedApi] = useState(false);

  // ── Initial fetch: metadata + first page of records + similar datasets ──────
  const loadDataset = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setDataset(null);
    setRecordsResponse(null);
    setSimilarDatasets([]);
    setCurrentPage(1);
    setSearchTerm('');
    setSortColumn(null);

    const rawId = decodeURIComponent(id);

    try {
      // Fetch metadata first — this is the critical call that determines 404 vs success
      const dsResult = await datasetService.getDatasetById(rawId);

      if (!dsResult) {
        setError({ type: 'not_found', message: `Dataset "${rawId}" was not found in the database.` });
        setLoading(false);
        return;
      }

      setDataset(dsResult);

      // Fetch records and similar in parallel after confirming dataset exists
      const [recsResult, simResult] = await Promise.allSettled([
        datasetService.getDatasetRecords(rawId, { page: 1, limit: 100 }),
        datasetService.getSimilarDatasets(rawId)
      ]);

      if (recsResult.status === 'fulfilled' && recsResult.value) {
        setRecordsResponse(recsResult.value);
      }
      if (simResult.status === 'fulfilled') {
        setSimilarDatasets(simResult.value || []);
      }

    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setError({ type: 'not_found', message: `Dataset "${rawId}" was not found in the database.` });
      } else {
        setError({
          type: 'api_error',
          message: `Could not reach the LankaData Hub API. Please check your connection and try again. (${err?.message || 'Unknown error'})`
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, retryCount]); // retryCount triggers re-fetch

  useEffect(() => {
    loadDataset();
  }, [loadDataset]);

  // ── Subsequent records fetch (search / sort / page change) ──────────────────
  const fetchRecords = useCallback(async () => {
    if (!dataset || !id) return;
    const rawId = decodeURIComponent(id);
    try {
      const res = await datasetService.getDatasetRecords(rawId, {
        search: searchTerm.trim() || undefined,
        sort_by: sortColumn || undefined,
        sort_order: sortOrder,
        page: currentPage,
        limit: pageSize
      });
      if (res) setRecordsResponse(res);
    } catch {
      // Silent — already have initial records
    }
  }, [id, dataset, searchTerm, sortColumn, sortOrder, currentPage, pageSize]);

  useEffect(() => {
    if (dataset) fetchRecords();
  }, [fetchRecords, dataset]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    if (recordsResponse?.columns?.length) return recordsResponse.columns;
    if (dataset?.columns?.length) return dataset.columns;
    const rows = recordsResponse?.rows || dataset?.preview_rows || [];
    return rows.length > 0 ? Object.keys(rows[0]) : [];
  }, [recordsResponse, dataset]);

  const allRows = useMemo(
    () => recordsResponse?.rows || dataset?.preview_rows || [],
    [recordsResponse, dataset]
  );

  const { dateKey, numericKeys } = useMemo(() => {
    if (!allRows.length || !columns.length) return { dateKey: null, numericKeys: [] };
    const dateCol = columns.find(c => /date|year|month|time/i.test(c)) || columns[0];
    const numCols = columns.filter(c => {
      if (c === dateCol) return false;
      return allRows.slice(0, 5).some(r => {
        const v = r[c];
        return typeof v === 'number' || (!isNaN(parseFloat(v)) && isFinite(Number(v)));
      });
    });
    return { dateKey: dateCol, numericKeys: numCols };
  }, [columns, allRows]);

  const chartData = useMemo(() => {
    if (!dateKey || !numericKeys.length || !allRows.length) return [];
    return [...allRows].reverse().map(r => {
      const pt: Record<string, any> = { date: String(r[dateKey] ?? '') };
      numericKeys.forEach(k => { pt[k] = typeof r[k] === 'number' ? r[k] : parseFloat(r[k]) || 0; });
      return pt;
    });
  }, [allRows, dateKey, numericKeys]);

  const totalTableRows = recordsResponse?.total_rows ?? dataset?.total_records ?? allRows.length;
  const totalPages = Math.max(1, Math.ceil(totalTableRows / pageSize));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSort = (col: string) => {
    if (sortColumn === col) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortColumn(col); setSortOrder('asc'); }
  };

  const handleCopyApiUrl = () => {
    const cleanId = dataset?.id || id || '';
    navigator.clipboard.writeText(`${window.location.origin}/api/datasets/${cleanId}/records`);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2500);
  };

  const handleDownload = (format: string) => {
    const cleanId = dataset?.id || id || '';
    window.open(datasetService.getDownloadUrl(cleanId, format), '_blank');
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex-1 bg-lanka-bg min-h-screen">
      <div className="flex items-center justify-center py-8 gap-3 text-lanka-muted text-sm">
        <Loader2 size={18} className="animate-spin text-cyan-400" />
        Loading dataset from database…
      </div>
      <PageSkeleton />
    </div>
  );

  if (error) {
    if (error.type === 'not_found') {
      return <DatasetNotFound datasetId={decodeURIComponent(id || '')} message={error.message} />;
    }
    return <APIError message={error.message} onRetry={() => setRetryCount(c => c + 1)} />;
  }

  if (!dataset) {
    return <DatasetNotFound datasetId={decodeURIComponent(id || '')} />;
  }

  // ── Successful render ─────────────────────────────────────────────────────
  const maintainer = dataset.source || dataset.maintainer || 'Official Publisher';
  const totalRecords = dataset.total_records || recordsResponse?.total_rows || allRows.length;
  const fileSize = dataset.file_size || '—';
  const datasetIdClean = dataset.id;

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">

      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-[#030c18] to-[#020810]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-80 h-48 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-lanka-muted font-medium">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/datasets" className="hover:text-cyan-400 transition-colors">Datasets</Link>
            <ChevronRight size={11} />
            <span className="text-white font-bold">{dataset.title}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-[10px] font-black bg-blue-500/15 text-cyan-300 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <Building2 size={11} />
              {dataset.category || 'Economy'}
            </span>
            {dataset.live && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                Live Sync
              </div>
            )}
            <span className="text-[10px] text-lanka-muted flex items-center gap-1">
              <Clock size={11} className="text-cyan-400" />
              {dataset.frequency || 'Daily'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
            {dataset.title}
          </h1>
          <p className="text-xs sm:text-sm text-lanka-muted max-w-4xl leading-relaxed mb-6">
            {dataset.full_description || dataset.fullDescription || dataset.description}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5 text-xs text-lanka-muted">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              <span>Source: <strong className="text-white">{maintainer}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400" />
              <span>Coverage: <strong className="text-white">{dataset.coverage || 'Historical'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TableIcon size={14} className="text-teal-400" />
              <span>Records: <strong className="text-white">{totalRecords.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-purple-400" />
              <span>Views: <strong className="text-white">{(dataset.views || 0).toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={14} className="text-amber-400" />
              <span>Downloads: <strong className="text-white">{(dataset.downloads || 0).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 70/30 Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ═══ LEFT 70% ════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Overview metadata card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Layers size={13} className="text-cyan-400" /> Dataset Overview
                </h2>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  PostgreSQL
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'TOTAL RECORDS', value: totalRecords.toLocaleString(), color: 'text-white' },
                  { label: 'COLUMNS', value: `${columns.length} fields`, color: 'text-cyan-400' },
                  { label: 'FILE SIZE', value: fileSize, color: 'text-teal-400' },
                  { label: 'FREQUENCY', value: dataset.frequency || '—', color: 'text-white' },
                  { label: 'COVERAGE', value: dataset.coverage || '—', color: 'text-white' },
                  { label: 'LAST UPDATED', value: dataset.updated_at || dataset.updatedAt || 'Today', color: 'text-white' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-lanka-muted uppercase font-bold block">{label}</span>
                    <span className={`text-sm font-black ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Column schema pills */}
              {columns.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-2">COLUMN SCHEMA</span>
                  <div className="flex flex-wrap gap-2">
                    {columns.map((col, i) => (
                      <span key={i} className="text-[11px] font-semibold text-slate-200 bg-white/5 border border-lanka-border px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Auto-generated charts (only when data exists) */}
            {chartData.length > 0 && numericKeys.length > 0 && (
              <div className="space-y-6">
                {/* Dynamically generated individual line chart for every numeric column */}
                {numericKeys.map((numKey) => (
                  <div key={numKey} className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <LineIcon size={13} className="text-cyan-400" /> {dateKey} vs {numKey}
                        </h2>
                        <p className="text-[11px] text-lanka-muted mt-0.5">
                          Automated timeline chart for {numKey}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={11} /> Line Chart
                      </span>
                    </div>
                    <div className="h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{ backgroundColor: '#0b1424', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Line type="monotone" dataKey={numKey} name={numKey} stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}

                {/* Combined Line Chart if multiple numeric columns */}
                {numericKeys.length > 1 && (
                  <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <LineIcon size={13} className="text-cyan-400" /> Combined Rates Timeline
                        </h2>
                        <p className="text-[11px] text-lanka-muted mt-0.5">
                          {dateKey} vs {numericKeys.join(', ')}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={11} /> Overview Chart
                      </span>
                    </div>
                    <div className="h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{ backgroundColor: '#0b1424', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          {numericKeys.map((key, i) => (
                            <Line key={key} type="monotone" dataKey={key} name={key}
                              stroke={i === 0 ? '#38bdf8' : i === 1 ? '#0284c7' : '#06b6d4'} strokeWidth={2.5}
                              dot={{ r: 3 }} activeDot={{ r: 6 }} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Records Table */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-lanka-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TableIcon size={13} className="text-cyan-400" /> Database Records
                  </h2>
                  <span className="text-[10px] text-lanka-muted">
                    {allRows.length.toLocaleString()} of {totalRecords.toLocaleString()} total records
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-lanka-muted" />
                    <input
                      type="text"
                      placeholder="Search records…"
                      value={searchTerm}
                      onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#081326] border border-lanka-border text-xs text-white placeholder-lanka-muted pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-[#081326] border border-lanka-border text-xs text-white px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                  >
                    {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                {columns.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-[#091326] border-b border-lanka-border z-10">
                      <tr>
                        {columns.map((col, i) => (
                          <th key={i} onClick={() => handleSort(col)}
                            className="p-3.5 uppercase tracking-wider text-[10px] font-bold text-lanka-darkText hover:text-white cursor-pointer select-none transition-colors whitespace-nowrap">
                            <span className="flex items-center gap-1.5">
                              {col}
                              <ArrowUpDown size={11} className={sortColumn === col ? 'text-cyan-400' : 'opacity-30'} />
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lanka-border/40">
                      {allRows.length > 0 ? allRows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-white/[0.04] transition-colors">
                          {columns.map((col, ci) => (
                            <td key={ci} className="p-3.5 text-slate-300 font-medium whitespace-nowrap">
                              {row[col] !== undefined && row[col] !== null ? String(row[col]) : '—'}
                            </td>
                          ))}
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={columns.length} className="p-8 text-center text-lanka-muted text-xs">
                            No records match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-lanka-muted text-xs">
                    No records found in the database for this dataset.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-lanka-border flex justify-between items-center bg-[#070e1c] text-xs">
                  <span className="text-[11px] text-lanka-muted">
                    Page <strong className="text-white">{currentPage}</strong> of {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-lanka-border bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors text-[11px]">
                      Previous
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg border border-lanka-border bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors text-[11px]">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Similar Datasets */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Database size={13} className="text-cyan-400" /> Similar Datasets
              </h2>
              {similarDatasets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarDatasets.map(d => (
                    <Link key={d.id} to={`/datasets/${d.id}`}
                      className="group bg-[#081326] border border-lanka-border hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-all">
                      <div>
                        <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                          {d.category}
                        </span>
                        <h3 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors mb-1">{d.title}</h3>
                        <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] text-lanka-muted">
                        <span>Updated: {d.updated_at || 'Recently'}</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          View <ChevronRight size={11} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-lanka-border/60 rounded-xl text-lanka-muted text-xs">
                  No similar datasets found in the same category.
                </div>
              )}
            </div>
          </div>

          {/* ═══ RIGHT 30% ═══════════════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* Download card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Download size={13} className="text-teal-400" /> Download
                </h3>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  {(dataset.downloads || 0).toLocaleString()} downloads
                </span>
              </div>

              {/* CSV primary button */}
              <button onClick={() => handleDownload('csv')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-cyan-500/40 rounded-xl cursor-pointer transition-all group text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                      {datasetIdClean.replace(/-/g, '_')}.csv
                    </span>
                    <span className="text-[10px] text-lanka-muted">{fileSize} · CSV Format</span>
                  </div>
                </div>
                <Download size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>

              {/* JSON / SQL */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleDownload('json')}
                  className="flex items-center justify-center gap-2 bg-[#081326] hover:bg-white/5 border border-lanka-border py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-colors">
                  <Key size={12} className="text-cyan-400" /> JSON
                </button>
                <button onClick={() => handleDownload('sql')}
                  className="flex items-center justify-center gap-2 bg-[#081326] hover:bg-white/5 border border-lanka-border py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-colors">
                  <Database size={12} className="text-teal-400" /> SQL
                </button>
              </div>

              {/* Copy API URL */}
              <button onClick={handleCopyApiUrl}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-lanka-border py-2.5 px-4 rounded-xl text-xs font-semibold text-lanka-muted hover:text-white transition-colors">
                {copiedApi
                  ? <><Check size={12} className="text-teal-400" /><span className="text-teal-400 font-bold">URL Copied!</span></>
                  : <><Copy size={12} /> Copy REST API URL</>
                }
              </button>
            </div>

            {/* API snippet */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Key size={13} className="text-cyan-400" /> REST API
              </h3>
              <p className="text-[11px] text-lanka-muted leading-relaxed">
                Access live PostgreSQL records programmatically:
              </p>
              <div className="bg-[#030a14] border border-lanka-border rounded-xl p-3 text-[11px] font-mono text-cyan-300 break-all select-all">
                GET /api/datasets/{datasetIdClean}/records
              </div>
              <Link to="/documentation"
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 uppercase">
                Read API docs <ChevronRight size={11} />
              </Link>
            </div>

            {/* Metadata card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Building2 size={13} className="text-blue-400" /> Metadata
              </h3>
              <div className="space-y-4 text-xs">
                {[
                  { label: 'PUBLISHER', value: maintainer, icon: <Building2 size={12} className="text-cyan-400" /> },
                  { label: 'FREQUENCY', value: dataset.frequency || 'Daily', icon: <RefreshCw size={12} className="text-teal-400" /> },
                  { label: 'COVERAGE', value: dataset.coverage || '—', icon: <Calendar size={12} className="text-blue-400" /> },
                  { label: 'LICENSE', value: 'CC BY 4.0', icon: null },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">{label}</span>
                    <span className="font-bold text-white flex items-center gap-2">
                      {icon}{value}
                    </span>
                  </div>
                ))}
                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1.5">FORMATS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(dataset.formats || ['CSV', 'JSON', 'SQL']).map((f, i) => (
                      <span key={i} className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded uppercase">
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
