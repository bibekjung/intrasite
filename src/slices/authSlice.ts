import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  name: string;
  email?: string;
  username?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  fullResponse: any | null;
  isAuthenticated: boolean;
  isAnimationComplete: boolean;
};

// Load initial state from localStorage
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const fullResponseStr = localStorage.getItem('auth_full_response');
  const fullResponse = fullResponseStr ? JSON.parse(fullResponseStr) : null;

  return {
    token,
    user,
    fullResponse,
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
      action: PayloadAction<{ token: string; user: User; fullResponse?: any }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.fullResponse = action.payload.fullResponse || null;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      if (action.payload.fullResponse) {
        localStorage.setItem(
          'auth_full_response',
          JSON.stringify(action.payload.fullResponse),
        );
      }
    },
    setIsAnimationComplete: (state, action: PayloadAction<boolean>) => {
      state.isAnimationComplete = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.fullResponse = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_full_response');
    },
  },
});

export const { setCredentials, setIsAnimationComplete, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
