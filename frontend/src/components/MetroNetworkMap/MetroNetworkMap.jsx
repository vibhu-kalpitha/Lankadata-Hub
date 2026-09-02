import React, { useState, useRef } from "react";
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
  const [activeStation, setActiveStation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const routesList = Object.values(metroRoutes);
  const containerRef = useRef(null);

  const activeRouteId = hoveredRouteId || selectedRouteId;
  const activeRoute = activeRouteId ? metroRoutes[activeRouteId] : null;
  const displayStation = activeStation || hoveredStation;

  return (
    <div
      ref={containerRef}
      className={`metro-map-wrapper ${isFullscreen ? "fullscreen" : ""}`}
    >
      {/* Top Map Control Bar with ONLY Fullscreen Option */}
      <div className="map-top-bar">
        <div className="map-brand-title">
          <span className="live-dot-ping" />
          <span className="map-title-text">LANKA METRO BUS NETWORK</span>
        </div>

        <div className="map-controls-group">
          <button
            className="map-ctrl-btn fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? "Exit Fullscreen ⛶" : "⛶ Fullscreen"}
          </button>
        </div>
      </div>

      {/* Horizontal One-After-One Route Legend Bar */}
      <Legend
        selectedRouteId={selectedRouteId}
        hoveredRouteId={hoveredRouteId}
        onSelectRoute={(id) => setSelectedRouteId(id)}
        onHoverRoute={(id) => setHoveredRouteId(id)}
      />

      {/* Dynamic Route Hover Details Banner */}
      {activeRoute && (
        <div className="route-hover-banner">
          <div className="route-banner-header">
            <span
              className="route-banner-badge"
              style={{ backgroundColor: activeRoute.color }}
            >
              {activeRoute.id}
            </span>
            <span className="route-banner-title">{activeRoute.name}</span>
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

      {/* SVG Canvas Viewport */}
      <div className="metro-svg-viewport">
        <svg
          viewBox="-70 0 2120 2048"
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

            {/* Indian Ocean Coast Line Band */}
            <path
              d="M 0 0 L 120 0 L 120 2048 L 0 2048 Z"
              fill="#0f172a"
              fillOpacity="0.8"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <text
              x="50"
              y="1024"
              fill="#334155"
              fontSize="24"
              fontWeight="900"
              letterSpacing="6"
              transform="rotate(-90 50 1024)"
            >
              INDIAN OCEAN
            </text>
          </g>

          {/* 1. ROUTE LINES */}
          <g className="routes-layer">
            {routesList.map((route) => {
              const isSelected = activeRouteId === route.id;
              const isDimmed = activeRouteId !== null && activeRouteId !== route.id;
              return (
                <g
                  key={route.id}
                  onMouseEnter={() => setHoveredRouteId(route.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                >
                  <RouteLayer
                    route={route}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    onClick={(r) => setSelectedRouteId(r.id === selectedRouteId ? null : r.id)}
                  />
                </g>
              );
            })}
          </g>

          {/* 2. STATION CIRCLES & LABELS */}
          <g className="stations-layer">
            {metroStations.map((station) => {
              const isHovered = hoveredStation?.id === station.id;
              const isSelected = activeStation?.id === station.id;
              return (
                <StationLayer
                  key={station.id}
                  station={station}
                  isHovered={isHovered}
                  isSelected={isSelected}
                  onClick={(s) => setActiveStation(s)}
                  onMouseEnter={(s) => setHoveredStation(s)}
                  onMouseLeave={() => setHoveredStation(null)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Hover & Active Station Info Tooltip Card */}
      {displayStation && (
        <div className="metro-tooltip-card">
          <div className="tooltip-header">
            <span className="tooltip-title">{displayStation.name}</span>
            <span
              className="tooltip-[close]"
              onClick={() => {
                setActiveStation(null);
                setHoveredStation(null);
              }}
            >
              ✕
            </span>
          </div>

          <div className="tooltip-body">
            <div>
              <strong>Station Type: </strong>
              <span className="text-cyan-400 font-mono">
                {displayStation.interchange
                  ? "Multi-Route Interchange Station"
                  : "Intermediate Station"}
              </span>
            </div>

            <div style={{ marginTop: "6px" }}>
              <strong>Serving Routes:</strong>
              <div className="routes-badge-wrap">
                {displayStation.routes.map((rId) => {
                  const r = metroRoutes[rId];
                  return (
                    <span
                      key={rId}
                      className="route-mini-badge"
                      style={{ backgroundColor: r?.color || "#00d2ff" }}
                    >
                      {rId}: {r?.name || rId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetroNetworkMap;
