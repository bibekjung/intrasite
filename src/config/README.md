# API Configuration

This directory contains the API configuration for the application.

## Files

- `apiConfig.ts` - Centralized API endpoint configuration

## Usage

### Import the configuration

```typescript
import { API_ENDPOINTS, API_BASE_URL, buildApiUrl } from '@/config/apiConfig';
```

### Using endpoints

```typescript
// Simple endpoint
apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

// Endpoint with path parameters
const userId = '123';
const endpoint = buildApiUrl(API_ENDPOINTS.USER.PROFILE.replace(':id', userId));
// Or use replacePathParams helper
import { replacePathParams } from '@/config/apiConfig';
const endpoint = replacePathParams(API_ENDPOINTS.DIRECTORY.DETAILS, {
  id: '123',
});
```

### Available Endpoints

#### Authentication

- `API_ENDPOINTS.AUTH.LOGIN` - `/ldap-login`
- `API_ENDPOINTS.AUTH.REFRESH_TOKEN` - `/refresh-token`
- `API_ENDPOINTS.AUTH.LOGOUT` - `/logout`
- `API_ENDPOINTS.AUTH.FORGOT_PASSWORD` - `/forgot-password`
- `API_ENDPOINTS.AUTH.RESET_PASSWORD` - `/reset-password`

#### User

- `API_ENDPOINTS.USER.PROFILE` - `/user`
- `API_ENDPOINTS.USER.UPDATE_PROFILE` - `/user`
- `API_ENDPOINTS.USER.CHANGE_PASSWORD` - `/user/change-password`
- `API_ENDPOINTS.USER.AVATAR` - `/user/avatar`

#### Directory

- `API_ENDPOINTS.DIRECTORY.LIST` - `/directory`
- `API_ENDPOINTS.DIRECTORY.SEARCH` - `/directory/search`
- `API_ENDPOINTS.DIRECTORY.DETAILS` - `/directory/:id`

#### NID Search

- `API_ENDPOINTS.NID.SEARCH` - `/nid/search`
- `API_ENDPOINTS.NID.VERIFY` - `/nid/verify`

#### Settings

- `API_ENDPOINTS.SETTINGS.GET` - `/settings`
- `API_ENDPOINTS.SETTINGS.UPDATE` - `/settings`

#### Documents

- `API_ENDPOINTS.DOCUMENTS.LIST` - `/documents`
- `API_ENDPOINTS.DOCUMENTS.GET` - `/documents/:id`
- `API_ENDPOINTS.DOCUMENTS.DOWNLOAD` - `/documents/:id/download`

## Configuration

The API base URL is automatically determined based on the environment:

- **Development**: Uses `/api` (proxied by Vite to `VITE_API_PROXY_TARGET`)
- **Production**: Uses `VITE_API_BASE_URL` from environment variables

## Environment Variables

Set these in your `.env` file:

```env
# Development proxy target (only used in dev mode)
VITE_API_PROXY_TARGET=http://10.0.113.163:8000

# Production API base URL
VITE_API_BASE_URL=http://10.0.113.163:8000/api
```

## Adding New Endpoints

To add a new endpoint:

1. Open `src/config/apiConfig.ts`
2. Add the endpoint to the appropriate section in `API_ENDPOINTS`
3. Use the endpoint in your API calls:

```typescript
// Example: Adding a new endpoint
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_FEATURE: {
    LIST: '/new-feature',
    GET: '/new-feature/:id',
    CREATE: '/new-feature',
  },
} as const;

// Usage
apiClient.get(API_ENDPOINTS.NEW_FEATURE.LIST);
```
