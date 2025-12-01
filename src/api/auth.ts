import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import {
  type LoginInput,
  type LoginResponse,
  type RefreshTokenInput,
  type RefreshTokenResponse,
} from './schemas/authSchema';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  isAccessTokenExpired,
} from '@/utils/tokenStorage';
import { store } from '@/store/store';
import { updateTokens, clearAuth } from '@/slices/authSlice';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/apiConfig';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds timeout is set
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Proactively refresh access token if it's expired or about to expire
 * This function is called before API requests to ensure we always have a valid token
 */
const refreshTokenIfNeeded = async (): Promise<string | null> => {
  // If already refreshing, wait for that to complete
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  // Check if token is expired or about to expire (with 10 second buffer)
  if (!isAccessTokenExpired(10)) {
    return getAccessToken();
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    // No refresh token available, logout user
    store.dispatch(clearAuth());
    clearTokens();
    window.location.href = '/';
    return null;
  }

  isRefreshing = true;

  try {
    const newTokens = await refreshAccessToken(refreshToken);
    const newAccessToken = newTokens.access_token.accessToken;
    const expiresIn = newTokens.access_token.expiresIn || 60;

    setAccessToken(newAccessToken, expiresIn);

    if (newTokens.refresh_token) {
      setRefreshToken(newTokens.refresh_token);
    }

    // Update Redux store with new tokens
    store.dispatch(
      updateTokens({
        token: newAccessToken,
        refreshToken: newTokens.refresh_token,
        expiresIn: expiresIn,
      }),
    );

    processQueue(null, newAccessToken);
    isRefreshing = false;

    return newAccessToken;
  } catch (refreshError) {
    // Refresh failed, logout user
    store.dispatch(clearAuth());
    clearTokens();
    processQueue(refreshError as Error, null);
    isRefreshing = false;
    window.location.href = '/';
    return null;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {} as Record<string, string>;
    }

    // Skip token refresh for login, logout, and refresh token endpoints
    const isLoginEndpoint = config.url?.includes(API_ENDPOINTS.AUTH.LOGIN);
    const isLogoutEndpoint = config.url?.includes(API_ENDPOINTS.AUTH.LOGOUT);
    const isRefreshTokenEndpoint =
      config.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN) ||
      config.url?.includes('refresh-token');
    const isAuthEndpoint =
      isLoginEndpoint || isLogoutEndpoint || isRefreshTokenEndpoint;

    if (!isAuthEndpoint) {
      // Proactively refresh token if needed before making the request
      const token = await refreshTokenIfNeeded();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (isLoginEndpoint) {
      // For login endpoint, don't add Authorization header
    } else if (isLogoutEndpoint) {
      // For logout endpoint, use existing token if available (don't refresh)
      // This allows backend to invalidate the token even if it's expired
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (isRefreshTokenEndpoint) {
      // For refresh token endpoint, don't add Authorization header (uses refresh_token in body)
    }

    if (
      config.data &&
      (config.method === 'post' ||
        config.method === 'put' ||
        config.method === 'patch')
    ) {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, logout user
        store.dispatch(clearAuth());
        clearTokens();
        processQueue(new Error('No refresh token available'), null);
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const newTokens = await refreshAccessToken(refreshToken);
        const newAccessToken = newTokens.access_token.accessToken;

        setAccessToken(newAccessToken, newTokens.access_token.expiresIn || 60);

        if (newTokens.refresh_token) {
          setRefreshToken(newTokens.refresh_token);
        }

        // Update Redux store with new tokens
        store.dispatch(
          updateTokens({
            token: newAccessToken,
            refreshToken: newTokens.refresh_token,
            expiresIn: newTokens.access_token.expiresIn,
          }),
        );

        processQueue(null, newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(clearAuth());
        clearTokens();
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const loginLdap = async (
  credentials: LoginInput,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Handle different response structures
    // Response structure: { error: false, message: "...", data: { refresh_token: "...", ... } }
    // axios automatically parses JSON, so response.data is the parsed object
    let data = response.data;

    // If response has a nested 'data' property, use that (common API pattern)
    // This handles: { error: false, data: {...} } -> extract {...}
    if (data && typeof data === 'object' && 'data' in data && data.data) {
      data = data.data;
    }

    // Handle string responses (shouldn't happen with JSON, but just in case)
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        throw new Error(`Invalid response format from server: ${errorMessage}`);
      }
    }

    // Ensure data is an object at this point
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: expected object');
    }

    let accessToken = '';
    const accessTokenId = '';
    let tokenType = 'Bearer';
    let expiresIn = 3600;

    // Extract expires_in from response (can be at root level or nested)
    if (data.expires_in !== undefined) {
      expiresIn =
        typeof data.expires_in === 'number'
          ? data.expires_in
          : typeof data.expires_in === 'string'
            ? parseInt(data.expires_in) || 60
            : 60;
    }

    if (data.access_token) {
      if (typeof data.access_token === 'string') {
        accessToken = data.access_token;
      } else if (data.access_token) {
        accessToken = data.access_token;
        // accessTokenId = data.access_token.accessTokenId || '';
        tokenType = data.tokenType || 'Bearer';
        // Use expires_in from nested access_token if available, otherwise use root level
        if (data.access_token.expiresIn !== undefined) {
          expiresIn =
            typeof data.access_token.expiresIn === 'number'
              ? data.access_token.expiresIn
              : typeof data.access_token.expiresIn === 'string'
                ? parseInt(data.access_token.expiresIn) || expiresIn
                : expiresIn;
        }
      }
    } else if (data.token) {
      accessToken = data.token;
    } else if (data.accessToken) {
      accessToken = data.accessToken;
    }

    if (!data.user) {
      throw new Error('User data not found in response');
    }

    const userData = data.user;

    if (!accessToken) {
      throw new Error(
        'Access token not found in response. Response: ' + JSON.stringify(data),
      );
    }

    if (!userData.name || !userData.username) {
      throw new Error(
        'Required user fields (name, username) not found in response',
      );
    }

    // Extract refresh_token explicitly - check multiple possible locations
    // Priority: data.refresh_token (snake_case) > data.refreshToken (camelCase) > response.data.data.refresh_token
    let refreshToken: string | undefined = undefined;

    // First, try to get from the extracted data object
    if (data.refresh_token) {
      if (
        typeof data.refresh_token === 'string' &&
        data.refresh_token.trim().length > 0
      ) {
        refreshToken = data.refresh_token.trim();
      }
    } else if (data.refreshToken) {
      if (
        typeof data.refreshToken === 'string' &&
        data.refreshToken.trim().length > 0
      ) {
        refreshToken = data.refreshToken.trim();
      }
    }

    // If not found in data, check the original response structure
    // This handles cases where the response structure might be different
    if (!refreshToken && response.data) {
      const originalData = response.data;
      // Check if refresh_token is at the root level of response.data
      if (
        originalData.refresh_token &&
        typeof originalData.refresh_token === 'string'
      ) {
        refreshToken = originalData.refresh_token.trim();
      } else if (
        originalData.refreshToken &&
        typeof originalData.refreshToken === 'string'
      ) {
        refreshToken = originalData.refreshToken.trim();
      }
      // Also check if it's nested in response.data.data (in case our extraction missed it)
      else if (originalData.data) {
        if (
          originalData.data.refresh_token &&
          typeof originalData.data.refresh_token === 'string'
        ) {
          refreshToken = originalData.data.refresh_token.trim();
        } else if (
          originalData.data.refreshToken &&
          typeof originalData.data.refreshToken === 'string'
        ) {
          refreshToken = originalData.data.refreshToken.trim();
        }
      }
    }

    const loginResponse: LoginResponse = {
      message: data.message || 'Login successful',
      user: {
        id:
          typeof userData.id === 'string'
            ? parseInt(userData.id) || 0
            : typeof userData.id === 'number'
              ? userData.id
              : 0,
        guid: userData.guid || '',
        domain: userData.domain || '',
        ldap_dn: userData.ldap_dn || '',
        name: userData.name,
        email: userData.email || null,
        username: userData.username,
        status: userData.status || '',
        last_login_at: userData.last_login_at || '',
        email_verified_at: userData.email_verified_at || null,
        created_at: userData.created_at || '',
        updated_at: userData.updated_at || '',
        two_factor_secret: userData.two_factor_secret || null,
        two_factor_recovery_codes: userData.two_factor_recovery_codes || null,
        two_factor_confirmed_at: userData.two_factor_confirmed_at || null,
      },
      access_token: {
        accessTokenId: accessTokenId,
        tokenType: tokenType,
        expiresIn: expiresIn,
        accessToken: accessToken,
      },
      refresh_token: refreshToken,
      token_type: data.token_type || tokenType,
    };

    return loginResponse;
  } catch (error: unknown) {
    if (
      (error instanceof Error && error.message?.includes('timeout')) ||
      (isAxiosError(error) && error.code === 'ECONNABORTED')
    ) {
      throw new Error(
        'Connection timeout. Please check your network connection and try again.',
      );
    }

    if (
      isAxiosError(error) &&
      (error.code === 'ERR_NETWORK' ||
        error.code === 'ERR_CONNECTION_REFUSED' ||
        error.code === 'ERR_CONNECTION_TIMED_OUT')
    ) {
      throw new Error(
        'Unable to connect to the server. Please check your network connection and try again.',
      );
    }

    if (isAxiosError(error) && error.response) {
      const status = error.response.status;
      let errorMessage = 'An error occurred during login';

      if (error.response.data) {
        const responseData = error.response.data;
        if (typeof responseData === 'string' && responseData.trim()) {
          errorMessage = responseData;
        } else if (
          typeof responseData === 'object' &&
          responseData !== null &&
          'message' in responseData &&
          typeof responseData.message === 'string'
        ) {
          errorMessage = responseData.message;
        } else if (
          typeof responseData === 'object' &&
          responseData !== null &&
          'error' in responseData &&
          typeof responseData.error === 'string'
        ) {
          errorMessage = responseData.error;
        }
      }

      // Provide default messages for common status codes
      if (status === 401) {
        errorMessage =
          'Invalid credentials. Please check your username and password.';
      } else if (status === 403) {
        errorMessage = 'Access forbidden. Please contact your administrator.';
      } else if (status === 500) {
        errorMessage = errorMessage || 'Server error. Please try again later.';
      } else if (status >= 400 && status < 500) {
        errorMessage =
          errorMessage || `Client error (${status}). Please check your input.`;
      } else if (status >= 500) {
        errorMessage =
          errorMessage || `Server error (${status}). Please try again later.`;
      } else {
        errorMessage =
          errorMessage ||
          `Error ${status}: ${error.response.statusText || 'Unknown error'}`;
      }

      throw new Error(errorMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred during login';
    throw new Error(errorMessage);
  }
};

/**
 * Refresh access token using refresh token
 * FIXED: Better error handling and response parsing to prevent logout on 200 responses
 */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refresh_token: refreshToken } as RefreshTokenInput,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't retry refresh token requests
        _retry: true,
      } as InternalAxiosRequestConfig & { _retry?: boolean },
    );

    // FIXED: Handle wrapped response structure (like login response)
    let data = response.data;

    // If response has a nested 'data' property, use that (common API pattern)
    // This handles: { error: false, data: {...} } -> extract {...}
    if (data && typeof data === 'object' && 'data' in data && data.data) {
      data = data.data;
    }

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        // eslint-disable-next-line no-console
        console.error('Failed to parse refresh token response:', errorMessage);
        throw new Error(`Invalid response format from server: ${errorMessage}`);
      }
    }

    let accessToken = '';
    let accessTokenId = '';
    let tokenType = 'Bearer';
    let expiresIn = 60; // Default to 60 seconds
    let newRefreshToken: string | undefined = undefined;

    // Type assertion for response data that might have additional properties
    const responseData = data as RefreshTokenResponse & {
      expires_in?: number | string;
      token?: string;
      accessToken?: string;
      tokenType?: string;
      refreshToken?: string;
    };

    // Extract expires_in from response (can be at root level or nested)
    if (responseData.expires_in !== undefined) {
      expiresIn =
        typeof responseData.expires_in === 'number'
          ? responseData.expires_in
          : typeof responseData.expires_in === 'string'
            ? parseInt(responseData.expires_in) || 60
            : 60;
    }

    // FIXED: Better access token extraction with more fallbacks
    if (responseData.access_token) {
      if (typeof responseData.access_token === 'string') {
        accessToken = responseData.access_token;
      } else if (
        responseData.access_token &&
        typeof responseData.access_token === 'object'
      ) {
        accessToken = responseData.access_token.accessToken || '';
        accessTokenId = responseData.access_token.accessTokenId || '';
        tokenType =
          responseData.access_token.tokenType ||
          responseData.token_type ||
          responseData.tokenType ||
          'Bearer';
        // Use expires_in from nested access_token if available, otherwise use root level
        if (responseData.access_token.expiresIn !== undefined) {
          expiresIn =
            typeof responseData.access_token.expiresIn === 'number'
              ? responseData.access_token.expiresIn
              : typeof responseData.access_token.expiresIn === 'string'
                ? parseInt(responseData.access_token.expiresIn) || expiresIn
                : expiresIn;
        }
      }
    } else if (responseData.token) {
      accessToken = responseData.token;
    } else if (responseData.accessToken) {
      accessToken = responseData.accessToken;
    }

    // FIXED: Better refresh token extraction
    if (responseData.refresh_token) {
      newRefreshToken = responseData.refresh_token;
    } else if (responseData.refreshToken) {
      newRefreshToken = responseData.refreshToken;
    }

    // FIXED: Better error message with full response for debugging
    // Only throw if we truly don't have an access token
    if (!accessToken || accessToken.trim() === '') {
      // eslint-disable-next-line no-console
      console.error(
        'Refresh token response structure:',
        JSON.stringify(data, null, 2),
      );
      // eslint-disable-next-line no-console
      console.error('Response status:', response.status);
      throw new Error(
        `Access token not found in refresh response. Response structure: ${JSON.stringify(data)}`,
      );
    }

    return {
      access_token: {
        accessTokenId: accessTokenId,
        tokenType: tokenType,
        expiresIn: expiresIn,
        accessToken: accessToken,
      },
      refresh_token: newRefreshToken,
      token_type: responseData.token_type || tokenType,
    };
  } catch (error: unknown) {
    // FIXED: Better error handling with proper typing
    // If it's already our custom error, re-throw it
    if (error instanceof Error) {
      if (error.message.includes('Access token not found')) {
        throw error;
      }
    }

    // Handle Axios errors
    if (isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error(
          'Connection timeout. Please check your network connection and try again.',
        );
      }

      if (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ERR_CONNECTION_REFUSED' ||
        error.code === 'ERR_CONNECTION_TIMED_OUT'
      ) {
        throw new Error(
          'Unable to connect to the server. Please check your network connection and try again.',
        );
      }

      if (error.response) {
        const status = error.response.status;
        let errorMessage = 'An error occurred during token refresh';

        if (error.response.data) {
          if (
            typeof error.response.data === 'string' &&
            error.response.data.trim()
          ) {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }

        if (status === 401) {
          errorMessage = 'Refresh token expired. Please login again.';
        } else if (status === 403) {
          errorMessage = 'Refresh token invalid. Please login again.';
        } else if (status === 500) {
          errorMessage =
            errorMessage || 'Server error. Please try again later.';
        }

        throw new Error(errorMessage);
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An error occurred during token refresh';
    throw new Error(errorMessage);
  }
};

/**
 * Logout user - destroys session on backend
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to destroy session
    await apiClient.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: unknown) {
    // Even if logout API call fails, we should still clear frontend state
    // Log the error but don't throw - we want to proceed with frontend cleanup
    // eslint-disable-next-line no-console
    console.warn(
      'Backend logout failed, but proceeding with frontend cleanup:',
      error instanceof Error ? error.message : String(error),
    );
    // Don't throw - we'll still clear frontend state regardless
  }
};

export const fetchUserData = async () => {
  const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
  return response.data;
};
