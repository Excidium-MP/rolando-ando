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
import { Icon } from '@/components/Icon';
import { TYPE } from '@/constants/theme';
import { CHAT_THREAD, MESSAGES } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const thread = MESSAGES.find((m) => m.id === id) ?? MESSAGES[0];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: surface.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 14,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: surface.bgElev,
          borderBottomWidth: 0.5,
          borderBottomColor: surface.border,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Icon.back size={22} color={surface.text} />
        </Pressable>
        <View>
          <Avatar src={thread.avatar} size={36} />
          {thread.online && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 11,
                height: 11,
                borderRadius: 5.5,
                backgroundColor: '#3FB872',
                borderWidth: 2,
                borderColor: surface.bgElev,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ ...TYPE.ui, fontSize: 15, fontWeight: '600', color: surface.text }}>
              {thread.name}
            </Text>
            {thread.belt && <BeltBar color={thread.belt} stripes={thread.stripes ?? 0} width={20} height={5} />}
          </View>
          <Text
            style={{
              ...TYPE.ui,
              fontSize: 11,
              color: thread.online ? '#3FB872' : surface.textDim,
            }}
          >
            {thread.online ? 'Active now' : 'Active 2h ago'}
          </Text>
        </View>
        <Icon.more size={22} color={surface.textMuted} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 16, gap: 8 }}
      >
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 11,
            color: surface.textDim,
            textAlign: 'center',
            marginBottom: 8,
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
                marginTop: grouped ? 0 : 4,
              }}
            >
              <View
                style={[
                  {
                    maxWidth: '78%',
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 18,
                  },
                  isMe
                    ? {
                        backgroundColor: theme.accent,
                        borderBottomRightRadius: groupedNext ? 18 : 4,
                        borderTopRightRadius: grouped ? 4 : 18,
                      }
                    : {
                        backgroundColor: surface.bgElev,
                        borderWidth: 0.5,
                        borderColor: surface.border,
                        borderBottomLeftRadius: groupedNext ? 18 : 4,
                        borderTopLeftRadius: grouped ? 4 : 18,
                      },
                ]}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 14,
                    lineHeight: 20,
                    color: isMe ? '#fff' : surface.text,
                  }}
                >
                  {m.text}
                </Text>
              </View>
            </View>
          );
        })}

        <View
          style={{
            marginVertical: 12,
            padding: 14,
            backgroundColor: theme.accentSoft,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: `${theme.accent}33`,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon.calendar size={16} color={theme.accent} />
            <Text
              style={{
                ...TYPE.ui,
                fontSize: 12,
                fontWeight: '600',
                color: theme.tag,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}
            >
              Suggested
            </Text>
          </View>
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, marginTop: 6 }}>
            Want to RSVP together to <Text style={{ fontWeight: '700' }}>Atos Saturday Open Mat</Text>?
          </Text>
          <Pressable
            style={{
              marginTop: 10,
              alignSelf: 'flex-start',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: theme.accent,
            }}
          >
            <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '600', color: '#fff' }}>RSVP both</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
          backgroundColor: surface.bgElev,
          borderTopWidth: 0.5,
          borderTopColor: surface.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: surface.chip,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.plus size={20} color={surface.textMuted} />
        </View>
        <View
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            backgroundColor: surface.chip,
            paddingHorizontal: 14,
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textDim }}>Message…</Text>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.send size={18} color="#fff" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
