import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useBreakpoint } from '@/hooks/useBreakpoint';

type ScreenContainerProps = {
  children: React.ReactNode;
  bg: string;
  style?: ViewStyle;
  /** Disable the desktop width clamp (Discover needs full bleed for the map split). */
  fullBleed?: boolean;
  /** Per-screen max-width on desktop. Design spec varies: Feed/Inbox 620, Profile/Gym 720, OpenMat/Chat 620. */
  maxWidth?: number;
};

// Must match RAIL_WIDTH in app/(tabs)/_layout.tsx. The desktop rail floats on the
// left as position:absolute, so screens add this offset themselves on desktop.
export const RAIL_WIDTH = 240;

const DEFAULT_MAX = 620;

// Centers and clamps a screen's content on desktop while keeping the phone
// layout untouched at < 768px. On desktop, leaves room for the side rail and
// centers the remaining width on a per-screen max-width column.
export function ScreenContainer({ children, bg, style, fullBleed, maxWidth = DEFAULT_MAX }: ScreenContainerProps) {
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  if (!isDesktop) {
    return <View style={[{ flex: 1, backgroundColor: bg }, style]}>{children}</View>;
  }

  if (fullBleed) {
    return (
      <View style={[{ flex: 1, backgroundColor: bg, paddingLeft: RAIL_WIDTH }, style]}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        paddingLeft: RAIL_WIDTH,
        alignItems: 'center',
      }}
    >
      <View
        style={[
          {
            flex: 1,
            width: '100%',
            maxWidth,
            backgroundColor: bg,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
