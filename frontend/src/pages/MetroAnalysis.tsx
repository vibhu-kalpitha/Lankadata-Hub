import React, { useState, useEffect } from 'react';
import './MetroAnalysis.css';
import { WesternProvinceMap } from '../components/WesternProvinceMap';
import {
  fetchMetroTotals,
  fetchMetroConnectedCities,
  fetchMetroBuses,
} from '../services/metroService';
import type {
  MetroTotalItem,
  MetroConnectedCity,
  MetroBusRoute,
} from '../services/metroService';

interface WhyMetroItem {
  title: string;
  description: string;
  result: string;
}

interface AudienceItem {
  title: string;
  text: string;
}

const whyMetro: WhyMetroItem[] = [
  {
    title: "Congested urban corridors",
    description:
      "High-frequency public transport concentrates passenger movement on major corridors instead of relying entirely on individual vehicles.",
    result:
      "More people can move through shared transport using existing road capacity more efficiently.",
  },
  {
    title: "Uncertainty about bus arrival",
    description:
      "GPS tracking and passenger information systems provide better visibility of vehicle movement and service conditions.",
    result:
      "Passengers can plan journeys around real-time service information.",
  },
  {
    title: "Disconnected bus services",
    description:
      "Connected routes and interchange infrastructure allow passengers to transfer between services more easily.",
    result:
      "Transfers become simpler and the network becomes more useful as a whole.",
  },
  {
    title: "Long waiting times",
    description:
      "Frequent peak-period services reduce the amount of time passengers need to wait for the next vehicle.",
    result:
      "Shorter waiting periods and better service availability.",
  },
  {
    title: "Limited accessibility",
    description:
      "Modern vehicles and passenger facilities can support low-floor access, wheelchair users and priority seating.",
    result:
      "Public transport becomes accessible to a wider passenger population.",
  },
  {
    title: "Fragmented passenger information",
    description:
      "GPS, digital displays and mobile applications can bring service information into one passenger experience.",
    result:
      "Passengers gain better visibility of the network.",
  },
  {
    title: "Urban emissions and traffic pressure",
    description:
      "High-capacity shared transport allows more passengers to travel without requiring an equivalent increase in private vehicles.",
    result:
      "Supports more sustainable urban mobility and can reduce traffic pressure on major corridors.",
  },
];

const audience: AudienceItem[] = [
  {
    title: "Daily commuters",
    text: "People travelling to Colombo and surrounding urban centres every day can benefit from predictable, frequent services.",
  },
  {
    title: "Students",
    text: "Students can use connected routes to reach schools, universities and other education centres without depending entirely on private transport.",
  },
  {
    title: "Workers",
    text: "Workers travelling between residential areas and employment centres can benefit from reliable high-frequency corridors.",
  },
  {
    title: "Visitors and occasional passengers",
    text: "Clear route information, connected stops and passenger information make the network easier to understand.",
  },
];

interface StatCardProps {
  value: string | number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="metro-stat-card">
      <div className="metro-stat-value">{value}</div>
      <div className="metro-stat-label">{label}</div>
    </div>
  );
}

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
}

