import { create } from 'zustand';

import {
  ACCENT_THEMES,
  SURFACES,
  type AccentColor,
  type ThemeBundle,
} from '@/constants/theme';

type ThemeState = {
  accentTheme: AccentColor;
  isDark: boolean;
  setAccentTheme: (a: AccentColor) => void;
  setDark: (d: boolean) => void;
  toggleDark: () => void;
};

// v2 ships dark + red as the baked-in defaults. The setters and light tokens
// stay so a future settings screen can flip these without re-touching theming.
export const useThemeStore = create<ThemeState>((set) => ({
  accentTheme: 'red',
  isDark: true,
  setAccentTheme: (accentTheme) => set({ accentTheme }),
  setDark: (isDark) => set({ isDark }),
  toggleDark: () => set((s) => ({ isDark: !s.isDark })),
}));

export function useTheme(): ThemeBundle {
  const accentTheme = useThemeStore((s) => s.accentTheme);
  const isDark = useThemeStore((s) => s.isDark);
  return {
    surface: SURFACES[isDark ? 'dark' : 'light'],
    theme: ACCENT_THEMES[accentTheme],
    isDark,
  };
}
