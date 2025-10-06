import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import darkTheme from "../theme/dark";
import lightTheme from "../theme/light";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        const parsed = JSON.parse(storedTheme);
        setIsDarkMode(parsed === "dark");
        setTheme(parsed === "dark" ? darkTheme : lightTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? darkTheme : lightTheme);
    await AsyncStorage.setItem("theme", JSON.stringify(newMode ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Hook que você importa no seu Biblia.jsx
export const useTheme = () => useContext(ThemeContext);