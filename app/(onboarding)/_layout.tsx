import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function OnboardingLayout() {
  const { session, isLoaded, user } = useAuth();
  const profileQuery = useProfile(user?.id);

  if (!isLoaded) return null;
  if (!session) return <Redirect href="/(auth)/sign-in" />;

  // Wait for the profile fetch before deciding so we do not bounce a returning
  // onboarded user back to onboarding for a frame.
  if (profileQuery.isLoading) return null;

  if (profileQuery.data?.is_onboarded) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
