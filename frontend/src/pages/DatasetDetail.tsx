import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, Eye, Download, Database, Key, ChevronRight, 
  Calendar, Clock, LineChart as LineIcon, Search, ArrowUpDown, 
  Copy, Check, Building2, Layers, Table as TableIcon, Sparkles, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';

import { datasetService } from '../services/datasetService';
import type { DatasetDetail as DatasetDetailType, DatasetPreviewResponse } from '../services/datasetService';
import { TableSkeleton, ChartSkeleton } from '../components/SkeletonLoader';

const CHART_COLORS = ['#38bdf8', '#10b981', '#3b82f6', '#a855f7', '#f59e0b'];

export const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<DatasetDetailType | null>(null);
  const [previewData, setPreviewData] = useState<DatasetPreviewResponse | null>(null);
  const [similarDatasets, setSimilarDatasets] = useState<Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedApi, setCopiedApi] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCurrentPage(1);
    setSearchTerm('');
    setSortColumn(null);

    Promise.all([
      datasetService.getDatasetById(id),
      datasetService.getDatasetPreview(id),
      datasetService.getSimilarDatasets(id)
    ]).then(([dsRes, prevRes, simRes]) => {
      setDataset(dsRes);
      setPreviewData(prevRes);
      setSimilarDatasets(simRes);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  // Dynamic Column & Chart Analytics Detection
  const columns = useMemo(() => {
    if (previewData?.columns && previewData.columns.length > 0) {
      return previewData.columns;
    }
    if (dataset?.columns && dataset.columns.length > 0) {
      return dataset.columns;
    }
    if (dataset?.previewHeaders && dataset.previewHeaders.length > 0) {
      return dataset.previewHeaders;
    }
    const rows = previewData?.rows || dataset?.previewRows || dataset?.preview_rows || [];
    return rows.length > 0 ? Object.keys(rows[0]) : [];
  }, [previewData, dataset]);

  const allRows = useMemo(() => {
    return previewData?.rows || dataset?.previewRows || dataset?.preview_rows || [];
  }, [previewData, dataset]);

  // Identify Date/Time column and Numeric columns automatically
  const { dateKey, numericKeys } = useMemo(() => {
    if (allRows.length === 0 || columns.length === 0) {
      return { dateKey: null, numericKeys: [] };
    }

    // Look for Date/Year/Time column
    let dateCol = columns.find(c => {
      const l = c.toLowerCase();
      return l.includes('date') || l.includes('year') || l.includes('month') || l.includes('time');
    });
    if (!dateCol) dateCol = columns[0];

    // Look for numeric columns
    const numCols = columns.filter(c => {
      if (c === dateCol) return false;
      return allRows.slice(0, 5).some(r => {
        const val = r[c];
        return typeof val === 'number' || (!isNaN(parseFloat(val)) && isFinite(val));
      });
    });

    return { dateKey: dateCol, numericKeys: numCols };
  }, [columns, allRows]);

  // Prepare chart data chronologically (reversed if date is descending)
  const chartData = useMemo(() => {
    if (!dateKey || numericKeys.length === 0 || allRows.length === 0) return [];
    
    const formatted = allRows.map(r => {
      const item: Record<string, any> = { date: r[dateKey] };
      numericKeys.forEach(k => {
        const v = r[k];
        item[k] = typeof v === 'number' ? v : parseFloat(v) || 0;
      });
      return item;
    });

    return [...formatted].reverse();
  }, [allRows, dateKey, numericKeys]);

  // Filtered & Sorted Table Rows
  const processedRows = useMemo(() => {
    let result = [...allRows];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => 
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }

    // Sort filter
    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
        return sortOrder === 'asc' 
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [allRows, searchTerm, sortColumn, sortOrder]);

  // Paginated Rows
  const totalTableRows = processedRows.length;
  const totalPages = Math.ceil(totalTableRows / pageSize);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, currentPage, pageSize]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  };

  const handleCopyApiUrl = () => {
    const url = `${window.location.origin}/api/datasets/${id}/preview`;
    navigator.clipboard.writeText(url);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2500);
  };

  const handleFileDownload = (format: string) => {
    const downloadUrl = datasetService.getDownloadUrl(id || '', format);
    window.open(downloadUrl, '_blank');
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
        <Link to="/datasets" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg">
          Back to Datasets
        </Link>
      </div>
    );
  }

  const maintainerName = dataset.source || dataset.maintainer || 'Central Bank of Sri Lanka';
  const totalRecords = dataset.total_records || allRows.length || 5620;
  const fileSize = dataset.file_size || '12.4 MB';

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">

      {/* ── Page Header Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-[#030c18] via-[#040e1c] to-[#020810]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-80 h-48 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-lanka-muted font-medium">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/datasets" className="hover:text-cyan-400 transition-colors">Datasets</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">{dataset.title}</span>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-[10px] font-black bg-blue-500/15 text-cyan-300 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <Building2 size={11} />
              {dataset.category}
            </span>
            {dataset.live && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                Live Feed Sync
              </div>
            )}
            <span className="text-[10px] text-lanka-muted flex items-center gap-1">
              <Clock size={11} className="text-cyan-400" />
              Frequency: <strong className="text-white font-semibold">{dataset.frequency}</strong>
            </span>
          </div>

          {/* Title and Short Description */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
            {dataset.title}
          </h1>
          <p className="text-xs sm:text-sm text-lanka-muted max-w-4xl leading-relaxed mb-6">
            {dataset.full_description || dataset.fullDescription || dataset.description}
          </p>

          {/* Metadata Highlights Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5 text-xs text-lanka-muted">
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-blue-400" />
              <span>Source: <strong className="text-white font-semibold">{maintainerName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-cyan-400" />
              <span>Coverage: <strong className="text-white font-semibold">{dataset.coverage}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TableIcon size={15} className="text-teal-400" />
              <span>Total Rows: <strong className="text-white font-semibold">{totalRecords.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-purple-400" />
              <span>Views: <strong className="text-white font-semibold">{dataset.views.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={15} className="text-amber-400" />
              <span>Downloads: <strong className="text-white font-semibold">{dataset.downloads.toLocaleString()}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Main Desktop 70/30 Grid Layout ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ════ LEFT COLUMN: 70% (Overview, Charts, Preview, Similar) ════ */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Dataset Overview Card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  Dataset Overview
                </h2>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  Verified Data Source
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">TOTAL ROWS</span>
                  <span className="text-sm font-black text-white">{totalRecords.toLocaleString()}</span>
                </div>
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">COLUMNS COUNT</span>
                  <span className="text-sm font-black text-cyan-400">{columns.length} Fields</span>
                </div>
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">FILE SIZE</span>
                  <span className="text-sm font-black text-teal-400">{fileSize}</span>
                </div>
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">UPDATE FREQUENCY</span>
                  <span className="text-sm font-bold text-white">{dataset.frequency}</span>
                </div>
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">TIME SPAN</span>
                  <span className="text-sm font-bold text-white">{dataset.coverage}</span>
                </div>
                <div className="bg-[#081326] border border-lanka-border/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-lanka-muted uppercase font-bold block">LAST UPDATED</span>
                  <span className="text-sm font-bold text-white">{dataset.updated_at || dataset.updatedAt || 'Today'}</span>
                </div>
              </div>

              {/* Column Schema Pill Tags */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-2">
                  DETECTED COLUMN SCHEMA
                </span>
                <div className="flex flex-wrap gap-2">
                  {columns.map((col, idx) => (
                    <span 
                      key={idx} 
                      className="text-[11px] font-semibold text-slate-200 bg-white/5 border border-lanka-border px-3 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Dynamic Auto-Generated Line Charts */}
            {chartData.length > 0 && numericKeys.length > 0 && (
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <LineIcon size={14} className="text-teal-400" />
                      Auto-Generated Interactive Charts
                    </h2>
                    <p className="text-[11px] text-lanka-muted mt-0.5">
                      Visualizing daily rates timeline ({dateKey} vs {numericKeys.join(', ')})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> Recharts Driven
                  </span>
                </div>

                <div className="h-80 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={['auto', 'auto']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0b1424', 
                          borderColor: '#1e293b', 
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#f8fafc'
                        }} 
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                      {numericKeys.map((key, i) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          name={key}
                          stroke={CHART_COLORS[i % CHART_COLORS.length]}
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 3. Dynamic Data Preview Table */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl overflow-hidden space-y-0">
              
              {/* Header & Controls Bar */}
              <div className="p-5 border-b border-lanka-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TableIcon size={14} className="text-cyan-400" />
                    Dataset Preview Table
                  </h2>
                  <span className="text-[10px] text-lanka-muted">
                    Showing {paginatedRows.length} of {totalTableRows} loaded records
                  </span>
                </div>

                {/* Search & Page Size Select */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-lanka-muted" />
                    <input 
                      type="text" 
                      placeholder="Search inside table..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#081326] border border-lanka-border text-xs text-white placeholder-lanka-muted pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-[#081326] border border-lanka-border text-xs text-white px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                  </select>
                </div>
              </div>

              {/* Table Container with Horizontal Scroll & Sticky Header */}
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#091326] border-b border-lanka-border z-10">
                    <tr>
                      {columns.map((col, idx) => (
                        <th 
                          key={idx} 
                          onClick={() => handleSort(col)}
                          className="p-3.5 uppercase tracking-wider text-[10px] font-bold text-lanka-darkText hover:text-white cursor-pointer select-none transition-colors"
                        >
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span>{col}</span>
                            <ArrowUpDown size={11} className={sortColumn === col ? 'text-cyan-400' : 'opacity-40'} />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lanka-border/40">
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-white/[0.04] transition-colors">
                          {columns.map((col, colIdx) => (
                            <td key={colIdx} className="p-3.5 text-slate-300 font-medium whitespace-nowrap">
                              {row[col] !== undefined && row[col] !== null ? String(row[col]) : '—'}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length || 1} className="p-8 text-center text-lanka-muted">
                          No matching records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-lanka-border flex justify-between items-center bg-[#070e1c] text-xs">
                  <span className="text-[11px] text-lanka-muted">
                    Page <strong className="text-white">{currentPage}</strong> of {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-lanka-border bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors text-[11px]"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg border border-lanka-border bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors text-[11px]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Similar Datasets Section */}
            {similarDatasets.length > 0 && (
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} className="text-cyan-400" />
                  Similar Category Datasets
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarDatasets.map((d) => (
                    <Link
                      key={d.id}
                      to={`/datasets/${d.id}`}
                      className="group bg-[#081326] border border-lanka-border hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-all"
                    >
                      <div>
                        <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                          {d.category}
                        </span>
                        <h3 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors mb-1">
                          {d.title}
                        </h3>
                        <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">
                          {d.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] text-lanka-muted">
                        <span>Updated: {d.updated_at || 'Recently'}</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          View Dataset <ChevronRight size={12} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ════ RIGHT COLUMN: 30% (Downloads, API Info, Sidebar Specs) ════ */}
          <div className="space-y-6">
            
            {/* Download Resources Card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Download size={14} className="text-teal-400" />
                  Download Resource
                </h3>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  {dataset.downloads.toLocaleString()} Downloads
                </span>
              </div>

              {/* Main CSV File Download Link */}
              <button 
                onClick={() => handleFileDownload('csv')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-cyan-500/40 rounded-xl cursor-pointer transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors truncate">
                      {dataset.id.replace(/-/g, '_')}.csv
                    </span>
                    <span className="text-[10px] text-lanka-muted block mt-0.5">{fileSize} • Full Daily Export</span>
                  </div>
                </div>
                <Download size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              </button>

              {/* Additional Export Format Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleFileDownload('json')}
                  className="flex items-center justify-center gap-2 bg-[#081326] hover:bg-white/5 border border-lanka-border py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-colors"
                >
                  <Key size={13} className="text-cyan-400" />
                  <span>JSON Format</span>
                </button>
                <button 
                  onClick={() => handleFileDownload('sql')}
                  className="flex items-center justify-center gap-2 bg-[#081326] hover:bg-white/5 border border-lanka-border py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-colors"
                >
                  <Database size={13} className="text-teal-400" />
                  <span>SQL Dump</span>
                </button>
              </div>

              {/* Copy API Link Button */}
              <button
                onClick={handleCopyApiUrl}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-lanka-border py-2.5 px-4 rounded-xl text-xs font-semibold text-lanka-muted hover:text-white transition-colors"
              >
                {copiedApi ? (
                  <>
                    <Check size={13} className="text-teal-400" />
                    <span className="text-teal-400 font-bold">API URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy REST API Endpoint URL</span>
                  </>
                )}
              </button>
            </div>

            {/* API Access Information Card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Key size={14} className="text-cyan-400" />
                REST API Integration
              </h3>
              <p className="text-[11px] text-lanka-muted leading-relaxed">
                Fetch live rows programmatically via JSON REST endpoint:
              </p>
              
              <div className="bg-[#030a14] border border-lanka-border rounded-xl p-3 text-[11px] font-mono text-cyan-300 break-all select-all">
                GET /api/datasets/{dataset.id}/preview
              </div>

              <Link 
                to="/documentation" 
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 uppercase pt-1"
              >
                <span>Read API documentation</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* Dataset Metadata Sidebar Card */}
            <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Building2 size={14} className="text-blue-400" />
                Publisher Metadata
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">
                    PUBLISHER / MAINTAINER
                  </span>
                  <span className="font-bold text-white flex items-center gap-2">
                    <Building2 size={13} className="text-cyan-400" />
                    {maintainerName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">
                    UPDATE FREQUENCY
                  </span>
                  <span className="font-bold text-white flex items-center gap-2">
                    <RefreshCw size={13} className="text-teal-400" />
                    {dataset.frequency}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">
                    HISTORICAL COVERAGE
                  </span>
                  <span className="font-bold text-white flex items-center gap-2">
                    <Calendar size={13} className="text-blue-400" />
                    {dataset.coverage}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">
                    LICENSE
                  </span>
                  <span className="font-semibold text-slate-300">
                    Creative Commons Attribution 4.0 (CC BY 4.0)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-lanka-darkText uppercase block mb-1">
                    AVAILABLE FORMATS
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(dataset.formats || ['CSV', 'JSON', 'SQL']).map((fmt, idx) => (
                      <span 
                        key={idx} 
                        className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded uppercase"
                      >
                        {fmt}
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
