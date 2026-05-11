import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { signOut } from '@/lib/auth';
import { useTheme } from '@/store/themeStore';

export default function SettingsScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const profileQuery = useProfile(user?.id);

  const onSignOut = () => {
    const confirmSignOut = async () => {
      await signOut();
      // (auth)/_layout guard redirects automatically once the session is
      // cleared, but pop back to the tabs first for a cleaner transition.
      router.replace('/');
    };

    // React Native Web's Alert.alert is unreliable for multi-button modals
    // (silently no-ops in some Expo builds). Fall back to window.confirm
    // there; native iOS / Android keep the proper Alert UI.
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Sign out?\n\nYou can sign back in any time.')) {
        void confirmSignOut();
      }
      return;
    }

    Alert.alert('Sign out', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: confirmSignOut },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 14,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: surface.bgElev,
            borderWidth: 0.5,
            borderColor: surface.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.back size={18} color={surface.text} />
        </Pressable>
        <Text style={{ ...TYPE.display, fontSize: 24, color: surface.text, letterSpacing: -0.3 }}>
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 40,
          gap: 24,
        }}
      >
        <Section title="Account" surface={surface}>
          <Row
            surface={surface}
            label="Email"
            value={user?.email ?? '—'}
          />
          <Row
            surface={surface}
            label="Handle"
            value={profileQuery.data?.handle ? `@${profileQuery.data.handle}` : '—'}
          />
          <Row
            surface={surface}
            label="Display name"
            value={profileQuery.data?.display_name ?? '—'}
          />
        </Section>

        <Section title="About" surface={surface}>
          <Row surface={surface} label="App" value="Open Tatame" />
          <Row surface={surface} label="Build" value="0.1.0 (prototype)" />
        </Section>

        <Pressable
          onPress={onSignOut}
          style={({ pressed }) => ({
            marginTop: 8,
            backgroundColor: surface.bgElev,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: surface.border,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ ...TYPE.ui, color: '#E8584C', fontSize: 15, fontWeight: '600' }}>
            Sign out
          </Text>
        </Pressable>

        <Text
          style={{
            ...TYPE.ui,
            fontSize: 11,
            color: surface.textDim,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Powered by {theme.name} belt energy.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  surface,
  children,
}: {
  title: string;
  surface: ReturnType<typeof useTheme>['surface'];
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text
        style={{
          ...TYPE.ui,
          fontSize: 11,
          color: surface.textDim,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: surface.bgElev,
          borderRadius: 14,
          borderWidth: 0.5,
          borderColor: surface.border,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  surface,
  label,
  value,
}: {
  surface: ReturnType<typeof useTheme>['surface'];
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        borderTopWidth: 0.5,
        borderTopColor: surface.border,
      }}
    >
      <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted }}>{label}</Text>
      <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, flexShrink: 1 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
