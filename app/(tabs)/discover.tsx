import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';
import { GYMS, type Gym } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const FILTERS = [
  { k: 'all', l: 'All' },
  { k: 'open', l: 'Open mats today' },
  { k: 'gi', l: 'Gi' },
  { k: 'nogi', l: 'No-Gi' },
  { k: 'visited', l: 'Visited' },
] as const;

const PIN_POSITIONS: { id: Gym['id']; x: number; y: number }[] = [
  { id: 'atos', x: 32, y: 58 },
  { id: 'gb-austin', x: 70, y: 28 },
  { id: 'unity', x: 55, y: 72 },
  { id: '10p', x: 18, y: 36 },
  { id: 'aoj', x: 80, y: 50 },
];

export default function DiscoverScreen() {
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Gym>(GYMS[0]);
  const [filter, setFilter] = useState<string>('all');

  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <FakeMap dark={isDark} theme={theme} selected={selected} onSelect={setSelected} />

      <View style={{ position: 'absolute', top: insets.top + 10, left: 14, right: 14 }}>
        <View
          style={{
            backgroundColor: surface.bgElev,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: surface.border,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Icon.search size={18} color={surface.textDim} />
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textDim, flex: 1 }}>
            Search gyms or affiliations
          </Text>
          <View
            style={{
              backgroundColor: theme.tagBg,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: theme.tag }}>Map</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingTop: 10 }}
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
                  backgroundColor: active ? theme.accent : surface.bgElev,
                  borderWidth: 0.5,
                  borderColor: active ? theme.accent : surface.border,
                }}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 12,
                    fontWeight: '500',
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

      <View style={{ position: 'absolute', bottom: 110, left: 0, right: 0 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={292}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 12 }}
        >
          {GYMS.map((g) => (
            <GymCard
              key={g.id}
              gym={g}
              surface={surface}
              theme={theme}
              isSelected={selected.id === g.id}
              onPress={() => {
                setSelected(g);
                router.push(`/gym/${g.id}`);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function GymCard({
  gym,
  surface,
  theme,
  isSelected,
  onPress,
}: {
  gym: Gym;
  surface: Surface;
  theme: BeltTheme;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 280,
        backgroundColor: surface.bgElev,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: isSelected ? theme.accent : surface.border,
        flexDirection: 'row',
        gap: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Image
        source={{ uri: gym.cover }}
        style={{ width: 76, height: 76, borderRadius: 12 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 1 }}>
          <Icon.star size={11} color="#E8A84C" />
          <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: surface.text }}>
            {gym.rating}
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>· {gym.distance}</Text>
        </View>
        <Text
          numberOfLines={1}
          style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}
        >
          {gym.name}
        </Text>
        <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, marginBottom: 6 }}>
          {gym.affiliation}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: gym.openMatsThisWeek > 0 ? '#3FB872' : '#9A958A',
            }}
          />
          <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted }}>
            Next: {gym.nextOpenMat}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function FakeMap({
  dark,
  theme,
  selected,
  onSelect,
}: {
  dark: boolean;
  theme: BeltTheme;
  selected: Gym;
  onSelect: (g: Gym) => void;
}) {
  const land = dark ? '#1F1D17' : '#F1ECDF';
  const street = dark ? '#28251E' : '#FAF8F3';
  const streetMajor = dark ? '#3A3528' : '#FFFFFF';
  const water = dark ? '#1A2530' : '#C8DAE0';
  const park = dark ? '#1B2218' : '#D8E2C8';
  const labelColor = dark ? '#6B665C' : '#9A958A';

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
        <Line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke={street} strokeWidth={0.6} />
      ))}
      {[12, 22, 32, 42, 52, 62, 72, 82].map((x) => (
        <Line key={`v${x}`} x1={x} y1={0} x2={x} y2={100} stroke={street} strokeWidth={0.6} />
      ))}

      <Line x1={0} y1={50} x2={100} y2={50} stroke={streetMajor} strokeWidth={1.4} />
      <Line x1={42} y1={0} x2={42} y2={100} stroke={streetMajor} strokeWidth={1.4} />
      <Path d="M 0 30 Q 35 38 60 28 T 100 22" fill="none" stroke={streetMajor} strokeWidth={1.2} />

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
            <Circle cx={p.x} cy={p.y + 2} r={isSel ? 1.6 : 1.2} fill="rgba(0,0,0,0.25)" onPress={() => onSelect(gym)} />
            <Circle cx={p.x} cy={p.y} r={isSel ? 4.5 : 3.2} fill={theme.accent} onPress={() => onSelect(gym)} />
            <Circle cx={p.x} cy={p.y} r={isSel ? 1.8 : 1.3} fill="#fff" onPress={() => onSelect(gym)} />
            {isSel && (
              <Circle cx={p.x} cy={p.y} r={6.5} fill="none" stroke={theme.accent} strokeWidth={0.5} opacity={0.4} />
            )}
          </React.Fragment>
        );
      })}

      <Circle cx={42} cy={50} r={5} fill="#1E5BA8" opacity={0.15} />
      <Circle cx={42} cy={50} r={2} fill="#1E5BA8" />
      <Circle cx={42} cy={50} r={0.8} fill="#fff" />
    </Svg>
  );
}
