import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  email: '',
  password: '',
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
    clearAuth: (state) => {
      state.email = '';
      state.password = '';
    },
  },
});

export const { setEmail, setPassword, clearAuth } = authSlice.actions;
export default authSlice.reducer;
