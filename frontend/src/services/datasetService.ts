import axios from 'axios';
import { API_BASE_URL } from './config';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  table_name?: string;
  primary_date_column?: string;
  formats: string[];
  created_at?: string;
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
  similarDatasets?: Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>;
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

const normalizeDatasetId = (id: string): string => {
  if (!id) return '';
  return decodeURIComponent(id).trim().toLowerCase();
};

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'economy', name: 'Economy & Finance', count: 12, iconName: 'TrendingUp', description: 'Exchange rates, GDP, and inflation metrics' },
  { id: 'health', name: 'Health & Surveillance', count: 8, iconName: 'Activity', description: 'Epidemiological case counts and public health stats' },
  { id: 'weather', name: 'Weather & Climate', count: 6, iconName: 'CloudRain', description: 'Rainfall, temperature, and meteorological data' },
  { id: 'transportation', name: 'Transport & Ports', count: 5, iconName: 'Globe', description: 'Port traffic, vehicle registrations, and road networks' },
];

const FALLBACK_DATASETS: Dataset[] = [
  {
    id: 'cbsl-usd-exchange-rates',
    title: 'USD Exchange Rates (CBSL & Commercial Banks)',
    description: 'Daily buying and selling exchange rates for USD across CBSL, HNB, Commercial Bank, Peoples Bank, Seylan, Sampath, and NTB.',
    category: 'Economy & Finance',
    table_name: 'cbsl_usd_exchange_rates',
    formats: ['CSV', 'JSON', 'SQL', 'API'],
    views: 1420,
    downloads: 850,
    maintainer: 'Central Bank of Sri Lanka',
    source: 'CBSL & Commercial Bank Scraper',
    frequency: 'Daily',
    coverage: '2020 - Present',
    live: true,
    featured: true,
    total_records: 12500,
    file_size: '1.8 MB'
  },
  {
    id: 'sri-lanka-provinces',
    title: 'Sri Lanka Provincial Profiles & Demographics',
    description: 'Comprehensive regional profiles including population, land area, provincial capitals, and district breakdowns across all 9 provinces.',
    category: 'Economy & Finance',
    table_name: 'provinces',
    formats: ['CSV', 'JSON', 'API'],
    views: 980,
    downloads: 430,
    maintainer: 'Survey Department of Sri Lanka',
    source: 'Department of Census & Statistics',
    frequency: 'Annual',
    coverage: 'All 9 Provinces',
    live: true,
    featured: true,
    total_records: 9,
    file_size: '250 KB'
  },
  {
    id: 'national-dengue-surveillance',
    title: 'National Dengue Surveillance & District Cases',
    description: 'Epidemiological Dengue case counts, high-risk zones, and monthly trends tracked by the National Dengue Eradication Unit.',
    category: 'Health & Surveillance',
    table_name: 'dengue_cases',
    formats: ['CSV', 'JSON', 'API'],
    views: 1150,
    downloads: 620,
    maintainer: 'Ministry of Health Sri Lanka',
    source: 'National Dengue Eradication Unit',
    frequency: 'Weekly',
    coverage: '25 Districts',
    live: true,
    featured: false,
    total_records: 4800,
    file_size: '890 KB'
  }
];

export const datasetService = {
  // Fetch all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, { timeout: 8000 });
      if (response.data && response.data.length > 0) return response.data;
      return FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
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
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets`, { params, timeout: 8000 });
      if (response.data && response.data.datasets && response.data.datasets.length > 0) {
        return response.data;
      }
      return { datasets: FALLBACK_DATASETS, total: FALLBACK_DATASETS.length, pages: 1 };
    } catch {
      return { datasets: FALLBACK_DATASETS, total: FALLBACK_DATASETS.length, pages: 1 };
    }
  },

  // Fetch single dataset details
  getDatasetById: async (id: string): Promise<DatasetDetail | null> => {
    const cleanId = normalizeDatasetId(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}`, { timeout: 8000 });
      if (response.data) return response.data;
      return (FALLBACK_DATASETS.find(d => d.id === cleanId) as DatasetDetail) || null;
    } catch {
      return (FALLBACK_DATASETS.find(d => d.id === cleanId) as DatasetDetail) || null;
    }
  },

  // Fetch dataset records (table preview with pagination, search, sorting)
  getDatasetRecords: async (id: string, params?: {
    search?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
    offset?: number;
  }): Promise<DatasetPreviewResponse | null> => {
    const cleanId = normalizeDatasetId(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}/records`, { params, timeout: 8000 });
      return response.data;
    } catch {
      try {
        const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}/preview`, { params, timeout: 8000 });
        return response.data;
      } catch {
        return null;
      }
    }
  },

  // Alias for getDatasetRecords
  getDatasetPreview: async (id: string, params?: {
    search?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
  }): Promise<DatasetPreviewResponse | null> => {
    return datasetService.getDatasetRecords(id, params);
  },

  // Fetch similar datasets from same category
  getSimilarDatasets: async (id: string): Promise<Array<{ id: string; title: string; description: string; category: string; updated_at?: string }>> => {
    const cleanId = normalizeDatasetId(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}/similar`, { timeout: 8000 });
      return response.data;
    } catch {
      return [];
    }
  },

  // Helper to build direct download link
  getDownloadUrl: (id: string, format: string): string => {
    const cleanId = normalizeDatasetId(id);
    return `${API_BASE_URL}/datasets/${cleanId}/download/${format}`;
  },

  // Fetch featured / latest datasets for Homepage
  getLatestDatasets: async (limit: number = 4): Promise<Dataset[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/latest`, { params: { limit }, timeout: 8000 });
      if (response.data && response.data.length > 0) return response.data;
      return FALLBACK_DATASETS.slice(0, limit);
    } catch {
      return FALLBACK_DATASETS.slice(0, limit);
    }
  }
};
