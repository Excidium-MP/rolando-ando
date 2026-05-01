import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { TYPE } from '@/constants/theme';
import { MESSAGES, PEOPLE } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

export default function MessagesScreen() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingTop: insets.top + 10,
            paddingHorizontal: 20,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ ...TYPE.display, fontSize: 30, color: surface.text, letterSpacing: -0.6 }}>
            Messages
          </Text>
          <IconButton surface={surface}>
            <Icon.plus size={20} color={surface.text} />
          </IconButton>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          <View
            style={{
              backgroundColor: surface.chip,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon.search size={16} color={surface.textDim} />
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textDim }}>Search messages</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14, gap: 14 }}
        >
          {PEOPLE.slice(0, 6).map((p) => (
            <View key={p.id} style={{ width: 56, alignItems: 'center' }}>
              <View>
                <Avatar src={p.avatar} size={52} />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: '#3FB872',
                    borderWidth: 2,
                    borderColor: surface.bg,
                  }}
                />
              </View>
              <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginTop: 4 }}>
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
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderRadius: 14,
                backgroundColor: m.unread > 0 ? theme.tagBg + '60' : 'transparent',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View>
                <Avatar src={m.avatar} size={52} />
                {m.online && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: '#3FB872',
                      borderWidth: 2,
                      borderColor: surface.bg,
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...TYPE.ui,
                      fontSize: 15,
                      fontWeight: m.unread > 0 ? '700' : '600',
                      color: surface.text,
                      flexShrink: 1,
                    }}
                  >
                    {m.name}
                  </Text>
                  {m.belt && <BeltBar color={m.belt} stripes={m.stripes ?? 0} width={20} height={5} />}
                  {m.isGym && (
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
                <Text
                  numberOfLines={1}
                  style={{
                    ...TYPE.ui,
                    fontSize: 13,
                    color: m.unread > 0 ? surface.text : surface.textMuted,
                    fontWeight: m.unread > 0 ? '500' : '400',
                    marginTop: 2,
                  }}
                >
                  {m.last}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 11,
                    color: m.unread > 0 ? theme.accent : surface.textDim,
                    fontWeight: m.unread > 0 ? '600' : '400',
                  }}
                >
                  {m.time}
                </Text>
                {m.unread > 0 && (
                  <View
                    style={{
                      minWidth: 18,
                      height: 18,
                      paddingHorizontal: 5,
                      borderRadius: 9,
                      backgroundColor: theme.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: '#fff' }}>
                      {m.unread}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
