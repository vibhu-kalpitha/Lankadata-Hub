import axios from 'axios';
import { API_BASE_URL, USE_MOCK_DATA } from './config';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  formats: string[]; // ['CSV', 'JSON', 'API', 'Excel', 'SQL']
  updatedAt?: string;
  updated_at?: string;
  views: number;
  downloads: number;
  maintainer: string;
  source?: string;
  frequency: string;
  coverage: string;
  live: boolean;
  featured?: boolean;
  total_records?: number;
  file_size?: string;
}

export interface DatasetDetail extends Dataset {
  fullDescription?: string;
  full_description?: string;
  columns?: string[];
  previewHeaders?: string[];
  previewRows?: Array<Record<string, any>>;
  preview_rows?: Array<Record<string, any>>;
  relatedDashboards?: Array<{ id: string; title: string }>;
  relatedApis?: Array<{ id: string; title: string; endpoint: string }>;
  similarDatasets?: Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>;
  quarterlyDistribution?: Array<{ quarter: string; primary: number; secondary: number }>;
  growthTrend?: Array<{ year: string; growth: number }>;
}

export interface DatasetPreviewResponse {
  dataset_id: string;
  columns: string[];
  rows: Array<Record<string, any>>;
  total_rows: number;
  total_columns: number;
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
    id: 'usd-exchange-rates',
    title: 'USD Exchange Rates',
    description: 'Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka.',
    fullDescription: 'Historical daily USD buying and selling exchange rates published by the Central Bank of Sri Lanka. Spanning multi-year daily records, this dataset offers essential indicators for financial modeling, import-export analysis, and macroeconomic forecasting.',
    category: 'Economy',
    formats: ['CSV', 'JSON', 'SQL'],
    updatedAt: 'Today',
    views: 5640,
    downloads: 1820,
    maintainer: 'Central Bank of Sri Lanka',
    source: 'Central Bank of Sri Lanka',
    frequency: 'Daily',
    coverage: '2005 - Present',
    live: true,
    featured: true,
    total_records: 5620,
    file_size: '12.4 MB',
    columns: ['Date', 'Buying Rate (LKR)', 'Selling Rate (LKR)'],
    previewHeaders: ['Date', 'Buying Rate (LKR)', 'Selling Rate (LKR)'],
    previewRows: [
      { Date: '2024-08-01', 'Buying Rate (LKR)': 302.50, 'Selling Rate (LKR)': 308.20 },
      { Date: '2024-07-31', 'Buying Rate (LKR)': 302.10, 'Selling Rate (LKR)': 307.80 },
      { Date: '2024-07-30', 'Buying Rate (LKR)': 301.90, 'Selling Rate (LKR)': 307.50 },
      { Date: '2024-07-29', 'Buying Rate (LKR)': 301.60, 'Selling Rate (LKR)': 307.20 },
      { Date: '2024-07-26', 'Buying Rate (LKR)': 301.20, 'Selling Rate (LKR)': 306.90 },
      { Date: '2024-07-25', 'Buying Rate (LKR)': 300.90, 'Selling Rate (LKR)': 306.50 },
      { Date: '2024-07-24', 'Buying Rate (LKR)': 300.50, 'Selling Rate (LKR)': 306.10 },
      { Date: '2024-07-23', 'Buying Rate (LKR)': 300.20, 'Selling Rate (LKR)': 305.80 },
      { Date: '2024-07-22', 'Buying Rate (LKR)': 299.80, 'Selling Rate (LKR)': 305.40 },
      { Date: '2024-07-19', 'Buying Rate (LKR)': 299.50, 'Selling Rate (LKR)': 305.10 },
    ],
    similarDatasets: [
      { id: 'hnb-usd-rates', title: 'HNB USD Exchange Rates', description: 'Daily commercial bank USD rates published by Hatton National Bank.', category: 'Economy', updated_at: 'Today' }
    ]
  },
  {
    id: 'hnb-usd-rates',
    title: 'HNB USD Exchange Rates',
    description: 'Daily USD buying, selling, and telegraphic transfer (TT) exchange rates published by Hatton National Bank.',
    fullDescription: 'Daily commercial bank exchange rates for US Dollars published by Hatton National Bank (HNB PLC). Tracks counter buying, counter selling, and telegraphic transfer (TT) rates across business days.',
    category: 'Economy',
    formats: ['CSV', 'JSON', 'SQL'],
    updatedAt: 'Today',
    views: 3120,
    downloads: 950,
    maintainer: 'Hatton National Bank',
    source: 'Hatton National Bank',
    frequency: 'Daily',
    coverage: '2015 - Present',
    live: true,
    featured: true,
    total_records: 2840,
    file_size: '6.8 MB',
    columns: ['Date', 'Buying Rate (LKR)', 'Selling Rate (LKR)', 'TT Buying Rate (LKR)'],
    previewHeaders: ['Date', 'Buying Rate (LKR)', 'Selling Rate (LKR)', 'TT Buying Rate (LKR)'],
    previewRows: [
      { Date: '2024-08-01', 'Buying Rate (LKR)': 301.80, 'Selling Rate (LKR)': 309.00, 'TT Buying Rate (LKR)': 300.50 },
      { Date: '2024-07-31', 'Buying Rate (LKR)': 301.50, 'Selling Rate (LKR)': 308.70, 'TT Buying Rate (LKR)': 300.20 },
      { Date: '2024-07-30', 'Buying Rate (LKR)': 301.20, 'Selling Rate (LKR)': 308.40, 'TT Buying Rate (LKR)': 299.90 },
      { Date: '2024-07-29', 'Buying Rate (LKR)': 300.90, 'Selling Rate (LKR)': 308.10, 'TT Buying Rate (LKR)': 299.60 },
      { Date: '2024-07-26', 'Buying Rate (LKR)': 300.50, 'Selling Rate (LKR)': 307.70, 'TT Buying Rate (LKR)': 299.20 },
      { Date: '2024-07-25', 'Buying Rate (LKR)': 300.20, 'Selling Rate (LKR)': 307.40, 'TT Buying Rate (LKR)': 298.90 },
      { Date: '2024-07-24', 'Buying Rate (LKR)': 299.80, 'Selling Rate (LKR)': 307.00, 'TT Buying Rate (LKR)': 298.50 },
    ],
    similarDatasets: [
      { id: 'usd-exchange-rates', title: 'USD Exchange Rates', description: 'Historical daily USD exchange rates published by Central Bank of Sri Lanka.', category: 'Economy', updated_at: 'Today' }
    ]
  },
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

