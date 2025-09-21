import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  email: string;
  password: string;
  isAnimationComplete: boolean;
};

const initialState: AuthState = {
  email: '',
  password: '',
  isAnimationComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setIsAnimationComplete: (state, action: PayloadAction<boolean>) => {
      state.isAnimationComplete = action.payload;
    },
    clearAuth: (state) => {
      state.email = '';
      state.password = '';
    },
  },
});

export const { setEmail, setPassword, setIsAnimationComplete, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
