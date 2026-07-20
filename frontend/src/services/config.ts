// Service configuration for LankaData Hub

// FastAPI backend base URL
export const API_BASE_URL = 'http://localhost:8000/api';

// Config flag to toggle between local mock services and real backend REST APIs.
// If set to true, mock data will be used. If false, it makes axios calls to API_BASE_URL.
export const USE_MOCK_DATA = true;

// Helper to determine if we should call the live API
export const getServiceMode = (): boolean => {
  return USE_MOCK_DATA;
};
