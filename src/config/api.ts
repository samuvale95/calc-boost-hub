// API Configuration
const getApiBaseUrl = () => {
  // Use environment variable if available, otherwise fallback to default
  return import.meta.env.VITE_API_BASE_URL || 'https://radiant-peak-19300-dc15f27e243f.herokuapp.com';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    USERS: '/users',
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    REGENERATE_PASSWORD: '/users/{id}/regenerate-password',
    DEACTIVATE_USER: '/users/{id}/deactivate',
    ACTIVATE_USER: '/users/{id}/activate',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
