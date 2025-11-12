import { validateEnv, getApiUrl } from './env';

// Validate environment variables on import
validateEnv();

export const API_CONFIG = {
  ENDPOINTS: {
    USERS: '/users',
    LOGIN: '/auth/login',
    REGISTER: '/users/register',
    CHECK_EMAIL: '/users/check-email',
    VERIFY_TOKEN: '/auth/verify',
    REGENERATE_PASSWORD: '/users/{id}/regenerate-password',
    DEACTIVATE_USER: '/users/{id}/deactivate',
    ACTIVATE_USER: '/users/{id}/activate',
    UPDATE_USER: '/users/{id}',
    // Payment endpoints
    PAYMENTS: '/payments',
    MY_PAYMENTS: '/payments/my-payments',
    MY_PAYMENT_SUMMARY: '/payments/my-summary',
    PAYMENT_BY_ID: '/payments/{id}',
    // Admin payment endpoints
    ALL_PAYMENTS: '/payments/all',
    PAYMENT_STATS: '/payments/stats',
    // PDF download endpoint
    DOWNLOAD_PDF: '/pdf/download',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return getApiUrl(endpoint);
};
