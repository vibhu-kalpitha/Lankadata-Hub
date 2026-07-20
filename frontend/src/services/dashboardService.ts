import axios from 'axios';
import { API_BASE_URL, USE_MOCK_DATA } from './config';

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  author: string;
  updatedAt: string;
  live: boolean;
  featured?: boolean;
}

export interface DashboardDetail extends Dashboard {
  chartData: Array<{ month: string; Projected: number; Actual: number }>;
  insights: string[];
  metrics: Array<{ title: string; value: string; change: string; isPositive: boolean; type: string }>;
  relatedReports: Array<{ title: string; size: string; type: string }>;
  relatedDatasets: Array<{ id: string; title: string; category: string }>;
  apiEndpoint: string;
}

export const MOCK_DASHBOARDS: DashboardDetail[] = [
  {
    id: 'national-gdp-growth',
    title: 'National GDP & Economic Growth',
    description: 'Comprehensive tracking of GDP growth rates, real-time national indicators, and economic forecasts.',
    category: 'Economy',
    views: 12400,
    author: 'National Intelligence Unit',
    updatedAt: 'Jul 07, 2024, 09:42 AM',
    live: true,
    featured: true,
    insights: [
      'Economic activity shows strong rebound in the tourism sector, projecting a 5% increase in FX earnings by Q4.',
      'Agricultural output stable despite fuel price fluctuations; export crop diversification recommended.',
      'Debt restructuring milestones are meeting IMF benchmarks, improving global credit sentiment.'
    ],
    metrics: [
      { title: 'Total GDP', value: '$84.5B', change: '+3.2%', isPositive: true, type: 'GDP' },
      { title: 'Inflation Rate', value: '4.2%', change: '+1.5%', isPositive: false, type: 'CPI' },
      { title: 'Foreign Reserves', value: '$4.1B', change: '+0.8%', isPositive: true, type: 'FOREX' },
      { title: 'Trade Balance', value: '-$2.1B', change: 'Stable', isPositive: true, type: 'TRADE' }
    ],
    relatedReports: [
      { title: 'Agricultural Export 2024', size: '2.4 MB', type: 'PDF' },
      { title: 'Tourism Inflow Quarterly', size: '1.1 MB', type: 'PDF' }
    ],
    relatedDatasets: [
      { id: 'annual-gdp-growth', title: 'Annual GDP Growth Rates', category: 'Economy' },
      { id: 'monthly-fuel-prices', title: 'Monthly Fuel Price Trends', category: 'Economy' }
    ],
    apiEndpoint: '/api/v1/economy/gdp-growth',
    chartData: [
      { month: 'JAN', Projected: 1.8, Actual: 1.5 },
      { month: 'FEB', Projected: 2.2, Actual: 2.1 },
      { month: 'MAR', Projected: 3.5, Actual: 3.2 },
      { month: 'APR', Projected: 2.8, Actual: 2.4 },
      { month: 'MAY', Projected: 4.1, Actual: 3.8 },
      { month: 'JUN', Projected: 4.8, Actual: 4.2 },
      { month: 'JUL', Projected: 5.2, Actual: 4.9 },
      { month: 'AUG', Projected: 5.5, Actual: 5.1 },
    ]
  },
  {
    id: 'dengue-outbreak-dashboard',
    title: 'Dengue Outbreak Dashboard',
    description: 'Surveillance map, hospital bed availability, weekly case statistics, and critical hotspot tracking.',
    category: 'Health',
    views: 18900,
    author: 'Epidemiology Unit',
    updatedAt: '1 minute ago',
    live: true,
    featured: true,
    insights: [
      'Hotspot warning active for Colombo and Gampaha districts due to heavy rainfall.',
      'Hospitalization count decreased by 12% in Southern province compared to last week.',
      'Larval control campaign schedules optimized based on precipitation prediction grids.'
    ],
    metrics: [
      { title: 'Total Cases', value: '42,891', change: '+15%', isPositive: false, type: 'CASES' },
      { title: 'Critical Zones', value: '08', change: 'Active alerts', isPositive: false, type: 'ZONES' },
      { title: 'Recovered', value: '38.2K', change: 'Discharged', isPositive: true, type: 'RECOVERED' },
      { title: 'Fatality Rate', value: '0.4%', change: 'Regional avg', isPositive: true, type: 'FATALITY' }
    ],
    relatedReports: [
      { title: 'Dengue Weekly Surveillance Report', size: '1.8 MB', type: 'PDF' }
    ],
    relatedDatasets: [
      { id: 'public-health-indicators', title: 'Public Health Indicators', category: 'Health' }
    ],
    apiEndpoint: '/api/v1/health/dengue-outbreak',
    chartData: [
      { month: 'SEP', Projected: 12000, Actual: 15400 },
      { month: 'OCT', Projected: 19000, Actual: 22000 },
      { month: 'NOV', Projected: 24000, Actual: 29000 },
      { month: 'DEC', Projected: 32000, Actual: 36000 },
      { month: 'JAN', Projected: 40000, Actual: 41200 },
      { month: 'FEB', Projected: 45000, Actual: 42891 },
    ]
  },
  {
    id: 'monsoon-rainfall-intensity',
    title: 'Monsoon Rainfall Intensity',
    description: 'Interactive precipitation models, reservoir water levels, flood risk zones, and weather warnings.',
    category: 'Weather',
    views: 8900,
    author: 'Meteorological Dept',
    updatedAt: '2 hours ago',
    live: true,
    featured: true,
    insights: [
      'South-West monsoon intensity stabilizing; reservoir level capacities reached 88%.',
      'Flood alert level downgraded for Kelani Ganga basin; minor risk remains active.'
    ],
    metrics: [
      { title: 'Avg Rainfall', value: '420 mm', change: '+8% vs normal', isPositive: true, type: 'RAIN' },
      { title: 'Reservoir Level', value: '88.4%', change: 'Rising', isPositive: true, type: 'WATER' }
    ],
    relatedReports: [],
    relatedDatasets: [],
    apiEndpoint: '/api/v1/weather/monsoon',
    chartData: [
      { month: 'MAY', Projected: 180, Actual: 190 },
      { month: 'JUN', Projected: 320, Actual: 350 },
      { month: 'JUL', Projected: 450, Actual: 420 },
    ]
  },
  {
    id: 'national-power-grid',
    title: 'National Power Grid Live',
    description: 'Current energy generation mix between hydro, thermal, and solar. Real-time consumption analytics.',
    category: 'Environment',
    views: 5700,
    author: 'CEB Smart Systems',
    updatedAt: '5 seconds ago',
    live: true,
    featured: true,
    insights: [
      'Hydroelectric power constitutes 64% of current grid capacity due to high reservoir volumes.',
      'Peak load expected at 7:30 PM. Active spinning reserves are at 180 MW.'
    ],
    metrics: [
      { title: 'Hydro Share', value: '64.2%', change: '+5% YoY', isPositive: true, type: 'HYDRO' },
      { title: 'Solar Share', value: '8.4%', change: 'Day peak', isPositive: true, type: 'SOLAR' },
      { title: 'Grid Stability', value: '100%', change: 'High', isPositive: true, type: 'STABILITY' }
    ],
    relatedReports: [],
    relatedDatasets: [],
    apiEndpoint: '/api/v1/energy/power-grid',
    chartData: [
      { month: '12:00', Projected: 1200, Actual: 1150 },
      { month: '14:00', Projected: 1400, Actual: 1380 },
      { month: '16:00', Projected: 1550, Actual: 1510 },
      { month: '18:00', Projected: 1850, Actual: 1890 },
      { month: '20:00', Projected: 2100, Actual: 2050 },
    ]
  }
];

