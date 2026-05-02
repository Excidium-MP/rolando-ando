import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, Pressable, Text, View, type ViewStyle } from 'react-native';

import { TYPE, type Surface } from '@/constants/theme';

type GlassIconBtnProps = {
  surface: Surface;
  isDark?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  badge?: number;
  size?: number;
  blur?: boolean;
};

const IS_WEB = Platform.OS === 'web';

export function GlassIconBtn({
  surface,
  isDark,
  children,
  onPress,
  badge,
  size = 36,
  blur = true,
}: GlassIconBtnProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: size,
        height: size,
        borderRadius: 12,
        backgroundColor: hovered ? surface.bgElev : surface.bgGlass,
        borderWidth: 0.5,
        borderColor: surface.borderGlass,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        ...(blur && IS_WEB
          ? ({
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            } as ViewStyle)
          : null),
        ...(IS_WEB ? ({ cursor: 'pointer' } as ViewStyle) : null),
      })}
    >
      {blur && !IS_WEB && (
        <BlurView
          intensity={surface.glassIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      {children}
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 8,
            backgroundColor: '#E8453A',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: surface.bg,
          }}
        >
          <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 10, fontWeight: '700' }}>
            {badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
