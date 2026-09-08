import React, { useState, useEffect } from 'react';
import './MetroAnalysis.css';
import { WesternProvinceMap } from '../components/WesternProvinceMap';
import { MetroNetworkMap } from '../components/MetroNetworkMap/MetroNetworkMap';
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
import {
  BusFront,
  Route,
  Network,
  Clock,
  MapPin,
  Building2,
  Monitor,
  CreditCard,
  BarChart3,
  GitBranch,
  Map,
  ChartNoAxesCombined,
  Lightbulb,
  Zap,
  Activity,
  ShieldCheck,
  Smartphone,
  Radio,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WhyMetroItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  result: string;
}

interface AudienceItem {
  icon: React.ReactNode;
  title: string;
  text: string;
  image?: string;
}

const whyMetro: WhyMetroItem[] = [
  {
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    title: "Congested urban corridors",
    description:
      "High-frequency public transport concentrates passenger movement on major corridors instead of relying entirely on individual vehicles.",
    result:
      "More people can move through shared transport using existing road capacity more efficiently.",
  },
  {
    icon: <Clock className="w-5 h-5 text-cyan-400" />,
    title: "Uncertainty about bus arrival",
    description:
      "GPS tracking and passenger information systems provide better visibility of vehicle movement and service conditions.",
    result:
      "Passengers can plan journeys around real-time service information.",
  },
  {
    icon: <GitBranch className="w-5 h-5 text-cyan-400" />,
    title: "Disconnected bus services",
    description:
      "Connected routes and interchange infrastructure allow passengers to transfer between services more easily.",
    result:
      "Transfers become simpler and the network becomes more useful as a whole.",
  },
  {
    icon: <Clock className="w-5 h-5 text-cyan-400" />,
    title: "Long waiting times",
    description:
      "Frequent peak-period services reduce the amount of time passengers need to wait for the next vehicle.",
    result:
      "Shorter waiting periods and better service availability.",
  },
  {
    icon: <Building2 className="w-5 h-5 text-cyan-400" />,
    title: "Limited accessibility",
    description:
      "Modern vehicles and passenger facilities can support low-floor access, wheelchair users and priority seating.",
    result:
      "Public transport becomes accessible to a wider passenger population.",
  },
  {
    icon: <Monitor className="w-5 h-5 text-cyan-400" />,
    title: "Fragmented passenger information",
    description:
      "GPS, digital displays and mobile applications can bring service information into one passenger experience.",
    result:
      "Passengers gain better visibility of the network.",
  },
  {
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
    title: "Urban emissions and traffic pressure",
    description:
      "High-capacity shared transport allows more passengers to travel without requiring an equivalent increase in private vehicles.",
    result:
      "Supports more sustainable urban mobility and can reduce traffic pressure on major corridors.",
  },
];

const audience: AudienceItem[] = [
  {
    icon: <Clock className="w-5 h-5 text-cyan-400" />,
    title: "Daily commuters",
    text: "People travelling to Colombo and surrounding urban centres every day can benefit from predictable, frequent services.",
    image: "/daily-commuters.png",
  },
  {
    icon: <Building2 className="w-5 h-5 text-cyan-400" />,
    title: "Students",
    text: "Students can use connected routes to reach schools, universities and other education centres without depending entirely on private transport.",
    image: "/students-transit.png",
  },
  {
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
    title: "Workers",
    text: "Workers travelling between residential areas and employment centres can benefit from reliable high-frequency corridors.",
    image: "/office-workers.png",
  },
  {
    icon: <MapPin className="w-5 h-5 text-cyan-400" />,
    title: "Visitors and occasional passengers",
    text: "Clear route information, connected stops and passenger information make the network easier to understand.",
    image: "/visitors-passengers.png",
  },
];

const metroFeatures = [
  {
    icon: <Clock className="w-5 h-5 text-cyan-400" />,
    title: "High-Frequency Services",
    description: "Frequent and reliable services operating along important urban corridors.",
    image: "/feature-high-frequency.png",
  },
  {
    icon: <MapPin className="w-5 h-5 text-cyan-400" />,
    title: "Live GPS Tracking",
    description: "Real-time location tracking and estimated bus arrival information.",
    image: "/feature-live-gps.png",
  },
  {
    icon: <Building2 className="w-5 h-5 text-cyan-400" />,
    title: "Modern Passenger Facilities",
    description: "Improved bus stops, stations, shelters and passenger infrastructure.",
    image: "/feature-modern-facilities.png",
  },
  {
    icon: <Monitor className="w-5 h-5 text-cyan-400" />,
    title: "Digital Information",
    description: "Real-time information about routes, arrivals and service updates.",
    image: "/feature-digital-info.png",
  },
  {
    icon: <CreditCard className="w-5 h-5 text-cyan-400" />,
    title: "Digital Ticketing",
    description: "Modern and convenient fare payment systems.",
    image: "/feature-digital-ticketing.png",
  },
  {
    icon: <GitBranch className="w-5 h-5 text-cyan-400" />,
    title: "Connected Interchanges",
    description: "Better connections between buses and other transport services.",
    image: "/feature-connected-interchanges.png",
  },
];

