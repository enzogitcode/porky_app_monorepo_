import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface DarkModeState {
  darkMode: boolean; // ✅ aquí es boolean
}

const initialState: DarkModeState = {
  darkMode: false,
};

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode; // alterna true/false
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload; // se asegura de que payload sea boolean
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;

