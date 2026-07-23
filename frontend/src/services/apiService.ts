import axios from 'axios';
import { API_BASE_URL, USE_MOCK_DATA } from './config';

export interface ApiEndpoint {
  id: string;
  title: string;
  description: string;
  category: string;
  method: 'GET' | 'POST';
  endpoint: string;
  parameters: Array<{ name: string; type: string; required: boolean; description: string }>;
  sampleRequest: {
    curl: string;
    javascript: string;
    python: string;
  };
  sampleResponse: string; // JSON String
  datasetId: string;
  datasetName: string;
  pricing: 'Free' | 'Developer' | 'Enterprise';
  status: 'active' | 'beta';
}

export const MOCK_APIS: ApiEndpoint[] = [
  {
    id: 'gdp-growth-api',
    title: 'GDP Growth Rate REST API',
    description: 'Fetch historical and current Gross Domestic Product growth rates, regional contributions, and economic sectors.',
    category: 'Economy',
    method: 'GET',
    endpoint: '/api/v1/economy/gdp-growth',
    pricing: 'Free',
    status: 'active',
    datasetId: 'annual-gdp-growth',
    datasetName: 'Annual GDP Growth Rates',
    parameters: [
      { name: 'year', type: 'Integer', required: false, description: 'Filter records by a specific year (e.g., 2023).' },
      { name: 'province', type: 'String', required: false, description: 'Filter growth rates by province (e.g., Western).' },
      { name: 'limit', type: 'Integer', required: false, description: 'Limit the number of records returned (default is 10).' }
    ],
    sampleRequest: {
      curl: `curl -X GET "https://api.lankadatahub.lk/v1/economy/gdp-growth?year=2023" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Accept: application/json"`,
      javascript: `fetch("https://api.lankadatahub.lk/v1/economy/gdp-growth?year=2023", {\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Accept": "application/json"\n  }\n})\n.then(response => response.json())\n.then(data => console.log(data));`,
      python: `import requests\n\nurl = "https://api.lankadatahub.lk/v1/economy/gdp-growth"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Accept": "application/json"\n}\nparams = {"year": 2023}\n\nresponse = requests.get(url, headers=headers, params=params)\nprint(response.json())`
    },
    sampleResponse: `{\n  "status": "success",\n  "data": [\n    {\n      "year": 2023,\n      "province": "Western Province",\n      "gdp_growth_rate": 2.8,\n      "indicator_value_lkr_b": 12450.5,\n      "last_updated": "2024-07-20T02:00:00Z"\n    }\n  ],\n  "meta": {\n    "total": 1,\n    "page": 1,\n    "limit": 10\n  }\n}`
  },
  {
    id: 'fuel-prices-api',
    title: 'Fuel Prices REST API',
    description: 'Get real-time retail pricing of fuel revisions by CPC and LIOC, taxes components, and global Crude references.',
    category: 'Economy',
    method: 'GET',
    endpoint: '/api/v1/energy/fuel-prices',
    pricing: 'Developer',
    status: 'active',
    datasetId: 'monthly-fuel-prices',
    datasetName: 'Monthly Fuel Price Trends',
    parameters: [
      { name: 'fuel_type', type: 'String', required: false, description: 'Type of fuel: petrol_92, petrol_95, auto_diesel, super_diesel, kerosene.' },
      { name: 'distributor', type: 'String', required: false, description: 'Fuel distributor: cpc, lioc.' }
    ],
    sampleRequest: {
      curl: `curl -X GET "https://api.lankadatahub.lk/v1/energy/fuel-prices?fuel_type=petrol_92" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch("https://api.lankadatahub.lk/v1/energy/fuel-prices?fuel_type=petrol_92", {\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY"\n  }\n})\n.then(res => res.json())\n.then(console.log);`,
      python: `import requests\n\nresponse = requests.get(\n    "https://api.lankadatahub.lk/v1/energy/fuel-prices",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    params={"fuel_type": "petrol_92"}\n)\nprint(response.json())`
    },
    sampleResponse: `{\n  "status": "success",\n  "distributor": "CPC",\n  "fuel_type": "Petrol 92 Octane",\n  "price_lkr": 320.00,\n  "currency": "LKR",\n  "effective_date": "2024-07-01"\n}`
  },
  {
    id: 'health-stats-api',
    title: 'Public Health Indicators API',
    description: 'Fetch weekly statistics on infectious diseases, vaccination distributions, hospital capacity logs by region.',
    category: 'Health',
    method: 'GET',
    endpoint: '/api/v1/health/indicators',
    pricing: 'Developer',
    status: 'active',
    datasetId: 'public-health-indicators',
    datasetName: 'Public Health Indicators',
    parameters: [
      { name: 'disease', type: 'String', required: false, description: 'Disease name (e.g., dengue, leptospirosis).' },
      { name: 'week', type: 'String', required: false, description: 'Target week index.' }
    ],
    sampleRequest: {
      curl: `curl -X GET "https://api.lankadatahub.lk/v1/health/indicators?disease=dengue" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch("https://api.lankadatahub.lk/v1/health/indicators?disease=dengue", {\n  headers: { "Authorization": "Bearer YOUR_API_KEY" }\n}).then(r => r.json()).then(console.log);`,
      python: `import requests\nr = requests.get("https://api.lankadatahub.lk/v1/health/indicators", headers={"Authorization": "Bearer YOUR_API_KEY"}, params={"disease": "dengue"})\nprint(r.json())`
    },
    sampleResponse: `{\n  "disease": "Dengue Outbreak",\n  "week": "Week 28",\n  "cases": 1245,\n  "hotspots": ["Colombo", "Gampaha"]\n}`
  },
  {
    id: 'weather-forecast-api',
    title: 'Precipitation & Weather API',
    description: 'Obtain active precipitation parameters, monsoon models, temperatures, and hydrological warning indices.',
    category: 'Weather',
    method: 'GET',
    endpoint: '/api/v1/weather/forecast',
    pricing: 'Free',
    status: 'beta',
    datasetId: 'weather-data',
    datasetName: 'Monsoon Rainfall Intensity',
    parameters: [
      { name: 'station', type: 'String', required: true, description: 'Weather station name (e.g., colombo, kandy, galle).' }
    ],
    sampleRequest: {
      curl: `curl -X GET "https://api.lankadatahub.lk/v1/weather/forecast?station=colombo" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `fetch("https://api.lankadatahub.lk/v1/weather/forecast?station=colombo", {\n  headers: { "Authorization": "Bearer YOUR_API_KEY" }\n}).then(r => r.json());`,
      python: `import requests\nprint(requests.get("https://api.lankadatahub.lk/v1/weather/forecast", headers={"Authorization": "Bearer YOUR_API_KEY"}, params={"station": "colombo"}).json())`
    },
    sampleResponse: `{\n  "station": "Colombo",\n  "precipitation_mm": 10.6,\n  "humidity_percent": 82,\n  "description": "Colombo - Partly Cloudy",\n  "timestamp": "2024-07-20T02:00:00Z"\n}`
  }
];

export const MOCK_PRICING = [
  { name: 'Free', price: 'Rs. 0', period: 'forever', desc: 'Perfect for students, researchers, and hobbyists building non-commercial tools.', features: ['10,000 requests / month', 'Public datasets access only', 'Standard rate limits (60 req/min)', 'Community forum support', 'JSON formats'] },
  { name: 'Developer', price: 'Rs. 7,500', period: 'month', desc: 'For developers and startups building production-ready apps and commercial dashboard suites.', features: ['500,000 requests / month', 'Access to live & historical streams', 'High rate limits (500 req/min)', 'Email support (24h response)', 'CSV, JSON, XML formats', '99.9% API uptime SLA'] },
  { name: 'Enterprise', price: 'Custom Pricing', period: 'custom', desc: 'Designed for financial institutions, conglomerates, and government bodies requiring dedicated tunnels.', features: ['Unlimited requests', 'Direct PostgreSQL connections', 'Dedicated support engineer', 'Custom query design', 'On-premise deployment support', '99.99% uptime guarantee'] }
];

export const apiService = {
  getApis: async (): Promise<ApiEndpoint[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_APIS;
    }
    const response = await axios.get(`${API_BASE_URL}/apis`);
    return response.data;
  },

  getApiById: async (id: string): Promise<ApiEndpoint | null> => {
    if (USE_MOCK_DATA) {
      const api = MOCK_APIS.find((a) => a.id === id);
      return api || null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/apis/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  getPricing: () => {
    return MOCK_PRICING;
  }
};
