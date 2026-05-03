import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Wordmark } from '@/components/Wordmark';
import { TYPE } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTheme } from '@/store/themeStore';

type TabKey = 'index' | 'discover' | 'messages' | 'profile';

const TABS: { key: TabKey; label: string; icon: IconName; iconFill: IconName }[] = [
  { key: 'index', label: 'Feed', icon: 'home', iconFill: 'homeFill' },
  { key: 'discover', label: 'Discover', icon: 'map', iconFill: 'mapFill' },
  { key: 'messages', label: 'Inbox', icon: 'message', iconFill: 'messageFill' },
  { key: 'profile', label: 'You', icon: 'user', iconFill: 'userFill' },
];

const IS_WEB = Platform.OS === 'web';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ResponsiveTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed · Rolando' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover · Rolando' }} />
      <Tabs.Screen name="messages" options={{ title: 'Inbox · Rolando' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile · Rolando' }} />
    </Tabs>
  );
}

type TabBarProps = {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
};

function ResponsiveTabBar(props: TabBarProps) {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'desktop') return <DesktopRail {...props} />;
  return <FloatingTabBar {...props} />;
}

// ─────────────────────────────────────────────────────────────
// PHONE: floating glass bottom bar (unchanged from mobile v2)
// ─────────────────────────────────────────────────────────────

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
        paddingTop: 6,
        paddingBottom: Math.max(insets.bottom, 12) + 4,
      }}
    >
      <LinearGradient
        colors={[
          'transparent',
          isDark ? 'rgba(12,12,11,0.6)' : 'rgba(244,243,239,0.6)',
          isDark ? '#0C0C0B' : surface.bg,
        ]}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 }}
      />
      <View
        style={{
          marginHorizontal: 12,
          height: 58,
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: surface.borderGlass,
          overflow: 'hidden',
          backgroundColor: surface.bgGlass,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 32,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
          ...(IS_WEB
            ? ({
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              } as ViewStyle)
            : null),
        }}
      >
        {!IS_WEB && (
          <BlurView
            intensity={surface.glassIntensity}
            tint={isDark ? 'dark' : 'light'}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 6,
          }}
        >
          {left.map((t) => (
            <PhoneTabItem
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
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: theme.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: theme.accent,
              shadowOpacity: 0.5,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
              opacity: pressed ? 0.85 : 1,
              ...(IS_WEB ? ({ cursor: 'pointer' } as ViewStyle) : null),
            })}
          >
            <Icon.plus size={22} color="#fff" />
          </Pressable>

          {right.map((t) => (
            <PhoneTabItem
              key={t.key}
              tab={t}
              active={activeRoute === t.key}
              onPress={() => navigation.navigate(t.key)}
              accent={theme.accent}
              dim={surface.textDim}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function PhoneTabItem({
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
        paddingVertical: 4,
        ...(IS_WEB ? ({ cursor: 'pointer' } as ViewStyle) : null),
      }}
    >
      <IconComp size={20} color={color} />
      <Text style={{ ...TYPE.ui, fontSize: 9, fontWeight: '700', color }}>{tab.label}</Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: left side rail
// ─────────────────────────────────────────────────────────────

const RAIL_WIDTH = 240;

function DesktopRail({ state, navigation }: TabBarProps) {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const activeRoute = state.routes[state.index]?.name as TabKey;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: RAIL_WIDTH,
        paddingHorizontal: 16,
        paddingTop: 28,
        paddingBottom: 24,
        borderRightWidth: 0.5,
        borderRightColor: surface.border,
        backgroundColor: surface.bg,
      }}
    >
      <View style={{ paddingHorizontal: 8, marginBottom: 22 }}>
        <Wordmark color={surface.text} accent={theme.accent} size={26} />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        {TABS.map((t) => (
          <RailItem
            key={t.key}
            tab={t}
            active={activeRoute === t.key}
            onPress={() => navigation.navigate(t.key)}
            accent={theme.accent}
            text={surface.text}
            dim={surface.textMuted}
            hoverBg={surface.bgElev}
          />
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/post')}
        style={({ pressed, hovered }) => ({
          height: 44,
          borderRadius: 12,
          backgroundColor: theme.accent,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: pressed ? 0.85 : hovered ? 0.95 : 1,
          shadowColor: theme.accent,
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          ...(IS_WEB ? ({ cursor: 'pointer' } as ViewStyle) : null),
        })}
      >
        <Icon.plus size={18} color="#fff" />
        <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: '#fff' }}>
          New post
        </Text>
      </Pressable>
    </View>
  );
}

function RailItem({
  tab,
  active,
  onPress,
  accent,
  text,
  dim,
  hoverBg,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onPress: () => void;
  accent: string;
  text: string;
  dim: string;
  hoverBg: string;
}) {
  const IconComp = active ? Icon[tab.iconFill] : Icon[tab.icon];
  const color = active ? accent : text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: pressed || hovered ? hoverBg : 'transparent',
        ...(IS_WEB ? ({ cursor: 'pointer' } as ViewStyle) : null),
      })}
    >
      <IconComp size={20} color={color} />
      <Text
        style={{
          ...TYPE.ui,
          fontSize: 14,
          fontWeight: active ? '700' : '500',
          color: active ? text : dim,
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}
