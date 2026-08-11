import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, Eye, Download, Database, ChevronRight,
  Search, ArrowUpDown, Sparkles, AlertTriangle, Maximize2, Minimize2,
  Activity, Code, Layers, TrendingUp, TrendingDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip
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

// ── Automatic Dynamic Chart Generator Component ──────────────────────────────
const DynamicDatasetCharts: React.FC<{ rows: Array<Record<string, any>>; columns: string[]; primaryDateCol?: string }> = ({ rows, columns, primaryDateCol }) => {
  const chartConfigs = useMemo(() => {
    if (!rows || rows.length === 0 || !columns || columns.length === 0) return null;

    const sample = rows[0];
    const allKeys = columns.length > 0 ? columns : Object.keys(sample);

    // 1. Identify Date/Time column
    let dateKey = primaryDateCol && allKeys.includes(primaryDateCol) ? primaryDateCol : undefined;
    if (!dateKey) {
      dateKey = allKeys.find(k => /date|year|time|month|day|period|effective_date/i.test(k));
    }
    if (!dateKey) {
      dateKey = allKeys.find(k => {
        const val = String(sample[k] || '');
        return !isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.length === 4);
      });
    }

    // 2. Identify Numeric columns
    const numericKeys = allKeys.filter(k => {
      if (k === dateKey) return false;
      const val = sample[k];
      if (typeof val === 'number') return true;
      if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val.replace(/,/g, '')))) return true;
      return false;
    });

    // 3. Identify Categorical columns
    const categoricalKeys = allKeys.filter(k => k !== dateKey && !numericKeys.includes(k));

    // Prepare chart data rows (top 30 records)
    const chartData = rows.slice(0, 30).map((r, i) => {
      const item: Record<string, any> = { _index: i + 1 };
      allKeys.forEach(k => {
        const raw = r[k];
        if (numericKeys.includes(k)) {
          if (typeof raw === 'number') item[k] = raw;
          else if (typeof raw === 'string') item[k] = parseFloat(raw.replace(/,/g, '')) || 0;
          else item[k] = 0;
        } else {
          item[k] = raw !== undefined && raw !== null ? String(raw) : '';
        }
      });
      return item;
    });

    // Determine Chart 1 and Chart 2 algorithms based on column types
    let chart1: { type: 'line' | 'bar' | 'area' | 'pie'; xKey: string; yKeys: string[]; title: string } | null = null;
    let chart2: { type: 'line' | 'bar' | 'area' | 'pie'; xKey: string; yKeys: string[]; title: string } | null = null;

    if (dateKey && numericKeys.length > 0) {
      // Date + Numeric -> Line Chart & Area Chart
      chart1 = {
        type: 'line',
        xKey: dateKey,
        yKeys: numericKeys.slice(0, 2),
        title: `${numericKeys[0].replace(/_/g, ' ').toUpperCase()} OVER TIME`
      };

      if (numericKeys.length >= 2) {
        chart2 = {
          type: 'area',
          xKey: dateKey,
          yKeys: numericKeys.slice(0, 3),
          title: `METRIC TREND COMPARISON`
        };
      } else if (categoricalKeys.length > 0) {
        chart2 = {
          type: 'bar',
          xKey: categoricalKeys[0],
          yKeys: [numericKeys[0]],
          title: `${numericKeys[0].replace(/_/g, ' ').toUpperCase()} BY ${categoricalKeys[0].replace(/_/g, ' ').toUpperCase()}`
        };
      } else {
        chart2 = {
          type: 'bar',
          xKey: dateKey,
          yKeys: [numericKeys[0]],
          title: `PERIODIC DISTRIBUTION`
        };
      }
    } else if (categoricalKeys.length > 0 && numericKeys.length > 0) {
      // Category + Numeric -> Bar Chart / Pie Chart
      const catKey = categoricalKeys[0];
      const uniqueCats = Array.from(new Set(rows.map(r => String(r[catKey]))));

      chart1 = {
        type: 'bar',
        xKey: catKey,
        yKeys: [numericKeys[0]],
        title: `${numericKeys[0].replace(/_/g, ' ').toUpperCase()} BY ${catKey.replace(/_/g, ' ').toUpperCase()}`
      };

      if (uniqueCats.length <= 6) {
        chart2 = {
          type: 'pie',
          xKey: catKey,
          yKeys: [numericKeys[0]],
          title: `${catKey.replace(/_/g, ' ').toUpperCase()} SHARE`
        };
      } else {
        chart2 = {
          type: 'line',
          xKey: catKey,
          yKeys: numericKeys.slice(0, 2),
          title: `DISTRIBUTION CURVE`
        };
      }
    } else if (numericKeys.length >= 2) {
      // Multi-numeric -> Line & Area
      chart1 = {
        type: 'line',
        xKey: '_index',
        yKeys: [numericKeys[0], numericKeys[1]],
        title: `${numericKeys[0].replace(/_/g, ' ')} vs ${numericKeys[1].replace(/_/g, ' ')}`
      };
      chart2 = {
        type: 'area',
        xKey: '_index',
        yKeys: numericKeys.slice(0, 3),
        title: `NUMERIC SPECTRUM ANALYSIS`
      };
    } else if (numericKeys.length === 1) {
      chart1 = {
        type: 'line',
        xKey: '_index',
        yKeys: [numericKeys[0]],
        title: `${numericKeys[0].replace(/_/g, ' ').toUpperCase()} SEQUENCE`
      };
      chart2 = {
        type: 'bar',
        xKey: '_index',
        yKeys: [numericKeys[0]],
        title: `VALUE DISTRIBUTION`
      };
    }

    return { chartData, chart1, chart2 };
  }, [rows, columns, primaryDateCol]);

  if (!chartConfigs || !chartConfigs.chart1) return null;

  const COLORS = ['#3b82f6', '#38bdf8', '#2dd4bf', '#a855f7', '#f43f5e', '#fbbf24'];

  const renderSingleChart = (cfg: { type: 'line' | 'bar' | 'area' | 'pie'; xKey: string; yKeys: string[]; title: string }, index: number) => {
    const { chartData } = chartConfigs;

    return (
      <div key={index} className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-cyan-400'}`} />
            {cfg.title}
          </h3>
          <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
            Auto-{cfg.type}
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {cfg.type === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey={cfg.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                {cfg.yKeys.map((yK, i) => (
                  <Bar key={yK} dataKey={yK} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            ) : cfg.type === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey={cfg.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                {cfg.yKeys.map((yK, i) => (
                  <Area key={yK} type="monotone" dataKey={yK} stroke={COLORS[i % COLORS.length]} fill={`${COLORS[i % COLORS.length]}33`} strokeWidth={2} />
                ))}
              </AreaChart>
            ) : cfg.type === 'pie' ? (
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                <Pie data={chartData} dataKey={cfg.yKeys[0]} nameKey={cfg.xKey} cx="50%" cy="50%" outerRadius={70} fill="#3b82f6" labelLine={false}>
                  {chartData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey={cfg.xKey} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#091527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                {cfg.yKeys.map((yK, i) => (
                  <Line key={yK} type="monotone" dataKey={yK} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={false} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      {chartConfigs.chart1 && renderSingleChart(chartConfigs.chart1, 0)}
      {chartConfigs.chart2 && renderSingleChart(chartConfigs.chart2, 1)}
    </div>
  );
};

// ── Check if dataset is one of the 7 exchange rate tables ─────────────────────
const isExchangeRateDataset = (datasetId?: string, tableName?: string): boolean => {
  const normId = (datasetId || '').toLowerCase().replace(/-/g, '_');
  const normTable = (tableName || '').toLowerCase().replace(/-/g, '_');
  return normId.includes('usd_exchange_rates') || normTable.includes('usd_exchange_rates');
};

// ── Dedicated Google Finance Style Exchange Rate Component ────────────────────
const ExchangeRateFinanceChart: React.FC<{ rows: Array<Record<string, any>>; columns: string[] }> = ({ rows, columns }) => {
  const parsedData = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    const sample = rows[0];
    const keys = columns.length > 0 ? columns : Object.keys(sample);

    const dateKey = keys.find(k => /date|effective|record_date|time/i.test(k)) || keys[0];
    const buyKey = keys.find(k => /buy|buying/i.test(k));
    const sellKey = keys.find(k => /sell|selling/i.test(k));

    if (!buyKey && !sellKey) return null;

    // Process rows chronologically (oldest to newest)
    const formattedRows = [...rows].reverse().map(r => {
      const dVal = String(r[dateKey] || '');
      const bVal = parseFloat(String(r[buyKey || ''] || '0').replace(/,/g, '')) || 0;
      const sVal = parseFloat(String(r[sellKey || ''] || '0').replace(/,/g, '')) || 0;
      return {
        date: dVal,
        buying: bVal,
        selling: sVal,
        spread: sVal > 0 && bVal > 0 ? (sVal - bVal).toFixed(2) : '0.00'
      };
    }).filter(r => r.buying > 0 || r.selling > 0);

    if (formattedRows.length === 0) return null;

    // Latest (today) vs Previous (yesterday)
    const latest = formattedRows[formattedRows.length - 1];
    const prev = formattedRows.length >= 2 ? formattedRows[formattedRows.length - 2] : latest;

    const buyDiff = latest.buying - prev.buying;
    const buyPct = prev.buying > 0 ? ((buyDiff / prev.buying) * 100).toFixed(2) : '0.00';

    const sellDiff = latest.selling - prev.selling;
    const sellPct = prev.selling > 0 ? ((sellDiff / prev.selling) * 100).toFixed(2) : '0.00';

    return {
      chartData: formattedRows,
      latest,
      buyTrend: { diff: buyDiff, pct: buyPct, isUp: buyDiff >= 0 },
      sellTrend: { diff: sellDiff, pct: sellPct, isUp: sellDiff >= 0 }
    };
  }, [rows, columns]);

  if (!parsedData) return null;

  const { chartData, latest, buyTrend, sellTrend } = parsedData;

  return (
    <div className="space-y-6 mb-6">
      
      {/* ── TODAY'S BUYING & SELLING DEV BOXES (UP: GREEN, DOWN: RED) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Today's Buying Price */}
        <div className="bg-[#051428] border border-sky-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">TODAY'S BUYING PRICE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.buying.toFixed(2)}</span>
            <span className="text-xs font-mono font-bold text-slate-400">LKR</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
              buyTrend.isUp
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              {buyTrend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {buyTrend.isUp ? '+' : ''}{buyTrend.diff.toFixed(2)} LKR ({buyTrend.pct}%)
            </span>
          </div>
        </div>

        {/* Today's Selling Price */}
        <div className="bg-[#051428] border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">TODAY'S SELLING PRICE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.selling.toFixed(2)}</span>
            <span className="text-xs font-mono font-bold text-slate-400">LKR</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
              sellTrend.isUp
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              {sellTrend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {sellTrend.isUp ? '+' : ''}{sellTrend.diff.toFixed(2)} LKR ({sellTrend.pct}%)
            </span>
          </div>
        </div>

        {/* Market Spread / Mid-Rate */}
        <div className="bg-[#051428] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">BANK SPREAD</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latest.spread}</span>
            <span className="text-xs font-mono font-bold text-slate-400">LKR</span>
          </div>
          <div className="mt-3 text-[10px] font-mono text-slate-400">
            Latest Record Date: <span className="text-white font-bold">{latest.date}</span>
          </div>
        </div>

      </div>

      {/* ── GOOGLE FINANCE STYLE DUAL LINE CHART ── */}
      <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-sky-400" />
              BUYING & SELLING EXCHANGE RATE HISTORICAL TREND
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Google Finance Interactive Comparison (USD to LKR)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span className="text-slate-300 font-bold">Buying Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-bold">Selling Rate</span>
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="buyingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="sellingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#040d1a', borderColor: '#1e293b', borderRadius: '16px', fontSize: '11px', color: '#fff' }} />
              <Area type="monotone" dataKey="buying" name="Buying Rate (LKR)" stroke="#38bdf8" strokeWidth={3} fill="url(#buyingGrad)" />
              <Area type="monotone" dataKey="selling" name="Selling Rate (LKR)" stroke="#10b981" strokeWidth={3} fill="url(#sellingGrad)" />
            </AreaChart>
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

  // Table controls
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    return [];
  }, [dataset, recordsResponse]);

  const rows = useMemo(() => {
    const rawRows = recordsResponse?.rows || dataset?.preview_rows || [];
    let filtered = [...rawRows];

    if (searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
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

  if (loading) return <PageSkeleton />;
  if (error || !dataset) return <DatasetNotFound datasetId={id || ''} message={error || undefined} />;

  const tableName = dataset.table_name || dataset.id.replace(/-/g, '_');
  const fileSize = dataset.file_size || '0 KB';
  const totalRecs = recordsResponse?.total_rows || dataset.total_records || rows.length;

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

            {/* Exchange Rate Finance Charts or Generic Charts */}
            {isExchangeRateDataset(dataset.id, dataset.table_name) ? (
              <ExchangeRateFinanceChart rows={rows} columns={columns} />
            ) : (
              <DynamicDatasetCharts rows={rows} columns={columns} primaryDateCol={dataset.primary_date_column} />
            )}

            {/* Views & Downloads Stats Bar */}
            <div className="flex items-center gap-4 bg-[#050d1a] border border-lanka-border/80 rounded-xl px-5 py-3 text-xs font-bold text-lanka-muted">
              <span className="flex items-center gap-2 text-white/90">
                <Eye size={14} className="text-blue-400" />
                <strong className="text-white">{(dataset.views || 0).toLocaleString()}</strong> VIEWS
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2 text-white/90">
                <Download size={14} className="text-teal-400" />
                <strong className="text-white">{(dataset.downloads || 0).toLocaleString()}</strong> DOWNLOADS
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
                        <td colSpan={columns.length || 1} className="px-6 py-8 text-center text-lanka-darkText font-sans">
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


              {/* Dataset Metadata Card */}
              <div className="bg-[#050d1a] border border-lanka-border rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" /> Dataset Metadata
                </h3>

                <div className="space-y-3 text-[11px]">
                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">TITLE</span>
                    <span className="text-white font-semibold">{dataset.title}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">DESCRIPTION</span>
                    <span className="text-lanka-muted leading-relaxed">{dataset.description}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">MAINTAINER</span>
                    <span className="text-white font-semibold">{dataset.maintainer || 'Central Bank of Sri Lanka'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">SOURCE</span>
                    <span className="text-white font-semibold">{dataset.source || 'Official Publisher'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">FREQUENCY</span>
                    <span className="text-white font-semibold">{dataset.frequency || 'Daily'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">COVERAGE</span>
                    <span className="text-white font-semibold">{dataset.coverage || 'Historical'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-1">FORMATS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(dataset.formats || ['CSV', 'JSON', 'SQL', 'API']).map(fmt => (
                        <span key={fmt} className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-lanka-border/50">
                    <div>
                      <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">TOTAL RECORDS</span>
                      <span className="text-teal-400 font-mono font-bold">{totalRecs.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">FILE SIZE</span>
                      <span className="text-teal-400 font-mono font-bold">{fileSize}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-lanka-border/50">
                    <div>
                      <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">VIEWS</span>
                      <span className="text-blue-400 font-mono font-bold">{(dataset.views || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-lanka-darkText uppercase block mb-0.5">DOWNLOADS</span>
                      <span className="text-blue-400 font-mono font-bold">{(dataset.downloads || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-lanka-border/50 text-[10px] text-lanka-darkText space-y-1 font-mono">
                    {dataset.created_at && (
                      <div className="flex items-center justify-between">
                        <span>Created:</span>
                        <span className="text-lanka-muted">{dataset.created_at}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Updated:</span>
                      <span className="text-lanka-muted">{dataset.updated_at || dataset.updatedAt || 'Recently'}</span>
                    </div>
                  </div>
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
                    <div className="text-[11px] text-lanka-darkText">No similar datasets found in this category.</div>
                  )}
                </div>

                <Link
                  to="/datasets"
                  className="text-[11px] font-bold text-cyan-400 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  View all related datasets →
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
