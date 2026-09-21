import { validateEnv, getApiUrl } from './env';

// Validate environment variables on import
validateEnv();

export const API_CONFIG = {
  ENDPOINTS: {
    USERS: '/users',
    CURRENT_USER: '/users/me',
    REGISTER: '/users/register',
    CHECK_EMAIL: '/users/check-email',
    VERIFY_TOKEN: '/auth/verify',
    REGENERATE_PASSWORD: '/users/{id}/regenerate-password',
    DEACTIVATE_USER: '/users/{id}/deactivate',
    ACTIVATE_USER: '/users/{id}/activate',
    UPDATE_USER: '/users/{id}',
    APPROVE_USER: '/users/admin/{id}/approve',
    REJECT_USER: '/users/admin/{id}/reject',
    // PDF / scale + manual download endpoint (DAND Scale plan, point 5:
    // registration-gated, no payment involved)
    DOWNLOAD_PDF: '/pdf/download',
    PDF_INFO: '/pdf/info',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return getApiUrl(endpoint);
};
