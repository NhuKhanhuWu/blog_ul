/** @format */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
}

// Get the theme from localStorage or default to 'light' (could also check prefers-color-scheme)
const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as Theme;
  if (savedTheme) return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
const themeReducer = themeSlice.reducer;
export default themeReducer;
