import axios from 'axios';
import { API_BASE_URL, USE_MOCK_DATA } from './config';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  formats: string[]; // ['CSV', 'JSON', 'API', 'Excel', 'SQL']
  updatedAt: string;
  views: number;
  downloads: number;
  maintainer: string;
  frequency: string;
  coverage: string;
  live: boolean;
  featured?: boolean;
}

export interface DatasetDetail extends Dataset {
  fullDescription: string;
  previewHeaders: string[];
  previewRows: Array<Record<string, any>>;
  relatedDashboards: Array<{ id: string; title: string }>;
  relatedApis: Array<{ id: string; title: string; endpoint: string }>;
  similarDatasets: Array<{ id: string; title: string; description: string; category: string }>;
  quarterlyDistribution: Array<{ quarter: string; primary: number; secondary: number }>;
  growthTrend: Array<{ year: string; growth: number }>;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  iconName: string;
  description: string;
}

// Highly comprehensive mock categories matching the requested ones
export const MOCK_CATEGORIES: Category[] = [
  { id: 'economy', name: 'Economy', count: 124, iconName: 'TrendingUp', description: 'National GDP, inflation rates, trade balance, and financial statistics.' },
  { id: 'health', name: 'Health', count: 82, iconName: 'Activity', description: 'Epidemiological reports, public hospital stats, and disease outbreak data.' },
  { id: 'weather', name: 'Weather', count: 45, iconName: 'CloudRain', description: 'Monsoon metrics, temperature distribution, and humidity tracking.' },
  { id: 'agriculture', name: 'Agriculture', count: 67, iconName: 'Leaf', description: 'Harvest yields, pesticide distribution, and fertilizer consumption indices.' },
  { id: 'education', name: 'Education', count: 67, iconName: 'GraduationCap', description: 'Literacy rates, university enrollment, and school distribution maps.' },
  { id: 'tourism', name: 'Tourism', count: 31, iconName: 'Compass', description: 'Monthly arrivals, tourist expenditure, and hospitality indicators.' },
  { id: 'transportation', name: 'Transportation', count: 19, iconName: 'Truck', description: 'Expressway traffic volumes, vehicle registration, and public transit usage.' }
];

