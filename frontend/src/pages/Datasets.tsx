import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { datasetService } from '../services/datasetService';
import type { Dataset, Category } from '../services/datasetService';
import { CardSkeleton } from '../components/SkeletonLoader';

export const Datasets: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // States mirroring URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'Latest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Sync state with url query parameters
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedFormat(searchParams.get('format') || '');
    setSortBy(searchParams.get('sortBy') || 'Latest');
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Load categories and datasets
  useEffect(() => {
    datasetService.getCategories().then(cats => setCategories(cats));
  }, []);

  useEffect(() => {
    setLoading(true);
    datasetService.getDatasets({
      search: searchQuery,
      category: selectedCategory,
      format: selectedFormat,
      sortBy: sortBy,
      page: currentPage,
      limit: 6
    }).then(res => {
      setDatasets(res.datasets);
      setTotal(res.total);
      setTotalPages(res.pages);
      setLoading(false);
    });
  }, [searchQuery, selectedCategory, selectedFormat, sortBy, currentPage]);

  const updateFilters = (newParams: Record<string, string | number>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '') {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });
    setSearchParams(updated);
  };

  const handleApplyFilters = () => {
    updateFilters({
      search: searchQuery,
      category: selectedCategory,
      format: selectedFormat,
      sortBy: sortBy,
      page: 1 // Reset to page 1 on filter
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedFormat('');
    setSortBy('Latest');
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateFilters({ page });
  };

  const handleCategoryCheckboxChange = (catId: string) => {
    setSelectedCategory(prev => (prev === catId ? '' : catId));
  };

  const handleFormatCheckboxChange = (format: string) => {
    setSelectedFormat(prev => (prev === format ? '' : format));
  };

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="glass-panel p-5 space-y-6">
            
            {/* Categories filter checklist */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-lanka-border pb-2">
                <SlidersHorizontal size={12} className="text-lanka-cyan" />
                <span>Categories</span>
              </h3>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center justify-between text-xs text-lanka-muted hover:text-white cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={selectedCategory.toLowerCase() === cat.id}
                        onChange={() => handleCategoryCheckboxChange(cat.id)}
                        className="rounded border-slate-700 bg-[#0c1422] text-lanka-blue focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="group-hover:text-white transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-[10px] bg-white/5 border border-lanka-border px-1.5 py-0.5 rounded font-mono">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Format filters */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-lanka-border pb-2">
                Data Format
              </h3>
              <div className="flex flex-wrap gap-2">
                {['CSV', 'JSON', 'API', 'Excel'].map((fmt) => {
                  const isChecked = selectedFormat.toLowerCase() === fmt.toLowerCase();
                  return (
                    <button
                      key={fmt}
                      onClick={() => handleFormatCheckboxChange(fmt)}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        isChecked 
                          ? 'bg-lanka-blue-glow border-lanka-blue text-lanka-cyan-glow text-white shadow-blue-glow' 
                          : 'bg-[#0a1122]/50 border-lanka-border text-lanka-muted hover:text-white hover:border-lanka-border-hover'
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-lanka-border">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-lanka-blue hover:bg-lanka-blue-hover text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-blue-glow active:scale-95"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-transparent hover:bg-white/5 text-lanka-muted hover:text-white text-xs font-semibold py-2.5 rounded-lg transition-colors border border-transparent hover:border-lanka-border"
              >
                Reset
              </button>
            </div>

          </div>
        </aside>

        {/* Right Side Content list */}
        <section className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white m-0 tracking-tight">Explore Datasets</h1>
              <p className="text-xs text-lanka-muted mt-1 leading-relaxed max-w-xl">
                Access thousands of live and historical indicators from across Sri Lanka, curated for research, governance, and development.
              </p>
            </div>
            
            {/* Sort options */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-[10px] font-bold text-lanka-darkText uppercase flex items-center gap-1">
                <ArrowUpDown size={10} />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateFilters({ sortBy: e.target.value, page: 1 });
                }}
                className="bg-[#0b1424] border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-lanka-blue"
              >
                <option value="Latest">Latest</option>
                <option value="Most Popular">Most Popular</option>
                <option value="Most Downloaded">Most Downloaded</option>
              </select>
            </div>
          </div>

          {/* Search bar inside lists panel */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search datasets (e.g. GDP, Fuel prices, Census)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full bg-lanka-bg-light/50 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue"
            />
            <Search size={16} className="absolute left-4 top-3.5 text-lanka-darkText" />
          </div>

          {/* Datasets Grid / Loading list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 4, 5].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : datasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.map((d) => (
                <div key={d.id} className="glass-panel p-5 flex flex-col justify-between h-56 hover:scale-[1.01] transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-bold bg-[#1e293b] border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full uppercase">
                        {d.category}
                      </span>
                      <span className="text-[9px] text-lanka-darkText">{d.updatedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-white truncate">{d.title}</h3>
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
                    <Link 
                      to={`/datasets/${d.id}`} 
                      className="text-xs font-bold text-lanka-blue-light hover:underline flex items-center gap-1 group"
                    >
                      <span>View Data</span>
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-lanka-card border border-lanka-border rounded-xl">
              <p className="text-sm text-lanka-muted">No datasets matched your query parameters.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-3 text-xs font-bold text-lanka-cyan hover:underline"
              >
                Clear Search & Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 pt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-lanka-border bg-lanka-card hover:bg-lanka-bg-light text-white disabled:opacity-30 disabled:hover:bg-lanka-card transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isSelected = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-lanka-blue border-lanka-blue text-white shadow-blue-glow' 
                        : 'bg-[#0a1122]/50 border-lanka-border text-lanka-muted hover:text-white hover:border-lanka-border-hover'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-lanka-border bg-lanka-card hover:bg-lanka-bg-light text-white disabled:opacity-30 disabled:hover:bg-lanka-card transition-colors"
              >
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
