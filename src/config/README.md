# Environment Variables Configuration

This application requires the following environment variables to be set:

## Required Variables

### `VITE_API_BASE_URL`
- **Description**: Base URL for the API endpoints
- **Required**: Yes
- **Example Development**: `http://localhost:8000/api/v1`
- **Example Production**: `https://your-api-domain.com/api/v1`

## Setup Instructions

1. Create a `.env.local` file in the project root
2. Add the required environment variables:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Environment Files Priority

1. `.env.local` (highest priority, not committed to git)
2. `.env.development` (for development)
3. `.env.production` (for production)
4. `.env` (fallback)

## Development vs Production

- **Development**: Set `VITE_API_BASE_URL` to your local API server
- **Production**: Set `VITE_API_BASE_URL` to your production API server

## Error Handling

If `VITE_API_BASE_URL` is not set, the application will throw an error on startup to prevent runtime issues.