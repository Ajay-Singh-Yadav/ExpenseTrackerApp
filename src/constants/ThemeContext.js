import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('dark');
  const [theme, setTheme] = useState(Themes.dark);

  // Load saved theme on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme && Themes[storedTheme]) {
          setThemeKey(storedTheme);
          setTheme(Themes[storedTheme]);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    })();
  }, []);

  const toggleTheme = useCallback(async key => {
    if (Themes[key]) {
      setThemeKey(key);
      setTheme(Themes[key]);
      await AsyncStorage.setItem('appTheme', key);
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themeKey,
      toggleTheme,
    }),
    [theme, themeKey, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
