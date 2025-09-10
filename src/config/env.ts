// Environment variables configuration
// This file centralizes all environment variable access

export const ENV = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  
  // Development mode
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  
  // Mode
  MODE: import.meta.env.MODE,
} as const;

// Validation function
export const validateEnv = (): void => {
  const requiredVars = [
    { key: 'VITE_API_BASE_URL', value: ENV.API_BASE_URL }
  ];

  const missingVars = requiredVars.filter(({ value }) => !value);
  
  if (missingVars.length > 0) {
    const missingKeys = missingVars.map(({ key }) => key).join(', ');
    throw new Error(
      `Missing required environment variables: ${missingKeys}\n` +
      'Please check your .env.local file and ensure all required variables are set.\n' +
      'See src/config/README.md for setup instructions.'
    );
  }
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  if (!ENV.API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Remove trailing slash from base URL and add endpoint
  const baseUrl = ENV.API_BASE_URL.replace(/\/$/, '');
  
  return `${baseUrl}${normalizedEndpoint}`;
};