function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="metro-section-heading">
      <div className="metro-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export const MetroAnalysis: React.FC = () => {
  // State querying PostgreSQL database tables (metro_total, metro_most_connect_cities, metro_bus)
  const [totals, setTotals] = useState<MetroTotalItem[]>([]);
  const [connectedCities, setConnectedCities] = useState<MetroConnectedCity[]>([]);
  const [routesData, setRoutesData] = useState<MetroBusRoute[]>([]);
  const [selectedStop, setSelectedStop] = useState<MetroConnectedCity | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fetch totals from PostgreSQL metro_total table
    fetchMetroTotals().then((data) => setTotals(data));

    // 2. Fetch connected cities from PostgreSQL metro_most_connect_cities table
    fetchMetroConnectedCities().then((cities) => {
      setConnectedCities(cities);
      if (cities.length > 0) {
        setSelectedStop(cities[0]);
      }
    });

    // 3. Fetch routes from PostgreSQL metro_bus table
    fetchMetroBuses().then((buses) => setRoutesData(buses));
  }, []);

  return (
    <main className="metro-page">

      {/* HERO */}
      <section className="metro-hero">
        <div className="metro-hero-grid">

          <div className="metro-hero-left">
            <div className="metro-label">LANKADATA HUB / METRO BUS</div>

            <h1>
              Understanding
              <span> Metro Mobility</span>
            </h1>

            <p className="metro-hero-description">
              A data-driven view of how high-frequency public transport,
              connected routes and multimodal infrastructure can create a more
              accessible and efficient urban mobility network in Sri Lanka.
            </p>

            <div className="metro-hero-line" />
          </div>

          <div className="metro-hero-right">
            <WesternProvinceMap />
          </div>

        </div>
      </section>

      {/* WHAT IS METRO */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="01 / WHAT IS METRO?"
          title="A connected urban mobility network"
          description="Metro Bus is not simply a collection of individual bus routes. The concept focuses on connecting high-frequency services, modern passenger infrastructure, digital information and transport interchanges."
        />

        <div className="metro-definition-grid">

          <div className="metro-definition-main">
            <p>
              In Sri Lanka, the Metro Bus concept represents a modernization
              of urban public transport. It is designed around high-frequency
              corridors connecting major urban areas through reliable services,
              modern stops, passenger information systems and connected
              transport infrastructure.
            </p>

            <p>
              The system combines frequent bus services, live GPS tracking,
              modern passenger facilities, digital ticketing, centralized
              fleet management and multimodal interchange infrastructure.
            </p>

            <p>
              The goal is therefore not simply to operate more buses. The goal
              is to create a connected mobility network where passengers can
              move between locations more easily and make better decisions
              using real-time information.
            </p>
          </div>

          <div className="metro-definition-image" onClick={() => setIsMapExpanded(true)}>
            <img
              src="/metro-bus-official-map.jpg"
              alt="Official Lanka Metro Transit Network Map"
              loading="lazy"
            />
            <div className="metro-image-badge">
              <span>LANKA METRO TRANSIT OFFICIAL MAP</span>
              <p>Click to view full screen diagram (CM01 - CM08 Corridors)</p>
            </div>
          </div>

        </div>
      </section>

      {/* FULLSCREEN MAP MODAL */}
      {isMapExpanded && (
        <div className="metro-modal-backdrop" onClick={() => setIsMapExpanded(false)}>
          <div className="metro-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="metro-modal-close" onClick={() => setIsMapExpanded(false)}>
              ✕ CLOSE
            </button>
            <img
              src="/metro-bus-official-map.jpg"
              alt="Full Resolution Lanka Metro Transit Map"
            />
          </div>
        </div>
      )}

      {/* NETWORK STATS (Fetched from PostgreSQL metro_total table) */}
      <section className="metro-stats-section">
        <div className="metro-stats-grid">
          {totals.length > 0 ? (
            totals.map((item) => (
              <StatCard
                key={item.id || item.network_metric}
                value={item.total_count}
                label={item.network_metric}
              />
            ))
          ) : (
            <>
              <StatCard value="7" label="Total Active Routes" />
              <StatCard value="11" label="Total Destinations Served" />
              <StatCard value="60+" label="Total Network Bus Stops" />
              <StatCard value="5" label="Total Major Connections" />
            </>
          )}
        </div>
      </section>

      {/* WHY METRO */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="02 / WHY METRO?"
          title="What changes when public transport becomes connected?"
          description="The value of Metro is not only the number of buses. It comes from how services solve common problems faced by passengers and urban areas."
        />

        <div className="why-metro-grid">
          {whyMetro.map((item, index) => (
            <div className="why-card" key={item.title}>
              <div className="why-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="why-result">
                <span>RESULT</span>
                <strong>{item.result}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="metro-section audience-section">
        <SectionTitle
          eyebrow="03 / WHO IS IT FOR?"
          title="Who benefits from a connected Metro network?"
          description="Metro is designed around the needs of people who depend on reliable movement between residential areas, employment centres, education centres and transport hubs."
        />

        <div className="audience-grid">
          {audience.map((item, index) => (
            <div className="audience-card" key={item.title}>
              <div className="audience-index">
                0{index + 1}
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRAFFIC IMPACT (Section 04 — How the Metro Bus Cuts Down Traffic & Visual Operational Metrics with Image) */}
      <section className="metro-section traffic-section">
        <SectionTitle
          eyebrow="04 / TRAFFIC IMPACT"
          title="How the Metro Bus Cuts Down Traffic"
          description="Colombo experiences severe gridlock, with over 250,000 private vehicles entering the city daily. The Metro Bus aims to break this congestion through a 'modal shift'—getting people out of their private cars and onto public transit:"
        />

        <div className="traffic-main-grid">

          <div className="traffic-flow-column">
            <div className="traffic-step">
              <div className="traffic-step-number">01</div>
              <h3>Massive Space Optimization</h3>
              <p>
                One single FOTON Metro Bus carries up to 80+ passengers. This efficiently removes roughly 40 to 50 private cars or three-wheelers from tightly packed Colombo roads like the High-Level or Galle Road corridors.
              </p>
            </div>

            <div className="traffic-step">
              <div className="traffic-step-number">02</div>
              <h3>Bus Priority Lanes</h3>
              <p>
                LMT works alongside designated bus priority corridors. Keeping the buses separated from regular traffic ensures they don't get stuck in standard gridlocks, allowing them to bypass car queues.
              </p>
            </div>

            <div className="traffic-step">
              <div className="traffic-step-number">03</div>
              <h3>Eliminating "Bus Racing"</h3>
              <p>
                Traditional private buses in Sri Lanka often idle at stops to wait for passengers and then race dangerously to beat competitors. LMT operates under a unified cluster company model with fixed, automated schedules, keeping traffic moving smoothly.
              </p>
            </div>
          </div>

          <div className="traffic-image-column">
            <div className="traffic-image-card">
              <img
                src="/metro-traffic-cut.png"
                alt="Sri Lanka Metro Bus Cutting Traffic Congestion"
                loading="lazy"
              />
              <div className="traffic-image-caption">
                <span>PRIORITY TRANSIT CORRIDOR</span>
                <p>Rapid transit bypassing urban congestion along major Colombo arteries.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Operational Metrics & Capacity Targets Grid */}
        <div className="metro-metrics-container">
          <div className="metrics-heading">Operational Metrics & Fleet Target Details</div>
          
          <div className="metrics-card-grid">
            <div className="metric-visual-card">
              <div>
                <div className="metric-visual-val">122</div>
                <div className="metric-visual-title">Current Fleet Size</div>
              </div>
              <div className="metric-visual-desc">Active target reached for the rollout across Colombo.</div>
            </div>

            <div className="metric-visual-card">
              <div>
                <div className="metric-visual-val">272</div>
                <div className="metric-visual-title">Future Fleet Target (2027)</div>
              </div>
              <div className="metric-visual-desc">Planned scale-up to expand lines outside Colombo District.</div>
            </div>

            <div className="metric-visual-card">
              <div>
                <div className="metric-visual-val">80+</div>
                <div className="metric-visual-title">Passenger Capacity</div>
              </div>
              <div className="metric-visual-desc">Built for high-volume urban rapid transit.</div>
            </div>

            <div className="metric-visual-card">
              <div>
                <div className="metric-visual-val">33</div>
                <div className="metric-visual-title">Seating Layout</div>
              </div>
              <div className="metric-visual-desc">Includes priority seating and automated wheelchair ramps.</div>
            </div>

            <div className="metric-visual-card">
              <div>
                <div className="metric-visual-val">~47</div>
                <div className="metric-visual-title">Standing Room</div>
              </div>
              <div className="metric-visual-desc">Spacious standing area equipped with grab handles.</div>
            </div>
          </div>
        </div>
      </section>

      {/* RIDE EXPERIENCE (Section 05 — How Metro Upgrades the Quality of Your Ride) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="05 / RIDE EXPERIENCE"
          title="How Metro Upgrades the Quality of Your Ride"
          description="The service fixes long-standing complaints about local public transport—such as overcrowding, loud noises, and unpredictable schedules—by introducing modern European-standard features:"
        />

        <div className="ride-features-grid">

          <div className="ride-feature-card">
            <div className="feature-number">01 / LMT-GO APP</div>
            <h3>Zero Waiting via LMT-GO App</h3>
            <p>
              Passengers no longer have to guess when the next bus will show up. Continuous satellite GPS tracking feeds live arrival times directly to smart shelters and commuters' mobile phones.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-number">02 / ACCESSIBILITY</div>
            <h3>True Inclusion & Accessibility</h3>
            <p>
              The entire fleet consists of low-floor vehicles equipped with extendable wheelchair ramps, multi-language audio/visual next-stop announcements, and broad doors. This makes travel easy for the elderly, pregnant women, and passengers with disabilities.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-number">03 / CABIN COMFORT</div>
            <h3>Premium Cabin Comfort</h3>
            <p>
              Every bus features full climate-control air conditioning, ergonomic seating, built-in USB charging ports, and a quiet, spacious interior.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-number">04 / FARE SYSTEM</div>
            <h3>Cashless "Tap & Go" Fare System</h3>
            <p>
              By using the LMT Touch transit card or mobile QR scanning, conductors don't have to manually handle cash or change. This prevents fare disputes and significantly speeds up boarding times at busy stations.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-number">05 / SAFETY & SOS</div>
            <h3>Enforced Safety & Monitoring</h3>
            <p>
              The vehicles are equipped with 24/7 CCTV cameras and emergency SOS buttons. Drivers are professionally trained and monitored, eliminating aggressive driving behavior.
            </p>
          </div>

        </div>
      </section>

      {/* CONNECTED STOPS (Section 06 — Network Connectivity) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="06 / NETWORK CONNECTIVITY"
          title="Where is the network most connected?"
          description="Stops become more important when multiple routes and destinations converge at the same location."
        />

        <div className="connectivity-layout">

          <div className="connected-stop-list">
            {connectedCities.map((stop, index) => (
              <button
                className={`connected-stop ${
                  selectedStop?.city_hub === stop.city_hub ? "active" : ""
                }`}
                onClick={() => setSelectedStop(stop)}
                key={stop.id || stop.city_hub}
              >
                <span className="stop-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="stop-name">{stop.city_hub}</span>

                <span className="stop-routes">
                  {stop.routes_serving_it} routes
                </span>
              </button>
            ))}
          </div>

          {selectedStop && (
            <div className="connected-stop-detail">
              <div className="detail-label">TRANSIT HUB ANALYSIS</div>

              <h3>{selectedStop.city_hub}</h3>

              <div className="detail-stat-grid">
                <div>
                  <strong>{selectedStop.routes_serving_it}</strong>
                  <span>Routes Serving</span>
                </div>

                <div>
                  <strong>{selectedStop.total_stops}</strong>
                  <span>Total Network Stops</span>
                </div>
              </div>

              <div className="detail-info-block">
                <div className="info-item">
                  <span className="info-label">Primary Destinations Served</span>
                  <p className="info-value">{selectedStop.primary_destinations}</p>
                </div>

                <div className="info-item">
                  <span className="info-label">Major Connections & Rail Exchanges</span>
                  <p className="info-value">{selectedStop.major_connections}</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* COVERAGE & DISTRICT ANALYSIS (Section 07 — Executive Transport Summary) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="07 / COVERAGE & DISTRICT ANALYSIS"
          title="Colombo District Executive Transport Summary"
          description="A data-driven evaluation of network density, route boundaries, and regional transit dependence across the Colombo Metropolitan Region."
        />

        <div className="coverage-analysis-grid">

          {/* Card 1: Infographic Pie Chart (Dark Mode & Enlarged Chart Size) */}
          <div className="coverage-analyst-card pie-chart-infographic-card">
            <div className="pie-chart-header">
              <div className="card-badge cyan">DISTRICT DISTRIBUTION</div>
              <h3 className="pie-chart-title">
                Sri Lanka Metro Bus Network: Stop Distribution by District
              </h3>
            </div>

            <div className="pie-chart-body">
              {/* SVG Pie Chart Infographic - Enlarged 210px Size */}
              <div className="pie-chart-visual">
                <svg viewBox="0 0 200 200" className="w-[195px] h-[195px] md:w-[210px] md:h-[210px]">
                  {/* Slice 1: Inside Colombo District (90.32% = 325.15 deg) */}
                  <path
                    d="M 100 100 L 100 18 A 82 82 0 1 1 51.2 33.5 Z"
                    fill="#00d2ff"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer filter drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                  />
                  {/* Slice 2: Outside Colombo District (9.68% = 34.85 deg) */}
                  <path
                    d="M 100 100 L 51.2 33.5 A 82 82 0 0 1 100 18 Z"
                    fill="#475569"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  />
                  {/* Inner Donut Hole (Dark Theme) */}
                  <circle cx="100" cy="100" r="44" fill="#0d1218" stroke="#252c35" strokeWidth="1" />
                  {/* Center Summary Count */}
                  <text x="100" y="96" textAnchor="middle" fontSize="17" fontWeight="800" fill="#00d2ff">
                    62
                  </text>
                  <text x="100" y="112" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.5">
                    TOTAL STOPS
                  </text>
                </svg>
              </div>

              {/* Legend & Slice Callouts */}
              <div className="pie-chart-legend">
                <div className="legend-row">
                  <div className="legend-color-dot" style={{ backgroundColor: '#00d2ff' }} />
                  <div className="legend-info">
                    <div className="legend-label">Inside Colombo District (90.3%)</div>
                    <div className="legend-stat font-mono">56 Stops • 90.32%</div>
                  </div>
                </div>

                <div className="legend-row">
                  <div className="legend-color-dot" style={{ backgroundColor: '#475569' }} />
                  <div className="legend-info">
                    <div className="legend-label">Outside Colombo District (9.7%)</div>
                    <div className="legend-stat font-mono">6 Stops • 9.68%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Distance Comparison */}
          <div className="coverage-analyst-card">
            <div>
              <div className="card-badge">DISTANCE COMPARISON</div>
              <div className="distance-compare-grid">
                <div className="compare-item">
                  <strong>23.9 km</strong>
                  <span>Internal Colombo Avg</span>
                </div>
                <div className="compare-divider" />
                <div className="compare-item">
                  <strong>31.1 km</strong>
                  <span>Cross-Border Avg</span>
                </div>
              </div>
              <p className="card-desc">
                Routes remaining 100% inside Colombo are <strong>shorter on average (23.9 km)</strong> compared to regional cross-border routes (31.1 km).
              </p>
            </div>
          </div>

          {/* Card 3: Top Infrastructure Routes */}
          <div className="coverage-analyst-card">
            <div>
              <div className="card-badge">TOP INFRASTRUCTURE ROUTES</div>
              <div className="top-routes-list">
                <div className="top-route-item">
                  <span className="route-code-pill">CM01</span>
                  <span className="route-name-text">Makumbura ⇄ Pettah</span>
                  <strong className="route-count-badge">17 Colombo Stops (100%)</strong>
                </div>
                <div className="top-route-item">
                  <span className="route-code-pill">CM02</span>
                  <span className="route-name-text">Millennium City ⇄ Fort</span>
                  <strong className="route-count-badge">16 Colombo Stops (100%)</strong>
                </div>
                <div className="top-route-item">
                  <span className="route-code-pill">CM07</span>
                  <span className="route-name-text">Kesbewa ⇄ Pettah</span>
                  <strong className="route-count-badge">7 Colombo Stops (100%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Key Executive Takeaway */}
          <div className="coverage-analyst-card takeaway-card">
            <div>
              <div className="card-badge cyan">EXECUTIVE TAKEAWAY</div>
              <h3>Systemic Dependency</h3>
              <p className="takeaway-text">
                The Lanka Metro Transit network relies overwhelmingly on Colombo District infrastructure, with over 90% of all passenger stops concentrated within its urban boundaries. While cross-border routes cover longer distances on average to connect outlying suburbs, internal Colombo corridors form the high-density operational core of the entire system.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ROUTE ANALYSIS (Section 08 — Corridor Performance) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="08 / ROUTE ANALYSIS"
          title="How individual corridors perform"
          description="Route-level data allows the network to be analysed beyond a simple map."
        />

        <div className="route-grid">
          {routesData.map((route) => (
            <div className="route-card" key={route.id || route.route_code}>

              <div className="route-card-top">
                <span>{route.route_code}</span>
                <span>{route.approx_duration}</span>
              </div>

              <h3>{route.route_name}</h3>

              <div className="route-metrics">
                <div>
                  <strong>{route.total_stops}</strong>
                  <span>Stops</span>
                </div>

                <div>
                  <strong>{route.distance_km}</strong>
                  <span>Distance</span>
                </div>

                <div>
                  <strong>{route.approx_duration}</strong>
                  <span>Duration</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* DATA ANALYSIS (Section 09) */}
      <section className="metro-section analysis-section">
        <SectionTitle
          eyebrow="09 / DATA ANALYSIS"
          title="What can the data tell us?"
          description="Once route, stop, schedule and interchange data are combined, the Metro network can be evaluated using measurable indicators."
        />

        <div className="analysis-grid">

          <div className="analysis-card">
            <span>01</span>
            <h3>Route Density</h3>
            <p>
              Identify areas where a high number of routes overlap and where
              public transport connectivity is strongest.
            </p>
          </div>

          <div className="analysis-card">
            <span>02</span>
            <h3>Stop Connectivity</h3>
            <p>
              Measure how many routes, destinations and connections are
              available from individual stops.
            </p>
          </div>

          <div className="analysis-card">
            <span>03</span>
            <h3>Coverage Score</h3>
            <p>
              Compare areas using route count, stop count and destination
              connectivity.
            </p>
          </div>

          <div className="analysis-card">
            <span>04</span>
            <h3>Service Frequency</h3>
            <p>
              Analyse departure intervals to identify high-frequency and
              low-frequency corridors.
            </p>
          </div>

          <div className="analysis-card">
            <span>05</span>
            <h3>Transfer Potential</h3>
            <p>
              Identify locations where multiple transport modes or routes
              intersect.
            </p>
          </div>

          <div className="analysis-card">
            <span>06</span>
            <h3>Network Gaps</h3>
            <p>
              Identify areas with low route coverage, fewer stops or limited
              destination connectivity.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER MESSAGE */}
      <section className="metro-conclusion">
        <div>
          <span className="metro-eyebrow">LANKADATA HUB</span>

          <h2>
            From individual routes
            <br />
            to a connected network.
          </h2>

          <p>
            The purpose of Metro analysis is to understand how routes,
            stops, frequency and interchanges work together to create a
            more connected urban transport system.
          </p>
        </div>
      </section>

    </main>
  );
};

export default MetroAnalysis;
