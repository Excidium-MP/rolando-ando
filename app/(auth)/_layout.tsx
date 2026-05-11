import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { session, isLoaded } = useAuth();
  // Wait for the first getSession() round-trip so we do not flash sign-in for
  // an already-logged-in user.
  if (!isLoaded) return null;
  if (session) {
    // If they are logged in, kick them back to the app. The onboarding gate
    // inside the tabs/onboarding layouts handles the is_onboarded redirect.
    return <Redirect href="/" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
