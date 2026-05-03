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
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { isPlaceholderProfile, useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/store/themeStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mobile clients tolerate some staleness in exchange for fewer requests
      // and snappier list rendering. Individual hooks can override.
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
  });

  // Kick off auth restoration in parallel with font loading so the splash
  // screen masks both, not whichever finishes last.
  useEffect(() => {
    useAuthStore.getState().initialize();
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
  const { session, user, isLoaded } = useAuth();
  const profileQuery = useProfile(user?.id);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    // Wait for the profile fetch before deciding the onboarding gate. While
    // the query is loading we leave the user on whatever screen they are on,
    // even if technically wrong, to avoid flicker.
    if (session && profileQuery.isLoading) return;

    const root = segments[0] as string | undefined;
    const inAuth = root === '(auth)';
    const inOnboarding = root === '(onboarding)';

    if (!session) {
      if (!inAuth) router.replace('/(auth)/sign-in');
      return;
    }

    const needsOnboarding = isPlaceholderProfile(profileQuery.data);
    if (needsOnboarding) {
      if (!inOnboarding) router.replace('/(onboarding)/setup');
      return;
    }

    if (inAuth || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [
    isLoaded,
    session,
    profileQuery.data,
    profileQuery.isLoading,
    segments,
    router,
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: surface.bg },
        }}
      >
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ title: 'MMA Finder' }} />
        <Stack.Screen
          name="gym/[id]"
          options={{ animation: 'slide_from_right', title: 'Gym · MMA Finder' }}
        />
        <Stack.Screen
          name="openmat/[id]"
          options={{ animation: 'slide_from_right', title: 'Open mat · MMA Finder' }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{ animation: 'slide_from_right', title: 'Chat · MMA Finder' }}
        />
        <Stack.Screen
          name="post"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            title: 'New post · MMA Finder',
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
