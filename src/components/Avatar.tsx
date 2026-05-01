import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

import { TYPE } from '@/constants/theme';

type AvatarProps = {
  src?: string;
  size?: number;
  ring?: string;
  label?: string;
};

export function Avatar({ src, size = 32, ring, label }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: src ? 'transparent' : '#D4CFC4',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...(ring ? { borderWidth: 2, borderColor: ring } : null),
      }}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        label && (
          <Text style={{ ...TYPE.ui, color: '#5C5851', fontSize: size * 0.4, fontWeight: '600' }}>
            {label}
          </Text>
        )
      )}
    </View>
  );
}

type AvatarStackProps = {
  avatars: { src?: string; label?: string }[];
  size?: number;
  max?: number;
  ringColor?: string;
};

export function AvatarStack({ avatars, size = 24, max = 3, ringColor = '#FAF8F3' }: AvatarStackProps) {
  const shown = avatars.slice(0, max);
  const remainder = avatars.length - max;
  return (
    <View style={{ flexDirection: 'row' }}>
      {shown.map((a, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <Avatar src={a.src} label={a.label} size={size} ring={ringColor} />
        </View>
      ))}
      {remainder > 0 && (
        <View
          style={{
            marginLeft: -size * 0.3,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#1A1815',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: ringColor,
          }}
        >
          <Text style={{ ...TYPE.ui, color: '#F2EFE8', fontSize: size * 0.38, fontWeight: '600' }}>
            +{remainder}
          </Text>
        </View>
      )}
    </View>
  );
}
