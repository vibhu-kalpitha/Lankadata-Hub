import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../services/datasetService';
import { TrendingUp, Activity, CloudRain, Leaf, GraduationCap, Compass, Truck, ArrowRight } from 'lucide-react';

const catStyles: Record<string, { gradient: string; glow: string; iconColor: string; accent: string }> = {
  economy:        { gradient: 'from-blue-600/20 to-blue-900/5',    glow: 'hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]',   iconColor: 'text-blue-400',   accent: 'from-blue-500 to-cyan-400'    },
  health:         { gradient: 'from-rose-600/20 to-rose-900/5',    glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]',   iconColor: 'text-rose-400',   accent: 'from-rose-500 to-pink-400'    },
  weather:        { gradient: 'from-sky-600/20 to-sky-900/5',      glow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]',  iconColor: 'text-sky-400',    accent: 'from-sky-500 to-blue-400'     },
  agriculture:    { gradient: 'from-green-600/20 to-green-900/5',  glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]',   iconColor: 'text-green-400',  accent: 'from-green-500 to-teal-400'   },
  education:      { gradient: 'from-purple-600/20 to-purple-900/5',glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',  iconColor: 'text-purple-400', accent: 'from-purple-500 to-violet-400'},
  tourism:        { gradient: 'from-amber-600/20 to-amber-900/5',  glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]', iconColor: 'text-amber-400',  accent: 'from-amber-500 to-orange-400' },
  transportation: { gradient: 'from-orange-600/20 to-orange-900/5',glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]', iconColor: 'text-orange-400', accent: 'from-orange-500 to-red-400'   },
};

const getIcon = (name: string, color: string) => {
  const props = { size: 28, className: color };
  switch (name) {
    case 'TrendingUp':    return <TrendingUp    {...props} />;
    case 'Activity':      return <Activity       {...props} />;
    case 'CloudRain':     return <CloudRain      {...props} />;
    case 'Leaf':          return <Leaf           {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Compass':       return <Compass        {...props} />;
    case 'Truck':         return <Truck          {...props} />;
    default:              return <TrendingUp     {...props} />;
  }
};

export const Categories: React.FC = () => {
  return (
    <div className="flex-1 bg-lanka-bg min-h-screen">

      {/* ── Hero ───────────────────────────────────────── */}
      <div className="relative overflow-hidden py-8 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030b16] to-[#040c1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-3">
            Data Categories
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">
            Browse by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sector</span>
          </h1>
          <p className="text-xs text-lanka-muted max-w-lg mx-auto">
            Open datasets, dashboards, and APIs grouped by Sri Lanka's critical socio-economic sectors.
          </p>
        </div>
      </div>

      {/* ── Category Grid ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CATEGORIES.map(cat => {
            const style = catStyles[cat.id] || catStyles.economy;
            return (
              <Link key={cat.id} to={`/categories/${cat.id}`}
                className={`group relative bg-gradient-to-br ${style.gradient} border border-white/8 hover:border-white/20 rounded-2xl p-6 flex flex-col justify-between h-52 transition-all hover:scale-[1.02] ${style.glow} overflow-hidden`}>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* Large background icon */}
                <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  {getIcon(cat.iconName, style.iconColor)}
                </div>

                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/15 mb-4 group-hover:scale-110 transition-transform`}>
                    {getIcon(cat.iconName, style.iconColor)}
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">{cat.name}</h3>
                  <p className="text-[11px] text-lanka-muted leading-relaxed line-clamp-2">{cat.description}</p>
                </div>

                <div className="relative flex items-center justify-between pt-3 border-t border-white/8">
                  <span className="text-[10px] font-mono text-lanka-darkText">
                    {cat.count} datasets
                  </span>
                  <span className={`text-[11px] font-bold bg-gradient-to-r ${style.accent} bg-clip-text text-transparent flex items-center gap-1`}>
                    Explore <ArrowRight size={11} className="text-current group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-[#050d1a] border border-white/10 rounded-2xl p-10">
          <h3 className="text-xl font-black text-white mb-2">Don't see your sector?</h3>
          <p className="text-sm text-lanka-muted mb-6">Request a new dataset category or contribute data through our open data portal.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold px-8 py-3 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
            Request a Category <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
