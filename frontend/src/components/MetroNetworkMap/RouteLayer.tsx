import React from "react";
import type { MetroRoute } from "../../data/metroRoutes";

interface RouteLayerProps {
  route: MetroRoute;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: (route: MetroRoute) => void;
}

export const RouteLayer: React.FC<RouteLayerProps> = ({
  route,
  isSelected,
  isDimmed,
  onClick,
}) => {
  if (!route || !route.points || route.points.length === 0) return null;

  const pointsString = route.points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const startPoint = route.points[0];
  const endPoint = route.points[route.points.length - 1];

  return (
    <g
      className={`route-layer-group ${isSelected ? "selected" : ""} ${isDimmed ? "dimmed" : ""}`}
      onClick={() => onClick && onClick(route)}
      style={{ cursor: "pointer" }}
    >
      {/* Background glow stroke for selected route */}
      {isSelected && (
        <polyline
          points={pointsString}
          fill="none"
          stroke={route.color}
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          filter="blur(6px)"
        />
      )}

      {/* Main Metro Route Polyline */}
      <polyline
        points={pointsString}
        fill="none"
        stroke={route.color}
        strokeWidth={isSelected ? "14" : "10"}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: isDimmed ? 0.25 : 1,
          transition: "stroke-width 0.25s ease, opacity 0.25s ease",
        }}
      />

      {/* Route ID Label Badge near Start Point with 16px Font Size */}
      {startPoint && (
        <g transform={`translate(${startPoint.x}, ${startPoint.y})`} pointerEvents="none">
          <rect
            x="-28"
            y="-36"
            width="56"
            height="26"
            rx="5"
            fill={route.color}
            stroke="#ffffff"
            strokeWidth="2"
            opacity={isDimmed ? 0.3 : 0.95}
          />
          <text
            x="0"
            y="-18"
            textAnchor="middle"
            fontSize="16"
            fontWeight="900"
            fill="#ffffff"
            opacity={isDimmed ? 0.4 : 1}
          >
            {route.id}
          </text>
        </g>
      )}

      {/* Route ID Label Badge near End Point with 16px Font Size */}
      {endPoint && (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y) && (
        <g transform={`translate(${endPoint.x}, ${endPoint.y})`} pointerEvents="none">
          <rect
            x="-28"
            y="12"
            width="56"
            height="26"
            rx="5"
            fill={route.color}
            stroke="#ffffff"
            strokeWidth="2"
            opacity={isDimmed ? 0.3 : 0.95}
          />
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fontSize="16"
            fontWeight="900"
            fill="#ffffff"
            opacity={isDimmed ? 0.4 : 1}
          >
            {route.id}
          </text>
        </g>
      )}
    </g>
  );
};

export default RouteLayer;
