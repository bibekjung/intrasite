/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

/**
 * Get the API base URL based on environment
 * In development, uses '/api' which is proxied by Vite
 * In production, uses the full URL from environment variable
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isDev = import.meta.env.DEV;

  // In development, always use '/api' to leverage Vite proxy
  if (isDev) {
    return '/api';
  }

  // In production, use environment variable or fallback
  if (envUrl) {
    const trimmed = envUrl.trim();
    // Remove trailing slash if present
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }

  // Production fallback
  return 'http://10.0.130.163:8000/api';
};

/**
 * API Base URL
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints Configuration
 * Define all API endpoints here for easy management
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/ldap-login',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // User endpoints
  USER: {
    PROFILE: '/user',
    UPDATE_PROFILE: '/user',
    CHANGE_PASSWORD: '/user/change-password',
    AVATAR: '/user/avatar',
  },

  // Directory endpoints
  DIRECTORY: {
    LIST: '/directory',
    SEARCH: '/directory/search',
    DETAILS: '/directory/:id',
  },

  // NID Search endpoints
  NID: {
    SEARCH: '/nid/search',
    VERIFY: '/nid/verify',
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },

  // Policy/Document endpoints
  DOCUMENTS: {
    LIST: '/documents',
    GET: '/documents/:id',
    DOWNLOAD: '/documents/:id/download',
  },

  // Authorization endpoints
  ROLES: {
    LIST: '/admin/get-all-role',
    CREATE: '/admin/create-role',
    GET: '/roles/:id',
    UPDATE: '/roles/:id',
    DELETE: '/roles/:id',
  },

  PERMISSIONS: {
    LIST: '/permissions',
    GET: '/permissions/:id',
  },

  PORTAL: {
    CREATE: '/admin/create-portal',
    LIST: '/admin/get-all-portal',
    GET: '/admin/get-portal/:id',
    UPDATE: '/admin/update-portal/:id',
    DELETE: '/admin/delete-portal/:id',
  },
} as const;

/**
 * Helper function to build full endpoint URL
 * @param endpoint - The endpoint path (e.g., '/ldap-login' or API_ENDPOINTS.AUTH.LOGIN)
 * @returns Full URL with base path
 */
export const getEndpointUrl = (endpoint: string): string => {
  // Remove leading slash if present (we'll add it)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If base URL is relative (starts with '/'), just append
  if (API_BASE_URL.startsWith('/')) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }

  // If base URL is absolute, ensure proper joining
  const baseUrl = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Helper function to replace path parameters
 * @param endpoint - Endpoint with parameters (e.g., '/user/:id')
 * @param params - Object with parameter values (e.g., { id: '123' })
 * @returns Endpoint with replaced parameters (e.g., '/user/123')
 */
export const replacePathParams = (
  endpoint: string,
  params: Record<string, string | number>,
): string => {
  let result = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

/**
 * Get full URL for an endpoint with optional path parameters
 * @param endpoint - The endpoint path
 * @param params - Optional path parameters to replace
 * @returns Full URL
 */
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string | number>,
): string => {
  const endpointWithParams = params
    ? replacePathParams(endpoint, params)
    : endpoint;
  return getEndpointUrl(endpointWithParams);
};

/**
 * Log API configuration (development only)
 */
export const logApiConfig = (): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.group('🔌 API Configuration');
    // eslint-disable-next-line no-console
    console.log('Base URL:', API_BASE_URL);
    // eslint-disable-next-line no-console
    console.log('Environment:', import.meta.env.MODE);
    // eslint-disable-next-line no-console
    console.log('Endpoints:', API_ENDPOINTS);
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};

// Log configuration in development
if (import.meta.env.DEV) {
  logApiConfig();
}
