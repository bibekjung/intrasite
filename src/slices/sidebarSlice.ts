import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SlidebarState = {
  isOpen: boolean;
};

const initialState: SlidebarState = {
  isOpen: true,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
