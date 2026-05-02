import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, Pressable, View, type ViewStyle } from 'react-native';

import type { Surface } from '@/constants/theme';

type GlassCardProps = {
  surface: Surface;
  isDark?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
  border?: boolean;
  blur?: boolean;
  onPress?: () => void;
};

const IS_WEB = Platform.OS === 'web';

// blur=true uses the native BlurView on iOS/Android, where it pays off as real
// chrome. On web we instead set CSS `backdrop-filter` directly on the surface,
// because (a) `BlurView` on web is itself a backdrop-filter wrapper, so the
// extra layer is wasted DOM, and (b) we want to bump the bg opacity higher on
// web so the card stays readable in browsers that no-op backdrop-filter.
export function GlassCard({
  surface,
  isDark,
  children,
  style,
  padding = 14,
  radius = 16,
  border = true,
  blur,
  onPress,
}: GlassCardProps) {
  const containerStyle: ViewStyle = {
    borderRadius: radius,
    overflow: 'hidden',
    backgroundColor: surface.bgGlass,
    ...(border ? { borderWidth: 0.5, borderColor: surface.borderGlass } : null),
    ...(blur && IS_WEB
      ? // RN-Web passes the property through to CSS unchanged.
        ({ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' } as ViewStyle)
      : null),
    ...style,
  };

  const innerContent = (
    <>
      {blur && !IS_WEB && (
        <BlurView
          intensity={surface.glassIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      <View style={{ padding }}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
          ...containerStyle,
          opacity: pressed ? 0.85 : 1,
          ...(IS_WEB
            ? ({
                cursor: 'pointer',
                transitionProperty: 'background-color, border-color',
                transitionDuration: '120ms',
                ...(hovered ? { borderColor: surface.borderStrong } : null),
              } as ViewStyle)
            : null),
        })}
      >
        {innerContent}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{innerContent}</View>;
}
