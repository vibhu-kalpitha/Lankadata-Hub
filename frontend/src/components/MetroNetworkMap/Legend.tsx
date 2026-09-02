import React from "react";
import { metroRoutes } from "../../data/metroRoutes";

interface LegendProps {
  selectedRouteId: string | null;
  hoveredRouteId: string | null;
  onSelectRoute: (id: string | null) => void;
  onHoverRoute: (id: string | null) => void;
}

export const Legend: React.FC<LegendProps> = ({
  selectedRouteId,
  hoveredRouteId,
  onSelectRoute,
  onHoverRoute,
}) => {
  const routesList = Object.values(metroRoutes);

  return (
    <div className="metro-legend-horizontal-bar">
      <div className="legend-horizontal-scroll">
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
    </div>
  );
};

export default Legend;
