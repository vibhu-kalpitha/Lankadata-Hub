import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Database, Eye, Download, X } from 'lucide-react';
import { datasetService } from '../services/datasetService';
import type { Dataset, Category } from '../services/datasetService';
import { CardSkeleton } from '../components/SkeletonLoader';

const categoryColors: Record<string, string> = {
  economy:       'from-blue-500/20 to-blue-900/10 border-blue-500/30 text-blue-300',
  health:        'from-rose-500/20 to-rose-900/10 border-rose-500/30 text-rose-300',
  weather:       'from-sky-500/20 to-sky-900/10 border-sky-500/30 text-sky-300',
  agriculture:   'from-green-500/20 to-green-900/10 border-green-500/30 text-green-300',
  education:     'from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-300',
  tourism:       'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-300',
  transportation:'from-orange-500/20 to-orange-900/10 border-orange-500/30 text-orange-300',
};

export const Datasets: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'Latest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedFormat(searchParams.get('format') || '');
    setSortBy(searchParams.get('sortBy') || 'Latest');
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  useEffect(() => { datasetService.getCategories().then(c => setCategories(c)); }, []);

  useEffect(() => {
    setLoading(true);
    datasetService.getDatasets({ search: searchQuery, category: selectedCategory, format: selectedFormat, sortBy, page: currentPage, limit: 6 })
      .then(res => { setDatasets(res.datasets); setTotal(res.total); setTotalPages(res.pages); setLoading(false); });
  }, [searchQuery, selectedCategory, selectedFormat, sortBy, currentPage]);

  const updateFilters = (p: Record<string, string | number>) => {
    const u = new URLSearchParams(searchParams);
    Object.entries(p).forEach(([k, v]) => v === '' ? u.delete(k) : u.set(k, String(v)));
    setSearchParams(u);
  };

  const handleApply = () => updateFilters({ search: searchQuery, category: selectedCategory, format: selectedFormat, sortBy, page: 1 });
  const handleReset = () => { setSearchQuery(''); setSelectedCategory(''); setSelectedFormat(''); setSortBy('Latest'); setSearchParams({}); };
  const handlePage = (p: number) => { if (p < 1 || p > totalPages) return; updateFilters({ page: p }); };

  const catColor = (id: string) => categoryColors[id] || 'from-slate-500/20 to-slate-900/10 border-slate-500/30 text-slate-300';

  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">
      {/* ── Page Header Banner ─────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#040e1e] to-[#020810] py-8 px-6">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-64 h-40 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-2 text-[11px] text-lanka-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Datasets</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">
            Explore <span className="bg-gradient-to-r from-lanka-blue-light to-cyan-400 bg-clip-text text-transparent">Datasets</span>
          </h1>
          <p className="text-xs text-lanka-muted max-w-xl">
            Live and historical indicators from across Sri Lanka — curated for research, governance, and development.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-[#050d1a] border border-white/10 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal size={12} className="text-cyan-400" /> Filters
              </h3>
              <button onClick={handleReset} className="text-[10px] text-lanka-muted hover:text-red-400 transition-colors flex items-center gap-1">
                <X size={10} /> Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <p className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest mb-3">Category</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedCategory.toLowerCase() === cat.id ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}
                        onClick={() => setSelectedCategory(p => p === cat.id ? '' : cat.id)}>
                        {selectedCategory.toLowerCase() === cat.id && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`text-xs transition-colors ${selectedCategory.toLowerCase() === cat.id ? 'text-white font-semibold' : 'text-lanka-muted group-hover:text-white'}`}>{cat.name}</span>
                    </div>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-lg font-mono text-lanka-darkText">{cat.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <p className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest mb-3">Format</p>
              <div className="flex flex-wrap gap-2">
                {['CSV', 'JSON', 'API', 'Excel'].map(fmt => {
                  const active = selectedFormat.toLowerCase() === fmt.toLowerCase();
                  return (
                    <button key={fmt} onClick={() => setSelectedFormat(p => p.toLowerCase() === fmt.toLowerCase() ? '' : fmt)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all ${active ? 'bg-blue-600/30 border-blue-500 text-cyan-300 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-lanka-muted hover:border-white/30 hover:text-white'}`}>
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={handleApply}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────── */}
        <section className="flex-1 space-y-6">
          {/* Search + Sort bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-3.5 text-lanka-darkText" />
              <input type="text" placeholder="Search datasets (e.g. GDP, Fuel prices, Census)..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleApply()}
                className="w-full bg-[#050d1a] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div className="flex items-center gap-2 bg-[#050d1a] border border-white/10 rounded-xl px-3 py-1.5">
              <ArrowUpDown size={12} className="text-lanka-darkText" />
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); updateFilters({ sortBy: e.target.value, page: 1 }); }}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer">
                <option value="Latest">Latest</option>
                <option value="Most Popular">Most Popular</option>
                <option value="Most Downloaded">Most Downloaded</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
          ) : datasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {datasets.map(d => {
                const color = catColor(d.category.toLowerCase());
                return (
                  <div key={d.id}
                    className="group relative bg-gradient-to-br from-[#060f1e] to-[#040b16] border border-white/8 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between h-56 transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(37,99,235,0.12)] overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-28 h-28 bg-blue-600/5 group-hover:bg-blue-600/10 rounded-full blur-2xl transition-colors pointer-events-none" />
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-black bg-gradient-to-r ${color} border px-2.5 py-1 rounded-full uppercase tracking-wider`}>{d.category}</span>
                        {d.live && <span className="flex items-center gap-1 text-[9px] font-bold text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />LIVE</span>}
                      </div>
                      <h3 className="text-sm font-black text-white leading-tight mb-2">{d.title}</h3>
                      <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-4 text-[10px] text-lanka-darkText mb-3">
                        <span className="flex items-center gap-1"><Eye size={11} /> {d.views.toLocaleString()} views</span>
                        <span className="flex items-center gap-1"><Download size={11} /> {d.downloads.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Database size={11} /> {d.frequency}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/8">
                        <div className="flex gap-1.5">
                          {d.formats.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-[8px] font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded uppercase">{f}</span>
                          ))}
                        </div>
                        <Link to={`/datasets/${d.id}`} className="text-[11px] font-bold text-blue-400 hover:text-white flex items-center gap-1 transition-colors">
                          View Data <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#050d1a] border border-white/10 rounded-2xl">
              <Database size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-sm text-lanka-muted mb-3">No datasets matched your filters.</p>
              <button onClick={handleReset} className="text-xs font-bold text-cyan-400 hover:underline">Clear filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
                className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => handlePage(i + 1)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${i + 1 === currentPage ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-white/5 border-white/10 text-lanka-muted hover:border-white/30 hover:text-white'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Datasets;
