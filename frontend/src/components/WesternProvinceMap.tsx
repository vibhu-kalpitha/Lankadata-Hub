import React, { useState } from 'react';
import { srilankaDistricts } from '../assets/srilankaDistrictsMapData';
import { MapPin } from 'lucide-react';

interface RouteMapItem {
  code: string;
  name: string;
  color: string;
  glowColor: string;
  pathD: string;
  distance: string;
  duration: string;
  stops: string[];
}

export const metroRoutesData: RouteMapItem[] = [
  {
    code: 'CM01',
    name: 'Makumbura ↔ Colombo Fort',
    color: '#00d2ff',
    glowColor: 'rgba(0, 210, 255, 0.6)',
    pathD: 'M 92 510 L 86.5 496 L 83.5 495 L 81 488 L 76 480 L 70 478 L 66 476 L 62 476 L 58 472 L 57 472',
    distance: '23.3 km',
    duration: '1h 15m',
    stops: ['Makumbura MMC', 'Kottawa Junction', 'Pannipitiya', 'Thalawathugoda', 'Battaramulla', 'Rajagiriya', 'Borella', 'Town Hall', 'Pettah', 'Colombo Fort'],
  },
  {
    code: 'CM02',
    name: 'Millennium City ↔ Colombo Fort',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    pathD: 'M 92 492 L 87.5 489 L 83.5 486 L 80 482 L 76 480 L 70 478 L 66 476 L 62 473 L 57 472',
    distance: '22.7 km',
    duration: '1h 30m',
    stops: ['Millennium City', 'Arangala', 'Malabe Junction', 'Thalangama', 'Battaramulla', 'Rajagiriya', 'Borella', 'Maradana', 'Colombo Fort'],
  },
  {
    code: 'CM03',
    name: 'Kadawatha ↔ Makumbura',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.6)',
    pathD: 'M 83 452 L 79.5 450 L 77.5 458 L 74.5 461 L 65.5 472 L 66.5 480 L 74 492 L 77.5 493 L 79.5 494 L 86.5 496 L 92 510',
    distance: '34.8 km',
    duration: '2h 00m',
    stops: ['Kadawatha', 'Mahara', 'Kiribathgoda', 'Kelaniya Univ', 'Dematagoda', 'Narahenpita', 'Nawinna', 'Maharagama', 'Apeksha Hospital', 'Kottawa', 'Makumbura MMC'],
  },
  {
    code: 'CM04',
    name: 'Dematagoda ↔ Panadura',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    pathD: 'M 65.5 472 L 66 476 L 65 475 L 66.5 480 L 66 483 L 68.5 486 L 70.5 488 L 72 490 L 62 490 L 64 500 L 65 520 L 64 555',
    distance: '28.7 km',
    duration: '1h 45m',
    stops: ['Dematagoda', 'Borella', 'Campbell Park', 'Narahenpita', 'Kirulapone', 'Nugegoda', 'Delkanda', 'Wijerama', 'Dehiwala', 'Ratmalana', 'Moratuwa', 'Panadura Terminal'],
  },
  {
    code: 'CM05',
    name: 'Battaramulla ↔ Ekala',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    pathD: 'M 76 480 L 70 478 L 69 478.5 L 74.5 461 L 72 462 L 77.5 458 L 79.5 450 L 83 452 L 69 432 L 73.5 425',
    distance: '29.9 km',
    duration: '2h 00m',
    stops: ['Battaramulla Depot', 'Rajagiriya', 'Ayurveda Junction', 'Kelaniya', 'Thorana Junction', 'Kiribathgoda', 'Mahara', 'Kadawatha', 'Ja-Ela', 'Ekala Industrial Zone'],
  },
  {
    code: 'CM06',
    name: 'Kollupitiya Circular',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    pathD: 'M 59 476 L 59.5 476 L 62 476 L 63.5 477 L 64 478 L 60 481 L 59 476',
    distance: '14.0 km',
    duration: '0h 45m',
    stops: ['Kollupitiya Junction', 'Liberty Plaza', 'Town Hall', 'Horton Place', 'Barnes Place', 'Bambalapitiya', 'Kollupitiya Circular'],
  },
  {
    code: 'CM08',
    name: 'Kesbewa ↔ Pettah',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    pathD: 'M 75 520 L 71 505 L 66 506 L 64 500 L 63 495 L 62 490 L 61 485 L 60 481 L 59 476 L 58 474 L 58 472',
    distance: '35.7 km',
    duration: '2h 00m',
    stops: ['Kesbewa Terminal', 'Piliyandala', 'Katubedda', 'Ratmalana', 'Mt. Lavinia', 'Dehiwala', 'Wellawatte', 'Bambalapitiya', 'Kollupitiya', 'Galle Face', 'Pettah'],
  },
];

