// Province data service — fetches from FastAPI GET /api/provinces
// Architecture: React → FastAPI → PostgreSQL

import { FASTAPI_API_URL } from './config';

export interface Province {
  id: number;
  province: string;
  provincial_capital: string;
  total_area_km2: number;
  estimated_population: string;
  districts_included: string[];
  data_source: string | null;
  last_updated: string | null;
}

export async function fetchProvinces(): Promise<Province[]> {
  const response = await fetch(`${FASTAPI_API_URL}/provinces`);
  if (!response.ok) {
    throw new Error(`Failed to fetch provinces: ${response.status} ${response.statusText}`);
  }
  const data: Province[] = await response.json();
  return data;
}
