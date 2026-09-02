import React from "react";

export const StationLayer = ({ station, isHovered, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
  if (!station) return null;

  let textAnchor = "start";
  let dx = station.labelOffsetX ?? 32;
  let dy = station.labelOffsetY ?? 9;

  switch (station.labelPosition) {
    case "left":
      textAnchor = "end";
      dx = station.labelOffsetX ?? -32;
      break;
    case "right":
      textAnchor = "start";
      dx = station.labelOffsetX ?? 32;
      break;
    case "top":
      textAnchor = "middle";
      dx = 0;
      dy = station.labelOffsetY ?? -32;
      break;
    case "bottom":
      textAnchor = "middle";
      dx = 0;
      dy = station.labelOffsetY ?? 40;
      break;
    case "top-left":
      textAnchor = "end";
      dx = -22;
      dy = -22;
      break;
    case "top-right":
      textAnchor = "start";
      dx = 22;
      dy = -22;
      break;
    case "bottom-left":
      textAnchor = "end";
      dx = -22;
      dy = 36;
      break;
    case "bottom-right":
      textAnchor = "start";
      dx = 22;
      dy = 36;
      break;
    default:
      textAnchor = "start";
      dx = 32;
      dy = 9;
  }

  return (
    <g
      className={`station-node-group ${station.interchange ? "interchange" : ""} ${
        isHovered || isSelected ? "active" : ""
      }`}
      onClick={() => onClick && onClick(station)}
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(station, e)}
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
      style={{ cursor: "pointer" }}
    >
      {/* Station Marker */}
      {station.interchange ? (
        <g>
          <rect
            x={station.x - (isHovered ? 26 : 20)}
            y={station.y - (isHovered ? 18 : 14)}
            width={isHovered ? 52 : 40}
            height={isHovered ? 36 : 28}
            rx={isHovered ? 18 : 14}
            fill="#ffffff"
            stroke="#1f2937"
            strokeWidth="6"
            style={{ transition: "all 0.2s ease" }}
          />
          <circle
            cx={station.x}
            cy={station.y}
            r={isHovered ? "9" : "7"}
            fill="#1f2937"
          />
        </g>
      ) : (
        <circle
          cx={station.x}
          cy={station.y}
          r={isHovered ? "16" : "12"}
          fill="#ffffff"
          stroke="#1f2937"
          strokeWidth="5.5"
          style={{ transition: "all 0.2s ease" }}
        />
      )}

      {/* Station Name Label */}
      <text
        x={station.x + dx}
        y={station.y + dy}
        textAnchor={textAnchor}
        fontSize={station.interchange ? "38" : "32"}
        fontWeight={station.interchange ? "900" : "800"}
        fill={isHovered ? "#00d2ff" : station.interchange ? "#ffffff" : "#f8fafc"}
        stroke="#060a12"
        strokeWidth="7"
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