// Rich datasets mock database
export const MOCK_DATASETS: DatasetDetail[] = [
  {
    id: 'annual-gdp-growth',
    title: 'Annual GDP Growth Rates',
    description: 'Historical and projected annual GDP growth percentages for Sri Lanka, curated for economic research.',
    fullDescription: 'This dataset offers a comprehensive perspective on national fiscal priority by tracking real Gross Domestic Product (GDP) growth percentages. Spanning from 1960 to 2024, it measures the year-on-year market value change of all final goods and services produced within the country. This analysis is critical for researchers and policymakers monitoring the share of national budget allocation versus economic output relative to regional emerging markets.',
    category: 'Economy',
    formats: ['CSV', 'JSON', 'SQL'],
    updatedAt: '2 hours ago',
    views: 5488,
    downloads: 1240,
    maintainer: 'Department of Census',
    frequency: 'Real-time / Monthly',
    coverage: '1960 - Present',
    live: true,
    featured: true,
    previewHeaders: ['YEAR', 'REGION', 'INDICATOR VALUE', 'GROWTH %'],
    previewRows: [
      { YEAR: '2024 (Projected)', REGION: 'Western Province', 'INDICATOR VALUE': '12,450.50 LKR B', 'GROWTH %': '+4.2%' },
      { YEAR: '2023', REGION: 'Central Province', 'INDICATOR VALUE': '8,210.20 LKR B', 'GROWTH %': '+2.8%' },
      { YEAR: '2023', REGION: 'Southern Province', 'INDICATOR VALUE': '7,430.80 LKR B', 'GROWTH %': '+3.1%' },
      { YEAR: '2022', REGION: 'Western Province', 'INDICATOR VALUE': '11,940.10 LKR B', 'GROWTH %': '-1.5%' },
      { YEAR: '2021', REGION: 'Western Province', 'INDICATOR VALUE': '12,120.40 LKR B', 'GROWTH %': '+3.5%' },
    ],
    relatedDashboards: [
      { id: 'national-gdp-growth', title: 'National GDP & Economic Growth' },
      { id: 'economic-governance', title: 'Economic Governance Dashboard' }
    ],
    relatedApis: [
      { id: 'gdp-growth-api', title: 'GDP Growth Rate REST API', endpoint: '/api/v1/economy/gdp-growth' }
    ],
    similarDatasets: [
      { id: 'cpi-inflation', title: 'Consumer Price Index (CPI)', description: 'Inflation metrics and price indices from 1990-2024.', category: 'Economy' },
      { id: 'forex-reserves', title: 'Foreign Exchange Reserves', description: 'Monthly central bank foreign exchange reserve holdings.', category: 'Economy' },
      { id: 'employment-stats', title: 'Employment Statistics', description: 'Labor force participation rates and employment indices.', category: 'Economy' }
    ],
    quarterlyDistribution: [
      { quarter: 'Q1', primary: 4.1, secondary: 2.8 },
      { quarter: 'Q2', primary: 4.3, secondary: 3.0 },
      { quarter: 'Q3', primary: 4.5, secondary: 3.2 },
      { quarter: 'Q4', primary: 4.2, secondary: 2.9 },
      { quarter: 'Q5', primary: 4.6, secondary: 3.5 },
    ],
    growthTrend: [
      { year: '2020', growth: -3.5 },
      { year: '2021', growth: 3.5 },
      { year: '2022', growth: -7.8 },
      { year: '2023', growth: 1.6 },
      { year: '2024', growth: 4.2 },
    ]
  },
  {
    id: 'monthly-fuel-prices',
    title: 'Monthly Fuel Price Trends',
    description: 'Comprehensive monthly tracking of Petrol, Diesel, and Kerosene prices in Sri Lanka set by CPC and LIOC.',
    fullDescription: 'Detailed statistics tracking fuel retail pricing revisions since 2018 across the island. Includes comparative tables between CPC (Ceylon Petroleum Corporation) and LIOC prices, taxes component structure, and global crude price references (Brent & WTI). Essential for transport pricing elasticity studies.',
    category: 'Economy',
    formats: ['API', 'Excel'],
    updatedAt: '1 day ago',
    views: 3120,
    downloads: 890,
    maintainer: 'Ministry of Power & Energy',
    frequency: 'Monthly Sync',
    coverage: '2018 - Present',
    live: true,
    featured: true,
    previewHeaders: ['MONTH', 'FUEL TYPE', 'CPC PRICE (LKR)', 'LIOC PRICE (LKR)'],
    previewRows: [
      { MONTH: 'July 2024', 'FUEL TYPE': 'Petrol 92 Octane', 'CPC PRICE (LKR)': '320.00', 'LIOC PRICE (LKR)': '320.00' },
      { MONTH: 'July 2024', 'FUEL TYPE': 'Auto Diesel', 'CPC PRICE (LKR)': '290.00', 'LIOC PRICE (LKR)': '295.00' },
      { MONTH: 'June 2024', 'FUEL TYPE': 'Petrol 92 Octane', 'CPC PRICE (LKR)': '345.00', 'LIOC PRICE (LKR)': '345.00' },
      { MONTH: 'June 2024', 'FUEL TYPE': 'Auto Diesel', 'CPC PRICE (LKR)': '310.00', 'LIOC PRICE (LKR)': '312.00' },
    ],
    relatedDashboards: [
      { id: 'fuel-price-index', title: 'Today\'s Fuel Market' }
    ],
    relatedApis: [
      { id: 'fuel-prices-api', title: 'Fuel Prices REST API', endpoint: '/api/v1/energy/fuel-prices' }
    ],
    similarDatasets: [
      { id: 'electricity-tariffs', title: 'Electricity Tariff structures', description: 'Historical consumer energy pricing data.', category: 'Economy' }
    ],
    quarterlyDistribution: [
      { quarter: 'Q1', primary: 320, secondary: 310 },
      { quarter: 'Q2', primary: 340, secondary: 325 },
      { quarter: 'Q3', primary: 330, secondary: 318 },
      { quarter: 'Q4', primary: 320, secondary: 290 },
      { quarter: 'Q5', primary: 315, secondary: 285 },
    ],
    growthTrend: [
      { year: '2020', growth: 137 },
      { year: '2021', growth: 177 },
      { year: '2022', growth: 370 },
      { year: '2023', growth: 345 },
      { year: '2024', growth: 320 },
    ]
  },
  {
    id: 'district-population-census',
    title: 'District-wise Population Census',
    description: 'Demographic breakdown by district including age groups, literacy rate, and rural-urban migration.',
    fullDescription: 'A complete demographic analysis of the Sri Lankan population across all 25 districts. Utilizes census data updated with projections for 2023. Captures ethnicity distribution, employment ratios, age distribution parameters, and population density metrics.',
    category: 'Population',
    formats: ['CSV', 'JSON'],
    updatedAt: 'Census 2023',
    views: 4510,
    downloads: 1530,
    maintainer: 'Department of Census and Statistics',
    frequency: 'Decennial / Annual Projections',
    coverage: '1981 - 2023',
    live: false,
    featured: true,
    previewHeaders: ['DISTRICT', 'PROVINCE', 'POPULATION', 'DENSITY (per km2)'],
    previewRows: [
      { DISTRICT: 'Colombo', PROVINCE: 'Western', POPULATION: '2,448,000', 'DENSITY (per km2)': '3,430' },
      { DISTRICT: 'Gampaha', PROVINCE: 'Western', POPULATION: '2,300,000', 'DENSITY (per km2)': '1,650' },
      { DISTRICT: 'Kandy', PROVINCE: 'Central', POPULATION: '1,420,000', 'DENSITY (per km2)': '740' },
      { DISTRICT: 'Kurunegala', PROVINCE: 'North Western', POPULATION: '1,650,000', 'DENSITY (per km2)': '340' },
    ],
    relatedDashboards: [
      { id: 'demographics-sl', title: 'Discover Sri Lanka Demographics' }
    ],
    relatedApis: [
      { id: 'population-api', title: 'Population Statistics API', endpoint: '/api/v1/demographics/population' }
    ],
    similarDatasets: [
      { id: 'literacy-rates-district', title: 'District Literacy Rates', description: 'Historical literacy indicators by region.', category: 'Education' }
    ],
    quarterlyDistribution: [
      { quarter: 'Colombo', primary: 2.4, secondary: 2.3 },
      { quarter: 'Gampaha', primary: 2.3, secondary: 2.2 },
      { quarter: 'Kandy', primary: 1.4, secondary: 1.35 },
      { quarter: 'Kurunegala', primary: 1.6, secondary: 1.58 },
      { quarter: 'Galle', primary: 1.1, secondary: 1.05 },
    ],
    growthTrend: [
      { year: '2000', growth: 18.7 },
      { year: '2010', growth: 20.2 },
      { year: '2020', growth: 21.8 },
      { year: '2022', growth: 22.1 },
      { year: '2024', growth: 23.2 },
    ]
  },
  {
    id: 'public-health-indicators',
    title: 'Public Health Indicators',
    description: 'Weekly statistics on infectious diseases, vaccination rates, and hospital capacity across provinces.',
    fullDescription: 'Real-time and historic tracking of epidemiological parameters in Sri Lanka. Core indicators cover dengue outbreak statistics, malaria clearance registries, national immunization coverages, and maternal/infant health reports from the Epidemiology Unit.',
    category: 'Health',
    formats: ['JSON', 'API'],
    updatedAt: 'Weekly Sync',
    views: 6120,
    downloads: 915,
    maintainer: 'Epidemiology Unit, Ministry of Health',
    frequency: 'Weekly',
    coverage: '2015 - Present',
    live: true,
    featured: false,
    previewHeaders: ['WEEK', 'DISEASE', 'TOTAL CASES', 'CRITICAL DISTRICTS'],
    previewRows: [
      { WEEK: 'Week 28 (July 2024)', DISEASE: 'Dengue Outbreak', 'TOTAL CASES': '1,245', 'CRITICAL DISTRICTS': 'Colombo, Gampaha, Kalutara' },
      { WEEK: 'Week 28 (July 2024)', DISEASE: 'Leptospirosis', 'TOTAL CASES': '142', 'CRITICAL DISTRICTS': 'Ratnapura, Kurunegala' },
      { WEEK: 'Week 27 (July 2024)', DISEASE: 'Dengue Outbreak', 'TOTAL CASES': '1,310', 'CRITICAL DISTRICTS': 'Colombo, Gampaha' },
    ],
    relatedDashboards: [
      { id: 'dengue-outbreak-dashboard', title: 'Dengue Outbreak Dashboard' }
    ],
    relatedApis: [
      { id: 'health-stats-api', title: 'Public Health REST API', endpoint: '/api/v1/health/indicators' }
    ],
    similarDatasets: [
      { id: 'hospital-capacities', title: 'Hospital Capacities & ICU Beds', description: 'Real-time hospital resource dashboard data.', category: 'Health' }
    ],
    quarterlyDistribution: [
      { quarter: 'Western', primary: 15400, secondary: 1200 },
      { quarter: 'Central', primary: 4200, secondary: 310 },
      { quarter: 'Southern', primary: 3800, secondary: 290 },
      { quarter: 'Sabaragamuwa', primary: 2900, secondary: 180 },
      { quarter: 'North Western', primary: 3100, secondary: 200 },
    ],
    growthTrend: [
      { year: '2020', growth: 31000 },
      { year: '2021', growth: 25000 },
      { year: '2022', growth: 76000 },
      { year: '2023', growth: 88000 },
      { year: '2024', growth: 42891 },
    ]
  }
];

