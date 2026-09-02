import React from "react";

export const RouteLayer = ({ route, isSelected, isDimmed, onClick, onMouseEnter, onMouseLeave }) => {
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
      onMouseEnter={() => onMouseEnter && onMouseEnter(route)}
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
      style={{ cursor: "pointer" }}
    >
      {/* Invisible wider hit-testing polyline for easy mouse hovering */}
      <polyline
        points={pointsString}
        fill="none"
        stroke="transparent"
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Background glow stroke for selected/hovered route */}
      {isSelected && (
        <polyline
          points={pointsString}
          fill="none"
          stroke={route.color}
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          filter="blur(8px)"
        />
      )}

      {/* Main Metro Route Polyline */}
      <polyline
        points={pointsString}
        fill="none"
        stroke={route.color}
        strokeWidth={isSelected ? "18" : "14"}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: isDimmed ? 0.25 : 1,
          transition: "stroke-width 0.25s ease, opacity 0.25s ease",
        }}
      />

      {/* Route ID Label Badge near Start Point with 26px Font Size */}
      {startPoint && (
        <g transform={`translate(${startPoint.x}, ${startPoint.y})`} pointerEvents="none">
          <rect
            x="-41"
            y="-48"
            width="82"
            height="38"
            rx="8"
            fill={route.color}
            stroke="#ffffff"
            strokeWidth="3"
            opacity={isDimmed ? 0.3 : 0.95}
          />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fontSize="26"
            fontWeight="900"
            fill="#ffffff"
            opacity={isDimmed ? 0.4 : 1}
          >
            {route.id}
          </text>
        </g>
      )}

      {/* Route ID Label Badge near End Point with 26px Font Size */}
      {endPoint && (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y) && (
        <g transform={`translate(${endPoint.x}, ${endPoint.y})`} pointerEvents="none">
          <rect
            x="-41"
            y="14"
            width="82"
            height="38"
            rx="8"
            fill={route.color}
            stroke="#ffffff"
            strokeWidth="3"
            opacity={isDimmed ? 0.3 : 0.95}
          />
          <text
            x="0"
            y="40"
            textAnchor="middle"
            fontSize="26"
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
