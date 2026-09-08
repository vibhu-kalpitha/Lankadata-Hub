import React, { useState, useRef, useEffect } from "react";
import { metroRoutes } from "../../data/metroRoutes";
import { metroStations } from "../../data/metroStations";
import { RouteLayer } from "./RouteLayer";
import { StationLayer } from "./StationLayer";
import { Legend } from "./Legend";
import "./MetroNetworkMap.css";

export const MetroNetworkMap = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [hoveredRouteId, setHoveredRouteId] = useState(null);
  const [hoveredStation, setHoveredStation] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const routesList = Object.values(metroRoutes);
  const containerRef = useRef(null);

  const activeRouteId = hoveredRouteId || selectedRouteId;
  const activeRoute = activeRouteId ? metroRoutes[activeRouteId] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`metro-map-wrapper ${isFullscreen ? "fullscreen" : ""}`}
    >
      {/* Control Top Bar with Fullscreen Toggle */}
      <div className="map-top-bar px-4 py-2 bg-[#060a12]/90 border-b border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00d2ff]" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
            Unofficial Metro Transit Map
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-400 italic ml-2">
            • Interactive Network Map (100% Full Width)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="fullscreen-btn flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
          title={isFullscreen ? "Exit Full Screen" : "View Full Screen"}
        >
          {isFullscreen ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Exit Full Screen</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Full Screen</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Route Hover/Selection Details Banner Positioned Near Mouse Cursor */}
      {activeRoute && (
        <div
          className="route-hover-banner"
          style={{
            position: "absolute",
            left: Math.min(
              Math.max(mousePos.x + 15, 16),
              (containerRef.current?.clientWidth || 800) - 340
            ),
            top: Math.min(
              Math.max(mousePos.y - 30, 48),
              (containerRef.current?.clientHeight || 600) - 170
            ),
            zIndex: 50,
          }}
        >
          <div className="route-banner-header flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="route-banner-badge"
                style={{ backgroundColor: activeRoute.color }}
              >
                {activeRoute.id}
              </span>
              <span className="route-banner-title">{activeRoute.name}</span>
            </div>
            {selectedRouteId === activeRoute.id && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRouteId(null);
                }}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Close route detail"
              >
                ✕
              </button>
            )}
          </div>

          <div className="route-banner-meta">
            <div className="meta-item">
              <span className="meta-label">Terminals:</span>
              <span className="meta-value">
                {activeRoute.startTerminal || "Start"} ➔ {activeRoute.endTerminal || "End"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Total Destinations:</span>
              <span className="meta-value font-mono">
                {activeRoute.totalStations || 20} Stops
              </span>
            </div>
          </div>

          {activeRoute.description && (
            <p className="route-banner-desc">{activeRoute.description}</p>
          )}
        </div>
      )}

      {/* Floating Station Tooltip directly NEXT to the hovered bus stop cursor */}
      {hoveredStation && !activeRoute && (
        <div
          className="absolute bg-[#070e1b]/95 border border-cyan-500/60 backdrop-blur-md rounded-xl p-2.5 shadow-2xl text-xs z-40 pointer-events-none animate-fadeIn flex flex-col gap-1 min-w-[170px]"
          style={{
            left: Math.min(mousePos.x + 15, (containerRef.current?.clientWidth || 800) - 190),
            top: Math.max(mousePos.y - 65, 10),
          }}
        >
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
            <span>📍</span>
            <span>{hoveredStation.name}</span>
          </div>
          <div className="text-[10px] text-slate-300 flex items-center gap-1">
            <span className="text-slate-400 font-medium">Routes:</span>
            <div className="flex flex-wrap items-center gap-1">
              {hoveredStation.routes.map((routeId) => {
                const rt = metroRoutes[routeId];
                if (!rt) return null;
                return (
                  <span
                    key={routeId}
                    className="px-1.5 py-0.2 rounded text-white font-mono font-bold text-[9px]"
                    style={{ backgroundColor: rt.color }}
                  >
                    {routeId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas Viewport — min-y 210 provides 50px breathing room for top CM05 station names */}
      <div className="metro-svg-viewport">
        <svg
          viewBox="-160 210 2368 1760"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="metro-svg-canvas"
        >
          {/* Secondary Water / River Geographic Lines */}
          <g className="water-features-layer" opacity="0.4">
            {/* Kelani River Band */}
            <path
              d="M 430 400 Q 800 640 1500 850 L 1580 770 Q 830 540 510 300 Z"
              fill="#0284c7"
              fillOpacity="0.2"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <text
              x="1000"
              y="630"
              fill="#38bdf8"
              fontSize="20"
              fontWeight="bold"
              letterSpacing="4"
              opacity="0.6"
              transform="rotate(16 1000 630)"
            >
              KELANI RIVER
            </text>
          </g>

          {/* Render All Metro Polyline Routes */}
          <g className="metro-routes-layer">
            {routesList.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const isHovered = hoveredRouteId === route.id;
              const isDimmed =
                activeRouteId !== null &&
                activeRouteId !== route.id;

              return (
                <RouteLayer
                  key={route.id}
                  route={route}
                  isSelected={isSelected || isHovered}
                  isDimmed={isDimmed}
                  onClick={(r) => {
                    if (selectedRouteId === r.id) {
                      setSelectedRouteId(null);
                    } else {
                      setSelectedRouteId(r.id);
                    }
                  }}
                  onMouseEnter={(r) => setHoveredRouteId(r.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                />
              );
            })}
          </g>

          {/* Render All Station Node Points with Mouse Tracking Hover */}
          <g className="metro-stations-layer">
            {metroStations.map((station) => {
              const isHovered = hoveredStation?.id === station.id;

              return (
                <StationLayer
                  key={station.id}
                  station={station}
                  isHovered={isHovered}
                  onClick={() => {}}
                  onMouseEnter={(st, e) => {
                    setHoveredStation(st);
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setMousePos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Route Color Display Legend Bar directly at Bottom of Map with NO gap */}
      <div className="mt-0 pt-1 bg-[#060a12]/95 border-t border-slate-800/60 rounded-b-xl">
        <Legend
          selectedRouteId={selectedRouteId}
          hoveredRouteId={hoveredRouteId}
          onSelectRoute={(id) => setSelectedRouteId(id)}
          onHoverRoute={(id) => setHoveredRouteId(id)}
        />
      </div>
    </div>
  );
};

export default MetroNetworkMap;
