import React, { useMemo, useState, useEffect } from 'react';
import './MetroAnalysis.css';
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

  // Compute numeric coverage score for ranking from database connected cities (metro_most_connect_cities)
  const coverageData = useMemo(() => {
    return connectedCities.map((city) => {
      const routesCount = parseInt(String(city.routes_serving_it || '0').replace(/\D/g, ''), 10) || 0;
      const stopsCount = parseInt(String(city.total_stops || '0').replace(/\D/g, ''), 10) || 0;
      const score = Math.min(99, Math.max(10, Math.round((routesCount * 2) + (stopsCount / 10))));
      return {
        ...city,
        numericScore: score,
      };
    }).sort((a, b) => b.numericScore - a.numericScore);
  }, [connectedCities]);

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
            <div className="metro-network-card">
              <div className="network-card-header">
                <span>NETWORK OVERVIEW</span>
                <span className="live-dot">LIVE DATA</span>
              </div>

              <div className="network-map">
                <div className="network-line line-1" />
                <div className="network-line line-2" />
                <div className="network-line line-3" />

                <div className="network-node node-1">FORT</div>
                <div className="network-node node-2">PETTAH</div>
                <div className="network-node node-3">MARADANA</div>
                <div className="network-node node-4">KOTTAWA</div>
                <div className="network-node node-5">DEHIWALA</div>
              </div>

              <div className="network-footer">
                <span>COLOMBO METROPOLITAN REGION</span>
                <span>ROUTE NETWORK</span>
              </div>
            </div>
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

          <div className="metro-definition-image">
            <img
              src="/metro-bus.png"
              alt="Sri Lanka Metro Bus System"
              loading="lazy"
            />
          </div>

        </div>
      </section>

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
              <StatCard value="--" label="Routes analysed" />
              <StatCard value="--" label="Stops in network" />
              <StatCard value="--" label="Destinations" />
              <StatCard value="--" label="Major connections" />
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

      {/* TRAFFIC */}
      <section className="metro-section traffic-section">
        <SectionTitle
          eyebrow="04 / TRAFFIC IMPACT"
          title="How can Metro reduce traffic pressure?"
          description="The objective is not to remove every private vehicle from the road. The objective is to provide a practical alternative for a significant number of daily journeys."
        />

        <div className="traffic-flow">

          <div className="traffic-step">
            <div className="traffic-step-number">01</div>
            <h3>Concentrate demand</h3>
            <p>
              High-frequency services focus public transport capacity on the
              corridors where large numbers of people travel.
            </p>
          </div>

          <div className="traffic-arrow">→</div>

          <div className="traffic-step">
            <div className="traffic-step-number">02</div>
            <h3>Make transfers easier</h3>
            <p>
              Interchanges connect local, express and rail services so one
              journey does not require multiple disconnected trips.
            </p>
          </div>

          <div className="traffic-arrow">→</div>

          <div className="traffic-step">
            <div className="traffic-step-number">03</div>
            <h3>Shift journeys</h3>
            <p>
              Better frequency, information and connectivity make shared
              transport a more practical alternative to private vehicles.
            </p>
          </div>

          <div className="traffic-arrow">→</div>

          <div className="traffic-step">
            <div className="traffic-step-number">04</div>
            <h3>Reduce road pressure</h3>
            <p>
              If more passengers share high-capacity services, fewer individual
              vehicles are required for the same number of journeys.
            </p>
          </div>

        </div>
      </section>

      {/* CONNECTED STOPS (Fetched from PostgreSQL metro_most_connect_cities table) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="05 / NETWORK CONNECTIVITY"
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
              <div className="detail-label">MOST CONNECTED STOP</div>

              <h3>{selectedStop.city_hub}</h3>

              <div className="detail-stat-grid">
                <div>
                  <strong>{selectedStop.routes_serving_it}</strong>
                  <span>Routes</span>
                </div>

                <div>
                  <strong>{selectedStop.primary_destinations}</strong>
                  <span>Destinations</span>
                </div>

                <div>
                  <strong>{selectedStop.major_connections}</strong>
                  <span>Major connections</span>
                </div>

                <div>
                  <strong>{selectedStop.total_stops}</strong>
                  <span>Network stops</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* COVERAGE ANALYSIS (Fetched from PostgreSQL metro_most_connect_cities table) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="06 / COVERAGE ANALYSIS"
          title="Metro Bus Coverage"
          description="Coverage can be assessed by combining route availability, stop density and destination connectivity."
        />

        <div className="coverage-layout">

          <div className="coverage-visual">
            <div className="coverage-map">

              {coverageData.slice(0, 5).map((area, index) => (
                <div
                  key={area.city_hub}
                  className="coverage-zone"
                  style={
                    {
                      '--coverage': `${area.numericScore}%`,
                      '--position': `${15 + index * 17}%`,
                    } as React.CSSProperties
                  }
                >
                  <span>{area.city_hub}</span>
                </div>
              ))}

              <div className="coverage-map-title">
                COVERAGE INTENSITY
              </div>

            </div>

            <div className="coverage-legend">
              <span>LOW COVERAGE</span>
              <div className="coverage-gradient" />
              <span>HIGH COVERAGE</span>
            </div>
          </div>

          <div className="coverage-ranking">
            {coverageData.map((area, index) => (
              <div className="coverage-row" key={area.city_hub}>
                <div className="coverage-area">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{area.city_hub}</strong>
                </div>

                <div className="coverage-bar-wrapper">
                  <div
                    className="coverage-bar"
                    style={{ width: `${area.numericScore}%` }}
                  />
                </div>

                <strong className="coverage-score">
                  {area.numericScore}
                </strong>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ROUTE ANALYSIS (Fetched from PostgreSQL metro_bus table — 3x3 layout) */}
      <section className="metro-section">
        <SectionTitle
          eyebrow="07 / ROUTE ANALYSIS"
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

      {/* DATA ANALYSIS */}
      <section className="metro-section analysis-section">
        <SectionTitle
          eyebrow="08 / DATA ANALYSIS"
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
