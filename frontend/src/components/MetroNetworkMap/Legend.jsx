import React from "react";
import { metroRoutes } from "../../data/metroRoutes";

export const Legend = ({
  selectedRouteId,
  hoveredRouteId,
  onSelectRoute,
  onHoverRoute,
}) => {
  const routesList = Object.values(metroRoutes);

  return (
    <div className="metro-legend-horizontal-bar flex items-center justify-between gap-3 px-2 py-1">
      <div className="legend-horizontal-scroll flex items-center gap-2 overflow-x-auto py-0.5">
        <button
          onClick={() => onSelectRoute(null)}
          onMouseEnter={() => onHoverRoute(null)}
          className={`legend-chip-all ${selectedRouteId === null && hoveredRouteId === null ? "active" : ""}`}
        >
          ALL
        </button>

        {routesList.map((route) => {
          const isActive = selectedRouteId === route.id || hoveredRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(selectedRouteId === route.id ? null : route.id)}
              onMouseEnter={() => onHoverRoute(route.id)}
              onMouseLeave={() => onHoverRoute(null)}
              className={`legend-chip-item ${isActive ? "active" : ""}`}
              title={`${route.id}: ${route.name}`}
            >
              <span
                className="chip-color-dot"
                style={{ backgroundColor: route.color }}
              />
              <span className="chip-route-id">{route.id}</span>
            </button>
          );
        })}
      </div>

      {/* Source credit text on right side of legend */}
      <span className="text-[11px] text-slate-400/90 font-mono whitespace-nowrap pl-2 border-l border-slate-800 shrink-0">
        Data from Lanka Metro Web
      </span>
    </div>
  );
};

export default Legend;
