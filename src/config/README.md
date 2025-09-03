# API Configuration

This directory contains the API configuration for the application.

## Environment Setup

The application uses different API URLs based on the environment:

- **Development**: `http://localhost:8000`
- **Production**: Configurable via environment variable `VITE_API_BASE_URL`

## Configuration

### Development
The API URL is automatically set to `http://localhost:8000` when running in development mode.

### Production
To set a custom API URL for production, you can:

1. Set the environment variable `VITE_API_BASE_URL` in your deployment environment
2. Or modify the `getApiBaseUrl()` function in `api.ts` to hardcode your production URL

## Usage

```typescript
import { buildApiUrl, API_CONFIG } from '@/config/api';

// Build a full API URL
const usersUrl = buildApiUrl(API_CONFIG.ENDPOINTS.USERS);
// Results in: http://localhost:8000/users (dev) or your-production-url/users (prod)

// Direct access to base URL
const baseUrl = API_CONFIG.BASE_URL;
```

## Adding New Endpoints

To add new API endpoints, update the `ENDPOINTS` object in `api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    USERS: '/users',
    NEW_ENDPOINT: '/new-endpoint', // Add your new endpoint here
  }
};
```
