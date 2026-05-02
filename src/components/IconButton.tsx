import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, Pressable, Text, View, type ViewStyle } from 'react-native';

import { TYPE, type Surface } from '@/constants/theme';

const IS_WEB = Platform.OS === 'web';

type IconButtonProps = {
  surface: Surface;
  children: React.ReactNode;
  onPress?: () => void;
  badge?: number;
  size?: number;
};

export function IconButton({ surface, children, onPress, badge, size = 38 }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: hovered ? surface.bgInset : surface.bgElev,
        borderWidth: 0.5,
        borderColor: surface.border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {children}
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
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

type BlurButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  tone?: 'dark' | 'light';
};

// Image-overlay glass button. tone="dark" is the v2 default for chrome on top
// of cover photos (Gym hero, OpenMat hero, Profile cover) — semi-opaque black
// with white icons. tone="light" stays available for any legacy light-bg use.
export function BlurButton({ children, onPress, tone = 'dark' }: BlurButtonProps) {
  const dark = tone === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: 36,
        height: 36,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: dark
          ? hovered
            ? 'rgba(0,0,0,0.5)'
            : 'rgba(0,0,0,0.35)'
          : hovered
          ? 'rgba(255,255,255,0.96)'
          : 'rgba(255,255,255,0.92)',
        borderWidth: 0.5,
        borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
        ...(IS_WEB
          ? ({
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            } as ViewStyle)
          : null),
      })}
    >
      {!IS_WEB && (
        <BlurView
          intensity={dark ? 20 : 30}
          tint={dark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      {children}
    </Pressable>
  );
}