// Double-checked trusted route specification details
const trustedRouteSpecs: Record<string, {
  peak_headway: string;
  off_peak_headway: string;
  operating_hours: string;
  fare_range_lkr: string;
  multimodal_transfers: string[];
  stops: string[];
}> = {
  CM01: {
    peak_headway: "5 – 7 min",
    off_peak_headway: "12 min",
    operating_hours: "05:30 – 22:30",
    fare_range_lkr: "LKR 50 – LKR 180",
    multimodal_transfers: ["Southern Expressway Hub", "Pettah Central Bus Stand", "Fort Railway Station"],
    stops: ["Makumbura MMC", "Kottawa Junction", "Pannipitiya", "Thalawathugoda", "Battaramulla (Sethsiripaya)", "Rajagiriya", "Borella", "Town Hall", "Pettah", "Colombo Fort"],
  },
  CM02: {
    peak_headway: "6 – 8 min",
    off_peak_headway: "15 min",
    operating_hours: "05:30 – 22:00",
    fare_range_lkr: "LKR 50 – LKR 170",
    multimodal_transfers: ["Maradana Railway Exchange", "Fort Railway Station", "Pettah Bus Hub"],
    stops: ["Millennium City (Athurugiriya)", "Arangala", "Malabe Junction", "Thalangama", "Battaramulla", "Rajagiriya", "Borella", "Maradana", "Colombo Fort"],
  },
  CM03: {
    peak_headway: "8 – 10 min",
    off_peak_headway: "15 min",
    operating_hours: "05:30 – 22:00",
    fare_range_lkr: "LKR 60 – LKR 220",
    multimodal_transfers: ["Central Expressway Terminal", "Kottawa Railway Station", "Kelaniya University Hub"],
    stops: ["Kadawatha Interchange Terminal", "Mahara", "Kiribathgoda", "Kelaniya University", "Dematagoda", "Narahenpita", "Nawinna", "Maharagama", "Apeksha Hospital", "Kottawa", "Makumbura MMC"],
  },
  CM04: {
    peak_headway: "6 – 8 min",
    off_peak_headway: "12 min",
    operating_hours: "05:30 – 22:30",
    fare_range_lkr: "LKR 50 – LKR 190",
    multimodal_transfers: ["Coastal Railway Line", "Panadura Bus Terminal", "Dematagoda Railway Station"],
    stops: ["Dematagoda", "Borella", "Campbell Park", "Narahenpita Junction", "Kirulapone", "Nugegoda", "Delkanda", "Wijerama", "Dehiwala", "Ratmalana", "Moratuwa", "Panadura Terminal"],
  },
  CM05: {
    peak_headway: "10 – 12 min",
    off_peak_headway: "18 min",
    operating_hours: "05:30 – 21:30",
    fare_range_lkr: "LKR 60 – LKR 200",
    multimodal_transfers: ["Ja-Ela Railway Station", "Main Railway Line (Kelaniya)", "Ekala Industrial Zone"],
    stops: ["Battaramulla Depot", "Rajagiriya", "Ayurveda Junction", "Kelaniya", "Thorana Junction", "Kiribathgoda", "Mahara", "Kadawatha", "Ja-Ela", "Ekala Industrial Zone"],
  },
  CM06: {
    peak_headway: "5 min",
    off_peak_headway: "8 min",
    operating_hours: "06:00 – 22:00",
    fare_range_lkr: "LKR 50 – LKR 90",
    multimodal_transfers: ["Kollupitiya Railway Station", "Bambalapitiya Railway Station", "Town Hall Bus Hub"],
    stops: ["Kollupitiya Junction", "Liberty Plaza", "Town Hall", "Horton Place", "Barnes Place", "Bambalapitiya", "Kollupitiya Circular"],
  },
  CM07: {
    peak_headway: "6 – 8 min",
    off_peak_headway: "12 min",
    operating_hours: "05:30 – 22:00",
    fare_range_lkr: "LKR 50 – LKR 160",
    multimodal_transfers: ["Pettah Central Bus Stand", "Fort Railway Station", "Boralesgamuwa Transit Hub"],
    stops: ["Kesbewa", "Piliyandala", "Werahera", "Boralesgamuwa", "Pepiliyana", "Nugegoda", "Kirulapone", "Pettah"],
  },
  CM08: {
    peak_headway: "4 – 6 min",
    off_peak_headway: "8 min",
    operating_hours: "06:00 – 22:00",
    fare_range_lkr: "LKR 50 – LKR 80",
    multimodal_transfers: ["Maradana Railway Station", "Fort Railway Station", "Pettah Bus Hub"],
    stops: ["Pettah", "Regal Cinema", "Gamin Hall", "Maradana Railway Station", "Hedges Court", "Town Hall", "Nelum Pokuna", "Pettah"],
  },
};

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
  icon?: React.ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
}

