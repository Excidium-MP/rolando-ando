import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BeltBar } from '@/components/BeltBar';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { SectionHeader, Stat } from '@/components/SectionHeader';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { GYMS, ME, PHOTOS } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const TABS = [
  { k: 'posts', l: 'Posts' },
  { k: 'videos', l: 'Videos' },
  { k: 'saved', l: 'Saved' },
] as const;

const GRID_PHOTOS = [
  PHOTOS.roll1,
  PHOTOS.roll2,
  PHOTOS.group1,
  PHOTOS.roll3,
  PHOTOS.gym1,
  PHOTOS.roll4,
  PHOTOS.group2,
  PHOTOS.gym2,
  PHOTOS.mat,
];

export default function ProfileScreen() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, isLoaded } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]['k']>('posts');

  // Anonymous browse: nothing personal to show. Surface a clear path to sign
  // in instead of pretending the mocked profile belongs to no one.
  if (isLoaded && !session) {
    return <AnonymousProfile />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 160 + insets.top, position: 'relative' }}>
          <LinearGradient
            colors={[theme.accent, `${theme.accent}88`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Image
            source={{ uri: PHOTOS.mat }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top + 10,
              left: 14,
              right: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <BlurButton>
              <Icon.search size={18} color="#1A1815" />
            </BlurButton>
            <BlurButton onPress={() => router.push('/settings')}>
              <Icon.more size={18} color="#1A1815" />
            </BlurButton>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -52, zIndex: 2 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 4,
              borderColor: surface.bg,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Image source={{ uri: ME.avatar }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...TYPE.display, fontSize: 30, color: surface.text, letterSpacing: -0.6 }}>
                {ME.name}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, marginTop: 2 }}>
                @{ME.handle} · {ME.city}
              </Text>
            </View>
            <Pressable
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: surface.bgElev,
                borderWidth: 0.5,
                borderColor: surface.borderStrong,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: surface.text }}>
                Edit profile
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              marginTop: 14,
              padding: 14,
              backgroundColor: surface.bgElev,
              borderRadius: 14,
              borderWidth: 0.5,
              borderColor: surface.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View>
              <BeltBar color={ME.belt} stripes={ME.stripes} width={60} height={16} />
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  color: surface.textMuted,
                  marginTop: 4,
                  textTransform: 'capitalize',
                }}
              >
                {ME.belt} · {ME.stripes} stripes
              </Text>
            </View>
            <View style={{ width: 0.5, height: 36, backgroundColor: surface.border }} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  color: surface.textDim,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                Home gym
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text, marginTop: 1 }}>
                Atos HQ
              </Text>
            </View>
          </View>

          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 22, marginTop: 14 }}>
            {ME.bio}
          </Text>

          <View
            style={{
              marginTop: 16,
              padding: 14,
              backgroundColor: surface.bgElev,
              borderRadius: 14,
              borderWidth: 0.5,
              borderColor: surface.border,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Stat value={ME.stats.rolls} label="Rolls" surface={surface} />
            <Stat value={ME.stats.gymsVisited} label="Gyms" surface={surface} divider />
            <Stat value={ME.stats.openMats} label="Open mats" surface={surface} divider />
            <Stat value={`${ME.stats.streak}d`} label="Streak" surface={surface} divider />
          </View>
        </View>

        <SectionHeader
          title="Gyms visited"
          action={`${ME.stats.gymsVisited} total`}
          surface={surface}
          theme={theme}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {GYMS.slice(0, 4).map((g) => (
            <Pressable key={g.id} onPress={() => router.push(`/gym/${g.id}`)} style={{ width: 140 }}>
              <View style={{ height: 90, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <Image source={{ uri: g.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#3FB872',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.check size={14} color="#fff" />
                </View>
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: surface.text, marginTop: 6 }}>
                {g.name}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>{g.location}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View
          style={{
            marginTop: 28,
            paddingHorizontal: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: surface.border,
            flexDirection: 'row',
            gap: 24,
          }}
        >
          {TABS.map((t) => (
            <Pressable
              key={t.k}
              onPress={() => setTab(t.k)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: tab === t.k ? theme.accent : 'transparent',
                marginBottom: -0.5,
              }}
            >
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 14,
                  fontWeight: tab === t.k ? '600' : '500',
                  color: tab === t.k ? surface.text : surface.textMuted,
                }}
              >
                {t.l}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ padding: 2, flexDirection: 'row', flexWrap: 'wrap' }}>
          {GRID_PHOTOS.map((p, i) => (
            <View key={i} style={{ width: '33.333%', aspectRatio: 1, padding: 1 }}>
              <View style={{ flex: 1, position: 'relative' }}>
                <Image source={{ uri: p }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                {(i === 0 || i === 4) && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon.play size={10} color="#fff" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AnonymousProfile() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: surface.bg,
        paddingTop: insets.top + 24,
        paddingHorizontal: 24,
        paddingBottom: 120,
        justifyContent: 'space-between',
      }}
    >
      <View />
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <Icon.user size={32} color={theme.accent} />
        </View>
        <Text
          style={{
            ...TYPE.display,
            fontSize: 32,
            color: surface.text,
            letterSpacing: -0.6,
            textAlign: 'center',
          }}
        >
          Your mat journey
        </Text>
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 14,
            color: surface.textMuted,
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 20,
            maxWidth: 280,
          }}
        >
          Sign in to track gyms visited, RSVP to open mats, share rolls, and message the community.
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        <Pressable
          onPress={() => router.push('/(auth)/sign-up')}
          style={({ pressed }) => ({
            backgroundColor: theme.accent,
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 15, fontWeight: '600' }}>
            Create an account
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          style={({ pressed }) => ({
            backgroundColor: surface.bgElev,
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: surface.borderStrong,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ ...TYPE.ui, color: surface.text, fontSize: 15, fontWeight: '600' }}>
            I already have an account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
