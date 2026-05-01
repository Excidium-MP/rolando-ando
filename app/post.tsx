import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Icon, type IconName } from '@/components/Icon';
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
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<PostKind>('video');

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: surface.border,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ ...TYPE.ui, fontSize: 15, fontWeight: '500', color: surface.textMuted }}>
            Cancel
          </Text>
        </Pressable>
        <Text style={{ ...TYPE.display, fontSize: 20, color: surface.text }}>New post</Text>
        <Pressable
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: theme.accent,
          }}
        >
          <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: '#fff' }}>Share</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.k;
              const IconComp = Icon[opt.icon];
              return (
                <Pressable
                  key={opt.k}
                  onPress={() => setKind(opt.k)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: active ? theme.tagBg : surface.bgElev,
                    borderWidth: 0.5,
                    borderColor: active ? theme.accent : surface.border,
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <IconComp size={20} color={active ? theme.tag : surface.text} />
                  <Text
                    style={{
                      ...TYPE.ui,
                      fontSize: 12,
                      fontWeight: '600',
                      color: active ? theme.tag : surface.text,
                    }}
                  >
                    {opt.l}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Avatar src={ME.avatar} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>
              {ME.name}
            </Text>
            <View
              style={{
                marginTop: 2,
                alignSelf: 'flex-start',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: surface.chip,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Icon.globe size={11} color={surface.textMuted} />
              <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted }}>Public</Text>
            </View>
          </View>
        </View>

        {kind === 'video' && (
          <>
            <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  aspectRatio: 4 / 5,
                  borderRadius: 16,
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
                    marginLeft: -30,
                    marginTop: -30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.play size={24} color="#1A1815" />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '600', color: '#1A1815' }}>
                    0:47 · Trim
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
              <Text style={{ ...TYPE.ui, fontSize: 15, color: surface.textDim, lineHeight: 22 }}>
                Describe the technique. What position, what setup, what details made it click?
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 14,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {['de la riva', 'sweep', 'collar drag'].map((t) => (
                <View
                  key={t}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: theme.tagBg,
                  }}
                >
                  <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '500', color: theme.tag }}>
                    #{t}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: surface.chip,
                  borderWidth: 0.5,
                  borderStyle: 'dashed',
                  borderColor: surface.borderStrong,
                }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '500', color: surface.textMuted }}>
                  + Add tag
                </Text>
              </View>
            </View>
          </>
        )}

        {kind === 'checkin' && (
          <>
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  color: surface.textDim,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Where are you training?
              </Text>
              <View
                style={{
                  padding: 14,
                  backgroundColor: surface.bgElev,
                  borderRadius: 14,
                  borderWidth: 0.5,
                  borderColor: surface.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Image
                  source={{ uri: GYMS[0].cover }}
                  style={{ width: 48, height: 48, borderRadius: 10 }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>
                    {GYMS[0].name}
                  </Text>
                  <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted }}>
                    {GYMS[0].location}
                  </Text>
                </View>
                <Icon.check size={20} color={theme.accent} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
              <Text style={{ ...TYPE.ui, fontSize: 15, color: surface.textDim, lineHeight: 22 }}>
                How was the session? Any takeaways?
              </Text>
            </View>
          </>
        )}

        {kind === 'text' && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ ...TYPE.ui, fontSize: 17, color: surface.textDim, lineHeight: 24 }}>
              Share a tip, a lesson, a question. The community will respond.
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: Math.max(insets.bottom, 16) + 8,
          backgroundColor: surface.bgElev,
          borderRadius: 999,
          borderWidth: 0.5,
          borderColor: surface.border,
          paddingHorizontal: 14,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 18,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <Icon.camera size={20} color={surface.textMuted} />
        <Icon.video size={20} color={surface.textMuted} />
        <Icon.pin size={20} color={surface.textMuted} />
        <Icon.calendar size={20} color={surface.textMuted} />
        <View style={{ flex: 1 }} />
        <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textDim }}>0 / 500</Text>
      </View>
    </View>
  );
}
