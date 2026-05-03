import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { DISCIPLINES, TYPE, type DisciplineKey } from '@/constants/theme';

type DisciplineBadgeProps = {
  discipline: DisciplineKey | string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
};

// Small wrapper that turns a discipline key into a tinted pill.
// Accepts an arbitrary string so callers can hand in raw `gym.style` entries
// like "Gi" / "No-Gi" without normalising upstream.
export function DisciplineBadge({ discipline, size = 'sm', style }: DisciplineBadgeProps) {
  const key = normalize(discipline);
  const d = DISCIPLINES[key] ?? DISCIPLINES.bjj;
  const sz = size === 'sm'
    ? { h: 22, fs: 10, px: 8 }
    : { h: 28, fs: 12, px: 11 };
  return (
    <View
      style={[
        {
          height: sz.h,
          paddingHorizontal: sz.px,
          borderRadius: 999,
          backgroundColor: `${d.accent}24`,
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          ...TYPE.ui,
          color: d.accent,
          fontSize: sz.fs,
          fontWeight: '600',
          letterSpacing: 0.3,
        }}
      >
        {d.name}
      </Text>
    </View>
  );
}

function normalize(input: string): DisciplineKey {
  // Strip whitespace, hyphens, and underscores so DB enum values (`muay_thai`,
  // `no_gi`) and human strings ("Muay Thai", "No-Gi") collapse to the same key.
  const k = input.toLowerCase().replace(/[\s_-]/g, '');
  if (k === 'nogi') return 'nogi';
  if (k === 'muaythai') return 'muayThai';
  if (k in DISCIPLINES) return k as DisciplineKey;
  return 'bjj';
}
