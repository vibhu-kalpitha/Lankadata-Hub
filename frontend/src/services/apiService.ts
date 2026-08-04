import axios from 'axios';
import { FASTAPI_API_URL } from './config';

// ── Interfaces ─────────────────────────────────────────────────────────────────
export interface ApiEndpoint {
  id: string;
  title: string;
  description: string;
  category: string;
  method: 'GET' | 'POST';
  endpoint: string;
  parameters?: Array<{ name: string; type: string; required: boolean; description: string }>;
  sampleRequest?: {
    curl: string;
    javascript: string;
    python: string;
  };
  sampleResponse?: string;
  datasetId?: string;
  datasetName?: string;
  pricing: 'Free' | 'Developer' | 'Enterprise';
  status: 'active' | 'beta';
}

// Static pricing tiers — UI config only, not dataset content
export const PRICING_TIERS = [
  {
    name: 'Free',
    price: 'Rs. 0',
    period: 'forever',
    desc: 'Perfect for students, researchers, and hobbyists building non-commercial tools.',
    features: [
      '10,000 requests / month',
      'Public datasets access only',
      'Standard rate limits (60 req/min)',
      'Community forum support',
      'JSON formats'
    ]
  },
  {
    name: 'Developer',
    price: 'Rs. 7,500',
    period: 'month',
    desc: 'For developers and startups building production-ready apps and commercial dashboard suites.',
    features: [
      '500,000 requests / month',
      'Access to live & historical streams',
      'High rate limits (500 req/min)',
      'Email support (24h response)',
      'CSV, JSON, XML formats',
      '99.9% API uptime SLA'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom Pricing',
    period: 'custom',
    desc: 'Designed for financial institutions, conglomerates, and government bodies requiring dedicated tunnels.',
    features: [
      'Unlimited requests',
      'Direct PostgreSQL connections',
      'Dedicated support engineer',
      'Custom query design',
      'On-premise deployment support',
      '99.99% uptime guarantee'
    ]
  }
];

// ── Service ────────────────────────────────────────────────────────────────────
export const apiService = {
  getApis: async (): Promise<ApiEndpoint[]> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/apis`, { timeout: 8000 });
      return response.data;
    } catch {
      return [];
    }
  },

  getApiById: async (id: string): Promise<ApiEndpoint | null> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/apis/${id}`, { timeout: 8000 });
      return response.data;
    } catch {
      return null;
    }
  },

  searchApis: async (query: string, limit = 3): Promise<Array<{ id: string; title: string }>> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/apis`, { timeout: 5000 });
      const q = query.toLowerCase();
      return (response.data || [])
        .filter((a: ApiEndpoint) =>
          a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
        )
        .slice(0, limit)
        .map((a: ApiEndpoint) => ({ id: a.id, title: a.title }));
    } catch {
      return [];
    }
  },

  // Pricing is UI config — not fetched from backend
  getPricing: () => PRICING_TIERS
};
