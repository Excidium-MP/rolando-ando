import type { Discipline, Gym } from '@mma-finder/db';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisciplineBadge } from '@/components/DisciplineBadge';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { useGyms } from '@/hooks/useGyms';
import { useTheme } from '@/store/themeStore';

// Filters surface the disciplines we actually have gyms for in the DB. Adding
// or removing filters here is purely cosmetic; the WHERE clause is built from
// the active value via useGyms({ discipline }).
const FILTERS: { value: Discipline | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'mma', label: 'MMA' },
  { value: 'bjj', label: 'BJJ' },
  { value: 'muay_thai', label: 'Muay Thai' },
  { value: 'boxing', label: 'Boxing' },
];

export default function DiscoverScreen() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [search, setSearch] = useState('');

  const gymsQuery = useGyms({ discipline, search });
  const gyms = gymsQuery.data ?? [];

  return (
    <ScreenContainer bg={surface.bg} maxWidth={720}>
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 16,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={{ ...TYPE.display, fontSize: 26, color: surface.text, letterSpacing: -0.5 }}>
            Discover
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textDim }}>
            {gymsQuery.isLoading ? 'Loading...' : `${gyms.length} gyms`}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: surface.chip,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: surface.borderStrong,
          }}
        >
          <Icon.search size={16} color={surface.textDim} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Gyms, cities, affiliations"
            placeholderTextColor={surface.textDim}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              ...TYPE.ui,
              flex: 1,
              fontSize: 14,
              color: surface.text,
              minHeight: 24,
            }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {FILTERS.map((f) => {
            const active = discipline === f.value;
            return (
              <Pressable
                key={f.label}
                onPress={() => setDiscipline(f.value)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: active ? theme.accent : surface.bgGlass,
                  borderWidth: 0.5,
                  borderColor: active ? theme.accent : surface.borderGlass,
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 12,
                    fontWeight: '600',
                    color: active ? '#fff' : surface.textMuted,
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {gymsQuery.isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : gyms.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <GlassCard surface={surface} padding={20} radius={14} style={{ alignItems: 'center' }}>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted, textAlign: 'center' }}>
              No gyms match. Try a different filter or search.
            </Text>
          </GlassCard>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {gyms.map((g) => (
            <GymRow
              key={g.id}
              gym={g}
              onPress={() => router.push(`/gym/${g.slug}`)}
            />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

function GymRow({ gym, onPress }: { gym: Gym; onPress: () => void }) {
  const { surface, theme } = useTheme();
  const initial = gym.name.charAt(0).toUpperCase();
  const subtitle = [gym.affiliation, gym.city].filter(Boolean).join(' · ');

  return (
    <GlassCard surface={surface} padding={12} radius={14} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: theme.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...TYPE.display, fontSize: 22, color: '#fff' }}>{initial}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{ ...TYPE.ui, fontSize: 15, fontWeight: '700', color: surface.text }}
          >
            {gym.name}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 2 }}
            >
              {subtitle}
            </Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            {gym.primary_discipline && (
              <DisciplineBadge discipline={gym.primary_discipline} />
            )}
            {gym.instagram_followers != null && (
              <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>
                {formatFollowers(gym.instagram_followers)} on IG
              </Text>
            )}
          </View>
        </View>
        <Icon.forward size={14} color={surface.textDim} />
      </View>
    </GlassCard>
  );
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
