import React from 'react';
import Svg, { Rect } from 'react-native-svg';

import { BELT_THEMES, type BeltColor } from '@/constants/theme';

type BeltBarProps = {
  color?: BeltColor;
  stripes?: number;
  width?: number;
  height?: number;
};

export function BeltBar({ color = 'blue', stripes = 2, width = 32, height = 10 }: BeltBarProps) {
  const t = BELT_THEMES[color];
  const beltColor = color === 'white' ? '#F5F2EC' : t.accent;
  const stripeColor = color === 'black' ? '#C4302B' : '#1A1A1A';
  const blockW = width * 0.28;
  const blockX = width - blockW - 2;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={1.5}
        fill={beltColor}
        stroke={color === 'white' ? '#D4CFC4' : 'rgba(0,0,0,0.15)'}
        strokeWidth={0.5}
      />
      <Rect x={blockX} y={0} width={blockW} height={height} fill={stripeColor} />
      {Array.from({ length: stripes }).map((_, i) => (
        <Rect
          key={i}
          x={blockX + 2 + i * 4}
          y={2}
          width={1.5}
          height={height - 4}
          fill="#fff"
          opacity={0.95}
        />
      ))}
    </Svg>
  );
}
