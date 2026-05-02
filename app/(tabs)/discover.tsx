import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { GlassCard } from '@/components/GlassCard';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TYPE, type Surface, type Theme } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { GYMS, type Gym } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const FILTERS = [
  { k: 'all', l: 'All' },
  { k: 'open', l: 'Open today' },
  { k: 'bjj', l: 'BJJ' },
  { k: 'mma', l: 'MMA' },
  { k: 'boxing', l: 'Boxing' },
] as const;

const DESKTOP_FILTERS = [
  { k: 'all', l: 'All' },
  { k: 'bjj', l: 'BJJ' },
  { k: 'mma', l: 'MMA' },
  { k: 'boxing', l: 'Boxing' },
] as const;

const PIN_POSITIONS: { id: Gym['id']; x: number; y: number }[] = [
  { id: 'atos', x: 32, y: 58 },
  { id: 'gb-austin', x: 70, y: 28 },
  { id: 'unity', x: 55, y: 72 },
  { id: '10p', x: 18, y: 36 },
  { id: 'aoj', x: 80, y: 50 },
];

const SIDE_PANEL_WIDTH = 340;
const IS_WEB = Platform.OS === 'web';

export default function DiscoverScreen() {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'desktop' && IS_WEB) {
    return <DesktopDiscover />;
  }
  return <PhoneDiscover />;
}

// ─────────────────────────────────────────────────────────────
// PHONE / NATIVE: floating cards over fake map
// ─────────────────────────────────────────────────────────────

