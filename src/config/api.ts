import { validateEnv, getApiUrl } from './env';

// Validate environment variables on import
validateEnv();

export const API_CONFIG = {
  ENDPOINTS: {
    USERS: '/users',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_TOKEN: '/auth/verify',
    REGENERATE_PASSWORD: '/users/{id}/regenerate-password',
    DEACTIVATE_USER: '/users/{id}/deactivate',
    ACTIVATE_USER: '/users/{id}/activate',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return getApiUrl(endpoint);
};
