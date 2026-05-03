import React from 'react';
import { Text, type TextStyle } from 'react-native';

import { TYPE } from '@/constants/theme';

type WordmarkProps = {
  size?: number;
  color: string;
  accent: string;
  style?: TextStyle;
};

// "Open Tatame." with the period tinted to the active accent. Used as the
// home wordmark on the Feed header and on top-of-screen brand moments.
export function Wordmark({ size = 26, color, accent, style }: WordmarkProps) {
  return (
    <Text
      style={[
        {
          ...TYPE.display,
          fontFamily: 'Geist_800ExtraBold',
          fontSize: size,
          color,
          letterSpacing: -0.8,
          lineHeight: size * 1.05,
        },
        style,
      ]}
    >
      Open Tatame<Text style={{ color: accent }}>.</Text>
    </Text>
  );
}
