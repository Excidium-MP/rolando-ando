import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { TYPE, type Surface, type Theme } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
  surface: Surface;
  theme: Theme;
};

export function SectionHeader({ title, action, onActionPress, surface, theme }: SectionHeaderProps) {
  return (
    <View
      style={{
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <Text style={{ ...TYPE.display, fontSize: 22, color: surface.text, letterSpacing: -0.2 }}>
        {title}
      </Text>
      {action && (
        <Pressable onPress={onActionPress}>
          <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '500', color: theme.accent }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

type StatProps = {
  value: string | number;
  label: string;
  sub?: string;
  surface: Surface;
  divider?: boolean;
  isText?: boolean;
};

export function Stat({ value, label, sub, surface, divider, isText }: StatProps) {
  return (
    <View
      style={{
        paddingLeft: divider ? 14 : 0,
        borderLeftWidth: divider ? 0.5 : 0,
        borderLeftColor: surface.border,
      }}
    >
      <Text
        style={{
          ...TYPE.display,
          fontSize: isText ? 18 : 24,
          color: surface.text,
          letterSpacing: -0.2,
        }}
      >
        {value}
      </Text>
      <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginTop: 2 }}>{label}</Text>
      {sub && <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>{sub}</Text>}
    </View>
  );
}
