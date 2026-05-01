import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { SectionHeader, Stat } from '@/components/SectionHeader';
import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';
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
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 280, position: 'relative' }}>
          <Image source={{ uri: gym.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'transparent', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.35, 0.6, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
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
            <BlurButton onPress={() => router.back()}>
              <Icon.back size={20} color="#1A1815" />
            </BlurButton>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <BlurButton>
                <Icon.share size={18} color="#1A1815" />
              </BlurButton>
              <BlurButton>
                <Icon.bookmark size={18} color="#1A1815" />
              </BlurButton>
            </View>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
            <Text
              style={{
                ...TYPE.ui,
                fontSize: 12,
                fontWeight: '500',
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {gym.affiliation}
            </Text>
            <Text style={{ ...TYPE.display, fontSize: 38, color: '#fff', letterSpacing: -0.8, lineHeight: 40 }}>
              {gym.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon.star size={13} color="#FFC857" />
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: '#fff' }}>{gym.rating}</Text>
                <Text style={{ ...TYPE.ui, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>({gym.reviewCount})</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.6)' }}>·</Text>
              <Text style={{ ...TYPE.ui, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{gym.distance}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)' }}>·</Text>
              <Text style={{ ...TYPE.ui, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>${gym.dropIn} drop-in</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {gym.tags.map((t) => (
              <Chip key={t} surface={surface} theme={theme} tone="accent">
                {t}
              </Chip>
            ))}
            {gym.style.map((t) => (
              <Chip key={t} surface={surface} theme={theme}>
                {t}
              </Chip>
            ))}
          </View>

          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted, lineHeight: 22 }}>
            {gym.description}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <Pressable
              style={{
                flex: 1,
                height: 46,
                borderRadius: 999,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: '#fff' }}>
                Request drop-in
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: surface.bgElev,
                borderWidth: 0.5,
                borderColor: surface.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon.message size={20} color={surface.text} />
            </Pressable>
            <Pressable
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: surface.bgElev,
                borderWidth: 0.5,
                borderColor: surface.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon.globe size={20} color={surface.text} />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: surface.bgElev,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: surface.border,
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1 }}>
            <Stat value={gym.members} label="Members" surface={surface} />
          </View>
          <View style={{ flex: 1 }}>
            <Stat value={gym.openMatsThisWeek} label="Open mats" sub="this week" surface={surface} divider />
          </View>
          <View style={{ flex: 1 }}>
            <Stat value="Verified" label="Affiliation" sub={gym.affiliation} surface={surface} divider isText />
          </View>
        </View>

        <SectionHeader title="Open mats" action="See all" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {gymOpenMats.length > 0 ? (
            gymOpenMats.map((om) => (
              <OpenMatRow key={om.id} om={om} surface={surface} theme={theme} onPress={() => router.push(`/openmat/${om.id}`)} />
            ))
          ) : (
            <View
              style={{
                padding: 24,
                backgroundColor: surface.bgElev,
                borderRadius: 14,
                borderWidth: 0.5,
                borderStyle: 'dashed',
                borderColor: surface.borderStrong,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, textAlign: 'center' }}>
                No open mats scheduled. Check back soon.
              </Text>
            </View>
          )}
        </View>

        <SectionHeader title="Weekly schedule" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: surface.bgElev,
              borderRadius: 14,
              borderWidth: 0.5,
              borderColor: surface.border,
              overflow: 'hidden',
            }}
          >
            {SCHEDULE.map((day, i) => (
              <View
                key={day.d}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth: i < SCHEDULE.length - 1 ? 0.5 : 0,
                  borderBottomColor: surface.border,
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 12,
                    fontWeight: '600',
                    color: surface.textMuted,
                    letterSpacing: 0.5,
                    width: 36,
                    paddingTop: 1,
                  }}
                >
                  {day.d.toUpperCase()}
                </Text>
                <View style={{ flex: 1, gap: 4 }}>
                  {day.items.map((it, j) => (
                    <Text key={j} style={{ ...TYPE.ui, fontSize: 13, color: surface.text }}>
                      {it}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <SectionHeader title="Who trains here" action="See all" surface={surface} theme={theme} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {PEOPLE.slice(0, 6).map((p) => (
            <View key={p.id} style={{ width: 76, alignItems: 'center' }}>
              <Avatar src={p.avatar} size={64} />
              <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '500', color: surface.text, marginTop: 6 }}>
                {p.name.split(' ')[0]}
              </Text>
              <View style={{ marginTop: 3 }}>
                <BeltBar color={p.belt} stripes={p.stripes} width={28} height={6} />
              </View>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="Reviews" action="See all" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {REVIEWS.map((r, i) => (
            <View
              key={i}
              style={{
                backgroundColor: surface.bgElev,
                borderRadius: 14,
                padding: 14,
                borderWidth: 0.5,
                borderColor: surface.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar src={r.who.avatar} size={32} />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: surface.text }}>
                    {r.who.name}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Icon.star key={j} size={11} color={j < r.stars ? '#FFC857' : surface.border} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, lineHeight: 20, marginTop: 10 }}>
                {r.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
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
  theme: BeltTheme;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: surface.bgElev,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: surface.border,
        padding: 12,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: om.isToday ? theme.accent : theme.tagBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.5,
            color: om.isToday ? '#fff' : theme.tag,
          }}
        >
          {om.day.toUpperCase()}
        </Text>
        <Text
          style={{
            ...TYPE.display,
            fontSize: 22,
            lineHeight: 22,
            marginTop: 2,
            color: om.isToday ? '#fff' : theme.tag,
          }}
        >
          {om.date.split(' ')[1]}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>{om.title}</Text>
        <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 2 }}>
          {om.time} · {om.style}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <AvatarStack avatars={om.going.map((p) => ({ src: p.avatar }))} size={18} max={3} ringColor={surface.bgElev} />
          <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>{om.goingCount} going</Text>
        </View>
      </View>
      <Icon.forward size={14} color={surface.textDim} />
    </Pressable>
  );
}
