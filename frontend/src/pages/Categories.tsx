import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../services/datasetService';
import { TrendingUp, Activity, CloudRain, Leaf, GraduationCap, Compass, Truck } from 'lucide-react';

export const Categories: React.FC = () => {
  // Mapping string to lucide icons
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp size={24} className="text-lanka-cyan" />;
      case 'Activity': return <Activity size={24} className="text-lanka-rose" />;
      case 'CloudRain': return <CloudRain size={24} className="text-lanka-blue-light" />;
      case 'Leaf': return <Leaf size={24} className="text-lanka-teal" />;
      case 'GraduationCap': return <GraduationCap size={24} className="text-purple-400" />;
      case 'Compass': return <Compass size={24} className="text-amber-400" />;
      case 'Truck': return <Truck size={24} className="text-orange-400" />;
      default: return <TrendingUp size={24} className="text-lanka-cyan" />;
    }
  };

  return (
    <div className="flex-1 bg-lanka-bg py-12 px-6 max-w-7xl mx-auto w-full grid-bg space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
          Browse Categories
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted leading-relaxed">
          Access Sri Lankan open datasets, dashboards, and REST APIs grouped by critical socio-economic sectors.
        </p>
      </div>

      {/* Grid of categories cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {MOCK_CATEGORIES.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/categories/${cat.id}`}
            className="glass-panel p-6 flex flex-col justify-between h-48 hover:scale-[1.01] hover:shadow-cyan-glow transition-all"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-lanka-border flex items-center justify-center">
                  {getIcon(cat.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-none">{cat.name}</h3>
                  <span className="text-[9px] text-lanka-darkText uppercase tracking-wider block mt-1 font-mono">
                    {cat.count} Datasets
                  </span>
                </div>
              </div>
              <p className="text-xs text-lanka-muted leading-relaxed line-clamp-2">{cat.description}</p>
            </div>

            <div className="flex justify-end pt-3 border-t border-lanka-border">
              <span className="text-xs font-bold text-lanka-cyan hover:underline uppercase flex items-center gap-1">
                Explore Sector
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Categories;
