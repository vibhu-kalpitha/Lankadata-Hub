import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Database, LayoutGrid, Cpu, ArrowRight } from 'lucide-react';
import { datasetService, MOCK_CATEGORIES } from '../services/datasetService';
import type { Dataset } from '../services/datasetService';
import { dashboardService } from '../services/dashboardService';
import type { Dashboard } from '../services/dashboardService';
import { apiService } from '../services/apiService';
import type { ApiEndpoint } from '../services/apiService';

export const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'datasets' | 'dashboards' | 'apis'>('datasets');
  
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [apis, setApis] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = MOCK_CATEGORIES.find(c => c.id === id);

  useEffect(() => {
    if (!id || !categoryInfo) return;
    setLoading(true);

    const loadCategoryContent = async () => {
      // 1. Fetch datasets
      const dsRes = await datasetService.getDatasets({ category: categoryInfo.name, limit: 100 });
      setDatasets(dsRes.datasets);

      // 2. Fetch dashboards
      const dbRes = await dashboardService.getDashboards();
      const popRes = await dashboardService.getPopularDashboards();
      const matchedDbs = [...dbRes, ...popRes].filter(
        d => d.category.toLowerCase() === categoryInfo.name.toLowerCase()
      );
      setDashboards(matchedDbs);

      // 3. Fetch APIs
      const apiRes = await apiService.getApis();
      const matchedApis = apiRes.filter(
        a => a.category.toLowerCase() === categoryInfo.name.toLowerCase()
      );
      setApis(matchedApis);

      setLoading(false);
    };

    loadCategoryContent();
  }, [id, categoryInfo]);

  if (!categoryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 bg-lanka-bg grid-bg">
        <h2 className="text-xl font-bold text-white">Category Not Found</h2>
        <Link to="/categories" className="inline-block bg-lanka-blue text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-6">
      
      {/* Back Link */}
      <Link to="/categories" className="inline-flex items-center gap-2 text-xs font-semibold text-lanka-muted hover:text-white transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Categories</span>
      </Link>

      {/* Header */}
      <div className="border-b border-lanka-border pb-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight m-0">
          {categoryInfo.name} Sector
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted mt-2 leading-relaxed max-w-2xl">
          {categoryInfo.description}
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-lanka-border gap-4">
        <button
          onClick={() => setActiveTab('datasets')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'datasets' 
              ? 'text-lanka-cyan border-lanka-cyan' 
              : 'text-lanka-muted border-transparent hover:text-white'
          }`}
        >
          <Database size={14} />
          <span>Datasets ({datasets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboards')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'dashboards' 
              ? 'text-lanka-cyan border-lanka-cyan' 
              : 'text-lanka-muted border-transparent hover:text-white'
          }`}
        >
          <LayoutGrid size={14} />
          <span>Dashboards ({dashboards.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'apis' 
              ? 'text-lanka-cyan border-lanka-cyan' 
              : 'text-lanka-muted border-transparent hover:text-white'
          }`}
        >
          <Cpu size={14} />
          <span>Developer APIs ({apis.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-16 text-xs text-lanka-muted">Loading category contents...</div>
      ) : (
        <div className="pt-4">
          
          {/* Datasets panel */}
          {activeTab === 'datasets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.length > 0 ? (
                datasets.map((d) => (
                  <div key={d.id} className="glass-panel p-5 flex flex-col justify-between h-48 hover:scale-[1.01] transition-all">
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
                      <Link to={`/datasets/${d.id}`} className="text-xs font-bold text-lanka-blue-light hover:underline">
                        View Data
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-xs text-lanka-muted bg-lanka-card/35 rounded-xl border border-lanka-border">
                  No datasets published under this category.
                </div>
              )}
            </div>
          )}

          {/* Dashboards panel */}
          {activeTab === 'dashboards' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboards.length > 0 ? (
                dashboards.map((d) => (
                  <Link 
                    key={d.id} 
                    to={`/dashboards/${d.id}`} 
                    className="glass-panel p-5 space-y-3 hover:border-lanka-border-hover transition-colors"
                  >
                    <span className="text-[9px] font-bold text-lanka-blue-light bg-lanka-blue-glow px-2 py-0.5 rounded uppercase">
                      {d.category}
                    </span>
                    <h3 className="text-xs font-bold text-white leading-tight">{d.title}</h3>
                    <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{d.description}</p>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-xs text-lanka-muted bg-lanka-card/35 rounded-xl border border-lanka-border">
                  No dashboards created under this category.
                </div>
              )}
            </div>
          )}

          {/* APIs panel */}
          {activeTab === 'apis' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apis.length > 0 ? (
                apis.map((api) => (
                  <div key={api.id} className="glass-panel p-5 flex flex-col justify-between h-48 hover:border-lanka-border-hover transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-white bg-lanka-teal`}>
                            {api.method}
                          </span>
                          <span className="font-mono text-[10px] text-lanka-cyan font-semibold truncate max-w-44">
                            {api.endpoint}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-white">{api.title}</h3>
                      <p className="text-[11px] text-lanka-muted line-clamp-2 leading-relaxed">{api.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-lanka-border">
                      <span className="text-[10px] text-lanka-darkText">Auth Required</span>
                      <Link to={`/apis/${api.id}`} className="text-xs font-bold text-lanka-blue-light hover:underline flex items-center gap-1">
                        <span>View Documentation</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-xs text-lanka-muted bg-lanka-card/35 rounded-xl border border-lanka-border">
                  No developer REST APIs available under this category.
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CategoryDetail;