interface MetroStopNode {
  name: string;
  cx: number;
  cy: number;
  routes: string[];
}

const metroStops: MetroStopNode[] = [
  // Core Hubs & Terminals
  { name: 'Colombo Fort / Pettah', cx: 58, cy: 472, routes: ['CM01', 'CM02', 'CM08'] },
  { name: 'Makumbura MMC', cx: 92, cy: 510, routes: ['CM01', 'CM03'] },
  { name: 'Millennium City (Athurugiriya)', cx: 92, cy: 492, routes: ['CM02'] },
  { name: 'Kadawatha Interchange Terminal', cx: 83, cy: 452, routes: ['CM03', 'CM05'] },
  { name: 'Panadura Terminal', cx: 64, cy: 555, routes: ['CM04'] },
  { name: 'Ekala Industrial Zone', cx: 73.5, cy: 425, routes: ['CM05'] },
  { name: 'Kesbewa Terminal', cx: 75, cy: 520, routes: ['CM08'] },

  // Key Intermediate Designated Stops
  { name: 'Kottawa Junction', cx: 86.5, cy: 496, routes: ['CM01', 'CM03'] },
  { name: 'Pannipitiya', cx: 83.5, cy: 495, routes: ['CM01'] },
  { name: 'Thalawathugoda', cx: 81, cy: 488, routes: ['CM01'] },
  { name: 'Battaramulla (Sethsiripaya)', cx: 76, cy: 480, routes: ['CM01', 'CM02', 'CM05'] },
  { name: 'Rajagiriya', cx: 70, cy: 478, routes: ['CM01', 'CM02', 'CM05'] },
  { name: 'Borella', cx: 66, cy: 476, routes: ['CM01', 'CM02', 'CM04'] },
  { name: 'Town Hall', cx: 62, cy: 476, routes: ['CM01', 'CM06'] },
  { name: 'Maradana', cx: 62, cy: 473, routes: ['CM02'] },
  { name: 'Arangala', cx: 87.5, cy: 489, routes: ['CM02'] },
  { name: 'Malabe Junction', cx: 83.5, cy: 486, routes: ['CM02'] },
  { name: 'Thalangama', cx: 80, cy: 482, routes: ['CM02', 'CM05'] },
  { name: 'Mahara', cx: 79.5, cy: 450, routes: ['CM03', 'CM05'] },
  { name: 'Kiribathgoda', cx: 77.5, cy: 458, routes: ['CM03', 'CM05'] },
  { name: 'Kelaniya University', cx: 74.5, cy: 461, routes: ['CM03', 'CM05'] },
  { name: 'Dematagoda', cx: 65.5, cy: 472, routes: ['CM03', 'CM04'] },
  { name: 'Narahenpita', cx: 66.5, cy: 480, routes: ['CM03', 'CM04'] },
  { name: 'Nawinna', cx: 74, cy: 492, routes: ['CM03'] },
  { name: 'Maharagama', cx: 77.5, cy: 493, routes: ['CM03'] },
  { name: 'Apeksha Hospital', cx: 79.5, cy: 494, routes: ['CM03'] },
  { name: 'Campbell Park', cx: 65, cy: 475, routes: ['CM04'] },
  { name: 'Kirulapone', cx: 66, cy: 483, routes: ['CM04'] },
  { name: 'Nugegoda', cx: 68.5, cy: 486, routes: ['CM04'] },
  { name: 'Delkanda', cx: 70.5, cy: 488, routes: ['CM04'] },
  { name: 'Wijerama', cx: 72, cy: 490, routes: ['CM04'] },
  { name: 'Dehiwala', cx: 62, cy: 490, routes: ['CM04', 'CM08'] },
  { name: 'Ratmalana', cx: 64, cy: 500, routes: ['CM04', 'CM08'] },
  { name: 'Moratuwa', cx: 65, cy: 520, routes: ['CM04'] },
  { name: 'Ayurveda Junction', cx: 69, cy: 478.5, routes: ['CM05'] },
  { name: 'Thorana Junction', cx: 72, cy: 462, routes: ['CM05'] },
  { name: 'Ja-Ela', cx: 69, cy: 432, routes: ['CM05'] },
  { name: 'Kollupitiya Junction', cx: 59, cy: 476, routes: ['CM06', 'CM08'] },
  { name: 'Liberty Plaza', cx: 59.5, cy: 476, routes: ['CM06'] },
  { name: 'Horton Place', cx: 63.5, cy: 477, routes: ['CM06'] },
  { name: 'Barnes Place', cx: 64, cy: 478, routes: ['CM06'] },
  { name: 'Bambalapitiya', cx: 60, cy: 481, routes: ['CM06', 'CM08'] },
  { name: 'Piliyandala', cx: 71, cy: 505, routes: ['CM08'] },
  { name: 'Katubedda', cx: 66, cy: 506, routes: ['CM08'] },
  { name: 'Mt. Lavinia', cx: 63, cy: 495, routes: ['CM08'] },
  { name: 'Wellawatte', cx: 61, cy: 485, routes: ['CM08'] },
  { name: 'Galle Face', cx: 58, cy: 474, routes: ['CM08'] },
];

