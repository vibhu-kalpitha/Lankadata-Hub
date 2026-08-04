// Service configuration for LankaData Hub

// Backend base URL — all API calls go through nginx proxy to the FastAPI backend
export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

// FastAPI service base URL (used by province map and other specialized endpoints)
export const FASTAPI_API_URL = import.meta.env.VITE_FASTAPI_API_URL || '/fastapi-api';

// Primary alias used by all services
export const API_BASE_URL = BACKEND_API_URL;
