import { BlurView } from 'expo-blur';
import { Redirect, Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/store/themeStore';

type TabKey = 'index' | 'discover' | 'messages' | 'profile';

const TABS: { key: TabKey; label: string; icon: IconName; iconFill: IconName }[] = [
  { key: 'index', label: 'Feed', icon: 'home', iconFill: 'homeFill' },
  { key: 'discover', label: 'Discover', icon: 'map', iconFill: 'mapFill' },
  { key: 'messages', label: 'Inbox', icon: 'message', iconFill: 'messageFill' },
  { key: 'profile', label: 'You', icon: 'user', iconFill: 'userFill' },
];

export default function TabsLayout() {
  const { session, isLoaded, user } = useAuth();
  // Only fetch the profile once auth is loaded and there is a user — anonymous
  // users get to browse tabs without ever touching the profiles table.
  const profileQuery = useProfile(isLoaded && user ? user.id : null);

  if (!isLoaded) return null;
  // Wait for the profile fetch so the tabs do not flash for one frame before
  // the redirect to onboarding kicks in.
  if (session && profileQuery.isLoading) return null;
  // Logged-in users who haven't completed onboarding go straight there. The
  // (onboarding) layout then redirects back here once is_onboarded flips true.
  if (session && profileQuery.data && !profileQuery.data.is_onboarded) {
    return <Redirect href="/(onboarding)/setup" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

type TabBarProps = {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
};

function FloatingTabBar({ state, navigation }: TabBarProps) {
  const { surface, theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name as TabKey;

  const half = Math.ceil(TABS.length / 2);
  const left = TABS.slice(0, half);
  const right = TABS.slice(half);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 14) + 4,
      }}
    >
      <View
        style={{
          marginHorizontal: 14,
          height: 64,
          borderRadius: 28,
          borderWidth: 0.5,
          borderColor: surface.border,
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(31,29,23,0.85)' : 'rgba(255,255,255,0.85)',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 8,
          }}
        >
          {left.map((t) => (
            <TabItem
              key={t.key}
              tab={t}
              active={activeRoute === t.key}
              onPress={() => navigation.navigate(t.key)}
              accent={theme.accent}
              dim={surface.textDim}
            />
          ))}

          <Pressable
            onPress={() => router.push('/post')}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: theme.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: theme.accent,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Icon.plus size={24} color="#fff" />
          </Pressable>

          {right.map((t) => (
            <TabItem
              key={t.key}
              tab={t}
              active={activeRoute === t.key}
              onPress={() => navigation.navigate(t.key)}
              accent={theme.accent}
              dim={surface.textDim}
            />
          ))}
        </BlurView>
      </View>
    </View>
  );
}

function TabItem({
  tab,
  active,
  onPress,
  accent,
  dim,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onPress: () => void;
  accent: string;
  dim: string;
}) {
  const IconComp = active ? Icon[tab.iconFill] : Icon[tab.icon];
  const color = active ? accent : dim;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 6,
      }}
    >
      <IconComp size={22} color={color} />
      <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '600', color }}>{tab.label}</Text>
    </Pressable>
  );
}