function PhoneDiscover() {
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Gym>(GYMS[0]);
  const [filter, setFilter] = useState<string>('all');

  return (
    <ScreenContainer bg={surface.bg} fullBleed>
      <FakeMap dark={isDark} theme={theme} selected={selected} onSelect={setSelected} />

      <View style={{ position: 'absolute', top: insets.top + 8, left: 12, right: 12 }}>
        <GlassCard surface={surface} isDark={isDark} blur padding={0} radius={14}>
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon.search size={16} color={surface.textDim} />
            <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textDim, flex: 1 }}>
              Gyms, disciplines, affiliations
            </Text>
            <View
              style={{
                backgroundColor: theme.accent,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.4 }}>
                MAP
              </Text>
            </View>
          </View>
        </GlassCard>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingTop: 8 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.k;
            return (
              <Pressable
                key={f.k}
                onPress={() => setFilter(f.k)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: active ? theme.accent : surface.bgGlass,
                  borderWidth: 0.5,
                  borderColor: active ? theme.accent : surface.borderGlass,
                  overflow: 'hidden',
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 11,
                    fontWeight: '600',
                    color: active ? '#fff' : surface.textMuted,
                  }}
                >
                  {f.l}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ position: 'absolute', bottom: 96, left: 0, right: 0 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={282}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 8, gap: 10 }}
        >
          {GYMS.map((g) => (
            <PhoneGymCard
              key={g.id}
              gym={g}
              surface={surface}
              theme={theme}
              isDark={isDark}
              isSelected={selected.id === g.id}
              onPress={() => {
                setSelected(g);
                router.push(`/gym/${g.id}`);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function PhoneGymCard({
  gym,
  surface,
  theme,
  isDark,
  isSelected,
  onPress,
}: {
  gym: Gym;
  surface: Surface;
  theme: Theme;
  isDark: boolean;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <GlassCard
      surface={surface}
      isDark={isDark}
      blur
      padding={0}
      radius={14}
      onPress={onPress}
      style={{
        width: 270,
        borderColor: isSelected ? theme.accent : surface.borderGlass,
        borderWidth: isSelected ? 1 : 0.5,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 10, padding: 10 }}>
        <Image
          source={{ uri: gym.cover }}
          style={{ width: 72, height: 72, borderRadius: 10 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon.star size={11} color="#E8A84C" />
            <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '700', color: surface.text }}>
              {gym.rating}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>· {gym.distance}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={{ ...TYPE.ui, fontSize: 14, fontWeight: '700', color: surface.text, marginTop: 2 }}
          >
            {gym.name}
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginTop: 1 }}>
            {gym.affiliation}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: gym.openMatsThisWeek > 0 ? '#22C55E' : '#555',
              }}
            />
            <Text style={{ ...TYPE.ui, fontSize: 10, color: surface.textDim }}>
              Next: {gym.nextOpenMat}
            </Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP WEB: top bar + split map/side-panel
// ─────────────────────────────────────────────────────────────

function DesktopDiscover() {
  const { surface, theme, isDark } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<Gym>(GYMS[0]);
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <ScreenContainer bg={surface.bg} fullBleed>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: surface.border,
            flexShrink: 0,
          }}
        >
          <Text
            style={{
              ...TYPE.display,
              fontSize: 22,
              color: surface.text,
              letterSpacing: -0.4,
              marginRight: 8,
            }}
          >
            Discover
          </Text>
          <View style={{ flex: 1, maxWidth: 400 }}>
            <GlassCard surface={surface} padding={0} radius={10}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon.search size={15} color={surface.textDim} />
                <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textDim }}>
                  Gyms, disciplines, affiliations
                </Text>
              </View>
            </GlassCard>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {DESKTOP_FILTERS.map((f) => {
              const active = filter === f.k;
              return (
                <Pressable
                  key={f.k}
                  onPress={() => setFilter(f.k)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: active ? theme.accent : surface.chip,
                  }}
                >
                  <Text
                    style={{
                      ...TYPE.ui,
                      fontSize: 11,
                      fontWeight: '600',
                      color: active ? '#fff' : surface.textMuted,
                    }}
                  >
                    {f.l}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <GlassCard surface={surface} padding={0} radius={8} style={{ flexDirection: 'row', padding: 2 }}>
            {(['map', 'list'] as const).map((v) => (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  backgroundColor: view === v ? theme.accent : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 11,
                    fontWeight: '600',
                    color: view === v ? '#fff' : surface.textMuted,
                    textTransform: 'capitalize',
                  }}
                >
                  {v}
                </Text>
              </Pressable>
            ))}
          </GlassCard>
        </View>

        {view === 'map' ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, position: 'relative' }}>
              <FakeMap dark={isDark} theme={theme} selected={selected} onSelect={setSelected} />
            </View>
            <ScrollView
              style={{
                width: SIDE_PANEL_WIDTH,
                borderLeftWidth: 0.5,
                borderLeftColor: surface.border,
              }}
              contentContainerStyle={{ padding: 16, gap: 10 }}
            >
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  color: surface.textDim,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {GYMS.length} gyms nearby
              </Text>
              {GYMS.map((g) => (
                <DesktopGymCard
                  key={g.id}
                  gym={g}
                  surface={surface}
                  theme={theme}
                  selected={selected.id === g.id}
                  onPress={() => {
                    setSelected(g);
                    router.push(`/gym/${g.id}`);
                  }}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              {GYMS.map((g) => (
                <View key={g.id} style={{ width: 320, flexGrow: 1, maxWidth: 420 }}>
                  <DesktopGymCard
                    gym={g}
                    surface={surface}
                    theme={theme}
                    selected={false}
                    onPress={() => router.push(`/gym/${g.id}`)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}

function DesktopGymCard({
  gym,
  surface,
  theme,
  selected,
  onPress,
}: {
  gym: Gym;
  surface: Surface;
  theme: Theme;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <GlassCard
      surface={surface}
      padding={0}
      radius={14}
      onPress={onPress}
      style={{
        borderWidth: selected ? 1 : 0.5,
        borderColor: selected ? theme.accent : surface.borderGlass,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
        <Image
          source={{ uri: gym.cover }}
          style={{ width: 80, height: 80, borderRadius: 10 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon.star size={12} color="#E8A84C" />
            <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: surface.text }}>
              {gym.rating}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>
              ({gym.reviewCount}) · {gym.distance}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{ ...TYPE.ui, fontSize: 15, fontWeight: '700', color: surface.text, marginTop: 3 }}
          >
            {gym.name}
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted, marginTop: 1 }}>
            {gym.affiliation} · {gym.location}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: gym.openMatsThisWeek > 0 ? '#22C55E' : '#555',
              }}
            />
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>
              Next: {gym.nextOpenMat}
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>
              · ${gym.dropIn} drop-in
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
            {gym.style.map((st) => (
              <View
                key={st}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: theme.tagBg,
                }}
              >
                <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '600', color: theme.accent }}>
                  {st}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// FAKE MAP (shared)
// ─────────────────────────────────────────────────────────────

function FakeMap({
  dark,
  theme,
  selected,
  onSelect,
}: {
  dark: boolean;
  theme: Theme;
  selected: Gym;
  onSelect: (g: Gym) => void;
}) {
  const land = dark ? '#111110' : '#F1ECDF';
  const street = dark ? '#1A1918' : '#FAF8F3';
  const streetMajor = dark ? '#222120' : '#FFFFFF';
  const water = dark ? '#0A1218' : '#C8DAE0';
  const park = dark ? '#0E150D' : '#D8E2C8';
  const labelColor = dark ? '#3A3833' : '#9A958A';

  return (
    <Svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Rect width={100} height={100} fill={land} />
      <Path d="M 0 80 Q 30 75 50 82 T 100 78 L 100 100 L 0 100 Z" fill={water} opacity={0.7} />
      <Path d="M 70 0 L 100 0 L 100 30 Q 80 25 70 0 Z" fill={water} opacity={0.6} />
      <Rect x={40} y={15} width={14} height={10} rx={1} fill={park} opacity={0.8} />
      <Rect x={10} y={60} width={12} height={14} rx={1} fill={park} opacity={0.8} />

      {[15, 25, 35, 45, 55, 65, 75, 85].map((y) => (
        <Line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke={street} strokeWidth={0.5} />
      ))}
      {[12, 22, 32, 42, 52, 62, 72, 82].map((x) => (
        <Line key={`v${x}`} x1={x} y1={0} x2={x} y2={100} stroke={street} strokeWidth={0.5} />
      ))}

      <Line x1={0} y1={50} x2={100} y2={50} stroke={streetMajor} strokeWidth={1.2} />
      <Line x1={42} y1={0} x2={42} y2={100} stroke={streetMajor} strokeWidth={1.2} />
      <Path d="M 0 30 Q 35 38 60 28 T 100 22" fill="none" stroke={streetMajor} strokeWidth={1} />

      <SvgText x={50} y={40} fill={labelColor} fontSize={2.4} textAnchor="middle">
        DOWNTOWN
      </SvgText>
      <SvgText x={85} y={78} fill={labelColor} fontSize={2.2} textAnchor="middle">
        BAY
      </SvgText>

      {PIN_POSITIONS.map((p) => {
        const gym = GYMS.find((g) => g.id === p.id);
        if (!gym) return null;
        const isSel = selected.id === p.id;
        return (
          <React.Fragment key={p.id}>
            <Circle cx={p.x} cy={p.y + 1.5} r={isSel ? 1.5 : 1} fill="rgba(0,0,0,0.3)" onPress={() => onSelect(gym)} />
            {isSel && (
              <Circle cx={p.x} cy={p.y} r={7} fill={theme.accent} opacity={0.15} onPress={() => onSelect(gym)} />
            )}
            <Circle cx={p.x} cy={p.y} r={isSel ? 4 : 2.8} fill={theme.accent} onPress={() => onSelect(gym)} />
            <Circle cx={p.x} cy={p.y} r={isSel ? 1.6 : 1} fill="#fff" onPress={() => onSelect(gym)} />
          </React.Fragment>
        );
      })}

      <Circle cx={42} cy={50} r={5} fill="#3B82F6" opacity={0.12} />
      <Circle cx={42} cy={50} r={2} fill="#3B82F6" />
      <Circle cx={42} cy={50} r={0.7} fill="#fff" />
    </Svg>
  );
}
