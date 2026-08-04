import axios from 'axios';
import { API_BASE_URL } from './config';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  table_name?: string;
  formats: string[];
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

export const datasetService = {
  // Fetch all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, { timeout: 8000 });
      return response.data;
    } catch {
      return [];
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
      return response.data;
    } catch {
      return { datasets: [], total: 0, pages: 1 };
    }
  },

  // Fetch single dataset details
  getDatasetById: async (id: string): Promise<DatasetDetail | null> => {
    const cleanId = normalizeDatasetId(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${cleanId}`, { timeout: 8000 });
      return response.data;
    } catch {
      return null;
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
      return response.data;
    } catch {
      return [];
    }
  }
};
