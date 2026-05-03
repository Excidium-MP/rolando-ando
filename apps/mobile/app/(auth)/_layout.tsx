import { Stack } from 'expo-router';
import React from 'react';

import { useTheme } from '@/store/themeStore';

export default function AuthLayout() {
  const { surface } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: surface.bg },
        animation: 'fade',
      }}
    />
  );
}
