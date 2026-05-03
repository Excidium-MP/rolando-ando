import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BeltBar } from '@/components/BeltBar';
import { DisciplineBadge } from '@/components/DisciplineBadge';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader, Stat } from '@/components/SectionHeader';
import { TYPE } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
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

const MY_DISCIPLINES = ['bjj', 'mma'];
const IS_WEB = Platform.OS === 'web';

export default function ProfileScreen() {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'desktop' && IS_WEB) {
    return <DesktopProfile />;
  }
  return <PhoneProfile />;
}

// ─────────────────────────────────────────────────────────────
// PHONE: stacked layout with overlapping avatar
// ─────────────────────────────────────────────────────────────

function PhoneProfile() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]['k']>('posts');

  return (
    <ScreenContainer bg={surface.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 150 + insets.top, position: 'relative' }}>
          <LinearGradient
            colors={[theme.accent, `${theme.accent}55`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Image
            source={{ uri: PHOTOS.mat }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 12,
              right: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <BlurButton tone="dark">
              <Icon.search size={16} color="#fff" />
            </BlurButton>
            <BlurButton tone="dark">
              <Icon.more size={16} color="#fff" />
            </BlurButton>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: -48, zIndex: 2 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: surface.bg,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 20,
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
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...TYPE.display, fontSize: 26, color: surface.text, letterSpacing: -0.6 }}>
                {ME.name}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 2 }}>
                @{ME.handle} · {ME.city}
              </Text>
            </View>
            <GlassCard surface={surface} padding={0} radius={10} style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text }}>
                Edit
              </Text>
            </GlassCard>
          </View>

          <View style={{ marginTop: 12 }}>
            <GlassCard
              surface={surface}
              radius={14}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <View>
                <BeltBar color={ME.belt} stripes={ME.stripes} width={54} height={14} />
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 10,
                    color: surface.textMuted,
                    marginTop: 3,
                    textTransform: 'capitalize',
                  }}
                >
                  {ME.belt} · {ME.stripes} stripes
                </Text>
              </View>
              <View style={{ width: 0.5, height: 32, backgroundColor: surface.border }} />
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {MY_DISCIPLINES.map((d) => (
                  <DisciplineBadge key={d} discipline={d} />
                ))}
              </View>
            </GlassCard>
          </View>

          <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, lineHeight: 20, marginTop: 12 }}>
            {ME.bio}
          </Text>

          <View style={{ marginTop: 14 }}>
            <GlassCard surface={surface} radius={14}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.rolls} label="Sessions" surface={surface} />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.gymsVisited} label="Gyms" surface={surface} divider />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.openMats} label="Open mats" surface={surface} divider />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={`${ME.stats.streak}d`} label="Streak" surface={surface} divider />
                </View>
              </View>
            </GlassCard>
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
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {GYMS.slice(0, 4).map((g) => (
            <Pressable key={g.id} onPress={() => router.push(`/gym/${g.id}`)} style={{ width: 130 }}>
              <View style={{ height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <Image source={{ uri: g.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <View
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 20,
                    height: 20,
                    borderRadius: 7,
                    backgroundColor: '#22C55E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.check size={12} color="#fff" />
                </View>
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text, marginTop: 5 }}>
                {g.name}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>{g.location}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View
          style={{
            marginTop: 24,
            paddingHorizontal: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: surface.border,
            flexDirection: 'row',
            gap: 20,
          }}
        >
          {TABS.map((t) => (
            <Pressable
              key={t.k}
              onPress={() => setTab(t.k)}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 2,
                borderBottomColor: tab === t.k ? theme.accent : 'transparent',
                marginBottom: -0.5,
              }}
            >
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 13,
                  fontWeight: tab === t.k ? '700' : '500',
                  color: tab === t.k ? surface.text : surface.textMuted,
                }}
              >
                {t.l}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ padding: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
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
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon.play size={9} color="#fff" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP WEB: horizontal avatar row, grid layouts, max 720
// ─────────────────────────────────────────────────────────────

function DesktopProfile() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]['k']>('posts');

  return (
    <ScreenContainer bg={surface.bg} maxWidth={720}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            position: 'relative',
            height: 200,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[theme.accent, `${theme.accent}44`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Image
            source={{ uri: PHOTOS.mat }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.25 }}
            contentFit="cover"
          />
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: -52, zIndex: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 20 }}>
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 24,
                borderWidth: 4,
                borderColor: surface.bg,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Image source={{ uri: ME.avatar }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>
            <View style={{ flex: 1, paddingBottom: 4 }}>
              <Text style={{ ...TYPE.display, fontSize: 30, color: surface.text, letterSpacing: -0.6 }}>
                {ME.name}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, marginTop: 3 }}>
                @{ME.handle} · {ME.city}
              </Text>
            </View>
            <GlassCard
              surface={surface}
              padding={0}
              radius={10}
              style={{ paddingHorizontal: 18, paddingVertical: 9 }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>
                Edit profile
              </Text>
            </GlassCard>
          </View>

          <View style={{ marginTop: 20 }}>
            <GlassCard
              surface={surface}
              radius={14}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <View>
                <BeltBar color={ME.belt} stripes={ME.stripes} width={58} height={16} />
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 11,
                    color: surface.textMuted,
                    marginTop: 3,
                    textTransform: 'capitalize',
                  }}
                >
                  {ME.belt} · {ME.stripes} stripes
                </Text>
              </View>
              <View style={{ width: 0.5, height: 36, backgroundColor: surface.border }} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                {MY_DISCIPLINES.map((d) => (
                  <DisciplineBadge key={d} discipline={d} />
                ))}
              </View>
            </GlassCard>
          </View>

          <Text
            style={{
              ...TYPE.ui,
              fontSize: 14,
              color: surface.text,
              lineHeight: 22,
              marginTop: 14,
              maxWidth: 500,
            }}
          >
            {ME.bio}
          </Text>

          <View style={{ marginTop: 16 }}>
            <GlassCard surface={surface} radius={14}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.rolls} label="Sessions" surface={surface} />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.gymsVisited} label="Gyms" surface={surface} divider />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={ME.stats.openMats} label="Open mats" surface={surface} divider />
                </View>
                <View style={{ flex: 1 }}>
                  <Stat value={`${ME.stats.streak}d`} label="Streak" surface={surface} divider />
                </View>
              </View>
            </GlassCard>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={{ ...TYPE.display, fontSize: 20, color: surface.text }}>Gyms visited</Text>
            <Pressable>
              <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: theme.accent }}>
                {ME.stats.gymsVisited} total
              </Text>
            </Pressable>
          </View>
          <View style={{ ...({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 } as unknown as ViewStyle) }}>
            {GYMS.slice(0, 4).map((g) => (
              <Pressable key={g.id} onPress={() => router.push(`/gym/${g.id}`)}>
                <View style={{ height: 90, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                  <Image source={{ uri: g.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 22,
                      height: 22,
                      borderRadius: 8,
                      backgroundColor: '#22C55E',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon.check size={13} color="#fff" />
                  </View>
                </View>
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text, marginTop: 6 }}>
                  {g.name}
                </Text>
                <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>{g.location}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={{
            marginTop: 28,
            paddingHorizontal: 24,
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
                  fontWeight: tab === t.k ? '700' : '500',
                  color: tab === t.k ? surface.text : surface.textMuted,
                }}
              >
                {t.l}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 4,
            ...({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 4 } as unknown as ViewStyle),
          }}
        >
          {GRID_PHOTOS.map((p, i) => (
            <View
              key={i}
              style={{
                aspectRatio: 1,
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image source={{ uri: p }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              {(i === 0 || i === 4) && (
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.play size={10} color="#fff" />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