export const MOCK_POPULAR_DASHBOARDS: Dashboard[] = [
  { id: 'tourism-arrivals-2024', title: 'Tourism Arrivals 2024', description: 'Real-time traveler entries, hotel booking ratios, and source market breakdown.', category: 'Tourism', views: 24000, author: 'Community Authored', updatedAt: 'Weekly', live: false },
  { id: 'colombo-price-index', title: 'Colombo Price Index', description: 'Retail market price trackers for consumer products, inflation triggers.', category: 'Finance', views: 18000, author: 'Community Authored', updatedAt: 'Monthly', live: false },
  { id: 'harvest-yield-maps', title: 'Harvest Yield Maps', description: 'Provincial crop yields, spatial soil classifications, and water distribution grids.', category: 'Agriculture', views: 15000, author: 'Community Authored', updatedAt: 'Seasonal', live: false },
  { id: 'export-value-trends', title: 'Export Value Trends', description: 'Performance details for tea, garments, rubber, and IT services exports.', category: 'Trade', views: 12000, author: 'Community Authored', updatedAt: 'Quarterly', live: false },
];

export const dashboardService = {
  getDashboards: async (): Promise<DashboardDetail[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_DASHBOARDS;
    }
    const response = await axios.get(`${API_BASE_URL}/dashboards`);
    return response.data;
  },

  getPopularDashboards: async (): Promise<Dashboard[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_POPULAR_DASHBOARDS;
    }
    const response = await axios.get(`${API_BASE_URL}/dashboards/popular`);
    return response.data;
  },

  getDashboardById: async (id: string): Promise<DashboardDetail | null> => {
    if (USE_MOCK_DATA) {
      const db = MOCK_DASHBOARDS.find((d) => d.id === id);
      if (db) return db;
      // Fallback details for popular dashboards
      const popular = MOCK_POPULAR_DASHBOARDS.find((d) => d.id === id);
      if (popular) {
        return {
          ...popular,
          chartData: [
            { month: 'Q1', Projected: 100, Actual: 105 },
            { month: 'Q2', Projected: 120, Actual: 118 },
            { month: 'Q3', Projected: 150, Actual: 142 },
          ],
          insights: ['Mock analysis indicators for ' + popular.title],
          metrics: [
            { title: 'Total Volume', value: '1.2M', change: '+8%', isPositive: true, type: 'GENERIC' },
            { title: 'Growth Rate', value: '4.8%', change: '+1.2%', isPositive: true, type: 'GENERIC' },
          ],
          relatedReports: [],
          relatedDatasets: [],
          apiEndpoint: '/api/v1/custom/' + popular.id
        };
      }
      return null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboards/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }
};
