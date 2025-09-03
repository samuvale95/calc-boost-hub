// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  
  // For production, you can set this via environment variable or hardcode
  return import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    USERS: '/users',
    REGISTER: '/users/register',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
