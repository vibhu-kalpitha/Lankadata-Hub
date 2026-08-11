import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Share2, FileText, ArrowRight, Award, User,
  ExternalLink, Eye, Copy, Check, X, Database, Layers,
  Building2, Globe, RefreshCw, ShieldCheck
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardDetail as DashboardDetailType } from '../services/dashboardService';
import { ChartSkeleton } from '../components/SkeletonLoader';

export const DashboardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dashboard, setDashboard] = useState<DashboardDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  const defaultMetabaseToken = "eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjJ9LCJwYXJhbXMiOnt9LCJpYXQiOjE3ODY0MzA0MDYsImV4cCI6MTc4NjQzMTAwNiwiX2VtYmVkZGluZ19wYXJhbXMiOnsiYmFua19uYW1lIjoiZW5hYmxlZCIsImJhbmsiOiJlbmFibGVkIiwic2VsZWN0X2JhbmsiOiJlbmFibGVkIn19.UbiEl_E4J6cOXhBve9GWWazMq3BBTlMReq2yX2BLZhY";

  useEffect(() => {
    // 1. Initialize Metabase Web Component Configuration
    (window as any).metabaseConfig = {
      theme: {
        preset: "dark"
      },
      isGuest: true,
      instanceUrl: "https://dashboard.lankadatahub.com"
    };

    // 2. Dynamically inject Metabase SDK Script
    const scriptId = 'metabase-embed-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://dashboard.lankadatahub.com/app/embed.js';
      script.defer = true;
      script.onerror = () => setUseIframeFallback(true);
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const targetId = id || 'usd-exchange-rates';

    dashboardService.getDashboardById(targetId).then((res: DashboardDetailType | null) => {
      if (res) {
        setDashboard(res);
      } else {
        // Fallback metadata for USD Exchange Rates dashboard if API returns null
        setDashboard({
          id: 'usd-exchange-rates',
          title: 'Sri Lanka USD Exchange Rates Intelligence Dashboard',
          description: 'Official real-time Central Bank of Sri Lanka (CBSL) USD/LKR exchange rates, buying/selling telemetry, historical rate fluctuations, and macroeconomic data streams.',
          category: 'Economy',
          author: 'Central Bank of Sri Lanka / LankaData Hub',
          live: true,
          featured: true,
          views: 14250,
          updatedAt: '2026-08-10',
          apiEndpoint: '/api/v1/todays-sri-lanka-stats'
        });
      }
      setLoading(false);
    });
  }, [id]);

  // Determine fallback iframe embed URL
  const getEmbedUrl = (): string => {
    return 'https://dashboard.lankadatahub.com/dashboard/2-sri-lanka-usd-exchange-rates';
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyApi = (apiPath: string) => {
    navigator.clipboard.writeText(`https://lankadatahub.com${apiPath}`);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 w-full bg-lanka-bg min-h-screen">
        <ChartSkeleton />
      </div>
    );
  }

  const embedUrl = getEmbedUrl();

  return (
    <div className="flex-1 bg-lanka-bg py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full min-h-screen">

      {/* ── Top Navigation & Meta Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboards"
            className="text-xs text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-lg transition-colors"
          >
            ← Back to Dashboards
          </Link>
          <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Action Controls: PDF Export & Share */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Export Dashboard as PDF or Print"
          >
            <FileText size={14} className="text-rose-400" />
            <span>Export as PDF</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/35 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-blue-glow active:scale-95"
          >
            <Share2 size={14} className="text-sky-400" />
            <span>Share Dashboard</span>
          </button>
        </div>
      </div>

      {/* ── Title Header ── */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="bg-blue-900/40 text-blue-300 border border-blue-700/40 px-2.5 py-0.5 rounded font-bold uppercase">
            {dashboard?.category || 'Economy'}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} className="text-slate-400" />
            {dashboard?.author || 'Central Bank of Sri Lanka'}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} className="text-slate-400" />
            {(dashboard?.views || 14250).toLocaleString()} Views
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            Updated: {dashboard?.updatedAt || 'Daily Auto-Sync'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          {dashboard?.title || 'Sri Lanka USD Exchange Rates Intelligence Dashboard'}
        </h1>
      </div>

      {/* ── FULL PAGE EMBEDDED DASHBOARD CONTAINER ── */}
      <div className="w-full bg-[#030914] border border-sky-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(14,165,233,0.12)] mb-10 relative group">

        {/* Top Control Bar for Embed */}
        <div className="bg-[#071325] border-b border-sky-500/20 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-white font-bold truncate">Metabase Embed Engine: dashboard.lankadatahub.com</span>
          </div>

          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
          >
            <span>Open Direct Link</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Metabase Web Component Embed Container taking FULL PAGE WIDTH */}
        <div className="w-full min-h-[650px] sm:min-h-[750px] md:min-h-[850px] bg-[#030914] relative">
          {!useIframeFallback ? (
            React.createElement('metabase-dashboard', {
              token: defaultMetabaseToken,
              'with-title': 'true',
              'with-downloads': 'true',
              style: { width: '100%', height: '850px', display: 'block', border: 'none' }
            })
          ) : (
            <iframe
              src={embedUrl}
              title={dashboard?.title || 'USD Exchange Rates Dashboard'}
              className="w-full h-[850px] border-0"
              allowFullScreen
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* ── METADATA OF DASHBOARD (SHOW UNDER DASHBOARD) ── */}
      <div className="space-y-8 bg-[#040e1d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Dashboard Metadata & Telemetry Specification</h2>
            <p className="text-xs text-slate-400">Detailed dataset metadata, parameters, sync frequency, and API endpoints.</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText size={14} />
            DASHBOARD OVERVIEW & SCOPE
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-[#07172b]/60 border border-sky-500/15 rounded-2xl p-5">
            {dashboard?.description || 'Comprehensive real-time Central Bank of Sri Lanka (CBSL) USD/LKR exchange rates, buying/selling telemetry, historical rate fluctuations, and macroeconomic data streams.'}
          </p>
        </div>

        {/* Technical Metadata Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">DATA SOURCE</span>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Building2 size={16} className="text-sky-400" />
              <span>Central Bank of Sri Lanka (CBSL)</span>
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Verified Official Telemetry Feed</span>
          </div>

          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">UPDATE FREQUENCY</span>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <RefreshCw size={16} className="text-emerald-400 animate-spin" />
              <span>Real-Time / Daily Auto-Sync</span>
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Automated Cron Pipeline Active</span>
          </div>

          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">COVERAGE & FREQUENCY</span>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Globe size={16} className="text-sky-400" />
              <span>Sri Lanka (National)</span>
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Daily Exchange Rates (USD/LKR)</span>
          </div>

          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">PUBLISHER & MAINTAINER</span>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>LankaData Hub Analytics</span>
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">Open Data Standard Spec 1.0</span>
          </div>

        </div>

        {/* Rest API Developer Endpoint Card */}
        <div className="bg-[#07172b] border border-sky-500/25 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={14} />
              DEVELOPER REST API STREAM
            </h3>
            <Link to="/apis" className="text-[10px] font-bold text-sky-400 hover:underline uppercase flex items-center gap-1">
              <span>View API Spec</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <p className="text-xs text-slate-300">
            Query raw structured JSON data stream for this dashboard programmatically:
          </p>

          <div className="flex items-center gap-3 bg-[#030914] border border-slate-800 p-3 rounded-xl font-mono text-xs text-sky-300 overflow-x-auto">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">GET</span>
            <span className="flex-1 truncate">https://lankadatahub.com{dashboard?.apiEndpoint || '/api/v1/todays-sri-lanka-stats'}</span>
            <button
              onClick={() => handleCopyApi(dashboard?.apiEndpoint || '/api/v1/todays-sri-lanka-stats')}
              className="px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
            >
              {copiedApi ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedApi ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        </div>

        {/* Related Datasets Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Award size={14} className="text-sky-400" />
            RELATED OPEN DATASET TABLES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Link
              to="/datasets/cbsl_usd_exchange_rates"
              className="bg-[#07162a]/70 hover:bg-[#091c36] border border-slate-800 hover:border-sky-500/40 p-4 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">POSTGRES TABLE</span>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300">cbsl_usd_exchange_rates</h4>
              <p className="text-[11px] text-slate-400 mt-1">Daily buying & selling rates from Central Bank of Sri Lanka.</p>
            </Link>

            <Link
              to="/datasets/colombo_stock_market_live"
              className="bg-[#07162a]/70 hover:bg-[#091c36] border border-slate-800 hover:border-sky-500/40 p-4 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">POSTGRES TABLE</span>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">colombo_stock_market_live</h4>
              <p className="text-[11px] text-slate-400 mt-1">CSE ASPI index, turnover LKR, volume traded, and trades count.</p>
            </Link>

            <Link
              to="/datasets/fuel_prices"
              className="bg-[#07162a]/70 hover:bg-[#091c36] border border-slate-800 hover:border-sky-500/40 p-4 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">POSTGRES TABLE</span>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300">fuel_prices</h4>
              <p className="text-[11px] text-slate-400 mt-1">Latest petroleum rates for 95 Octane, 92 Octane & Auto Diesel.</p>
            </Link>

          </div>
        </div>

      </div>

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07172c] border border-sky-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 size={18} className="text-sky-400" />
                Share Intelligence Dashboard
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Share standard open data dashboard link or copy embed token for research and analytical reporting.
            </p>

            {/* Direct URL Box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase">DIRECT LINK</label>
              <div className="flex items-center gap-2 bg-[#030914] border border-slate-800 p-2.5 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-xs text-slate-200 flex-1 outline-none font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Social Sharing Quick Buttons */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(dashboard?.title || 'Sri Lanka USD Exchange Rates Dashboard')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b1c33] hover:bg-sky-600/20 border border-sky-500/20 p-2.5 rounded-xl text-center text-xs font-bold text-sky-300 transition-colors"
              >
                Twitter / X
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b1c33] hover:bg-blue-600/20 border border-blue-500/20 p-2.5 rounded-xl text-center text-xs font-bold text-blue-300 transition-colors"
              >
                LinkedIn
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(dashboard?.title || 'Sri Lanka USD Exchange Rates Dashboard')}&body=${encodeURIComponent(window.location.href)}`}
                className="bg-[#0b1c33] hover:bg-slate-700/40 border border-slate-700 p-2.5 rounded-xl text-center text-xs font-bold text-slate-200 transition-colors"
              >
                Email
              </a>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardDetail;
