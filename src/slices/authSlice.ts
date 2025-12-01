import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from '@/utils/tokenStorage';

type User = {
  id: string;
  name: string;
  email?: string;
  username?: string;
};

import { AccessRoutesResponse } from '@/types/permissions';

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  fullResponse: any | null;
  accessRoutes: AccessRoutesResponse | null;
  isAuthenticated: boolean;
  isAnimationComplete: boolean;
};

// Load initial state from secure token storage
const getInitialState = (): AuthState => {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();
  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const fullResponseStr = localStorage.getItem('auth_full_response');
  const fullResponse = fullResponseStr ? JSON.parse(fullResponseStr) : null;

  const accessRoutesStr = localStorage.getItem('auth_access_routes');
  const accessRoutes = accessRoutesStr ? JSON.parse(accessRoutesStr) : null;

  return {
    token,
    refreshToken,
    user,
    fullResponse,
    accessRoutes,
    isAuthenticated: !!token && !!user,
    isAnimationComplete: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        user: User;
        fullResponse?: any;
        expiresIn?: number;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.user = action.payload.user;
      state.fullResponse = action.payload.fullResponse || null;
      state.isAuthenticated = true;

      // Store tokens securely
      setAccessToken(action.payload.token, action.payload.expiresIn);
      if (action.payload.refreshToken) {
        setRefreshToken(action.payload.refreshToken);
      }

      // Store user data in localStorage (not sensitive)
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      if (action.payload.fullResponse) {
        localStorage.setItem(
          'auth_full_response',
          JSON.stringify(action.payload.fullResponse),
        );
      }
    },
    setAccessRoutes: (state, action: PayloadAction<AccessRoutesResponse>) => {
      state.accessRoutes = action.payload;
      // Store access routes in localStorage
      localStorage.setItem(
        'auth_access_routes',
        JSON.stringify(action.payload),
      );
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        expiresIn?: number;
      }>,
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        setRefreshToken(action.payload.refreshToken);
      }
      setAccessToken(action.payload.token, action.payload.expiresIn);
    },
    setIsAnimationComplete: (state, action: PayloadAction<boolean>) => {
      state.isAnimationComplete = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.fullResponse = null;
      state.accessRoutes = null;
      state.isAuthenticated = false;

      // Clear all tokens and user data
      clearTokens();
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_full_response');
      localStorage.removeItem('auth_access_routes');
    },
  },
});

export const {
  setCredentials,
  updateTokens,
  setIsAnimationComplete,
  setAccessRoutes,
  clearAuth,
} = authSlice.actions;
export default authSlice.reducer;
