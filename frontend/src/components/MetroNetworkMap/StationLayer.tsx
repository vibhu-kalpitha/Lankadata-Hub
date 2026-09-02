import React from "react";
import type { MetroStation } from "../../data/metroStations";

interface StationLayerProps {
  station: MetroStation;
  isHovered?: boolean;
  isSelected?: boolean;
  onClick?: (station: MetroStation) => void;
  onMouseEnter?: (station: MetroStation) => void;
  onMouseLeave?: () => void;
}

export const StationLayer: React.FC<StationLayerProps> = ({
  station,
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!station) return null;

  let textAnchor: "start" | "middle" | "end" = "start";
  let dx = station.labelOffsetX ?? 22;
  let dy = station.labelOffsetY ?? 7;

  switch (station.labelPosition) {
    case "left":
      textAnchor = "end";
      dx = station.labelOffsetX ?? -22;
      break;
    case "right":
      textAnchor = "start";
      dx = station.labelOffsetX ?? 22;
      break;
    case "top":
      textAnchor = "middle";
      dx = 0;
      dy = station.labelOffsetY ?? -22;
      break;
    case "bottom":
      textAnchor = "middle";
      dx = 0;
      dy = station.labelOffsetY ?? 28;
      break;
    case "top-left":
      textAnchor = "end";
      dx = -16;
      dy = -16;
      break;
    case "top-right":
      textAnchor = "start";
      dx = 16;
      dy = -16;
      break;
    case "bottom-left":
      textAnchor = "end";
      dx = -16;
      dy = 26;
      break;
    case "bottom-right":
      textAnchor = "start";
      dx = 16;
      dy = 26;
      break;
    default:
      textAnchor = "start";
      dx = 22;
      dy = 7;
  }

  return (
    <g
      className={`station-node-group ${station.interchange ? "interchange" : ""} ${
        isHovered || isSelected ? "active" : ""
      }`}
      onClick={() => onClick && onClick(station)}
      onMouseEnter={() => onMouseEnter && onMouseEnter(station)}
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
      style={{ cursor: "pointer" }}
    >
      {/* Station Marker */}
      {station.interchange ? (
        <g>
          <rect
            x={station.x - (isHovered ? 20 : 16)}
            y={station.y - (isHovered ? 14 : 11)}
            width={isHovered ? 40 : 32}
            height={isHovered ? 28 : 22}
            rx={isHovered ? 14 : 11}
            fill="#ffffff"
            stroke="#1f2937"
            strokeWidth="4.5"
            style={{ transition: "all 0.2s ease" }}
          />
          <circle
            cx={station.x}
            cy={station.y}
            r={isHovered ? "7" : "5"}
            fill="#1f2937"
          />
        </g>
      ) : (
        <circle
          cx={station.x}
          cy={station.y}
          r={isHovered ? "12" : "9"}
          fill="#ffffff"
          stroke="#1f2937"
          strokeWidth="4"
          style={{ transition: "all 0.2s ease" }}
        />
      )}

      {/* Station Name Label with Increased Font Size (24px/21px) & Crisp Stroke Outline */}
      <text
        x={station.x + dx}
        y={station.y + dy}
        textAnchor={textAnchor}
        fontSize={station.interchange ? "24" : "21"}
        fontWeight={station.interchange ? "900" : "700"}
        fill={isHovered ? "#00d2ff" : station.interchange ? "#ffffff" : "#f8fafc"}
        stroke="#060a12"
        strokeWidth="4.5"
        paintOrder="stroke fill"
        className="station-label-text select-none pointer-events-none"
        style={{
          transition: "fill 0.2s ease",
        }}
      >
        {station.name}
      </text>
    </g>
  );
};

export default StationLayer;
