import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { CHAT_THREAD, MESSAGES } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const thread = MESSAGES.find((m) => m.id === id) ?? MESSAGES[0];

  return (
    <ScreenContainer bg={surface.bg} maxWidth={620}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: surface.bg }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 12,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: surface.border,
          overflow: 'hidden',
        }}
      >
        <BlurView
          intensity={surface.glassIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: surface.bgGlass,
          }}
        />
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Icon.back size={20} color={surface.text} />
        </Pressable>
        <View>
          <Avatar src={thread.avatar} size={32} />
          {thread.online && (
            <View
              style={{
                position: 'absolute',
                bottom: -1,
                right: -1,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#22C55E',
                borderWidth: 2,
                borderColor: surface.bg,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '700', color: surface.text }}>
              {thread.name}
            </Text>
            {thread.belt && <BeltBar color={thread.belt} stripes={thread.stripes ?? 0} width={18} height={4} />}
          </View>
          <Text
            style={{
              ...TYPE.ui,
              fontSize: 10,
              color: thread.online ? '#22C55E' : surface.textDim,
            }}
          >
            {thread.online ? 'Active now' : 'Active 2h ago'}
          </Text>
        </View>
        <Icon.more size={18} color={surface.textMuted} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 14, gap: 6 }}
      >
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 10,
            color: surface.textDim,
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          Today, 11:30 AM
        </Text>
        {CHAT_THREAD.map((m, i) => {
          const isMe = m.from === 'me';
          const prev = CHAT_THREAD[i - 1];
          const next = CHAT_THREAD[i + 1];
          const grouped = prev && prev.from === m.from;
          const groupedNext = next && next.from === m.from;
          return (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginTop: grouped ? 0 : 3,
              }}
            >
              <View
                style={[
                  {
                    maxWidth: '78%',
                    paddingHorizontal: 13,
                    paddingVertical: 9,
                    borderRadius: 14,
                  },
                  isMe
                    ? {
                        backgroundColor: theme.accent,
                        borderBottomRightRadius: groupedNext ? 14 : 4,
                        borderTopRightRadius: grouped ? 4 : 14,
                      }
                    : {
                        backgroundColor: surface.bgElev,
                        borderWidth: 0.5,
                        borderColor: surface.borderGlass,
                        borderBottomLeftRadius: groupedNext ? 14 : 4,
                        borderTopLeftRadius: grouped ? 4 : 14,
                      },
                ]}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 13,
                    lineHeight: 18,
                    color: isMe ? '#fff' : surface.text,
                  }}
                >
                  {m.text}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ marginVertical: 10 }}>
          <GlassCard
            surface={surface}
            radius={14}
            style={{ backgroundColor: theme.tagBg, borderColor: `${theme.accent}33` }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon.calendar size={14} color={theme.accent} />
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 10,
                  fontWeight: '700',
                  color: theme.accent,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                Suggested
              </Text>
            </View>
            <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, marginTop: 5 }}>
              RSVP together to <Text style={{ fontWeight: '700' }}>Atos Saturday Open Mat</Text>?
            </Text>
            <Pressable
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 10,
                backgroundColor: theme.accent,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '700', color: '#fff' }}>RSVP both</Text>
            </Pressable>
          </GlassCard>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderTopWidth: 0.5,
          borderTopColor: surface.border,
          overflow: 'hidden',
        }}
      >
        <BlurView
          intensity={surface.glassIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: surface.bgGlass,
          }}
        />
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: surface.bgGlass,
            borderWidth: 0.5,
            borderColor: surface.borderGlass,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.plus size={18} color={surface.textMuted} />
        </View>
        <View
          style={{
            flex: 1,
            height: 34,
            borderRadius: 999,
            backgroundColor: surface.bgGlass,
            borderWidth: 0.5,
            borderColor: surface.borderGlass,
            paddingHorizontal: 14,
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textDim }}>Message...</Text>
        </View>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.send size={16} color="#fff" />
        </View>
      </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
