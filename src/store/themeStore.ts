import { create } from 'zustand';

import { BELT_THEMES, SURFACES, type BeltColor, type ThemeBundle } from '@/constants/theme';

type ThemeState = {
  beltTheme: BeltColor;
  isDark: boolean;
  setBeltTheme: (b: BeltColor) => void;
  setDark: (d: boolean) => void;
  toggleDark: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  beltTheme: 'blue',
  isDark: false,
  setBeltTheme: (beltTheme) => set({ beltTheme }),
  setDark: (isDark) => set({ isDark }),
  toggleDark: () => set((s) => ({ isDark: !s.isDark })),
}));

export function useTheme(): ThemeBundle {
  const beltTheme = useThemeStore((s) => s.beltTheme);
  const isDark = useThemeStore((s) => s.isDark);
  return {
    surface: SURFACES[isDark ? 'dark' : 'light'],
    theme: BELT_THEMES[beltTheme],
    isDark,
  };
}