export const datasetService = {
  // Fetch all categories
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_CATEGORIES;
    }
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },

  // Fetch list of datasets with filters, sorting, search, and pagination
  getDatasets: async (params: {
    search?: string;
    category?: string;
    format?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ datasets: Dataset[]; total: number; pages: number }> => {
    const { search = '', category = '', format = '', sortBy = 'Latest', page = 1, limit = 10 } = params;

    if (USE_MOCK_DATA) {
      let filtered = [...MOCK_DATASETS];

      // Filter by search query
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            d.category.toLowerCase().includes(query)
        );
      }

      // Filter by category
      if (category) {
        filtered = filtered.filter(
          (d) => d.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by file format
      if (format) {
        filtered = filtered.filter((d) =>
          d.formats.some((f) => f.toLowerCase() === format.toLowerCase())
        );
      }

      // Sort
      if (sortBy === 'Latest') {
        // Mock order is already default latest
      } else if (sortBy === 'Most Popular') {
        filtered.sort((a, b) => b.views - a.views);
      } else if (sortBy === 'Most Downloaded') {
        filtered.sort((a, b) => b.downloads - a.downloads);
      }

      // Pagination
      const total = filtered.length;
      const pages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        datasets: paginated.map(({ previewRows, previewHeaders, ...rest }) => rest), // exclude detail tables for list
        total,
        pages
      };
    }

    const response = await axios.get(`${API_BASE_URL}/datasets`, { params });
    return response.data;
  },

  // Fetch single dataset details
  getDatasetById: async (id: string): Promise<DatasetDetail | null> => {
    if (USE_MOCK_DATA) {
      const dataset = MOCK_DATASETS.find((d) => d.id === id);
      return dataset || null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  // Fetch featured / latest datasets for Homepage
  getLatestDatasets: async (limit: number = 4): Promise<Dataset[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_DATASETS.slice(0, limit).map(({ previewRows, previewHeaders, ...rest }) => rest);
    }
    const response = await axios.get(`${API_BASE_URL}/datasets/latest`, { params: { limit } });
    return response.data;
  }
};
