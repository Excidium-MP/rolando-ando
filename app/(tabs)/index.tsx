import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { GlassCard } from '@/components/GlassCard';
import { GlassIconBtn } from '@/components/GlassIconBtn';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Wordmark } from '@/components/Wordmark';
import { TYPE, type Surface, type Theme } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { FEED, ME, PEOPLE, type FeedPost, type Gym, type OpenMat, type Person } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

const IS_WEB = Platform.OS === 'web';

const DISCIPLINE_FILTERS = ['All', 'BJJ', 'MMA', 'Boxing', 'Muay Thai', 'Wrestling'];

export default function FeedScreen() {
  const { surface, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';
  const [activeFilter, setActiveFilter] = React.useState('All');

  // Web (any width): sticky in-flow header with solid bg per the v2 web design.
  // Native: keep the absolute-positioned glass header from the mobile v2 build.
  const renderWebHeader = () => (
    <View
      style={{
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: surface.border,
        backgroundColor: surface.bg,
        ...({ position: 'sticky', top: 0, zIndex: 10 } as ViewStyle),
      }}
    >
      {isDesktop ? (
        <Text style={{ ...TYPE.display, fontSize: 22, color: surface.text, letterSpacing: -0.4 }}>
          Feed
        </Text>
      ) : (
        <Wordmark color={surface.text} accent={theme.accent} size={24} />
      )}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <GlassIconBtn surface={surface} isDark={isDark}>
          <Icon.search size={18} color={surface.text} />
        </GlassIconBtn>
        <GlassIconBtn surface={surface} isDark={isDark} badge={3}>
          <Icon.bell size={18} color={surface.text} />
        </GlassIconBtn>
      </View>
    </View>
  );

  const renderNativeHeader = () => (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
      <Wordmark color={surface.text} accent={theme.accent} size={26} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <GlassIconBtn surface={surface} isDark={isDark}>
          <Icon.search size={18} color={surface.text} />
        </GlassIconBtn>
        <GlassIconBtn surface={surface} isDark={isDark} badge={3}>
          <Icon.bell size={18} color={surface.text} />
        </GlassIconBtn>
      </View>
    </View>
  );

  return (
    <ScreenContainer bg={surface.bg} maxWidth={620}>
      {!IS_WEB && renderNativeHeader()}

      <ScrollView
        contentContainerStyle={{
          paddingTop: IS_WEB ? 0 : insets.top + 64,
          paddingBottom: 130,
        }}
        showsVerticalScrollIndicator={false}
      >
        {IS_WEB && renderWebHeader()}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 4,
            gap: 6,
          }}
        >
          {DISCIPLINE_FILTERS.map((d) => {
            const active = d === activeFilter;
            return (
              <Pressable
                key={d}
                onPress={() => setActiveFilter(d)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
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
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 6,
            gap: 12,
          }}
        >
          <NowRollingTile me surface={surface} theme={theme} />
          {PEOPLE.slice(0, 8).map((p) => (
            <NowRollingTile key={p.id} person={p} surface={surface} theme={theme} />
          ))}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 8,
            gap: 12,
          }}
        >
          {FEED.map((post) => (
            <FeedCard key={post.id} post={post} surface={surface} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function NowRollingTile({
  me,
  person,
  surface,
  theme,
}: {
  me?: boolean;
  person?: Person;
  surface: Surface;
  theme: Theme;
}) {
  const p = me ? ME : person;
  if (!p) return null;
  return (
    <View style={{ alignItems: 'center', gap: 5, width: 62 }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          padding: 2,
          backgroundColor: me ? surface.borderGlass : 'transparent',
        }}
      >
        {!me && (
          <LinearGradient
            colors={[theme.accent, `${theme.accent}66`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
          />
        )}
        <View
          style={{
            flex: 1,
            borderRadius: 14,
            padding: 1.5,
            backgroundColor: surface.bg,
          }}
        >
          <View style={{ flex: 1, borderRadius: 12.5, overflow: 'hidden' }}>
            <Image source={{ uri: p.avatar }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
          {me && (
            <View
              style={{
                position: 'absolute',
                bottom: -3,
                right: -3,
                width: 20,
                height: 20,
                borderRadius: 7,
                backgroundColor: theme.accent,
                borderWidth: 2,
                borderColor: surface.bg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon.plus size={10} color="#fff" />
            </View>
          )}
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...TYPE.ui,
          fontSize: 10,
          color: surface.textDim,
          fontWeight: '500',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {me ? 'You' : p.name.split(' ')[0]}
      </Text>
    </View>
  );
}

function FeedCard({ post, surface, theme }: { post: FeedPost; surface: Surface; theme: Theme }) {
  return (
    <GlassCard surface={surface} padding={0} radius={16}>
      <PostHeader author={post.author} time={post.time} surface={surface} theme={theme} />

      {post.kind === 'open-mat-event' && (
        <OpenMatPostBody om={post.openMat} text={post.text} surface={surface} theme={theme} />
      )}
      {post.kind === 'video-share' && (
        <VideoPostBody video={post.video} text={post.text} tags={post.tags} surface={surface} />
      )}
      {post.kind === 'gym-checkin' && (
        <CheckinPostBody photo={post.photo} text={post.text} gym={post.gym} surface={surface} theme={theme} />
      )}
      {post.kind === 'text-post' && (
        <View style={{ paddingHorizontal: 14, paddingTop: 4, paddingBottom: 14 }}>
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 22 }}>
            {post.text}
          </Text>
        </View>
      )}

      {post.kind !== 'open-mat-event' && (
        <PostActions likes={post.likes} comments={post.comments} surface={surface} />
      )}
    </GlassCard>
  );
}

function PostHeader({
  author,
  time,
  surface,
  theme,
}: {
  author: FeedPost['author'];
  time: string;
  surface: Surface;
  theme: Theme;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
      }}
    >
      <Avatar src={author.avatar} size={34} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: surface.text }}>
            {author.name}
          </Text>
          {author.belt && <BeltBar color={author.belt} stripes={author.stripes ?? 0} width={20} height={5} />}
          {author.isGym && (
            <View
              style={{
                backgroundColor: theme.tagBg,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 9,
                  fontWeight: '700',
                  color: theme.tag,
                  letterSpacing: 0.5,
                }}
              >
                GYM
              </Text>
            </View>
          )}
        </View>
        <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim, marginTop: 1 }}>
          {'gym' in author && author.gym ? `${author.gym} · ${time}` : time}
        </Text>
      </View>
      <View style={{ padding: 4 }}>
        <Icon.more size={16} color={surface.textDim} />
      </View>
    </View>
  );
}

function OpenMatPostBody({
  om,
  text,
  surface,
  theme,
}: {
  om: OpenMat;
  text: string;
  surface: Surface;
  theme: Theme;
}) {
  const router = useRouter();
  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
        <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, lineHeight: 20 }}>{text}</Text>
      </View>
      <Pressable
        onPress={() => router.push(`/openmat/${om.id}`)}
        style={{
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <View style={{ height: 150 }}>
          <Image source={{ uri: om.coverPhoto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            locations={[0.3, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {om.isToday && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: '#E8453A',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 999,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}>
                LIVE TODAY
              </Text>
            </View>
          )}
          <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
            <Text style={{ ...TYPE.display, fontSize: 17, color: '#fff', lineHeight: 20 }}>{om.title}</Text>
            <Text style={{ ...TYPE.ui, fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
              {om.time} · {om.style} · {om.level}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            backgroundColor: surface.bgElev,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <AvatarStack
              avatars={om.going.map((p) => ({ src: p.avatar }))}
              size={20}
              max={3}
              ringColor={surface.bg}
            />
            <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textMuted, fontWeight: '500' }}>
              {om.goingCount} going
            </Text>
          </View>
          <View
            style={{
              backgroundColor: theme.accent,
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: 999,
            }}
          >
            <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '700', color: '#fff' }}>Going</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

function VideoPostBody({
  video,
  text,
  tags,
  surface,
}: {
  video: { thumb: string; duration: string };
  text: string;
  tags?: string[];
  surface: Surface;
}) {
  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
        <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, lineHeight: 20 }}>{text}</Text>
      </View>
      <View style={{ aspectRatio: 4 / 5, marginBottom: 2 }}>
        <Image source={{ uri: video.thumb }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'transparent', 'rgba(0,0,0,0.5)']}
          locations={[0, 0.25, 0.75, 1]}
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
            borderColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Icon.play size={22} color="#fff" />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 11, fontWeight: '600' }}>
            {video.duration}
          </Text>
        </View>
        {tags && tags.length > 0 && (
          <View style={{ position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', gap: 5 }}>
            {tags.map((t) => (
              <View
                key={t}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderWidth: 0.5,
                  borderColor: 'rgba(255,255,255,0.18)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 10, fontWeight: '600' }}>
                  #{t}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
}

function CheckinPostBody({
  photo,
  text,
  gym,
  surface,
  theme,
}: {
  photo: string;
  text: string;
  gym: Gym;
  surface: Surface;
  theme: Theme;
}) {
  const router = useRouter();
  return (
    <>
      <Pressable
        onPress={() => router.push(`/gym/${gym.id}`)}
        style={{
          paddingHorizontal: 14,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Icon.pinFill size={12} color={theme.accent} />
        <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted }}>
          at <Text style={{ color: surface.text, fontWeight: '600' }}>{gym.name}</Text>
        </Text>
      </Pressable>
      <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
        <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, lineHeight: 20 }}>{text}</Text>
      </View>
      <View style={{ aspectRatio: 4 / 3 }}>
        <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </View>
    </>
  );
}

function PostActions({
  likes,
  comments,
  surface,
}: {
  likes?: number;
  comments?: number;
  surface: Surface;
}) {
  return (
    <View style={{ paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <ActionButton surface={surface} icon={<Icon.heart size={18} color={surface.textDim} />} count={likes} />
      <ActionButton surface={surface} icon={<Icon.comment size={18} color={surface.textDim} />} count={comments} />
      <ActionButton surface={surface} icon={<Icon.share size={18} color={surface.textDim} />} />
      <View style={{ flex: 1 }} />
      <ActionButton surface={surface} icon={<Icon.bookmark size={18} color={surface.textDim} />} />
    </View>
  );
}

function ActionButton({
  surface,
  icon,
  count,
}: {
  surface: Surface;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {icon}
      {count !== undefined && (
        <Text style={{ ...TYPE.ui, fontSize: 12, fontWeight: '600', color: surface.textDim }}>
          {count}
        </Text>
      )}
    </View>
  );
}
