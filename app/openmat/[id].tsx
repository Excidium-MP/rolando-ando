import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { SectionHeader } from '@/components/SectionHeader';
import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';
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
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 220, position: 'relative' }}>
          <Image source={{ uri: om.coverPhoto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.5)']}
            locations={[0, 0.4, 1]}
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
            <BlurButton>
              <Icon.share size={18} color="#1A1815" />
            </BlurButton>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {om.isToday && (
                <View
                  style={{
                    backgroundColor: '#E8584C',
                    paddingHorizontal: 9,
                    paddingVertical: 3,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: '#fff', letterSpacing: 0.3 }}>
                    TODAY
                  </Text>
                </View>
              )}
              <Text style={{ ...TYPE.ui, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
                {om.day} · {om.date}
              </Text>
            </View>
            <Text style={{ ...TYPE.display, fontSize: 32, color: '#fff', letterSpacing: -0.6, lineHeight: 34 }}>
              {om.title}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: 'rgba(255,255,255,0.95)', marginTop: 6 }}>
              at <Text style={{ fontWeight: '700' }}>{om.gym}</Text> · {om.city}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20, gap: 14 }}>
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.clock size={18} color={theme.tag} />}
            title={om.time}
            sub="2 hour session"
          />
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.pin size={18} color={theme.tag} />}
            title={gym?.address ?? 'Address'}
            sub={`${om.distance} away · Tap for directions`}
          />
          <DetailRow
            surface={surface}
            theme={theme}
            icon={<Icon.user size={18} color={theme.tag} />}
            title={`${om.style} · ${om.level}`}
            sub={`$${om.dropIn} drop-in`}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: theme.accentSoft,
              borderRadius: 18,
              borderWidth: 0.5,
              borderColor: `${theme.accent}33`,
              padding: 18,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AvatarStack
                avatars={om.going.map((p) => ({ src: p.avatar }))}
                size={32}
                max={4}
                ringColor={theme.accentSoft}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>
                  {om.goingCount} going
                </Text>
                <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted }}>
                  Including {om.going.slice(0, 2).map((p) => p.name.split(' ')[0]).join(', ')}
                  {om.going.length > 2 ? ` and ${om.goingCount - 2} others` : ''}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <Pressable
                onPress={() => setGoing(!going)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  backgroundColor: going ? '#3FB872' : theme.accent,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {going && <Icon.check size={16} color="#fff" />}
                <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: '#fff' }}>
                  {going ? "You're going" : "I'm going"}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  paddingHorizontal: 18,
                  height: 44,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderWidth: 0.5,
                  borderColor: surface.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '500', color: surface.text }}>Maybe</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <SectionHeader title="Comments" surface={surface} theme={theme} />
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {COMMENTS.map((c, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingLeft: c.reply ? 24 : 0,
              }}
            >
              <Avatar src={c.who.avatar} size={32} />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: surface.bgElev,
                    borderRadius: 14,
                    padding: 12,
                    borderWidth: 0.5,
                    borderColor: surface.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: surface.text }}>
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
                            fontWeight: '600',
                            color: theme.tag,
                            letterSpacing: 0.3,
                          }}
                        >
                          GYM
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, marginTop: 3, lineHeight: 19 }}>
                    {c.text}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 14,
                    marginTop: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>{c.time}</Text>
                  <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim, fontWeight: '500' }}>Like</Text>
                  <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim, fontWeight: '500' }}>Reply</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
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
  theme: BeltTheme;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: theme.tagBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>{title}</Text>
        <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 1 }}>{sub}</Text>
      </View>
    </View>
  );
}