export const WesternProvinceMap: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('CM01');
  const [hoveredStop, setHoveredStop] = useState<MetroStopNode | null>(null);

  // Western Province Districts (Gampaha, Colombo, Kalutara)
  const westernDistricts = srilankaDistricts.filter(d => d.province === 'Western');

  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-3">

      {/* SVG Map Container (Left side) */}
      <div className="relative flex-1 w-full h-[460px] md:h-[500px] flex items-center justify-center overflow-hidden">
        
        {/* Subtle radial cyan background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent filter blur-3xl pointer-events-none" />

        {/* SVG Western Province map */}
        <svg
          viewBox="35 405 110 175"
          className="w-full h-full p-1 filter drop-shadow-[0_0_25px_rgba(0,210,255,0.22)]"
        >
          {/* Western Province District Vector Outlines */}
          <g className="western-districts">
            {westernDistricts.map((d) => (
              <g key={d.id}>
                <path
                  d={d.d}
                  className="fill-[#0b1628]/85 stroke-cyan-500/35 stroke-[0.7] hover:fill-cyan-500/20 transition-colors"
                />
                {/* District Background Labels */}
                {d.district === 'Colombo' && (
                  <text x="64" y="490" fontSize="2.8" fill="#334155" fontWeight="bold" letterSpacing="0.5">
                    COLOMBO
                  </text>
                )}
                {d.district === 'Gampaha' && (
                  <text x="70" y="440" fontSize="2.8" fill="#334155" fontWeight="bold" letterSpacing="0.5">
                    GAMPAHA
                  </text>
                )}
                {d.district === 'Kalutara' && (
                  <text x="85" y="535" fontSize="2.8" fill="#334155" fontWeight="bold" letterSpacing="0.5">
                    KALUTARA
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Route Corridors — Active selected route highlighted */}
          <g className="metro-route-lines">
            {metroRoutesData.map((route) => {
              const isSelected = selectedRoute === route.code;
              return (
                <path
                  key={route.code}
                  d={route.pathD}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={isSelected ? '0.85' : '0.35'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 pointer-events-none"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 5px ${route.glowColor})` : 'none',
                    opacity: isSelected ? 1 : 0.15,
                  }}
                />
              );
            })}
          </g>

          {/* All Transit Bus Stops — Rendered as Dots */}
          <g className="metro-stop-nodes">
            {metroStops.map((stop) => {
              const isHovered = hoveredStop?.name === stop.name;
              const hasMatchingRoute = stop.routes.includes(selectedRoute);

              return (
                <g
                  key={stop.name}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredStop(stop)}
                  onMouseLeave={() => setHoveredStop(null)}
                  style={{ opacity: hasMatchingRoute ? 1 : 0.2 }}
                >
                  {/* Outer circle */}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r={isHovered ? '2.8' : '1.4'}
                    fill={isHovered ? '#00d2ff' : '#2563eb'}
                    fillOpacity="0.35"
                  />
                  {/* Core stop point dot */}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r={isHovered ? '1.6' : '0.9'}
                    fill={isHovered ? '#00d2ff' : '#38bdf8'}
                    stroke="#0b1628"
                    strokeWidth="0.25"
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip Overlay (Appears when hovering over any stop dot) */}
        {hoveredStop && (
          <div className="absolute bottom-2 left-2 bg-[#070e1b]/95 border border-lanka-cyan/40 backdrop-blur-md rounded-lg p-2.5 shadow-glass text-xs space-y-0.5 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 text-lanka-cyan font-bold text-[11px]">
              <MapPin size={11} />
              <span>{hoveredStop.name}</span>
            </div>
            <div className="text-[9px] text-lanka-muted">
              Serving Routes: <span className="text-white font-bold">{hoveredStop.routes.join(', ')}</span>
            </div>
          </div>
        )}

      </div>

      {/* Borderless Route Selection Buttons (Right side - Vertical top to bottom) */}
      <div className="flex flex-col gap-1 w-full md:w-[125px] shrink-0">
        {metroRoutesData.map((route) => {
          const isActive = selectedRoute === route.code;
          return (
            <button
              key={route.code}
              onClick={() => setSelectedRoute(route.code)}
              className={`text-[9.5px] px-2.5 py-1.5 rounded transition-all flex items-center justify-between text-left border-0 ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-400 font-semibold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: route.color, opacity: isActive ? 1 : 0.6 }}
                />
                <span>{route.code}</span>
              </div>
              <span className="text-[8px] text-slate-500 font-mono">{route.distance}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
