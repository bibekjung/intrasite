import axios from 'axios';
import { type LoginInput, type LoginResponse } from './schemas/authSchema';

const API_BASE = import.meta.env.DEV ? '/api' : 'http://10.0.130.163:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds timeout is set
});

apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {} as any;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_full_response');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export const loginLdap = async (
  credentials: LoginInput,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/ldap-login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = response.data;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e: any) {
        throw new Error('Invalid response format from server', e);
      }
    }

    let accessToken = '';
    let accessTokenId = '';
    let tokenType = 'Bearer';
    let expiresIn = 3600;

    if (data.access_token) {
      if (typeof data.access_token === 'string') {
        accessToken = data.access_token;
      } else if (data.access_token.accessToken) {
        accessToken = data.access_token.accessToken;
        accessTokenId = data.access_token.accessTokenId || '';
        tokenType = data.access_token.tokenType || 'Bearer';
        expiresIn =
          typeof data.access_token.expiresIn === 'number'
            ? data.access_token.expiresIn
            : typeof data.access_token.expiresIn === 'string'
              ? parseInt(data.access_token.expiresIn) || 3600
              : 3600;
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
      token_type: data.token_type || tokenType,
    };

    return loginResponse;
  } catch (error: any) {
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
      let errorMessage = 'An error occurred during login';

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

    const errorMessage = error.message || 'An error occurred during login';
    throw new Error(errorMessage);
  }
};

export const fetchUserData = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};
