import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_USER_ID_KEY = 'AUTH_USER_ID';

const THEMES = {
  default: {
    label: 'Azul/Cyan',
    from: '30 58 138',
    to: '22 78 99',
    on: '255 255 255',
  },
  emerald: {
    label: 'Verde',
    from: '6 78 59',
    to: '17 94 89',
    on: '255 255 255',
  },
  purple: {
    label: 'Morado',
    from: '88 28 135',
    to: '67 56 202',
    on: '255 255 255',
  },
  sunset: {
    label: 'Atardecer',
    from: '190 18 60',
    to: '217 119 6',
    on: '255 255 255',
  },
  graphite: {
    label: 'Grafito',
    from: '15 23 42',
    to: '51 65 85',
    on: '255 255 255',
  },
  lightSky: {
    label: 'Claro (Cielo)',
    from: '224 231 255',
    to: '186 230 253',
    on: '15 23 42',
  },
  lightMint: {
    label: 'Claro (Menta)',
    from: '209 250 229',
    to: '153 246 228',
    on: '15 23 42',
  },
};

const ThemeContext = createContext(null);

function readUserId() {
  const raw = localStorage.getItem(AUTH_USER_ID_KEY);
  if (!raw) return null;
  const asNumber = Number(raw);
  return Number.isFinite(asNumber) ? String(asNumber) : String(raw);
}

function themeKeyForUserId(userId) {
  return userId ? `KLINIX_THEME_USER_${userId}` : null;
}

function parseRgbTriplet(value) {
  const parts = String(value || '').trim().split(/\s+/).map((n) => Number(n));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts;
}

function relativeLuminance([r, g, b]) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function pickOnColor(from, to) {
  const f = parseRgbTriplet(from);
  const t = parseRgbTriplet(to);
  if (!f || !t) return '255 255 255';
  const lum = (relativeLuminance(f) + relativeLuminance(t)) / 2;
  return lum > 0.55 ? '15 23 42' : '255 255 255';
}

function applyCssVars(theme) {
  const root = document.documentElement;
  root.style.setProperty('--klinix-from', theme.from);
  root.style.setProperty('--klinix-to', theme.to);
  root.style.setProperty('--klinix-on', theme.on || pickOnColor(theme.from, theme.to));
}

export function ThemeProvider({ children }) {
  const [userId, setUserId] = useState(() => readUserId());

  const [themeName, setThemeName] = useState(() => {
    const initialUserId = readUserId();
    if (!initialUserId) return 'default';

    const perUserKey = themeKeyForUserId(initialUserId);
    const saved = perUserKey ? localStorage.getItem(perUserKey) : null;
    return saved && THEMES[saved] ? saved : 'default';
  });

  const theme = useMemo(() => THEMES[themeName] ?? THEMES.default, [themeName]);

  const syncUserId = useCallback(() => {
    setUserId(readUserId());
  }, []);

  useEffect(() => {
    const onAuthChanged = () => syncUserId();
    const onStorage = (e) => {
      if (e.key === AUTH_USER_ID_KEY) syncUserId();
    };

    window.addEventListener('auth:userChanged', onAuthChanged);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('auth:userChanged', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [syncUserId]);

  useEffect(() => {
    if (!userId) {
      setThemeName('default');
      return;
    }

    const perUserKey = themeKeyForUserId(userId);
    const saved = perUserKey ? localStorage.getItem(perUserKey) : null;
    setThemeName(saved && THEMES[saved] ? saved : 'default');
  }, [userId]);

  useEffect(() => {
    applyCssVars(theme);
    const perUserKey = themeKeyForUserId(userId);
    if (perUserKey) localStorage.setItem(perUserKey, themeName);
  }, [theme, themeName, userId]);

  const setTheme = useCallback((nextThemeName) => {
    if (!THEMES[nextThemeName]) return;
    setThemeName(nextThemeName);
  }, []);

  const resetTheme = useCallback(() => {
    setThemeName('default');
    const perUserKey = themeKeyForUserId(userId);
    if (perUserKey) localStorage.removeItem(perUserKey);
  }, [userId]);

  const value = useMemo(
    () => ({
      themes: THEMES,
      themeName,
      theme,
      setTheme,
      resetTheme,
      userId,
    }),
    [themeName, theme, setTheme, resetTheme, userId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
