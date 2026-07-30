// Service configuration for LankaData Hub

// Backend base URL
export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

// FastAPI service base URL
export const FASTAPI_API_URL = import.meta.env.VITE_FASTAPI_API_URL || '/fastapi-api';

// Alias for backwards compatibility
export const API_BASE_URL = BACKEND_API_URL;

// Config flag to toggle between local mock services and real backend REST APIs.
// If set to true, mock data will be used. If false, it makes axios calls.
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

// Helper to determine if we should call the live API
export const getServiceMode = (): boolean => {
  return USE_MOCK_DATA;
};
