import axios from 'axios';
import { API_BASE_URL } from './config';

// ── Interfaces ─────────────────────────────────────────────────────────────────
export interface Dashboard {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  author: string;
  updatedAt?: string;
  updated_at?: string;
  live: boolean;
  featured?: boolean;
  api_endpoint?: string;
}

export interface DashboardDetail extends Dashboard {
  embed_url?: string;
  embedUrl?: string;
  chartData?: Array<{ month: string; Projected: number; Actual: number }>;
  insights?: string[];
  metrics?: Array<{ title: string; value: string; change: string; isPositive: boolean; type: string }>;
  relatedReports?: Array<{ title: string; size: string; type: string }>;
  relatedDatasets?: Array<{ id: string; title: string; category: string }>;
  apiEndpoint?: string;
}

// ── Service ────────────────────────────────────────────────────────────────────
export const dashboardService = {
  getDashboards: async (): Promise<DashboardDetail[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboards`, { timeout: 8000 });
      return response.data;
    } catch {
      return [];
    }
  },

  getPopularDashboards: async (): Promise<Dashboard[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboards/popular`, { timeout: 8000 });
      return response.data;
    } catch {
      return [];
    }
  },

  searchDashboards: async (query: string, limit = 3): Promise<Array<{ id: string; title: string }>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboards`, {
        params: { search: query, limit },
        timeout: 5000
      });
      return (response.data || []).slice(0, limit).map((d: Dashboard) => ({ id: d.id, title: d.title }));
    } catch {
      return [];
    }
  },

  getDashboardById: async (id: string): Promise<DashboardDetail | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboards/${id}`, { timeout: 8000 });
      return response.data;
    } catch {
      return null;
    }
  }
};
