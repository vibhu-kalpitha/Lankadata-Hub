// Service for Sri Lanka statistics and map data

export interface SriLankaStat {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  source?: string;
  updatedTime?: string;
  desc?: string;
  iconName?: string;
}

export const MOCK_TODAYS_STATS = {
  environment: { label: 'ENVIRONMENT', value: '10.60', unit: '°C', desc: 'Colombo • Partly Cloudy', updatedTime: 'Updated 5 mins ago' },
  fuelMarket: {
    label: 'FUEL MARKET',
    updatedTime: 'Updated 20 mins ago',
    prices: [
      { name: '92 Octane', price: '320.00' },
      { name: 'Auto Diesel', price: '290.00' }
    ],
    source: '@Petroleum Ministry, 2024'
  },
  forexRate: { label: 'FOREX RATE', value: '320.00', unit: 'USD Buy', change: '-0.05%', desc: 'CENTRAL BANK OFFICIAL RATE', updatedTime: 'Updated 2 hours ago' },
  publicHealth: { label: 'PUBLIC HEALTH', value: '1,245', desc: 'Weekly Hospitalizations', updatedTime: 'Updated 4 hours ago' },
  stockMarket: { label: 'STOCK MARKET', value: '12,450.2', desc: 'ASPI index', change: '+1.5%', updatedTime: 'Updated 1 hour ago' },
  powerStatus: { label: 'POWER STATUS', value: '100%', desc: 'Grid Stability: High', updatedTime: 'Updated 5 secs ago' },
  teaAuction: { label: 'TEA AUCTION', value: '1,180.00', desc: 'LKR per kg (Avg Price)', source: 'COLOMBO TEA AUCTION', updatedTime: 'Updated Today' },
  tourism: { label: 'TOURISM', value: '4,820', desc: 'Daily Arrivals', updatedTime: 'Updated 17 hours ago' }
};

export const MOCK_DISCOVER_STATS = [
  { id: 'area', label: 'TOTAL AREA', value: '65,610', unit: 'km²', iconName: 'Maximize' },
  { id: 'population', label: 'TOTAL POPULATION', value: '23.2M', iconName: 'Users' },
  { id: 'forest', label: 'FOREST COVER', value: '29.9%', iconName: 'Trees' },
  { id: 'coastline', label: 'COASTLINE', value: '1,340', unit: 'km', iconName: 'Waves' },
  { id: 'provinces', label: 'PROVINCES', value: '09', iconName: 'Map' },
  { id: 'literacy', label: 'LITERACY RATE', value: '92.3%', iconName: 'BookOpen' },
  { id: 'universities', label: 'UNIVERSITIES', value: '17', iconName: 'GraduationCap' },
  { id: 'expressways', label: 'EXPRESSWAYS', value: '300+', unit: 'km', iconName: 'Navigation' }
];

export const MOCK_FOOTER_METRICS = [
  { label: 'NATIONAL FLOWER', value: 'Blue Water Lily' },
  { label: 'NATIONAL TREE', value: 'Na Tree' },
  { label: 'TIME ZONE', value: 'GMT +5:30' },
  { label: 'CURRENCY', value: 'LKR (Rs)' }
];

export const srilankaService = {
  getTodaysStats: () => MOCK_TODAYS_STATS,
  getDiscoverStats: () => MOCK_DISCOVER_STATS,
  getFooterMetrics: () => MOCK_FOOTER_METRICS,
};
