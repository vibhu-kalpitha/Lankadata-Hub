import React, { useState } from 'react';
import { MapPin, Info, Users, Maximize2, Layers, Database, Clock } from 'lucide-react';
import type { Province } from '../services/provinceService';

interface SriLankaMapProps {
  compact?: boolean;
  mapOnly?: boolean;
  provinces?: Province[];
  selectedProvince?: Province | null;
  onHoverProvince?: (province: Province | null) => void;
  onSelectProvince?: (province: Province | null) => void;
}

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  compact = false,
  mapOnly = false,
  provinces = [],
  selectedProvince = null,
  onHoverProvince,
  onSelectProvince
}) => {
  // The SVG paths key off province names — map API name → SVG id
  const provinceIdMap: Record<string, string> = {
    'Western':       'LK-1',
    'Central':       'LK-2',
    'Southern':      'LK-3',
    'Northern':      'LK-4',
    'Eastern':       'LK-5',
    'North Western': 'LK-6',
    'North Central': 'LK-7',
    'Uva':           'LK-8',
    'Sabaragamuwa':  'LK-9',
  };

  // Default to Western province on load
  const defaultProvince = provinces.find(p => p.province === 'Western') ?? provinces[0] ?? null;
  const [internalHovered, setInternalHovered] = useState<Province | null>(defaultProvince);

  // Active province is selectedProvince if provided, otherwise internal state
  const activeProvince = selectedProvince ?? internalHovered;

  const handleHover = (data: Province) => {
    setInternalHovered(data);
    onHoverProvince?.(data);
  };

  const handleClick = (data: Province) => {
    setInternalHovered(data);
    onSelectProvince?.(data);
    onHoverProvince?.(data);
  };

  // Stylized SVG paths for Sri Lanka's 9 provinces (scaled for viewBox="0 0 300 450")
  const provincePaths = [
    {
      // Northern (Jaffna/Vavuniya)
      id: 'LK-4',
      d: 'M 115 25 L 140 10 L 155 35 L 175 40 L 160 85 L 140 90 L 125 75 L 110 50 Z M 100 12 L 115 5 L 125 15 L 110 20 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // North Central (Anuradhapura/Polonnaruwa)
      id: 'LK-7',
      d: 'M 110 90 L 140 90 L 160 85 L 195 110 L 180 165 L 150 170 L 130 145 L 115 130 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Eastern (Trinco/Batticaloa/Ampara)
      id: 'LK-5',
      d: 'M 195 110 L 210 135 L 215 170 L 235 220 L 230 260 L 215 295 L 185 270 L 190 230 L 175 195 L 180 165 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // North Western (Kurunegala/Puttalam)
      id: 'LK-6',
      d: 'M 110 90 L 115 130 L 130 145 L 125 190 L 100 200 L 80 190 L 85 140 L 95 115 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Central (Kandy/Nuwara Eliya)
      id: 'LK-2',
      d: 'M 130 145 L 150 170 L 180 165 L 175 195 L 190 230 L 175 255 L 150 250 L 135 210 L 125 190 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Western (Colombo/Gampaha/Kalutara)
      id: 'LK-1',
      d: 'M 100 200 L 125 190 L 135 210 L 130 250 L 125 285 L 105 305 L 90 280 L 95 240 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Sabaragamuwa (Ratnapura/Kegalle)
      id: 'LK-9',
      d: 'M 135 210 L 150 250 L 175 255 L 170 290 L 140 310 L 125 285 L 130 250 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Uva (Badulla/Moneragala)
      id: 'LK-8',
      d: 'M 190 230 L 185 270 L 215 295 L 195 340 L 170 330 L 170 290 L 175 255 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    },
    {
      // Southern (Galle/Matara/Hambantota)
      id: 'LK-3',
      d: 'M 125 285 L 140 310 L 170 290 L 170 330 L 195 340 L 180 365 L 145 365 L 115 340 L 105 305 Z',
      color: 'stroke-lanka-cyan/40 hover:fill-lanka-cyan/20 fill-lanka-blue-glow'
    }
  ];

  const getProvinceByPathId = (pathId: string): Province | undefined =>
    provinces.find(p => provinceIdMap[p.province] === pathId);

  const formatArea = (km2: number): string =>
    `${km2.toLocaleString()} km²`;

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between w-full h-full gap-3 p-3 select-none">
        {/* Map SVG */}
        <div className="w-full sm:w-1/2 flex justify-center relative min-h-[190px]">
          <svg
            viewBox="0 0 300 400"
            className="w-full h-[200px] drop-shadow-[0_0_15px_rgba(0,210,255,0.25)]"
          >
            {provincePaths.map((p) => {
              const data = getProvinceByPathId(p.id);
              const isSelected = activeProvince && provinceIdMap[activeProvince.province] === p.id;
              return (
                <path
                  key={p.id}
                  d={p.d}
                  className={`transition-all duration-300 stroke-2 cursor-pointer outline-none ${p.color} ${
                    isSelected ? 'fill-lanka-cyan/40 stroke-lanka-cyan scale-[1.03] transform-origin-center' : 'stroke-lanka-blue-light/30'
                  }`}
                  onMouseEnter={() => data && handleHover(data)}
                  onClick={() => data && handleClick(data)}
                />
              );
            })}
          </svg>
        </div>

        {/* Details Card on Right */}
        <div className="w-full sm:w-1/2 bg-[#07172b]/80 border border-lanka-border rounded-xl p-3 flex flex-col justify-between space-y-2 text-xs">
          {activeProvince && (
            <>
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">Province Profile</span>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-cyan-400 animate-pulse" />
                  {activeProvince.province} Province
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="bg-white/5 border border-lanka-border p-1.5 rounded-lg">
                  <span className="text-[8px] font-bold text-lanka-darkText block uppercase">Capital</span>
                  <span className="font-bold text-white truncate block">{activeProvince.provincial_capital}</span>
                </div>
                <div className="bg-white/5 border border-lanka-border p-1.5 rounded-lg">
                  <span className="text-[8px] font-bold text-lanka-darkText block uppercase">Area</span>
                  <span className="font-bold text-white truncate block">{formatArea(activeProvince.total_area_km2)}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-lanka-border p-1.5 rounded-lg text-[10px]">
                <span className="text-[8px] font-bold text-lanka-darkText block uppercase mb-0.5">Population</span>
                <span className="font-bold text-teal-400 flex items-center gap-1">
                  <Users size={11} /> {activeProvince.estimated_population}
                </span>
              </div>

              <div className="text-[9px] text-lanka-muted pt-1 border-t border-lanka-border/50">
                <span className="font-bold text-slate-300">Districts: </span>
                <span className="line-clamp-1">{activeProvince.districts_included.join(', ')}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Map-only mode: just the SVG, no surrounding panel ─────────────────────
  if (mapOnly) {
    return (
      <div className="relative flex justify-center w-full">
        <div className="absolute inset-0 bg-radial-gradient from-lanka-cyan-glow to-transparent filter blur-2xl opacity-30 pointer-events-none" />
        <svg
          viewBox="0 0 300 400"
          className="w-full max-w-[300px] sm:max-w-[340px] h-[340px] sm:h-[380px] transition-transform duration-300 drop-shadow-[0_0_18px_rgba(0,210,255,0.25)] hover:scale-[1.02]"
        >
          {provincePaths.map((p) => {
            const data = getProvinceByPathId(p.id);
            const isSelected = activeProvince && provinceIdMap[activeProvince.province] === p.id;
            return (
              <path
                key={p.id}
                d={p.d}
                className={`transition-all duration-300 stroke-2 cursor-pointer outline-none ${p.color} ${
                  isSelected ? 'fill-lanka-cyan/30 stroke-lanka-cyan' : 'stroke-lanka-blue-light/20'
                }`}
                onMouseEnter={() => data && handleHover(data)}
                onClick={() => data && handleClick(data)}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full p-6 glass-panel rounded-2xl">
      {/* Map Section */}
      <div className="w-full lg:w-1/2 flex justify-center relative">
        <div className="absolute inset-0 bg-radial-gradient from-lanka-cyan-glow to-transparent filter blur-2xl opacity-40 pointer-events-none"></div>
        <svg
          viewBox="0 0 300 400"
          className="w-72 h-[350px] transition-transform duration-300 drop-shadow-[0_0_12px_rgba(0,210,255,0.15)]"
        >
          {provincePaths.map((p) => {
            const data = getProvinceByPathId(p.id);
            const isSelected = activeProvince && provinceIdMap[activeProvince.province] === p.id;
            return (
              <path
                key={p.id}
                d={p.d}
                className={`transition-all duration-300 stroke-2 cursor-pointer outline-none ${p.color} ${
                  isSelected ? 'fill-lanka-cyan/30 stroke-lanka-cyan scale-[1.02] transform-origin-center' : 'stroke-lanka-blue-light/20'
                }`}
                onMouseEnter={() => data && handleHover(data)}
                onClick={() => data && handleClick(data)}
              />
            );
          })}
        </svg>
        <div className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 bg-[#091122]/90 border border-lanka-border rounded-full text-[10px] text-lanka-cyan font-bold tracking-wider uppercase">
          <Layers size={10} />
          <span>National Map Data</span>
        </div>
      </div>

      {/* Stats Detail Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        {activeProvince ? (
          <div className="space-y-4">
            <div className="border-b border-lanka-border pb-3">
              <span className="text-[10px] font-bold text-lanka-cyan uppercase tracking-wider">Province Profile</span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <MapPin size={18} className="text-lanka-cyan animate-pulse" />
                {activeProvince.province} Province
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3">
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">PROVINCIAL CAPITAL</span>
                <span className="text-sm font-bold text-white">{activeProvince.provincial_capital}</span>
              </div>
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3">
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">TOTAL AREA</span>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  <Maximize2 size={12} className="text-lanka-muted" />
                  {formatArea(activeProvince.total_area_km2)}
                </span>
              </div>
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3 col-span-2">
                <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">ESTIMATED POPULATION</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Users size={14} className="text-lanka-teal" />
                  {activeProvince.estimated_population} Residents
                </span>
              </div>
            </div>

            <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3">
              <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1.5">DISTRICTS INCLUDED</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProvince.districts_included.map((dist: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-[#1e293b]/55 border border-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full"
                  >
                    {dist}
                  </span>
                ))}
              </div>
            </div>

            {/* ── NEW: Data Source & Last Updated ──────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              {activeProvince.data_source && (
                <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3">
                  <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">DATA SOURCE</span>
                  <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Database size={11} className="text-lanka-muted shrink-0" />
                    {activeProvince.data_source}
                  </span>
                </div>
              )}
              {activeProvince.last_updated && (
                <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-3">
                  <span className="text-[10px] font-semibold text-lanka-darkText uppercase block mb-1">LAST UPDATED</span>
                  <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Clock size={11} className="text-lanka-muted shrink-0" />
                    {activeProvince.last_updated}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-lanka-darkText flex items-center gap-1 justify-center lg:justify-start">
              <Info size={10} />
              Hover/Click map regions to update provincial intelligence profiles.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-lanka-muted text-sm">
            Select a province on the map to explore demographic intelligence.
          </div>
        )}
      </div>
    </div>
  );
};
