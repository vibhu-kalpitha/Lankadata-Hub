import React, { useState } from 'react';
import { MapPin, Info, Users, Maximize2, Layers } from 'lucide-react';
import type { Province } from '../services/provinceService';
import { srilankaDistricts, type DistrictMapFeature } from '../assets/srilankaDistrictsMapData';

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
  // Default to Western province on load
  const defaultProvince = provinces.find(p => p.province === 'Western') ?? provinces[0] ?? null;
  const [internalHovered, setInternalHovered] = useState<Province | null>(defaultProvince);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictMapFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Active province is selectedProvince if provided, otherwise internal state
  const activeProvince = selectedProvince ?? internalHovered;

  const findProvinceObj = (provName: string): Province | null => {
    return provinces.find(p => p.province.toLowerCase() === provName.toLowerCase()) ?? null;
  };

  const handleMouseEnterDistrict = (dist: DistrictMapFeature, e: React.MouseEvent) => {
    setHoveredDistrict(dist);
    setTooltipPos({ x: e.clientX, y: e.clientY });

    const provObj = findProvinceObj(dist.province);
    if (provObj) {
      setInternalHovered(provObj);
      onHoverProvince?.(provObj);
    }
  };

  const handleMouseMoveDistrict = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeaveDistrict = () => {
    setHoveredDistrict(null);
    setTooltipPos(null);
  };

  const handleClickDistrict = (dist: DistrictMapFeature) => {
    const provObj = findProvinceObj(dist.province);
    if (provObj) {
      setInternalHovered(provObj);
      onSelectProvince?.(provObj);
      onHoverProvince?.(provObj);
    }
  };

  const formatArea = (km2: number): string => `${km2.toLocaleString()} km²`;

  // Render SVG Map Paths for 25 Districts (Real GeoJSON)
  const renderSvgMap = (svgClassName: string) => (
    <div className="relative w-full flex justify-center items-center">
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent filter blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 450 650"
        className={`${svgClassName} transition-transform duration-300 drop-shadow-[0_0_20px_rgba(0,210,255,0.25)]`}
      >
        <g className="cursor-pointer">
          {srilankaDistricts.map((d) => {
            const isHovered = hoveredDistrict?.id === d.id;
            const isSameProvince = activeProvince && activeProvince.province.toLowerCase() === d.province.toLowerCase();

            let fillStrokeClass = 'fill-[#0a1e38]/60 stroke-cyan-500/30 stroke-[1.2] hover:fill-cyan-500/30 hover:stroke-cyan-300';

            if (isHovered) {
              fillStrokeClass = 'fill-cyan-400/60 stroke-white stroke-[2.2] drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]';
            } else if (isSameProvince) {
              fillStrokeClass = 'fill-cyan-500/35 stroke-cyan-300 stroke-[1.8] drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]';
            }

            return (
              <path
                key={d.id}
                d={d.d}
                className={`transition-all duration-200 outline-none ${fillStrokeClass}`}
                onMouseEnter={(e) => handleMouseEnterDistrict(d, e)}
                onMouseMove={handleMouseMoveDistrict}
                onMouseLeave={handleMouseLeaveDistrict}
                onClick={() => handleClickDistrict(d)}
              />
            );
          })}
        </g>
      </svg>

      {/* Floating Cursor Tooltip */}
      {hoveredDistrict && tooltipPos && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-1.5 bg-[#06162a]/95 border border-cyan-400/60 rounded-xl shadow-[0_0_25px_rgba(0,210,255,0.45)] backdrop-blur-md text-xs font-mono text-white select-none transition-transform duration-75"
          style={{
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold text-cyan-300 text-sm tracking-tight">{hoveredDistrict.district}</span>
          </div>
          <span className="text-[10px] text-slate-300 block font-sans tracking-wide mt-0.5">
            {hoveredDistrict.province} Province
          </span>
        </div>
      )}
    </div>
  );

  // ── Compact Mode ──────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between w-full h-[260px] gap-3 p-3 select-none overflow-hidden">
        <div className="w-full sm:w-1/2 flex justify-center relative h-full">
          {renderSvgMap('w-full h-full')}
        </div>

        <div className="w-full sm:w-1/2 bg-[#07172b]/80 border border-lanka-border rounded-xl p-3 flex flex-col justify-between h-full space-y-2 text-xs overflow-hidden">
          {activeProvince && (
            <>
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block truncate">
                  {hoveredDistrict ? `${hoveredDistrict.district} District` : 'Province Profile'}
                </span>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5 truncate">
                  <MapPin size={13} className="text-cyan-400 animate-pulse shrink-0" />
                  {activeProvince.province}
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
                <span className="font-bold text-teal-400 flex items-center gap-1 truncate">
                  <Users size={11} className="shrink-0" /> {activeProvince.estimated_population}
                </span>
              </div>

              <div className="text-[9px] text-lanka-muted pt-1 border-t border-lanka-border/50 flex justify-between items-center">
                <span className="truncate max-w-[60%]">{activeProvince.districts_included.join(', ')}</span>
                <span className="text-[8px] text-slate-400 font-mono shrink-0">
                  {activeProvince.data_source || 'Census'} • {activeProvince.last_updated || '2023'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Map-only Mode ─────────────────────────────────────────────────────────
  if (mapOnly) {
    return renderSvgMap('w-full max-w-[340px] sm:max-w-[380px] h-[360px] sm:h-[420px] hover:scale-[1.01]');
  }

  // ── Full Panel Mode (STABLE FIXED HEIGHT — NO RESIZING ON HOVER) ─────────
  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full h-[450px] min-h-[450px] max-h-[450px] p-6 glass-panel rounded-2xl overflow-hidden">
      {/* Map Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between relative h-full">
        {renderSvgMap('w-full max-w-[320px] h-[350px]')}
        <div className="flex items-center gap-1.5 px-3.5 py-1 bg-[#091122]/90 border border-lanka-border rounded-full text-[10px] text-cyan-300 font-bold tracking-wider uppercase shadow-glass">
          <Layers size={11} className="text-cyan-400" />
          <span>Real GeoJSON Vector Map (25 Districts)</span>
        </div>
      </div>

      {/* Stats Detail Section — STABLE FIXED LAYOUT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between h-full space-y-3 overflow-hidden">
        {activeProvince ? (
          <div className="h-full flex flex-col justify-between space-y-3">
            {/* Header */}
            <div className="border-b border-lanka-border/60 pb-2.5 shrink-0">
              <span className="text-[10px] font-bold text-lanka-cyan uppercase tracking-widest block truncate">
                {hoveredDistrict ? `Hover Focus: ${hoveredDistrict.district} District` : 'Province Profile'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-0.5 truncate">
                <MapPin size={18} className="text-lanka-cyan animate-pulse shrink-0" />
                {activeProvince.province}
              </h3>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-2.5">
                <span className="text-[9px] font-semibold text-lanka-darkText uppercase block mb-0.5">CAPITAL</span>
                <span className="text-sm font-bold text-white truncate block">{activeProvince.provincial_capital}</span>
              </div>
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-2.5">
                <span className="text-[9px] font-semibold text-lanka-darkText uppercase block mb-0.5">TOTAL AREA</span>
                <span className="text-sm font-bold text-white flex items-center gap-1 truncate">
                  <Maximize2 size={11} className="text-lanka-muted shrink-0" />
                  {formatArea(activeProvince.total_area_km2)}
                </span>
              </div>
              <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-2.5 col-span-2">
                <span className="text-[9px] font-semibold text-lanka-darkText uppercase block mb-0.5">ESTIMATED POPULATION</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                  <Users size={13} className="text-lanka-teal shrink-0" />
                  {activeProvince.estimated_population} Residents
                </span>
              </div>
            </div>

            {/* Districts List (Fixed height scrollable container) */}
            <div className="bg-lanka-bg-light/50 border border-lanka-border rounded-xl p-2.5 flex-1 min-h-0 flex flex-col justify-center">
              <span className="text-[9px] font-semibold text-lanka-darkText uppercase block mb-1">CONSTITUENT DISTRICTS</span>
              <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[70px] pr-1">
                {activeProvince.districts_included.map((dist: string, idx: number) => {
                  const isCurDistrict = hoveredDistrict?.district.toLowerCase() === dist.toLowerCase();
                  return (
                    <span
                      key={idx}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
                        isCurDistrict
                          ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 scale-105'
                          : 'bg-[#1e293b]/55 border border-slate-700/50 text-slate-300'
                      }`}
                    >
                      {dist}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Footer Metadata Line in Corner (No Standalone Boxes) */}
            <div className="pt-2 border-t border-lanka-border/40 flex items-center justify-between text-[10px] text-lanka-darkText shrink-0">
              <span className="flex items-center gap-1 truncate max-w-[55%]">
                <Info size={10} className="shrink-0" />
                Hover districts to update
              </span>
              <span className="text-[9px] text-slate-400 font-mono shrink-0">
                Src: {activeProvince.data_source || 'Census'} • {activeProvince.last_updated || '2023'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-lanka-muted text-sm">
            Hover over any district on the map to explore demographic intelligence.
          </div>
        )}
      </div>
    </div>
  );
};
