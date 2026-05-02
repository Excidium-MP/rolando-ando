import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { Chip } from '@/components/Chip';
import { DisciplineBadge } from '@/components/DisciplineBadge';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader, Stat } from '@/components/SectionHeader';
import { TYPE, type Surface, type Theme } from '@/constants/theme';
import { GYMS, OPEN_MATS, PEOPLE, type OpenMat } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const SCHEDULE = [
  { d: 'Mon', items: ['6:00 AM Fundamentals', '6:30 PM Gi · All', '7:30 PM Comp class'] },
  { d: 'Wed', items: ['6:30 PM No-Gi · All', '7:30 PM Drilling'] },
  { d: 'Fri', items: ['12:00 PM Open mat (members)', '6:30 PM Gi · All'] },
  { d: 'Sat', items: ['11:00 AM OPEN MAT', '1:00 PM Comp training'] },
];

const REVIEWS = [
  { who: PEOPLE[2], stars: 5, text: 'Visited from NYC, treated me like family. Murilo himself rolled with me. Worth the trip.' },
  { who: PEOPLE[4], stars: 5, text: 'Best academy on the west coast. Technical, intense, but never ego-driven.' },
];

export default function GymDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const gym = GYMS.find((g) => g.id === id) ?? GYMS[0];

  const gymOpenMats = OPEN_MATS.filter((om) => om.gymId === gym.id);

  return (
    <ScreenContainer bg={surface.bg} maxWidth={720}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 280, position: 'relative' }}>
          <Image source={{ uri: gym.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.75)']}
            locations={[0, 0.3, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
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
            <BlurButton tone="dark" onPress={() => router.back()}>
              <Icon.back size={18} color="#fff" />
            </BlurButton>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <BlurButton tone="dark">
                <Icon.share size={16} color="#fff" />
              </BlurButton>
              <BlurButton tone="dark">
                <Icon.bookmark size={16} color="#fff" />
              </BlurButton>
            </View>
          </View>
          <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18 }}>
            <Text
              style={{
                ...TYPE.ui,
                fontSize: 11,
                fontWeight: '600',
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {gym.affiliation}
            </Text>
            <Text style={{ ...TYPE.display, fontSize: 34, color: '#fff', letterSpacing: -0.8, lineHeight: 36 }}>
              {gym.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Icon.star size={12} color="#FFC857" />
                <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: '#fff' }}>{gym.rating}</Text>
                <Text style={{ ...TYPE.ui, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>({gym.reviewCount})</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.4)' }}>·</Text>
              <Text style={{ ...TYPE.ui, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{gym.distance}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)' }}>·</Text>
              <Text style={{ ...TYPE.ui, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>${gym.dropIn} drop-in</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {gym.style.map((t) => (
              <DisciplineBadge key={t} discipline={t} />
            ))}
            {gym.tags.map((t) => (
              <Chip key={t} surface={surface} theme={theme} tone="accent">
                {t}
              </Chip>
            ))}
          </View>

          <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, lineHeight: 20 }}>
            {gym.description}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <Pressable
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: '#fff' }}>
                Request drop-in
              </Text>
            </Pressable>
            <GlassCard
              surface={surface}
              padding={0}
              radius={12}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon.message size={18} color={surface.text} />
            </GlassCard>
            <GlassCard
              surface={surface}
              padding={0}
              radius={12}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon.globe size={18} color={surface.text} />
            </GlassCard>
          </View>
        </View>

        <View style={{ marginTop: 16, marginHorizontal: 16 }}>
          <GlassCard surface={surface} radius={14}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Stat value={gym.members} label="Members" surface={surface} />
              </View>
              <View style={{ flex: 1 }}>
                <Stat value={gym.openMatsThisWeek} label="Open mats" sub="this week" surface={surface} divider />
              </View>
              <View style={{ flex: 1 }}>
                <Stat value="Verified" label={gym.affiliation} surface={surface} divider isText />
              </View>
            </View>
          </GlassCard>
        </View>

        <SectionHeader title="Open mats" action="See all" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          {gymOpenMats.length > 0 ? (
            gymOpenMats.map((om) => (
              <OpenMatRow
                key={om.id}
                om={om}
                surface={surface}
                theme={theme}
                onPress={() => router.push(`/openmat/${om.id}`)}
              />
            ))
          ) : (
            <GlassCard
              surface={surface}
              padding={20}
              radius={14}
              style={{ borderStyle: 'dashed', borderColor: surface.borderStrong }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, textAlign: 'center' }}>
                No open mats scheduled. Check back soon.
              </Text>
            </GlassCard>
          )}
        </View>

        <SectionHeader title="Schedule" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 16 }}>
          <GlassCard surface={surface} padding={0} radius={14}>
            {SCHEDULE.map((day, i) => (
              <View
                key={day.d}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                  borderBottomWidth: i < SCHEDULE.length - 1 ? 0.5 : 0,
                  borderBottomColor: surface.border,
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 11,
                    fontWeight: '700',
                    color: surface.textDim,
                    letterSpacing: 0.5,
                    width: 34,
                    paddingTop: 1,
                  }}
                >
                  {day.d.toUpperCase()}
                </Text>
                <View style={{ flex: 1, gap: 3 }}>
                  {day.items.map((it, j) => (
                    <Text key={j} style={{ ...TYPE.ui, fontSize: 12, color: surface.text }}>
                      {it}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </GlassCard>
        </View>

        <SectionHeader title="Who trains here" action="See all" surface={surface} theme={theme} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
        >
          {PEOPLE.slice(0, 6).map((p) => (
            <View key={p.id} style={{ width: 68, alignItems: 'center' }}>
              <Avatar src={p.avatar} size={56} />
              <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '700', color: surface.text, marginTop: 5 }}>
                {p.name.split(' ')[0]}
              </Text>
              <View style={{ marginTop: 2 }}>
                <BeltBar color={p.belt} stripes={p.stripes} width={24} height={5} />
              </View>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="Reviews" action="See all" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          {REVIEWS.map((r, i) => (
            <GlassCard key={i} surface={surface} radius={14}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar src={r.who.avatar} size={30} />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text }}>
                    {r.who.name}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 1, marginTop: 1 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Icon.star key={j} size={10} color={j < r.stars ? '#FFC857' : surface.border} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, lineHeight: 19, marginTop: 8 }}>
                {r.text}
              </Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function OpenMatRow({
  om,
  surface,
  theme,
  onPress,
}: {
  om: OpenMat;
  surface: Surface;
  theme: Theme;
  onPress: () => void;
}) {
  return (
    <GlassCard
      surface={surface}
      padding={10}
      radius={14}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          backgroundColor: om.isToday ? theme.accent : theme.tagBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 9,
            fontWeight: '700',
            letterSpacing: 0.5,
            color: om.isToday ? '#fff' : theme.tag,
          }}
        >
          {om.day.toUpperCase()}
        </Text>
        <Text
          style={{
            ...TYPE.display,
            fontSize: 20,
            lineHeight: 20,
            marginTop: 1,
            color: om.isToday ? '#fff' : theme.tag,
          }}
        >
          {om.date.split(' ')[1]}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>{om.title}</Text>
        <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginTop: 1 }}>
          {om.time} · {om.style}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
          <AvatarStack
            avatars={om.going.map((p) => ({ src: p.avatar }))}
            size={16}
            max={3}
            ringColor={surface.bg}
          />
          <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>{om.goingCount} going</Text>
        </View>
      </View>
      <Icon.forward size={12} color={surface.textDim} />
    </GlassCard>
  );
}
