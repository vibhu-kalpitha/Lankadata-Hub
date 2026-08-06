import React, { useState } from 'react';
import { Compass, Trees, Waves, Mountain, ShieldCheck, Globe, Info } from 'lucide-react';
import { srilankaDistricts } from '../assets/srilankaDistrictsMapData';
import {
  srilankaPhysicalData,
  type RiverFeature,
  type ForestFeature,
  type PeakFeature
} from '../assets/srilankaPhysicalMapData';

export const SriLankaPhysicalMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'rivers' | 'forests' | 'peaks'>('all');
  const [hoveredFeature, setHoveredFeature] = useState<{
    title: string;
    subtitle: string;
    desc: string;
    type: 'river' | 'forest' | 'peak' | 'general';
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 w-full p-5 bg-[#050d1a]/90 border border-lanka-border rounded-2xl shadow-glass">
      {/* Map Section (Left of Right 50% Box) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative min-h-[360px]">
        {/* Layer Selector Pills */}
        <div className="flex items-center gap-1.5 mb-2 bg-[#091526]/80 p-1 rounded-xl border border-lanka-border/60 z-10 text-[10px] uppercase font-bold tracking-wider">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Features
          </button>
          <button
            onClick={() => setActiveTab('rivers')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'rivers' ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves size={10} /> Rivers
          </button>
          <button
            onClick={() => setActiveTab('forests')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'forests' ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees size={10} /> Forests
          </button>
          <button
            onClick={() => setActiveTab('peaks')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'peaks' ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mountain size={10} /> Peaks
          </button>
        </div>

        {/* Map Canvas */}
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-cyan-500/5 to-transparent filter blur-2xl pointer-events-none" />

          <svg
            viewBox="0 0 450 650"
            className="w-full max-w-[340px] h-[360px] transition-transform duration-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setHoveredFeature(null);
              setTooltipPos(null);
            }}
          >
            {/* Island Base Contour */}
            <g className="opacity-40">
              {srilankaDistricts.map((d) => (
                <path
                  key={d.id}
                  d={d.d}
                  className="fill-[#081b33] stroke-slate-700/50 stroke-[0.8]"
                />
              ))}
            </g>

            {/* Forest Reserve Polygons */}
            {(activeTab === 'all' || activeTab === 'forests') &&
              srilankaPhysicalData.forests.map((f: ForestFeature) => (
                <path
                  key={f.id}
                  d={f.d}
                  className="fill-emerald-500/40 stroke-emerald-400 stroke-2 hover:fill-emerald-400/70 hover:stroke-white transition-all cursor-pointer drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  onMouseEnter={() =>
                    setHoveredFeature({
                      title: f.name,
                      subtitle: `${f.type} • ${f.area}`,
                      desc: f.desc,
                      type: 'forest'
                    })
                  }
                />
              ))}

            {/* River Flow Vector Lines */}
            {(activeTab === 'all' || activeTab === 'rivers') &&
              srilankaPhysicalData.rivers.map((r: RiverFeature) => (
                <path
                  key={r.id}
                  d={r.d}
                  className="fill-none stroke-cyan-400 stroke-[3] stroke-round stroke-linejoin-round hover:stroke-white hover:stroke-[4] transition-all cursor-pointer drop-shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-pulse"
                  onMouseEnter={() =>
                    setHoveredFeature({
                      title: r.name,
                      subtitle: `River Length: ${r.length}`,
                      desc: r.desc,
                      type: 'river'
                    })
                  }
                />
              ))}

            {/* Mountain Peak Markers */}
            {(activeTab === 'all' || activeTab === 'peaks') &&
              srilankaPhysicalData.peaks.map((p: PeakFeature) => (
                <g
                  key={p.id}
                  className="cursor-pointer group"
                  onMouseEnter={() =>
                    setHoveredFeature({
                      title: p.name,
                      subtitle: p.elevation,
                      desc: 'Highest mountain summit in Central Highlands of Sri Lanka.',
                      type: 'peak'
                    })
                  }
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={6}
                    className="fill-amber-400/80 stroke-white stroke-2 group-hover:scale-125 transition-transform drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                  />
                  <polygon
                    points={`${p.x},${p.y - 12} ${p.x - 5},${p.y - 3} ${p.x + 5},${p.y - 3}`}
                    className="fill-amber-300"
                  />
                </g>
              ))}
          </svg>

          {/* Tooltip */}
          {hoveredFeature && tooltipPos && (
            <div
              className="fixed pointer-events-none z-50 px-3 py-1.5 bg-[#06162a]/95 border border-emerald-400/60 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.45)] backdrop-blur-md text-xs font-mono text-white select-none transition-transform duration-75"
              style={{
                left: `${tooltipPos.x + 14}px`,
                top: `${tooltipPos.y + 14}px`
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-emerald-300 text-sm tracking-tight">{hoveredFeature.title}</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-sans tracking-wide mt-0.5">
                {hoveredFeature.subtitle}
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 px-3.5 py-1 bg-[#091122]/90 border border-lanka-border rounded-full text-[10px] text-emerald-300 font-bold tracking-wider uppercase shadow-glass">
          <Compass size={11} className="text-emerald-400" />
          <span>Physical &amp; Natural Geography</span>
        </div>
      </div>

      {/* Details & Environmental Profile (Right of Right 50% Box) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
            Geography &amp; Ecosystems
          </span>
          <h3 className="text-2xl font-black text-white mt-1">Natural Geography</h3>
          <p className="text-xs text-lanka-muted mt-0.5">
            Key physical features, major river basins, forest reserves &amp; marine territory.
          </p>
        </div>

        {/* Feature Focus Box or Overview Grid */}
        {hoveredFeature ? (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 space-y-1.5 transition-all">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Feature Detail</span>
            <h4 className="text-base font-black text-white">{hoveredFeature.title}</h4>
            <span className="text-xs font-semibold text-emerald-300 block">{hoveredFeature.subtitle}</span>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">{hoveredFeature.desc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.04] border border-lanka-border rounded-xl p-3.5">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Total Land Area</span>
              <span className="text-base font-bold text-white">65,610 <span className="text-xs text-lanka-muted font-normal">km²</span></span>
            </div>

            <div className="bg-white/[0.04] border border-lanka-border rounded-xl p-3.5">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Marine Zone (EEZ)</span>
              <span className="text-base font-bold text-white">517,000 <span className="text-xs text-lanka-muted font-normal">km²</span></span>
            </div>

            <div className="bg-white/[0.04] border border-lanka-border rounded-xl p-3.5">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Longest River</span>
              <span className="text-sm font-bold text-white">Mahaweli <span className="text-xs text-lanka-muted font-normal">(335 km)</span></span>
            </div>

            <div className="bg-white/[0.04] border border-lanka-border rounded-xl p-3.5">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Highest Peak</span>
              <span className="text-sm font-bold text-white">Pidurutalagala <span className="text-xs text-lanka-muted font-normal">(2,524 m)</span></span>
            </div>
          </div>
        )}

        {/* Forest & Climate Badges */}
        <div className="bg-white/[0.04] border border-lanka-border rounded-xl p-3.5 space-y-2">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Forest &amp; Ecological Reserves</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              Sinharaja Rainforest (UNESCO)
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1e293b]/70 border border-slate-700/60 text-slate-200">
              Yala National Park
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1e293b]/70 border border-slate-700/60 text-slate-200">
              Wilpattu National Park
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1e293b]/70 border border-slate-700/60 text-slate-200">
              Knuckles Range
            </span>
          </div>
        </div>

        {/* Marine & Climate Specs */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-lanka-border/40">
          <div className="bg-white/[0.03] border border-lanka-border/80 rounded-xl p-2.5 flex items-center gap-2">
            <Globe size={14} className="text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Coastline</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">1,340 km Coast</span>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-lanka-border/80 rounded-xl p-2.5 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Forest Cover</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">~29.2% Land Area</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-lanka-darkText flex items-center gap-1">
          <Info size={10} />
          Hover map layers (Rivers, Forests, Mountain Peaks) to explore environmental data.
        </p>
      </div>
    </div>
  );
};
