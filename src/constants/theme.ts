import { Platform, type TextStyle } from 'react-native';

export type BeltColor = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export type BeltTheme = {
  name: string;
  accent: string;
  accentSoft: string;
  tag: string;
  tagBg: string;
  stripe: string;
};

// Belt themes are now used only for BeltBar rendering (per-user BJJ rank),
// not as the app accent. App-wide accent comes from ACCENT_THEMES.
export const BELT_THEMES: Record<BeltColor, BeltTheme> = {
  white: { name: 'White', accent: '#0E0E0E', accentSoft: '#F5F2EC', tag: '#1A1A1A', tagBg: '#F0EDE7', stripe: '#1A1A1A' },
  blue: { name: 'Blue', accent: '#1E5BA8', accentSoft: '#E8F0FA', tag: '#1E5BA8', tagBg: '#E8F0FA', stripe: '#1E5BA8' },
  purple: { name: 'Purple', accent: '#5B3A8C', accentSoft: '#EFEAF5', tag: '#5B3A8C', tagBg: '#EFEAF5', stripe: '#5B3A8C' },
  brown: { name: 'Brown', accent: '#6B4423', accentSoft: '#F1EAE2', tag: '#6B4423', tagBg: '#F1EAE2', stripe: '#6B4423' },
  black: { name: 'Black', accent: '#1A1A1A', accentSoft: '#EDEAE5', tag: '#1A1A1A', tagBg: '#EDEAE5', stripe: '#1A1A1A' },
};

export type AccentColor = 'red' | 'blue' | 'orange' | 'green' | 'white';

export type Theme = {
  name: string;
  accent: string;
  accentSoft: string;
  tag: string;
  tagBg: string;
};

export const ACCENT_THEMES: Record<AccentColor, Theme> = {
  red: { name: 'Red', accent: '#E8453A', accentSoft: 'rgba(232,69,58,0.12)', tag: '#E8453A', tagBg: 'rgba(232,69,58,0.10)' },
  blue: { name: 'Blue', accent: '#3B82F6', accentSoft: 'rgba(59,130,246,0.12)', tag: '#3B82F6', tagBg: 'rgba(59,130,246,0.10)' },
  orange: { name: 'Orange', accent: '#E87D35', accentSoft: 'rgba(232,125,53,0.12)', tag: '#E87D35', tagBg: 'rgba(232,125,53,0.10)' },
  green: { name: 'Green', accent: '#22C55E', accentSoft: 'rgba(34,197,94,0.12)', tag: '#22C55E', tagBg: 'rgba(34,197,94,0.10)' },
  white: { name: 'White', accent: '#E8E5DD', accentSoft: 'rgba(232,229,221,0.10)', tag: '#E8E5DD', tagBg: 'rgba(232,229,221,0.08)' },
};

export type DisciplineKey =
  | 'bjj'
  | 'muayThai'
  | 'boxing'
  | 'mma'
  | 'wrestling'
  | 'kickboxing'
  | 'gi'
  | 'nogi';

export type Discipline = { name: string; accent: string };

// Discipline accents replace belt-color theming for activity/style identity.
// `gi` and `nogi` map onto BJJ to support legacy gym.style values.
export const DISCIPLINES: Record<DisciplineKey, Discipline> = {
  bjj: { name: 'BJJ', accent: '#1E5BA8' },
  muayThai: { name: 'Muay Thai', accent: '#E85C3A' },
  boxing: { name: 'Boxing', accent: '#D4A843' },
  mma: { name: 'MMA', accent: '#C44A4A' },
  wrestling: { name: 'Wrestling', accent: '#3A8C5B' },
  kickboxing: { name: 'Kickboxing', accent: '#D97035' },
  gi: { name: 'Gi', accent: '#1E5BA8' },
  nogi: { name: 'No-Gi', accent: '#5B3A8C' },
};

export type Surface = {
  bg: string;
  bgElev: string;
  bgGlass: string;
  bgInset: string;
  text: string;
  textMuted: string;
  textDim: string;
  border: string;
  borderStrong: string;
  borderGlass: string;
  chip: string;
  overlay: string;
  glassIntensity: number;
};

const IS_WEB = Platform.OS === 'web';

// On web, BlurView becomes a CSS `backdrop-filter` which Firefox 102 and some
// Android Chromium variants silently no-op. We bump bgGlass opacity on web so
// cards remain readable when blur falls through.
const webBoostDark = IS_WEB ? 0.10 : 0.04;
const webBoostDarkElev = IS_WEB ? 0.14 : 0.06;
const webBoostLight = IS_WEB ? 0.78 : 0.55;
const webBoostLightElev = IS_WEB ? 0.85 : 0.72;

export const SURFACES: Record<'light' | 'dark', Surface> = {
  light: {
    bg: '#F4F3EF',
    bgElev: `rgba(255,255,255,${webBoostLightElev})`,
    bgGlass: `rgba(255,255,255,${webBoostLight})`,
    bgInset: '#ECEAE4',
    text: '#111110',
    textMuted: '#555550',
    textDim: '#8A8880',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.16)',
    borderGlass: 'rgba(255,255,255,0.6)',
    chip: 'rgba(0,0,0,0.05)',
    overlay: 'rgba(0,0,0,0.03)',
    glassIntensity: 60,
  },
  dark: {
    bg: '#0C0C0B',
    bgElev: `rgba(255,255,255,${webBoostDarkElev})`,
    bgGlass: `rgba(255,255,255,${webBoostDark})`,
    bgInset: '#070706',
    text: '#EDEDEB',
    textMuted: '#8A8880',
    textDim: '#555550',
    border: 'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(255,255,255,0.14)',
    borderGlass: 'rgba(255,255,255,0.10)',
    chip: 'rgba(255,255,255,0.06)',
    overlay: 'rgba(255,255,255,0.02)',
    glassIntensity: 30,
  },
};

// v2 drops Instrument Serif for an all-Geist system. Display uses the
// heaviest available weight; tighter letter-spacing gives the meaner read.
export const TYPE: Record<'display' | 'ui' | 'mono', TextStyle> = {
  display: { fontFamily: 'Geist_700Bold', letterSpacing: -0.6 },
  ui: { fontFamily: 'Geist_400Regular' },
  mono: { fontFamily: 'GeistMono_400Regular' },
};

export const ACCENT_DANGER = '#E8453A';
export const ACCENT_SUCCESS = '#22C55E';
export const ACCENT_WARN = '#FFC857';

export type ThemeBundle = { surface: Surface; theme: Theme; isDark: boolean };
