import '../global.css';
import 'react-native-reanimated';

import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initAuth } from '@/lib/auth';
import { useTheme } from '@/store/themeStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    initAuth().catch(() => {
      // initAuth swallows its own getSession errors; this catch is defensive
      // in case Supabase env vars are missing and the client throws on import.
    });
  }, []);

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
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="gym/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="openmat/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="post"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
