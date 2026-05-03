import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisciplineBadge } from '@/components/DisciplineBadge';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/store/themeStore';

export default function ProfileScreen() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const profileQuery = useProfile(user?.id);

  const onSignOut = () => {
    Alert.alert('Sign out?', 'You will need to sign back in to access your profile.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          useAuthStore.getState().signOut();
        },
      },
    ]);
  };

  const onEdit = () => {
    Alert.alert('Edit profile', 'Coming soon. For now you can update your handle and bio in Supabase Studio.');
  };

  // The root layout already gates onboarding, so by the time we render here
  // the profile should be loaded and non-placeholder. We still guard to keep
  // the type narrow and to handle cold-start / refetch edge cases.
  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <ScreenContainer bg={surface.bg} maxWidth={720}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.accent} />
        </View>
      </ScreenContainer>
    );
  }

  const profile = profileQuery.data;
  const initial = (profile.display_name?.trim() || profile.handle).charAt(0).toUpperCase();

  return (
    <ScreenContainer bg={surface.bg} maxWidth={720}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={{ height: 150 + insets.top, position: 'relative' }}>
          <LinearGradient
            colors={[theme.accent, `${theme.accent}55`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 12,
              right: 12,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <BlurButton tone="dark" onPress={onSignOut}>
              <Icon.more size={16} color="#fff" />
            </BlurButton>
          </View>
        </View>

        {/* Avatar + name + edit */}
        <View style={{ paddingHorizontal: 16, marginTop: -48, zIndex: 2 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: surface.bg,
              overflow: 'hidden',
              backgroundColor: theme.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text style={{ ...TYPE.display, fontSize: 36, color: '#fff' }}>{initial}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...TYPE.display, fontSize: 26, color: surface.text, letterSpacing: -0.6 }}>
                {profile.display_name || profile.handle}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 2 }}>
                @{profile.handle}
              </Text>
            </View>
            <Pressable onPress={onEdit}>
              <GlassCard
                surface={surface}
                padding={0}
                radius={10}
                style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text }}>
                  Edit
                </Text>
              </GlassCard>
            </Pressable>
          </View>

          {/* Primary discipline */}
          {profile.primary_discipline && (
            <View style={{ marginTop: 12, flexDirection: 'row' }}>
              <DisciplineBadge discipline={profile.primary_discipline} size="md" />
            </View>
          )}

          {/* Bio */}
          <View style={{ marginTop: 14 }}>
            <GlassCard surface={surface} radius={14}>
              {profile.bio ? (
                <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 21 }}>
                  {profile.bio}
                </Text>
              ) : (
                <Pressable onPress={onEdit}>
                  <Text
                    style={{
                      ...TYPE.ui,
                      fontSize: 14,
                      color: surface.textDim,
                      lineHeight: 21,
                    }}
                  >
                    Add a bio so other grapplers know what you train.
                  </Text>
                </Pressable>
              )}
            </GlassCard>
          </View>

          {/* Account info */}
          <View style={{ marginTop: 14 }}>
            <GlassCard surface={surface} radius={14}>
              <View style={{ gap: 10 }}>
                <View>
                  <Text
                    style={{
                      ...TYPE.ui,
                      fontSize: 10,
                      color: surface.textDim,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      marginBottom: 3,
                    }}
                  >
                    Signed in as
                  </Text>
                  <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text }}>
                    {user?.email ?? '...'}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Sign out */}
          <View style={{ marginTop: 24 }}>
            <PrimaryButton label="Sign out" onPress={onSignOut} variant="ghost" />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
