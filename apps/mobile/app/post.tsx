import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { GlassCard } from '@/components/GlassCard';
import { Icon, type IconName } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { GYMS, ME, PHOTOS } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

type PostKind = 'video' | 'checkin' | 'text';

const KIND_OPTIONS: { k: PostKind; l: string; icon: IconName }[] = [
  { k: 'video', l: 'Technique', icon: 'video' },
  { k: 'checkin', l: 'Check in', icon: 'pin' },
  { k: 'text', l: 'Knowledge', icon: 'text' },
];

export default function PostComposerScreen() {
  const router = useRouter();
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<PostKind>('video');

  return (
    <ScreenContainer bg={surface.bg}>
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: surface.border,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.textMuted }}>
            Cancel
          </Text>
        </Pressable>
        <Text style={{ ...TYPE.display, fontSize: 18, color: surface.text }}>New post</Text>
        <Pressable
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: theme.accent,
          }}
        >
          <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: '#fff' }}>Share</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.k;
              const IconComp = Icon[opt.icon];
              const color = active ? theme.accent : surface.textMuted;
              return (
                <GlassCard
                  key={opt.k}
                  surface={surface}
                  padding={12}
                  radius={12}
                  onPress={() => setKind(opt.k)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderWidth: active ? 1 : 0.5,
                    borderColor: active ? theme.accent : surface.borderGlass,
                  }}
                >
                  <IconComp size={18} color={color} />
                  <Text
                    style={{
                      ...TYPE.ui,
                      fontSize: 11,
                      fontWeight: '700',
                      color,
                      marginTop: 5,
                    }}
                  >
                    {opt.l}
                  </Text>
                </GlassCard>
              );
            })}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Avatar src={ME.avatar} size={36} />
          <View>
            <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>
              {ME.name}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>Public</Text>
          </View>
        </View>

        {kind === 'video' && (
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <View
                style={{
                  aspectRatio: 4 / 5,
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Image
                  source={{ uri: PHOTOS.techVid }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginLeft: -26,
                    marginTop: -26,
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderWidth: 0.5,
                    borderColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BlurView intensity={20} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Icon.play size={22} color="#fff" />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView intensity={20} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: '#fff' }}>
                    0:47 · Trim
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textDim, lineHeight: 20 }}>
                Describe the technique...
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 12,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {['de la riva', 'sweep', 'collar drag'].map((t) => (
                <View
                  key={t}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: theme.tagBg,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: theme.tag }}>
                    #{t}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: surface.chip,
                  borderWidth: 0.5,
                  borderStyle: 'dashed',
                  borderColor: surface.borderStrong,
                }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: surface.textMuted }}>
                  + Tag
                </Text>
              </View>
            </View>
          </>
        )}

        {kind === 'checkin' && (
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 10,
                  color: surface.textDim,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Where are you training?
              </Text>
              <GlassCard surface={surface} radius={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={{ uri: GYMS[0].cover }}
                  style={{ width: 44, height: 44, borderRadius: 10 }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>
                    {GYMS[0].name}
                  </Text>
                  <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted }}>
                    {GYMS[0].location}
                  </Text>
                </View>
                <Icon.check size={18} color={theme.accent} />
              </GlassCard>
            </View>
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textDim, lineHeight: 20 }}>
                How was the session?
              </Text>
            </View>
          </>
        )}

        {kind === 'text' && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
            <Text style={{ ...TYPE.ui, fontSize: 15, color: surface.textDim, lineHeight: 22 }}>
              Share a tip, a lesson, a question...
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <GlassCard
          surface={surface}
          isDark={isDark}
          blur
          padding={0}
          radius={999}
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Icon.camera size={18} color={surface.textMuted} />
            <Icon.video size={18} color={surface.textMuted} />
            <Icon.pin size={18} color={surface.textMuted} />
            <View style={{ flex: 1 }} />
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>0 / 500</Text>
          </View>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}
