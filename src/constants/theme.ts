import type { TextStyle } from 'react-native';

export type BeltColor = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export type BeltTheme = {
  name: string;
  accent: string;
  accentSoft: string;
  tag: string;
  tagBg: string;
  stripe: string;
};

export const BELT_THEMES: Record<BeltColor, BeltTheme> = {
  white: { name: 'White', accent: '#0E0E0E', accentSoft: '#F5F2EC', tag: '#1A1A1A', tagBg: '#F0EDE7', stripe: '#1A1A1A' },
  blue: { name: 'Blue', accent: '#1E5BA8', accentSoft: '#E8F0FA', tag: '#1E5BA8', tagBg: '#E8F0FA', stripe: '#1E5BA8' },
  purple: { name: 'Purple', accent: '#5B3A8C', accentSoft: '#EFEAF5', tag: '#5B3A8C', tagBg: '#EFEAF5', stripe: '#5B3A8C' },
  brown: { name: 'Brown', accent: '#6B4423', accentSoft: '#F1EAE2', tag: '#6B4423', tagBg: '#F1EAE2', stripe: '#6B4423' },
  black: { name: 'Black', accent: '#1A1A1A', accentSoft: '#EDEAE5', tag: '#1A1A1A', tagBg: '#EDEAE5', stripe: '#1A1A1A' },
};

export type Surface = {
  bg: string;
  bgElev: string;
  bgInset: string;
  text: string;
  textMuted: string;
  textDim: string;
  border: string;
  borderStrong: string;
  chip: string;
  overlay: string;
};

export const SURFACES: Record<'light' | 'dark', Surface> = {
  light: {
    bg: '#FAF8F3',
    bgElev: '#FFFFFF',
    bgInset: '#F2EFE8',
    text: '#1A1815',
    textMuted: '#6B665C',
    textDim: '#9A958A',
    border: 'rgba(26,24,21,0.08)',
    borderStrong: 'rgba(26,24,21,0.14)',
    chip: '#F0EDE7',
    overlay: 'rgba(26,24,21,0.04)',
  },
  dark: {
    bg: '#15140F',
    bgElev: '#1F1D17',
    bgInset: '#0F0E0A',
    text: '#F2EFE8',
    textMuted: '#A8A296',
    textDim: '#6B665C',
    border: 'rgba(242,239,232,0.08)',
    borderStrong: 'rgba(242,239,232,0.14)',
    chip: '#28251E',
    overlay: 'rgba(242,239,232,0.04)',
  },
};

export const TYPE: Record<'display' | 'ui' | 'mono', TextStyle> = {
  display: { fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3 },
  ui: { fontFamily: 'Geist_400Regular' },
  mono: { fontFamily: 'GeistMono_400Regular' },
};

export const ACCENT_DANGER = '#E8584C';
export const ACCENT_SUCCESS = '#3FB872';
export const ACCENT_WARN = '#FFC857';

export type ThemeBundle = { surface: Surface; theme: BeltTheme; isDark: boolean };
