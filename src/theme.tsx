import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createThemeStore, type ThemeMode } from './storage/themeStoreCore';

const themeStore = createThemeStore(AsyncStorage, 'app_theme_mode');

const palettes = {
  light: {
    colors: {
      background: '#FFF9F2',
      surface: '#FFFFFF',
      surfaceMuted: '#F3EFE8',
      primary: '#356B4A',
      primaryDark: '#244B34',
      primarySoft: '#E6F0E7',
      accent: '#E88951',
      accentSoft: '#FFF0E3',
      text: '#26332B',
      textMuted: '#788078',
      border: '#E9E5DD',
      danger: '#B5473C',
      white: '#FFFFFF',
    },
    radius: { small: 12, medium: 18, large: 26, pill: 999 },
    spacing: { page: 20 },
  },
  dark: {
    colors: {
      background: '#151A17',
      surface: '#202823',
      surfaceMuted: '#2A332D',
      primary: '#8FC49A',
      primaryDark: '#B4D9BA',
      primarySoft: '#2B4031',
      accent: '#F0A271',
      accentSoft: '#493326',
      text: '#F0F3EF',
      textMuted: '#A5B0A8',
      border: '#39443C',
      danger: '#FF9B8F',
      white: '#FFFFFF',
    },
    radius: { small: 12, medium: 18, large: 26, pill: 999 },
    spacing: { page: 20 },
  },
} as const;

export type AppTheme = (typeof palettes)[ThemeMode];

interface ThemeContextValue {
  mode: ThemeMode;
  theme: AppTheme;
  error: string | null;
  toggleTheme(): Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [error, setError] = useState<string | null>(null);
  const changedByUser = useRef(false);

  useEffect(() => {
    let active = true;
    themeStore
      .load()
      .then((savedMode) => {
        if (active && !changedByUser.current) setMode(savedMode);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar o tema.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = async () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    changedByUser.current = true;
    setMode(nextMode);
    setError(null);
    try {
      await themeStore.save(nextMode);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Erro ao salvar o tema.');
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: palettes[mode], error, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider.');
  }
  return context;
}
