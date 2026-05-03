import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { GlassCard } from '@/components/GlassCard';
import { GlassIconBtn } from '@/components/GlassIconBtn';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { MESSAGES, PEOPLE } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

export default function MessagesScreen() {
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScreenContainer bg={surface.bg} maxWidth={620}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingTop: insets.top + 10,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ ...TYPE.display, fontSize: 26, color: surface.text, letterSpacing: -0.6 }}>
            Messages
          </Text>
          <GlassIconBtn surface={surface} isDark={isDark}>
            <Icon.plus size={18} color={surface.text} />
          </GlassIconBtn>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <GlassCard surface={surface} padding={0} radius={12}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 9,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon.search size={14} color={surface.textDim} />
              <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textDim }}>Search</Text>
            </View>
          </GlassCard>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12, gap: 12 }}
        >
          {PEOPLE.slice(0, 6).map((p) => (
            <View key={p.id} style={{ width: 50, alignItems: 'center' }}>
              <View>
                <Avatar src={p.avatar} size={46} />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: -1,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#22C55E',
                    borderWidth: 2,
                    borderColor: surface.bg,
                  }}
                />
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim, marginTop: 3 }}>
                {p.name.split(' ')[0]}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 8 }}>
          {MESSAGES.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => router.push(`/chat/${m.id}`)}
              style={({ pressed, hovered }) => ({
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderRadius: 14,
                backgroundColor:
                  m.unread > 0 ? theme.tagBg : hovered ? surface.bgElev : 'transparent',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View>
                <Avatar src={m.avatar} size={46} />
                {m.online && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: -1,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#22C55E',
                      borderWidth: 2,
                      borderColor: m.unread > 0 ? surface.bgInset : surface.bg,
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...TYPE.ui,
                      fontSize: 14,
                      fontWeight: m.unread > 0 ? '700' : '600',
                      color: surface.text,
                      flexShrink: 1,
                    }}
                  >
                    {m.name}
                  </Text>
                  {m.belt && <BeltBar color={m.belt} stripes={m.stripes ?? 0} width={18} height={4} />}
                  {m.isGym && (
                    <View
                      style={{
                        backgroundColor: theme.tagBg,
                        paddingHorizontal: 4,
                        paddingVertical: 1,
                        borderRadius: 3,
                      }}
                    >
                      <Text
                        style={{
                          ...TYPE.ui,
                          fontSize: 8,
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
                <Text
                  numberOfLines={1}
                  style={{
                    ...TYPE.ui,
                    fontSize: 12,
                    color: m.unread > 0 ? surface.text : surface.textMuted,
                    fontWeight: m.unread > 0 ? '500' : '400',
                    marginTop: 1,
                  }}
                >
                  {m.last}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 10,
                    color: m.unread > 0 ? theme.accent : surface.textDim,
                    fontWeight: m.unread > 0 ? '700' : '400',
                  }}
                >
                  {m.time}
                </Text>
                {m.unread > 0 && (
                  <View
                    style={{
                      minWidth: 16,
                      height: 16,
                      paddingHorizontal: 4,
                      borderRadius: 8,
                      backgroundColor: theme.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '700', color: '#fff' }}>
                      {m.unread}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
