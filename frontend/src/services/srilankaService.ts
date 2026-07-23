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

export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  area: string;
  population: string;
  districts: string[];
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

export const MOCK_PROVINCES: ProvinceData[] = [
  { id: 'LK-1', name: 'Western', capital: 'Colombo', area: '3,684 km²', population: '6.2M', districts: ['Colombo', 'Gampaha', 'Kalutara'] },
  { id: 'LK-2', name: 'Central', capital: 'Kandy', area: '5,674 km²', population: '2.8M', districts: ['Kandy', 'Matale', 'Nuwara Eliya'] },
  { id: 'LK-3', name: 'Southern', capital: 'Galle', area: '5,544 km²', population: '2.6M', districts: ['Galle', 'Matara', 'Hambantota'] },
  { id: 'LK-4', name: 'Northern', capital: 'Jaffna', area: '8,884 km²', population: '1.1M', districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'] },
  { id: 'LK-5', name: 'Eastern', capital: 'Trincomalee', area: '9,996 km²', population: '1.7M', districts: ['Trincomalee', 'Batticaloa', 'Ampara'] },
  { id: 'LK-6', name: 'North Western', capital: 'Kurunegala', area: '7,888 km²', population: '2.5M', districts: ['Kurunegala', 'Puttalam'] },
  { id: 'LK-7', name: 'North Central', capital: 'Anuradhapura', area: '10,472 km²', population: '1.4M', districts: ['Anuradhapura', 'Polonnaruwa'] },
  { id: 'LK-8', name: 'Uva', capital: 'Badulla', area: '8,500 km²', population: '1.3M', districts: ['Badulla', 'Moneragala'] },
  { id: 'LK-9', name: 'Sabaragamuwa', capital: 'Ratnapura', area: '4,968 km²', population: '2.0M', districts: ['Ratnapura', 'Kegalle'] }
];

export const srilankaService = {
  getTodaysStats: () => MOCK_TODAYS_STATS,
  getDiscoverStats: () => MOCK_DISCOVER_STATS,
  getFooterMetrics: () => MOCK_FOOTER_METRICS,
  getProvinces: () => MOCK_PROVINCES,
  getProvinceById: (id: string) => MOCK_PROVINCES.find((p) => p.id === id) || null
};
