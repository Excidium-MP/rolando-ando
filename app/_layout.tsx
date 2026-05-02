import '../global.css';
import 'react-native-reanimated';

import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from '@expo-google-fonts/geist';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/store/themeStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemedRoot />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function ThemedRoot() {
  const { surface, isDark } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: surface.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: 'Rolando' }} />
        <Stack.Screen
          name="gym/[id]"
          options={{ animation: 'slide_from_right', title: 'Gym · Rolando' }}
        />
        <Stack.Screen
          name="openmat/[id]"
          options={{ animation: 'slide_from_right', title: 'Open mat · Rolando' }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{ animation: 'slide_from_right', title: 'Chat · Rolando' }}
        />
        <Stack.Screen
          name="post"
          options={{ presentation: 'modal', animation: 'slide_from_bottom', title: 'New post · Rolando' }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
