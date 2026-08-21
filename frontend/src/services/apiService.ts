import axios from 'axios';
import { FASTAPI_API_URL } from './config';

export interface ApiEndpoint {
  id: string;
  title: string;
  description: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  pricing: 'Free' | 'Pro' | 'Enterprise';
  status: 'active' | 'beta' | 'deprecated';
  datasetId?: string;
  datasetName?: string;
  sampleRequest?: Record<string, string>;
  sampleResponse?: Record<string, string>;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

export interface RegionalNewsData {
  province: string;
  total_articles: number;
  economy_count: number;
  politics_count: number;
  crime_count: number;
  general_count: number;
}

export interface NewsFeedItem {
  id: number | string;
  title: string;
  source: string;
  category: string;
  province: string;
  summary: string;
  keywords: string[];
  url: string;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  rateLimit: string;
  features: string[];
}

const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Developer',
    price: '$0',
    period: 'forever',
    rateLimit: '1,000 requests/day',
    features: [
      'Access to public datasets',
      'Standard REST API endpoints',
      'Community support',
      'JSON & CSV formats',
      '99.5% uptime SLA'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$49',
    period: 'per month',
    rateLimit: '100,000 requests/day',
    features: [
      'All Developer features',
      'Real-time WebSocket streams',
      'Priority email support',
      'Advanced GraphQL queries',
      'Historical archive access',
      '99.9% uptime SLA'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'billed annually',
    rateLimit: 'Custom limit',
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

export interface UsdBankRate {
  id: string;
  name: string;
  buy: number;
  sell: number;
  spread: number;
  spread_pct: string;
  status: string;
  updated_today: boolean;
  date: string;
}

export interface UsdTrendPoint {
  year: string;
  buy_stream: number;
  sell_stream: number;
}

export interface UsdComparisonResponse {
  title?: string;
  subtitle?: string;
  date: string;
  base_currency: string;
  quote_currency: string;
  banks: UsdBankRate[];
  best_buy_ranking: UsdBankRate[];
  best_sell_ranking: UsdBankRate[];
  trend_analysis: UsdTrendPoint[];
}

const FALLBACK_EXCHANGE_DATA: UsdComparisonResponse = {
  title: 'Daily Dashboard',
  subtitle: 'USD Dashboard - Tactical Data Stack',
  date: new Date().toISOString().split('T')[0],
  base_currency: 'USD',
  quote_currency: 'LKR',
  banks: [
    { id: 'hnb', name: 'HNB', buy: 297.90, sell: 303.35, spread: 5.45, spread_pct: '1.83%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'combank', name: 'ComBank', buy: 298.20, sell: 303.15, spread: 4.95, spread_pct: '1.66%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'peoples', name: 'Peoples Bank', buy: 297.50, sell: 304.00, spread: 6.50, spread_pct: '2.18%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'cbsl', name: 'CBSL', buy: 298.80, sell: 302.90, spread: 4.10, spread_pct: '1.37%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'seylan', name: 'Seylan Bank', buy: 297.80, sell: 303.70, spread: 5.90, spread_pct: '1.98%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'sampath', name: 'Sampath Bank', buy: 298.10, sell: 303.25, spread: 5.15, spread_pct: '1.72%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'ntb', name: 'NTB', buy: 297.60, sell: 303.80, spread: 6.20, spread_pct: '2.08%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
  ],
  best_buy_ranking: [
    { id: 'cbsl', name: 'CBSL', buy: 298.80, sell: 302.90, spread: 4.10, spread_pct: '1.37%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'combank', name: 'ComBank', buy: 298.20, sell: 303.15, spread: 4.95, spread_pct: '1.66%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'sampath', name: 'Sampath Bank', buy: 298.10, sell: 303.25, spread: 5.15, spread_pct: '1.72%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'hnb', name: 'HNB', buy: 297.90, sell: 303.35, spread: 5.45, spread_pct: '1.83%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'seylan', name: 'Seylan Bank', buy: 297.80, sell: 303.70, spread: 5.90, spread_pct: '1.98%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'ntb', name: 'NTB', buy: 297.60, sell: 303.80, spread: 6.20, spread_pct: '2.08%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'peoples', name: 'Peoples Bank', buy: 297.50, sell: 304.00, spread: 6.50, spread_pct: '2.18%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
  ],
  best_sell_ranking: [
    { id: 'cbsl', name: 'CBSL', buy: 298.80, sell: 302.90, spread: 4.10, spread_pct: '1.37%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'combank', name: 'ComBank', buy: 298.20, sell: 303.15, spread: 4.95, spread_pct: '1.66%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'sampath', name: 'Sampath Bank', buy: 298.10, sell: 303.25, spread: 5.15, spread_pct: '1.72%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'hnb', name: 'HNB', buy: 297.90, sell: 303.35, spread: 5.45, spread_pct: '1.83%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'seylan', name: 'Seylan Bank', buy: 297.80, sell: 303.70, spread: 5.90, spread_pct: '1.98%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'ntb', name: 'NTB', buy: 297.60, sell: 303.80, spread: 6.20, spread_pct: '2.08%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
    { id: 'peoples', name: 'Peoples Bank', buy: 297.50, sell: 304.00, spread: 6.50, spread_pct: '2.18%', status: 'Live', updated_today: true, date: new Date().toISOString().split('T')[0] },
  ],
  trend_analysis: [
    { year: "2020", buy_stream: 185.70, sell_stream: 190.20 },
    { year: "2021", buy_stream: 198.50, sell_stream: 203.10 },
    { year: "2022", buy_stream: 355.20, sell_stream: 368.50 },
    { year: "2023", buy_stream: 320.40, sell_stream: 332.80 },
    { year: "2024", buy_stream: 305.10, sell_stream: 312.40 },
    { year: "2025", buy_stream: 299.80, sell_stream: 305.20 },
    { year: "Today", buy_stream: 298.10, sell_stream: 303.35 },
  ]
};

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

  getPricingPlans: (): PricingPlan[] => MOCK_PRICING_PLANS,
  getPricing: (): PricingPlan[] => MOCK_PRICING_PLANS,

  getUsdExchangeRates: async (): Promise<UsdComparisonResponse> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/exchange-rates/usd-comparison`, { timeout: 8000 });
      if (response.data && response.data.banks && response.data.banks.length > 0) {
        return response.data;
      }
      return FALLBACK_EXCHANGE_DATA;
    } catch (error) {
      console.warn('Using fallback exchange rate data:', error);
      return FALLBACK_EXCHANGE_DATA;
    }
  },

  getTodaysSriLankaStats: async (): Promise<any> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/todays-sri-lanka-stats`, { timeout: 8000 });
      return response.data;
    } catch (error) {
      console.warn('Using fallback todays stats data:', error);
      return null;
    }
  },

  getRegionalNewsMapData: async (): Promise<RegionalNewsData[]> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/v1/news/regional-map`, { timeout: 8000 });
      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch regional news map data:', error);
      return [];
    }
  },

  getLiveNewsFeed: async (): Promise<NewsFeedItem[]> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/v1/news/live-feed`, { timeout: 8000 });
      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch live news feed:', error);
      return [];
    }
  },

  getCebPowerGridStats: async (): Promise<any> => {
    try {
      const response = await axios.get(`${FASTAPI_API_URL}/v1/ceb-power-grid-stats`, { timeout: 8000 });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch CEB power grid stats:', error);
      return null;
    }
  }
};
