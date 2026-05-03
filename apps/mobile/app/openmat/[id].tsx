import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { TYPE, type Surface, type Theme } from '@/constants/theme';
import { GYMS, OPEN_MATS, PEOPLE, PHOTOS } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const COMMENTS = [
  { who: PEOPLE[1], time: '2h', text: 'pulling up. anyone want to drill spider guard before?', reply: false },
  { who: PEOPLE[2], time: '3h', text: 'first time visiting, drop-in just $30 right?', reply: false },
  {
    who: { name: 'Atos HQ', avatar: PHOTOS.gym1, isGym: true },
    time: '3h',
    text: 'yes! $30 cash or card. just bring your gi',
    reply: true,
  },
];

export default function OpenMatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const om = OPEN_MATS.find((x) => x.id === id) ?? OPEN_MATS[0];
  const gym = GYMS.find((g) => g.id === om.gymId);
  const [going, setGoing] = useState(false);

  return (
    <ScreenContainer bg={surface.bg} maxWidth={620}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 240, position: 'relative' }}>
          <Image source={{ uri: om.coverPhoto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.65)']}
            locations={[0, 0.35, 1]}
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
            <BlurButton tone="dark">
              <Icon.share size={16} color="#fff" />
            </BlurButton>
          </View>
          <View style={{ position: 'absolute', left: 18, right: 18, bottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              {om.isToday && (
                <View
                  style={{
                    backgroundColor: '#E8453A',
                    paddingHorizontal: 9,
                    paddingVertical: 3,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}>
                    LIVE TODAY
                  </Text>
                </View>
              )}
              <Text style={{ ...TYPE.ui, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                {om.day} · {om.date}
              </Text>
            </View>
            <Text style={{ ...TYPE.display, fontSize: 28, color: '#fff', letterSpacing: -0.6, lineHeight: 30 }}>
              {om.title}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 5 }}>
              at <Text style={{ fontWeight: '700' }}>{om.gym}</Text>
            </Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 10 }}>
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.clock size={16} color={theme.accent} />}
            title={om.time}
            sub="2 hour session"
          />
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.pin size={16} color={theme.accent} />}
            title={gym?.address ?? 'Address'}
            sub={`${om.distance} away`}
          />
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.user size={16} color={theme.accent} />}
            title={`${om.style} · ${om.level}`}
            sub={`$${om.dropIn} drop-in`}
          />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <GlassCard
            surface={surface}
            radius={16}
            style={{
              backgroundColor: theme.tagBg,
              borderColor: `${theme.accent}33`,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AvatarStack
                avatars={om.going.map((p) => ({ src: p.avatar }))}
                size={30}
                max={4}
                ringColor={surface.bg}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>
                  {om.goingCount} going
                </Text>
                <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted }}>
                  {om.going.slice(0, 2).map((p) => p.name.split(' ')[0]).join(', ')} and others
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Pressable
                onPress={() => setGoing(!going)}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: going ? '#22C55E' : theme.accent,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                {going && <Icon.check size={14} color="#fff" />}
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: '#fff' }}>
                  {going ? "You're going" : "I'm going"}
                </Text>
              </Pressable>
              <GlassCard
                surface={surface}
                padding={0}
                radius={12}
                style={{
                  paddingHorizontal: 16,
                  height: 42,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '600', color: surface.text }}>
                  Maybe
                </Text>
              </GlassCard>
            </View>
          </GlassCard>
        </View>

        <SectionHeader title="Comments" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {COMMENTS.map((c, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                gap: 8,
                paddingLeft: c.reply ? 20 : 0,
              }}
            >
              <Avatar src={c.who.avatar} size={28} />
              <View style={{ flex: 1 }}>
                <GlassCard surface={surface} radius={12} padding={10}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text }}>
                      {c.who.name}
                    </Text>
                    {'isGym' in c.who && c.who.isGym && (
                      <View
                        style={{
                          backgroundColor: theme.tagBg,
                          paddingHorizontal: 5,
                          paddingVertical: 1,
                          borderRadius: 3,
                        }}
                      >
                        <Text
                          style={{
                            ...TYPE.ui,
                            fontSize: 9,
                            fontWeight: '700',
                            color: theme.tag,
                            letterSpacing: 0.4,
                          }}
                        >
                          GYM
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.text, marginTop: 3, lineHeight: 18 }}>
                    {c.text}
                  </Text>
                </GlassCard>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginTop: 4,
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>{c.time}</Text>
                  <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim, fontWeight: '600' }}>Like</Text>
                  <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim, fontWeight: '600' }}>Reply</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DetailRow({
  icon,
  title,
  sub,
  surface,
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  surface: Surface;
  theme: Theme;
}) {
  return (
    <GlassCard surface={surface} padding={12} radius={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: theme.tagBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>{title}</Text>
        <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginTop: 1 }}>{sub}</Text>
      </View>
    </GlassCard>
  );
}
