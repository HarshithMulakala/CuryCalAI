import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ColorSchemeName } from 'react-native';

type ThemeScheme = 'light' | 'dark';

type Theme = {
  scheme: ThemeScheme;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    card: string;
    muted: string;
    accent: string;
  };
  toggle: () => void;
  setScheme: (s: ThemeScheme) => void;
};

const LightColors = {
  background: '#FFF8F2',
  surface: '#FFFFFF',
  primary: '#FF6B35',
  secondary: '#FFB86B',
  text: '#1B1B1B',
  card: '#FFFDF9',
  muted: '#8C8C8C',
  accent: '#20B2AA',
};

const DarkColors = {
  background: '#0F1724',
  surface: '#0B1220',
  primary: '#FF7A59',
  secondary: '#FF9E6B',
  text: '#F6F6F7',
  card: '#0B1420',
  muted: '#9AA4B2',
  accent: '#39D6C2',
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ initialScheme, children }: { initialScheme?: ColorSchemeName; children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ThemeScheme>((initialScheme as ThemeScheme) || 'light');

  function toggle() {
    setSchemeState(s => (s === 'light' ? 'dark' : 'light'));
  }

  function setScheme(s: ThemeScheme) {
    setSchemeState(s);
  }

  const value: Theme = {
    scheme,
    colors: scheme === 'dark' ? DarkColors : LightColors,
    toggle,
    setScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}