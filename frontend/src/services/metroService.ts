import { API_BASE_URL } from './config';

export interface MetroTotalItem {
  id?: number;
  network_metric: string;
  total_count: string;
  key_locations_and_details?: string;
}

export interface MetroConnectedCity {
  id?: number;
  city_hub: string;
  routes_serving_it: string;
  primary_destinations: string;
  major_connections: string;
  total_stops: string;
  rail_exchange?: string;
}

export interface MetroBusRoute {
  id: number;
  route_code: string;
  route_name: string;
  origin_terminal?: string;
  destination_terminal?: string;
  category?: string;
  distance_km: string;
  approx_duration: string;
  total_stops: number;
  stops_sequence?: string;
  departure_schedules?: string;
  service_notes?: string;
  contact_number?: string;
  data_source?: string;
  peak_headway?: string;
  off_peak_headway?: string;
  operating_hours?: string;
  fare_range_lkr?: string;
  multimodal_transfers?: string[];
}

export async function fetchMetroTotals(): Promise<MetroTotalItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/metro/totals`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Error fetching metro totals from API:', e);
  }
  return [];
}

export async function fetchMetroConnectedCities(): Promise<MetroConnectedCity[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/metro/connected-cities`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Error fetching metro connected cities from API:', e);
  }
  return [];
}

export async function fetchMetroBuses(): Promise<MetroBusRoute[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/metro/buses`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Error fetching metro buses from API:', e);
  }
  return [];
}
