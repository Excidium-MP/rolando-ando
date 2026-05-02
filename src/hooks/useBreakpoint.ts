import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'desktop';

// Single breakpoint at 768px. Phone renders the full-bleed mobile layout
// (bottom tab bar, full-width content). Desktop swaps to a side-rail nav
// with a width-clamped content column. Used by the tab layout and
// ScreenContainer.
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return width >= 768 ? 'desktop' : 'phone';
}
