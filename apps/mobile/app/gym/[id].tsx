import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisciplineBadge } from '@/components/DisciplineBadge';
import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { BlurButton } from '@/components/IconButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE } from '@/constants/theme';
import { googleMapsUrl, instagramUrl, useGymBySlug } from '@/hooks/useGyms';
import { useTheme } from '@/store/themeStore';

export default function GymDetailScreen() {
  // The route param is named `id` for historical reasons but we pass the
  // gym's slug as the value (cleaner URLs like /gym/breakers-mma-villa-crespo).
  const { id: slug } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const gymQuery = useGymBySlug(slug);
  const gym = gymQuery.data;

  if (gymQuery.isLoading) {
    return (
      <ScreenContainer bg={surface.bg} maxWidth={720}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.accent} />
        </View>
      </ScreenContainer>
    );
  }

  if (!gym) {
    return (
      <ScreenContainer bg={surface.bg} maxWidth={720}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            gap: 16,
          }}
        >
          <Text style={{ ...TYPE.display, fontSize: 22, color: surface.text }}>Gym not found</Text>
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted, textAlign: 'center' }}>
            We could not find a gym with the handle "{slug}".
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '700', color: theme.accent }}>
              Back
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const igUrl = instagramUrl(gym.instagram_handle);
  const mapsUrl = googleMapsUrl(gym);
  const fullAddress = [gym.address, gym.neighborhood, gym.city].filter(Boolean).join(', ');

  const openIG = () => {
    if (igUrl) Linking.openURL(igUrl).catch(() => {});
  };
  const openMaps = () => {
    if (mapsUrl) Linking.openURL(mapsUrl).catch(() => {});
  };

  return (
    <ScreenContainer bg={surface.bg} maxWidth={720}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ height: 240, position: 'relative' }}>
          <LinearGradient
            colors={[theme.accent, `${theme.accent}33`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.6)']}
            locations={[0, 0.4, 1]}
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
          </View>
          <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18 }}>
            {gym.affiliation && (
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {gym.affiliation}
              </Text>
            )}
            <Text
              style={{
                ...TYPE.display,
                fontSize: 32,
                color: '#fff',
                letterSpacing: -0.6,
                lineHeight: 36,
              }}
            >
              {gym.name}
            </Text>
            {gym.city && (
              <Text style={{ ...TYPE.ui, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
                {gym.city}
              </Text>
            )}
          </View>
        </View>

        {/* Tags */}
        {gym.primary_discipline && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', gap: 6 }}>
            <DisciplineBadge discipline={gym.primary_discipline} size="md" />
          </View>
        )}

        {/* Description */}
        {gym.description && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 21 }}>
              {gym.description}
            </Text>
          </View>
        )}

        {/* Action buttons (Instagram + Maps) */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {igUrl ? (
            <Pressable
              onPress={openIG}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                shadowColor: theme.accent,
                shadowOpacity: 0.4,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '700', color: '#fff' }}>
                @{gym.instagram_handle}
              </Text>
              <Text style={{ ...TYPE.ui, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                on Instagram
              </Text>
              {gym.instagram_followers != null && (
                <Text
                  style={{ ...TYPE.ui, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginLeft: 4 }}
                >
                  {formatFollowers(gym.instagram_followers)}
                </Text>
              )}
            </Pressable>
          ) : (
            <View
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: surface.borderStrong,
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textDim }}>
                No Instagram on file
              </Text>
            </View>
          )}
          {mapsUrl && (
            <Pressable
              onPress={openMaps}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: surface.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: surface.chip,
              }}
            >
              <Icon.map size={18} color={surface.text} />
            </Pressable>
          )}
        </View>

        {/* Address card */}
        {fullAddress && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <GlassCard surface={surface} radius={14}>
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 10,
                  color: surface.textDim,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Address
              </Text>
              <Pressable onPress={openMaps} disabled={!mapsUrl}>
                <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 20 }}>
                  {fullAddress}
                </Text>
              </Pressable>
            </GlassCard>
          </View>
        )}

        {/* Founded year + affiliation as a fact strip */}
        {(gym.founded_year || gym.affiliation) && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <GlassCard surface={surface} radius={14}>
              <View style={{ flexDirection: 'row' }}>
                {gym.founded_year && (
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...TYPE.display,
                        fontSize: 22,
                        color: surface.text,
                      }}
                    >
                      {gym.founded_year}
                    </Text>
                    <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim, marginTop: 2 }}>
                      Founded
                    </Text>
                  </View>
                )}
                {gym.affiliation && (
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ ...TYPE.ui, fontSize: 14, fontWeight: '700', color: surface.text }}
                      numberOfLines={1}
                    >
                      {gym.affiliation}
                    </Text>
                    <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim, marginTop: 2 }}>
                      Affiliation
                    </Text>
                  </View>
                )}
              </View>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