const normalizeDatasetId = (id: string): string => {
  if (id === 'hnb-usd-exchange-rates' || id === 'hnb-usd-exchange-rate') return 'hnb-usd-rates';
  return id;
};

export const datasetService = {
  // Fetch all categories
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_CATEGORIES;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, { timeout: 5000 });
      return response.data;
    } catch {
      return MOCK_CATEGORIES;
    }
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

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            d.category.toLowerCase().includes(query)
        );
      }

      if (category) {
        filtered = filtered.filter(
          (d) => d.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (format) {
        filtered = filtered.filter((d) =>
          d.formats.some((f) => f.toLowerCase() === format.toLowerCase())
        );
      }

      if (sortBy === 'Latest') {
        // Default latest
      } else if (sortBy === 'Most Popular') {
        filtered.sort((a, b) => b.views - a.views);
      } else if (sortBy === 'Most Downloaded') {
        filtered.sort((a, b) => b.downloads - a.downloads);
      }

      const total = filtered.length;
      const pages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        datasets: paginated.map(({ previewRows, previewHeaders, ...rest }) => rest),
        total,
        pages
      };
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/datasets`, { params, timeout: 5000 });
      return response.data;
    } catch {
      let filtered = [...MOCK_DATASETS];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(d => d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query));
      }
      return {
        datasets: filtered.slice(0, limit).map(({ previewRows, previewHeaders, ...rest }) => rest),
        total: filtered.length,
        pages: 1
      };
    }
  },

  // Fetch single dataset details
  getDatasetById: async (id: string): Promise<DatasetDetail | null> => {
    const cleanId = normalizeDatasetId(id);
    if (USE_MOCK_DATA) {
      const dataset = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      return dataset || MOCK_DATASETS[0] || null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}`, { timeout: 5000 });
      return response.data;
    } catch {
      const fallback = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      return fallback || MOCK_DATASETS[0] || null;
    }
  },

  // Fetch dataset preview data with optional search, sorting, and pagination
  getDatasetPreview: async (id: string, params?: {
    search?: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    offset?: number;
  }): Promise<DatasetPreviewResponse | null> => {
    const cleanId = normalizeDatasetId(id);
    if (USE_MOCK_DATA) {
      const dataset = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      if (!dataset) return null;
      const rows = dataset.previewRows || dataset.preview_rows || [];
      const cols = dataset.columns || dataset.previewHeaders || (rows.length > 0 ? Object.keys(rows[0]) : []);
      return {
        dataset_id: cleanId,
        columns: cols,
        rows: rows,
        total_rows: rows.length,
        total_columns: cols.length
      };
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}/preview`, { params, timeout: 5000 });
      return response.data;
    } catch {
      const dataset = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      if (!dataset) return null;
      const rows = dataset.previewRows || dataset.preview_rows || [];
      const cols = dataset.columns || dataset.previewHeaders || (rows.length > 0 ? Object.keys(rows[0]) : []);
      return {
        dataset_id: cleanId,
        columns: cols,
        rows: rows,
        total_rows: rows.length,
        total_columns: cols.length
      };
    }
  },

  // Fetch similar datasets
  getSimilarDatasets: async (id: string): Promise<Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>> => {
    const cleanId = normalizeDatasetId(id);
    if (USE_MOCK_DATA) {
      const dataset = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      return dataset?.similarDatasets || [];
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}/similar`, { timeout: 5000 });
      return response.data;
    } catch {
      const dataset = MOCK_DATASETS.find((d) => d.id === cleanId || d.id === id);
      return dataset?.similarDatasets || [];
    }
  },

  // Helper to build direct download link
  getDownloadUrl: (id: string, format: string): string => {
    const cleanId = normalizeDatasetId(id);
    return `${API_BASE_URL}/datasets/${cleanId}/download?format=${format}`;
  },

  // Fetch featured / latest datasets for Homepage
  getLatestDatasets: async (limit: number = 4): Promise<Dataset[]> => {
    if (USE_MOCK_DATA) {
      return MOCK_DATASETS.slice(0, limit).map(({ previewRows, previewHeaders, ...rest }) => rest);
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/latest`, { params: { limit }, timeout: 5000 });
      return response.data;
    } catch {
      return MOCK_DATASETS.slice(0, limit).map(({ previewRows, previewHeaders, ...rest }) => rest);
    }
  }
};
