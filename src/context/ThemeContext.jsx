"use client";

import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn("useTheme() called outside of ThemeContext.Provider");
  }
  return context;
};
