import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';

type ChipProps = {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent';
  surface: Surface;
  theme: BeltTheme;
  style?: ViewStyle;
};

export function Chip({ children, tone = 'neutral', surface, theme, style }: ChipProps) {
  const isAccent = tone === 'accent';
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          paddingHorizontal: 9,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: isAccent ? theme.tagBg : surface.chip,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          ...TYPE.ui,
          color: isAccent ? theme.tag : surface.textMuted,
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0.1,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
