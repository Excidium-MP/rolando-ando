import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { TYPE, type Surface } from '@/constants/theme';

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
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: surface.bgElev,
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
            backgroundColor: '#E8584C',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: surface.bg,
          }}
        >
          <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 10, fontWeight: '600' }}>
            {badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

type BlurButtonProps = { children: React.ReactNode; onPress?: () => void };

export function BlurButton({ children, onPress }: BlurButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
