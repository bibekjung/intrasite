import axios from 'axios';
import { type LoginInput, type LoginResponse } from './schemas/authSchema';

const API_BASE = 'http://10.0.130.163:81/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const response = await apiClient.post('/ldap-login', credentials);

    const data = response.data;

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
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'An error occurred during login',
    );
  }
};

export const fetchUserData = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};
