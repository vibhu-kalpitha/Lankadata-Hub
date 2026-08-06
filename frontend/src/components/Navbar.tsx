import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { datasetService } from '../services/datasetService';
import { dashboardService } from '../services/dashboardService';
import { apiService } from '../services/apiService';

type SearchResults = {
  datasets: Array<{ id: string; title: string }>;
  dashboards: Array<{ id: string; title: string }>;
  apis: Array<{ id: string; title: string }>;
};

export const Navbar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({ datasets: [], dashboards: [], apis: [] });

  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced global search — all results from backend API
  const runSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setResults({ datasets: [], dashboards: [], apis: [] });
      return;
    }

    Promise.allSettled([
      datasetService.getDatasets({ search: query, limit: 3 }),
      dashboardService.searchDashboards(query, 3),
      apiService.searchApis(query, 3),
    ]).then(([dsResult, dbResult, apiResult]) => {
      const datasets =
        dsResult.status === 'fulfilled'
          ? (dsResult.value.datasets || []).slice(0, 3).map((d) => ({ id: d.id, title: d.title }))
          : [];
      const dashboards = dbResult.status === 'fulfilled' ? dbResult.value : [];
      const apis = apiResult.status === 'fulfilled' ? apiResult.value : [];
      setResults({ datasets, dashboards, apis });
    });
  }, []);

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => runSearch(searchQuery), 280);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [searchQuery, runSearch]);

  const handleResultClick = (type: string, id: string) => {
    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (type === 'dataset') navigate(`/datasets/${id}`);
    if (type === 'dashboard') navigate(`/dashboards/${id}`);
    if (type === 'api') navigate(`/apis/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/datasets?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const hasResults =
    results.datasets.length > 0 || results.dashboards.length > 0 || results.apis.length > 0;

  return (
    <nav className="sticky top-0 z-50 bg-[#070b13]/80 backdrop-blur-md border-b border-lanka-border shadow-glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
            <img
              src="/logo-mark.png"
              alt="LankaData Hub Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-lanka-cyan transition-colors">
            LankaData Hub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/datasets', label: 'Datasets' },
            { to: '/categories', label: 'Categories' },
            { to: '/dashboards', label: 'Dashboards' },
            { to: '/about', label: 'About' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-lanka-cyan border-b-2 border-lanka-cyan pb-1' : 'text-lanka-muted'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Input Container */}
          <div ref={searchRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search datasets, indicators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-56 bg-lanka-bg-light border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-full py-1.5 pl-4 pr-10 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue transition-all"
              />
              <button type="submit" className="absolute right-3 top-2 text-lanka-muted hover:text-white transition-colors">
                <Search size={14} />
              </button>
            </form>

            {/* Instant Search Results Dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute right-0 mt-2 w-80 bg-lanka-bg-light border border-lanka-border rounded-xl shadow-glass backdrop-blur-md overflow-hidden z-50">
                <div className="p-3 text-[10px] font-bold text-lanka-darkText tracking-wider uppercase border-b border-lanka-border">
                  Search Results
                </div>
                <div className="max-h-80 overflow-y-auto p-2 space-y-3">

                  {results.datasets.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-semibold text-lanka-cyan">DATASETS</div>
                      {results.datasets.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => handleResultClick('dataset', d.id)}
                          className="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs text-white truncate transition-colors"
                        >
                          {d.title}
                        </div>
                      ))}
                    </div>
                  )}

                  {results.dashboards.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-semibold text-lanka-teal">DASHBOARDS</div>
                      {results.dashboards.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => handleResultClick('dashboard', d.id)}
                          className="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs text-white truncate transition-colors"
                        >
                          {d.title}
                        </div>
                      ))}
                    </div>
                  )}

                  {results.apis.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-semibold text-purple-400">APIs</div>
                      {results.apis.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => handleResultClick('api', a.id)}
                          className="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs text-white truncate transition-colors"
                        >
                          {a.title}
                        </div>
                      ))}
                    </div>
                  )}

                  {!hasResults && (
                    <div className="text-center py-4 text-xs text-lanka-muted">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Log In & Sign Up buttons hidden for now */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-lanka-muted hover:text-white p-1"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-lanka-muted hover:text-white p-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden mt-3 px-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-lanka-bg-light border border-lanka-border rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:outline-none"
              autoFocus
            />
            <button type="submit" className="absolute right-3 top-2.5 text-lanka-muted">
              <Search size={16} />
            </button>
          </form>

          {searchQuery.trim() && (
            <div className="bg-lanka-bg-light border border-lanka-border rounded-lg mt-2 overflow-hidden shadow-glass max-h-60 overflow-y-auto">
              {results.datasets.map((d) => (
                <div key={d.id} onClick={() => handleResultClick('dataset', d.id)} className="p-3 text-xs text-white border-b border-lanka-border/50 cursor-pointer hover:bg-white/5">{d.title}</div>
              ))}
              {results.dashboards.map((d) => (
                <div key={d.id} onClick={() => handleResultClick('dashboard', d.id)} className="p-3 text-xs text-white border-b border-lanka-border/50 cursor-pointer hover:bg-white/5">{d.title}</div>
              ))}
              {results.apis.map((a) => (
                <div key={a.id} onClick={() => handleResultClick('api', a.id)} className="p-3 text-xs text-white border-b border-lanka-border/50 cursor-pointer hover:bg-white/5">{a.title}</div>
              ))}
              {!hasResults && (
                <div className="p-3 text-xs text-lanka-muted text-center">No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Nav Links */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full bg-lanka-bg-light border-b border-lanka-border p-6 flex flex-col gap-4 shadow-glass z-40">
          <Link to="/datasets"   onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-lanka-muted hover:text-white py-1">Datasets</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-lanka-muted hover:text-white py-1">Categories</Link>
          <Link to="/dashboards" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-lanka-muted hover:text-white py-1">Dashboards</Link>
          <Link to="/about"      onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-lanka-muted hover:text-white py-1">About</Link>
        </div>
      )}
    </nav>
  );
};