function SectionTitle({ icon, eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="metro-section-heading">
      <div className="metro-eyebrow-container">
        {icon}
        <span className="metro-eyebrow">{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {description && <p className="metro-section-description">{description}</p>}
    </div>
  );
}

export const MetroAnalysis: React.FC = () => {
  // State querying PostgreSQL database tables (metro_total, metro_most_connect_cities, metro_bus)
  const [totals, setTotals] = useState<MetroTotalItem[]>([]);
  const [connectedCities, setConnectedCities] = useState<MetroConnectedCity[]>([]);
  const [routesData, setRoutesData] = useState<MetroBusRoute[]>([]);
  const [selectedStop, setSelectedStop] = useState<MetroConnectedCity | null>(null);
  const [expandedRouteCode, setExpandedRouteCode] = useState<string | null>(null);
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
            <div className="metro-label flex items-center gap-2">
              <BusFront className="w-4 h-4 text-cyan-400" />
              <span>LANKADATA HUB / METRO BUS</span>
            </div>

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

      {/* SECTION 01: WHAT IS METRO */}
      <section className="metro-section">
        <SectionTitle
          icon={<BusFront className="w-4 h-4 text-cyan-400" />}
          eyebrow="UNDERSTANDING THE CONCEPT"
          title="What is a Metro Bus System?"
        />

        {/* Detailed Overview Paragraphs (Summarized, muted text-slate-400, justified alignment) */}
        <div className="space-y-3 mb-10 text-slate-400 text-justify">
          <p className="text-base md:text-lg leading-relaxed">
            Metro Bus is a connected urban mobility system built around high-frequency routes, modern passenger facilities, real-time GPS tracking, and multimodal transport interchanges.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            In Sri Lanka, the <strong className="text-cyan-400 font-semibold">Lanka Metro Transit (LMT)</strong> concept overhauls public transit across Western Province corridors (Galle Road, High-Level, Low-Level). By deploying low-floor AC buses, dedicated bus priority lanes, automated dispatching, and cashless "Tap & Go" ticketing, Metro Bus provides fast, reliable, and congestion-free transit linked to SLR train hubs.
          </p>
        </div>

        {/* 6 Metro Feature Cards Grid */}
        <div className="metro-features-grid">
          {metroFeatures.map((feature) => (
            <div className="metro-feature-card" key={feature.title}>
              <div className="feature-image-thumb">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-thumb-img"
                  loading="lazy"
                />
                <div className="feature-thumb-overlay" />
                <div className="feature-icon-badge">
                  {feature.icon}
                </div>
              </div>

              <div className="feature-card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visually Highlighted Statement Banner */}
        <div className="metro-highlight-statement">
          <p>
            "Metro is not simply about operating more buses. It is about creating one connected mobility network."
          </p>
        </div>

        {/* 5-Step Passenger Journey Flow Graphics */}
        <div className="passenger-journey-flow">
          {/* Step 1: Passenger Check Bus On Phone */}
          <div className="journey-step-card">
            <div className="journey-svg-box">
              <svg viewBox="0 0 80 80" className="journey-svg">
                <rect x="22" y="16" width="22" height="38" rx="4" fill="#0f172a" stroke="#00d2ff" strokeWidth="1.5" />
                <rect x="25" y="21" width="16" height="25" fill="#1e293b" />
                <circle cx="33" cy="33.5" r="4" fill="#00d2ff" opacity="0.3" />
                <circle cx="33" cy="33.5" r="2" fill="#00d2ff" />
                <circle cx="56" cy="24" r="5" fill="#38bdf8" />
                <path d="M 56 30 C 48 30 46 36 46 44 L 46 58 L 52 58 L 52 46 L 56 46 L 56 58 L 62 58 L 62 42 C 62 36 60 30 56 30 Z" fill="#38bdf8" />
                <path d="M 50 34 L 40 38" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="journey-step-num">01</div>
            <div className="journey-step-title">Check Bus on Phone</div>
          </div>

          <div className="journey-arrow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400">
              <path d="M 5 12 L 19 12 M 13 6 L 19 12 L 13 18" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Step 2: Goes to Bus Stop On Time */}
          <div className="journey-step-card">
            <div className="journey-svg-box">
              <svg viewBox="0 0 80 80" className="journey-svg">
                <path d="M 16 22 L 50 22 L 50 26 L 16 26 Z" fill="#00d2ff" />
                <line x1="20" y1="26" x2="20" y2="58" stroke="#475569" strokeWidth="2" />
                <line x1="46" y1="26" x2="46" y2="58" stroke="#475569" strokeWidth="2" />
                <circle cx="33" cy="34" r="6" fill="#0f172a" stroke="#00d2ff" strokeWidth="1" />
                <path d="M 33 31 L 33 34 L 35 34" stroke="#00d2ff" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="62" cy="24" r="5" fill="#38bdf8" />
                <path d="M 62 30 C 58 30 56 35 56 42 L 52 56 L 56 56 L 60 46 L 64 56 L 68 56 L 63 42 Z" fill="#38bdf8" />
              </svg>
            </div>
            <div className="journey-step-num">02</div>
            <div className="journey-step-title">Goes to Bus Stop</div>
          </div>

          <div className="journey-arrow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400">
              <path d="M 5 12 L 19 12 M 13 6 L 19 12 L 13 18" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Step 3: No Waits */}
          <div className="journey-step-card highlight-card">
            <div className="journey-svg-box">
              <svg viewBox="0 0 80 80" className="journey-svg">
                <circle cx="28" cy="28" r="12" fill="rgba(0,210,255,0.15)" stroke="#00d2ff" strokeWidth="1.5" />
                <path d="M 29 20 L 23 29 L 28 29 L 26 36 L 33 27 L 28 27 Z" fill="#00d2ff" />
                <circle cx="56" cy="24" r="5" fill="#00d2ff" />
                <path d="M 56 30 C 50 30 48 35 48 42 L 48 58 L 54 58 L 54 48 L 58 48 L 58 58 L 64 58 L 64 42 C 64 35 62 30 56 30 Z" fill="#00d2ff" />
              </svg>
            </div>
            <div className="journey-step-num text-cyan-400">03</div>
            <div className="journey-step-title text-cyan-400">No Waiting</div>
          </div>

          <div className="journey-arrow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400">
              <path d="M 5 12 L 19 12 M 13 6 L 19 12 L 13 18" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Step 4: On Board */}
          <div className="journey-step-card">
            <div className="journey-svg-box">
              <svg viewBox="0 0 80 80" className="journey-svg">
                <rect x="18" y="18" width="44" height="42" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="40" y1="18" x2="40" y2="60" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="34" cy="28" r="4.5" fill="#38bdf8" />
                <path d="M 34 33 C 30 33 28 37 28 43 L 28 56 L 32 56 L 32 46 L 36 46 L 36 56 L 40 56 L 40 43 Z" fill="#38bdf8" />
              </svg>
            </div>
            <div className="journey-step-num">04</div>
            <div className="journey-step-title">On Board</div>
          </div>

          <div className="journey-arrow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400">
              <path d="M 5 12 L 19 12 M 13 6 L 19 12 L 13 18" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Step 5: Destination */}
          <div className="journey-step-card">
            <div className="journey-svg-box">
              <svg viewBox="0 0 80 80" className="journey-svg">
                <path d="M 28 20 C 20 20 14 26 14 34 C 14 46 28 58 28 58 C 28 58 42 46 42 34 C 42 26 36 20 28 20 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <path d="M 23 34 L 27 38 L 34 30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="58" cy="24" r="5" fill="#10b981" />
                <path d="M 58 30 C 52 30 50 35 50 42 L 50 58 L 56 58 L 56 48 L 60 48 L 60 58 L 66 58 L 66 42 C 66 35 64 30 58 30 Z" fill="#10b981" />
              </svg>
            </div>
            <div className="journey-step-num">05</div>
            <div className="journey-step-title">Destination</div>
          </div>
        </div>

        {/* Centered Metro Transit Map (Fit on Screen in One View) */}
        <div className="w-full max-w-[1050px] mx-auto mt-8 flex justify-center">
          <MetroNetworkMap />
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
            totals.map((item) => {
              let label = item.network_metric;
              let val = item.total_count;
              if (label === "Total Destinations Served" || label === "Destinations Served") {
                label = "Destinations";
                val = "20+";
              } else if (label === "Destinations" && (val === "11" || !val)) {
                val = "20+";
              }
              if (label === "Total Network Bus Stops") {
                val = "150+";
              }
              return (
                <StatCard
                  key={item.id || label}
                  value={val}
                  label={label}
                />
              );
            })
          ) : (
            <>
              <StatCard value="7" label="Total Active Routes" />
              <StatCard value="20+" label="Destinations" />
              <StatCard value="150+" label="Total Network Bus Stops" />
              <StatCard value="5" label="Total Major Connections" />
            </>
          )}
        </div>
      </section>

      {/* SECTION 02: WHY METRO */}
      <section className="metro-section">
        <SectionTitle
          icon={<Lightbulb className="w-4 h-4 text-cyan-400" />}
          eyebrow="02 / WHY METRO?"
          title="What changes when public transport becomes connected?"
          description="The value of Metro is not only the number of buses. It comes from how services solve common problems faced by passengers and urban areas."
        />

        {/* Introductory Paragraph: Why Traditional Public Transport vs Why Metro (Summarized) */}
        <div className="why-metro-intro-block">
          <div className="why-intro-header flex items-center gap-2 mb-3">
            <BusFront className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-cyan-400">
              TRADITIONAL TRANSPORT VS. LANKA METRO TRANSIT
            </h3>
          </div>

          <p className="why-metro-lead-text text-sm md:text-base leading-relaxed text-slate-300">
            Traditional transport in Sri Lanka suffers from aggressive bus racing, unpredictable arrivals, cash disputes, and overcrowded stops. <strong className="text-cyan-400 font-semibold">Lanka Metro Transit (LMT)</strong> replaces this chaos with a structured, reliable network featuring automated schedules, low-floor buses, real-time GPS tracking, and cashless "Tap & Go" ticketing for a predictable commute.
          </p>

          {/* Key Solution Features Square Dev Boxes Grid */}
          <div className="lmt-square-features-grid">
            <div className="lmt-square-card">
              <div className="lmt-square-icon-box">
                <Clock className="w-7 h-7 text-cyan-400" />
              </div>
              <h4>Fixed Schedules</h4>
              <p>Fixed departure times eliminate long waits & bus racing.</p>
            </div>

            <div className="lmt-square-card">
              <div className="lmt-square-icon-box">
                <BusFront className="w-7 h-7 text-cyan-400" />
              </div>
              <h4>Low-Floor Fleet</h4>
              <p>Climate-controlled electric & diesel accessible buses.</p>
            </div>

            <div className="lmt-square-card">
              <div className="lmt-square-icon-box">
                <Radio className="w-7 h-7 text-cyan-400" />
              </div>
              <h4>Satellite GPS</h4>
              <p>Real-time location tracking on shelters & mobile app.</p>
            </div>

            <div className="lmt-square-card">
              <div className="lmt-square-icon-box">
                <CreditCard className="w-7 h-7 text-cyan-400" />
              </div>
              <h4>Tap & Go Pay</h4>
              <p>Cashless transit card & phone QR boarding payment.</p>
            </div>

            <div className="lmt-square-card">
              <div className="lmt-square-icon-box">
                <GitBranch className="w-7 h-7 text-cyan-400" />
              </div>
              <h4>Bus-Rail Interchanges</h4>
              <p>Connecting Metro Bus lines to Sri Lanka Railways (SLR) suburban train hubs.</p>
            </div>
          </div>
        </div>

        <div className="why-metro-grid">
          {whyMetro.map((item, index) => (
            <div className="why-card" key={item.title}>
              <div className="why-card-top flex items-center justify-between mb-3">
                <div className="why-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                  {item.icon}
                </div>
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

      {/* SECTION 03: TARGET AUDIENCE */}
      <section className="metro-section audience-section">
        <SectionTitle
          icon={<BusFront className="w-4 h-4 text-cyan-400" />}
          eyebrow="03 / WHO IS IT FOR?"
          title="Who benefits from a connected Metro network?"
          description="Metro is designed around the needs of people who depend on reliable movement between residential areas, employment centres, education centres and transport hubs."
        />

        <div className="audience-grid">
          {audience.map((item, index) => (
            <div className="audience-card" key={item.title}>
              <div className="audience-image-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="audience-card-img"
                  loading="lazy"
                />
                <div className="audience-img-overlay" />
                <div className="audience-index-badge">
                  0{index + 1}
                </div>
              </div>

              <div className="audience-card-body">
                <div className="audience-card-header flex items-center justify-between mb-2">
                  <h3>{item.title}</h3>
                  <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                    {item.icon}
                  </div>
                </div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 04: TRAFFIC IMPACT */}
      <section className="metro-section traffic-section">
        <SectionTitle
          icon={<Zap className="w-4 h-4 text-cyan-400" />}
          eyebrow="04 / TRAFFIC IMPACT"
          title="How the Metro Bus Cuts Down Traffic"
          description="Colombo experiences severe gridlock, with over 250,000 private vehicles entering the city daily. The Metro Bus aims to break this congestion through a 'modal shift'—getting people out of their private cars and onto public transit:"
        />

        {/* 3 Horizontal Dev Boxes Side-by-Side (Left to Right) with Generated Dark Mode Images */}
        <div className="traffic-horizontal-grid">

          {/* Dev Box 01 */}
          <div className="traffic-step-card">
            <div className="traffic-card-image-wrap">
              <img
                src="/traffic-space-optimization.png"
                alt="Massive Space Optimization"
                className="traffic-card-img"
                loading="lazy"
              />
              <div className="traffic-img-overlay" />
              <div className="traffic-step-badge">
                <span>01</span>
                <BusFront className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="traffic-card-content">
              <h3>Massive Space Optimization</h3>
              <p>
                One single FOTON Metro Bus carries up to 80+ passengers. This efficiently removes roughly 40 to 50 private cars or three-wheelers from tightly packed Colombo roads like the High-Level or Galle Road corridors.
              </p>
            </div>
          </div>

          {/* Dev Box 02 */}
          <div className="traffic-step-card">
            <div className="traffic-card-image-wrap">
              <img
                src="/traffic-priority-lanes.png"
                alt="Bus Priority Lanes"
                className="traffic-card-img"
                loading="lazy"
              />
              <div className="traffic-img-overlay" />
              <div className="traffic-step-badge">
                <span>02</span>
                <Route className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="traffic-card-content">
              <h3>Bus Priority Lanes</h3>
              <p>
                LMT works alongside designated bus priority corridors. Keeping the buses separated from regular traffic ensures they don't get stuck in standard gridlocks, allowing them to bypass car queues.
              </p>
            </div>
          </div>

          {/* Dev Box 03 */}
          <div className="traffic-step-card">
            <div className="traffic-card-image-wrap">
              <img
                src="/traffic-scheduled-dispatch.png"
                alt="Eliminating Bus Racing"
                className="traffic-card-img"
                loading="lazy"
              />
              <div className="traffic-img-overlay" />
              <div className="traffic-step-badge">
                <span>03</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="traffic-card-content">
              <h3>Eliminating "Bus Racing"</h3>
              <p>
                Traditional private buses in Sri Lanka often idle at stops to wait for passengers and then race dangerously to beat competitors. LMT operates under a unified cluster company model with fixed, automated schedules, keeping traffic moving smoothly.
              </p>
            </div>
          </div>

        </div>

        {/* Side-by-Side 3D Bus Architecture & Operational Metrics Grid */}
        <div className="metro-metrics-container">
          <div className="metrics-heading flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL METRICS & METRO BUS 3D ARCHITECTURE</span>
          </div>
          
          <div className="architecture-metrics-layout">

            {/* Left Column: 3D Wireframe Bus Architecture Model Blueprint */}
            <div className="metro-3d-architecture-col">
              <div className="architecture-blueprint-card">
                <div className="blueprint-header-bar">
                  <span>METRO BUS 3D ARCHITECTURE</span>
                  <span className="font-mono text-cyan-400">SUBDIVISION LEVEL 1</span>
                </div>
                
                <div className="blueprint-image-wrap">
                  <img
                    src="/metro-bus-3d-wireframe.png"
                    alt="Metro Bus 3D Wireframe Architecture Blueprint"
                    className="blueprint-img"
                  />

                  {/* Blueprint Callout Pins & Labels */}
                  <div className="blueprint-tag tag-cockpit">
                    <span className="tag-dot" />
                    <span className="tag-label">DRIVER CABIN & GPS</span>
                  </div>

                  <div className="blueprint-tag tag-doors">
                    <span className="tag-dot" />
                    <span className="tag-label">DUAL AUTO DOORS</span>
                  </div>

                  <div className="blueprint-tag tag-seating">
                    <span className="tag-dot" />
                    <span className="tag-label">33 SEATS / ~47 STANDING</span>
                  </div>
                </div>

                <div className="blueprint-caption">
                  FOTON 12M Low-Floor Rapid Transit Wireframe Blueprint
                </div>
              </div>
            </div>

            {/* Right Column: Operational Metrics & Target Details */}
            <div className="metro-metrics-details-col">
              <div className="metrics-card-grid-compact">
                <div className="metric-visual-card">
                  <div>
                    <div className="metric-visual-val">122</div>
                    <div className="metric-visual-title">Current Fleet Size</div>
                  </div>
                  <div className="metric-visual-desc">Active rollout target across Colombo lines.</div>
                </div>

                <div className="metric-visual-card">
                  <div>
                    <div className="metric-visual-val">272</div>
                    <div className="metric-visual-title">Future Target (2027)</div>
                  </div>
                  <div className="metric-visual-desc">Planned fleet scale-up for regional expansion.</div>
                </div>

                <div className="metric-visual-card">
                  <div>
                    <div className="metric-visual-val">80+</div>
                    <div className="metric-visual-title">Total Capacity</div>
                  </div>
                  <div className="metric-visual-desc">Built for high-volume rapid urban transport.</div>
                </div>

                <div className="metric-visual-card">
                  <div>
                    <div className="metric-visual-val">33</div>
                    <div className="metric-visual-title">Seating Layout</div>
                  </div>
                  <div className="metric-visual-desc">Priority seats & automated wheelchair ramp.</div>
                </div>

                <div className="metric-visual-card">
                  <div>
                    <div className="metric-visual-val">~47</div>
                    <div className="metric-visual-title">Standing Room</div>
                  </div>
                  <div className="metric-visual-desc">Spacious aisle with overhead grab handles.</div>
                </div>
              </div>

              {/* Environmental & Speed Metrics Strip */}
              <div className="environmental-metrics-strip-compact">
                <div className="env-metric-item">
                  <span className="env-label">CO₂ REDUCTION</span>
                  <strong>-42g / pax-km</strong>
                  <p>Emissions saved per passenger vs private cars.</p>
                </div>
                <div className="env-metric-item">
                  <span className="env-label">DAILY CAPACITY</span>
                  <strong>97,600+ Pax/Day</strong>
                  <p>Daily volume capacity across 7 corridors.</p>
                </div>
                <div className="env-metric-item">
                  <span className="env-label">PEAK SPEED</span>
                  <strong>24 km/h Avg</strong>
                  <p>Priority lane speed vs 11 km/h gridlock.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 05: RIDE EXPERIENCE */}
      <section className="metro-section">
        <SectionTitle
          icon={<Building2 className="w-4 h-4 text-cyan-400" />}
          eyebrow="05 / RIDE EXPERIENCE"
          title="How Metro Upgrades the Quality of Your Ride"
          description="The service fixes long-standing complaints about local public transport—such as overcrowding, loud noises, and unpredictable schedules—by introducing modern European-standard features:"
        />

        <div className="ride-features-grid">

          <div className="ride-feature-card">
            <div className="feature-card-header flex items-center justify-between mb-3">
              <div className="feature-number">01 / LMT-GO APP</div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3>Zero Waiting via LMT-GO App</h3>
            <p>
              Passengers no longer have to guess when the next bus will show up. Continuous satellite GPS tracking feeds live arrival times directly to smart shelters and commuters' mobile phones.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-card-header flex items-center justify-between mb-3">
              <div className="feature-number">02 / ACCESSIBILITY</div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3>True Inclusion & Accessibility</h3>
            <p>
              The entire fleet consists of low-floor vehicles equipped with extendable wheelchair ramps, multi-language audio/visual next-stop announcements, and broad doors. This makes travel easy for the elderly, pregnant women, and passengers with disabilities.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-card-header flex items-center justify-between mb-3">
              <div className="feature-number">03 / CABIN COMFORT</div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                <BusFront className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3>Premium Cabin Comfort</h3>
            <p>
              Every bus features full climate-control air conditioning, ergonomic seating, built-in USB charging ports, and a quiet, spacious interior.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-card-header flex items-center justify-between mb-3">
              <div className="feature-number">04 / FARE SYSTEM</div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                <CreditCard className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3>Cashless "Tap & Go" Fare System</h3>
            <p>
              By using the LMT Touch transit card or mobile QR scanning, conductors don't have to manually handle cash or change. This prevents fare disputes and significantly speeds up boarding times at busy stations.
            </p>
          </div>

          <div className="ride-feature-card">
            <div className="feature-card-header flex items-center justify-between mb-3">
              <div className="feature-number">05 / SAFETY & SOS</div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3>Enforced Safety & Monitoring</h3>
            <p>
              The vehicles are equipped with 24/7 CCTV cameras and emergency SOS buttons. Drivers are professionally trained and monitored, eliminating aggressive driving behavior.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 06: CONNECTED STOPS */}
      <section className="metro-section">
        <SectionTitle
          icon={<Network className="w-4 h-4 text-cyan-400" />}
          eyebrow="06 / NETWORK CONNECTIVITY"
          title="Where is the network most connected?"
          description="Stops become more important when multiple routes, expressways, and rail lines converge at the same location."
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
              <div className="detail-label flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>TRANSIT HUB ANALYSIS</span>
              </div>

              <h3>{selectedStop.city_hub}</h3>

              <div className="detail-info-block">
                <div className="detail-stat-row">
                  <div className="info-item">
                    <span className="info-label">Routes Serving</span>
                    <p className="info-value-stat">{selectedStop.routes_serving_it} Active Routes</p>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Total Network Stops</span>
                    <p className="info-value-stat">{selectedStop.total_stops} Designated Stops</p>
                  </div>
                </div>

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

        {/* Interactive Connectivity Visual Analytics (Pie Chart Left & Bar Chart Right) */}
        <div className="connectivity-charts-grid">

          {/* Left Chart: SVG Donut/Pie Chart for Selected Hub Route Share */}
          <div className="connectivity-chart-card">
            <div className="chart-card-header">
              <span className="chart-badge cyan flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-cyan-400" />
                ROUTE CONNECTIVITY SHARE
              </span>
              <h3>{selectedStop ? selectedStop.city_hub : "Selected Hub"} Network Share</h3>
            </div>

            {selectedStop && (() => {
              const routesCount = parseInt(selectedStop.routes_serving_it, 10) || 1;
              const totalRoutes = 7;
              const percentage = Math.round((routesCount / totalRoutes) * 100);
              const circumference = 2 * Math.PI * 65; // r = 65 => 408.4
              const dashOffset = circumference - (routesCount / totalRoutes) * circumference;

              return (
                <div className="pie-chart-container">
                  <div className="svg-donut-wrap">
                    <svg viewBox="0 0 180 180" className="w-[170px] h-[170px]">
                      {/* Background Donut Track */}
                      <circle
                        cx="90"
                        cy="90"
                        r="65"
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="20"
                      />
                      {/* Active Route Slice */}
                      <circle
                        cx="90"
                        cy="90"
                        r="65"
                        fill="transparent"
                        stroke="#00d2ff"
                        strokeWidth="20"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform="rotate(-90 90 90)"
                        className="transition-all duration-700 ease-out filter drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                      />
                      {/* Center Donut Text */}
                      <text x="90" y="85" textAnchor="middle" fontSize="24" fontWeight="800" fill="#00d2ff">
                        {routesCount} / {totalRoutes}
                      </text>
                      <text x="90" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" letterSpacing="0.8">
                        ROUTES ({percentage}%)
                      </text>
                    </svg>
                  </div>

                  <div className="pie-legend-block">
                    <div className="legend-item">
                      <div className="legend-dot bg-cyan" />
                      <div>
                        <div className="legend-title">{selectedStop.city_hub} Routes</div>
                        <div className="legend-sub font-mono">{routesCount} of {totalRoutes} Active Corridors</div>
                      </div>
                    </div>

                    <div className="legend-item">
                      <div className="legend-dot bg-slate" />
                      <div>
                        <div className="legend-title">Other Network Corridors</div>
                        <div className="legend-sub font-mono">{totalRoutes - routesCount} Other Corridors</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Chart: Bar Chart comparing Routes Serving across Connected Hubs */}
          <div className="connectivity-chart-card">
            <div className="chart-card-header">
              <span className="chart-badge flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-cyan-400" />
                NETWORK HUB COMPARISON
              </span>
              <h3>Routes Serving by Major Transit Hub</h3>
            </div>

            <div className="bar-chart-container">
              {connectedCities.map((city, idx) => {
                const routesCount = parseInt(city.routes_serving_it, 10) || 1;
                const maxRoutes = 7;
                const barWidth = `${(routesCount / maxRoutes) * 100}%`;
                const isSelected = selectedStop?.city_hub === city.city_hub;

                return (
                  <div
                    key={city.id || city.city_hub}
                    className={`bar-row-item ${isSelected ? "selected-row" : ""}`}
                    onClick={() => setSelectedStop(city)}
                  >
                    <div className="bar-row-header">
                      <span className="bar-rank">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="bar-hub-name">{city.city_hub}</span>
                      <span className="bar-count-badge font-mono">{routesCount} routes</span>
                    </div>

                    <div className="bar-track">
                      <div
                        className={`bar-fill ${isSelected ? "active-fill" : ""}`}
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 07: COVERAGE & DISTRICT ANALYSIS */}
      <section className="metro-section">
        <SectionTitle
          icon={<Map className="w-4 h-4 text-cyan-400" />}
          eyebrow="07 / COVERAGE & DISTRICT ANALYSIS"
          title="Colombo District Executive Transport Summary"
          description="A data-driven evaluation of network density, route boundaries, and regional transit dependence across the Colombo Metropolitan Region."
        />

        <div className="coverage-analysis-grid">

          {/* Card 1: Infographic Pie Chart */}
          <div className="coverage-analyst-card pie-chart-infographic-card">
            <div className="pie-chart-header">
              <div className="card-badge cyan flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-cyan-400" />
                DISTRICT DISTRIBUTION
              </div>
              <h3 className="pie-chart-title">
                Sri Lanka Metro Bus Network: Stop Distribution by District
              </h3>
            </div>

            <div className="pie-chart-body">
              {/* SVG Pie Chart Infographic */}
              <div className="pie-chart-visual">
                <svg viewBox="0 0 200 200" className="w-[195px] h-[195px] md:w-[210px] md:h-[210px]">
                  <path
                    d="M 100 100 L 100 18 A 82 82 0 1 1 51.2 33.5 Z"
                    fill="#00d2ff"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer filter drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                  />
                  <path
                    d="M 100 100 L 51.2 33.5 A 82 82 0 0 1 100 18 Z"
                    fill="#475569"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  />
                  <circle cx="100" cy="100" r="44" fill="#0d1218" stroke="#252c35" strokeWidth="1" />
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
              <div className="card-badge flex items-center gap-1">
                <Route className="w-3 h-3 text-cyan-400" />
                DISTANCE COMPARISON
              </div>
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
              <div className="card-badge flex items-center gap-1">
                <BusFront className="w-3 h-3 text-cyan-400" />
                TOP INFRASTRUCTURE ROUTES
              </div>
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
              <div className="card-badge cyan flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-cyan-400" />
                EXECUTIVE TAKEAWAY
              </div>
              <h3>Systemic Dependency</h3>
              <p className="takeaway-text">
                The Lanka Metro Transit network relies overwhelmingly on Colombo District infrastructure, with over 90% of all passenger stops concentrated within its urban boundaries. While cross-border routes cover longer distances on average to connect outlying suburbs, internal Colombo corridors form the high-density operational core of the entire system.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 08: ROUTE ANALYSIS */}
      <section className="metro-section">
        <SectionTitle
          icon={<Route className="w-4 h-4 text-cyan-400" />}
          eyebrow="08 / ROUTE ANALYSIS"
          title="How individual corridors perform"
          description="Granular route-level specifications including operating schedules, peak headways, and fare stages."
        />

        <div className="route-grid">
          {routesData.map((route) => {
            const spec = trustedRouteSpecs[route.route_code] || {
              peak_headway: "5 – 8 min",
              off_peak_headway: "12 min",
              operating_hours: "05:30 – 22:30",
              fare_range_lkr: "LKR 50 – LKR 180",
              stops: route.stops_sequence ? route.stops_sequence.split(" • ") : ["Terminal Start", "Interchange Stop", "Terminal End"],
            };

            const isExpanded = expandedRouteCode === route.route_code;

            return (
              <div className="route-card enriched-card" key={route.id || route.route_code}>

                <div className="route-card-top flex items-center justify-between">
                  <span>{route.route_code}</span>
                  <span className="headway-badge flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400 inline" />
                    PEAK: {spec.peak_headway}
                  </span>
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

                {/* Granular Specification Details */}
                <div className="route-spec-block">
                  <div className="spec-row">
                    <span className="spec-label">Operating Hours:</span>
                    <span className="spec-val font-mono">{spec.operating_hours}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Fare Range:</span>
                    <span className="spec-val font-mono text-slate-300">{spec.fare_range_lkr}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Off-Peak Headway:</span>
                    <span className="spec-val font-mono">{spec.off_peak_headway}</span>
                  </div>
                </div>

                {/* Collapsible Stop-by-Stop Breakdown */}
                <button
                  className="toggle-stops-btn flex items-center justify-center gap-1.5"
                  onClick={() => setExpandedRouteCode(isExpanded ? null : route.route_code)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                      <span>Hide Stop Sequence</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                      <span>View Full Stop Sequence</span>
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="stops-sequence-box">
                    <div className="sequence-title">DESIGNATED TRANSIT STOPS & HALTS</div>
                    <ol className="sequence-list">
                      {spec.stops.map((stopName, idx) => (
                        <li key={idx}>
                          <span className="seq-num">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="seq-name">{stopName}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 09: DATA ANALYSIS */}
      <section className="metro-section analysis-section">
        <SectionTitle
          icon={<ChartNoAxesCombined className="w-4 h-4 text-cyan-400" />}
          eyebrow="09 / DATA ANALYSIS"
          title="What can the data tell us?"
          description="Once route, stop, schedule and interchange data are combined, the Metro network can be evaluated using measurable indicators."
        />

        <div className="analysis-grid">

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">01</span>
              <Route className="w-5 h-5 text-cyan-400" />
            </div>
            <h3>Route Density</h3>
            <p>
              Identify areas where a high number of routes overlap and where
              public transport connectivity is strongest.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">02</span>
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <h3>Stop Connectivity</h3>
            <p>
              Measure how many routes, destinations and connections are
              available from individual stops.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">03</span>
              <Map className="w-5 h-5 text-cyan-400" />
            </div>
            <h3>Coverage Score</h3>
            <p>
              Compare areas using route count, stop count and destination
              connectivity.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">04</span>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <h3>Service Frequency</h3>
            <p>
              Analyse departure intervals to identify high-frequency and
              low-frequency corridors.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">05</span>
              <GitBranch className="w-5 h-5 text-cyan-400" />
            </div>
            <h3>Transfer Potential</h3>
            <p>
              Identify locations where multiple transport modes or routes
              intersect.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-card-header flex items-center justify-between mb-3">
              <span className="analysis-num">06</span>
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
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
          <span className="metro-eyebrow flex items-center justify-center gap-2 mb-3">
            <BusFront className="w-4 h-4 text-cyan-400 inline" />
            LANKADATA HUB
          </span>

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
