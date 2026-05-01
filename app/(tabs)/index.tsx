import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarStack } from '@/components/Avatar';
import { BeltBar } from '@/components/BeltBar';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';
import { FEED, ME, PEOPLE, type FeedPost, type OpenMat, type Gym, type Person } from '@/lib/mockData';
import { useTheme } from '@/store/themeStore';

export default function FeedScreen() {
  const { surface, theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: surface.bg }}>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: surface.border,
          backgroundColor: surface.bg,
        }}
      >
        <Text
          style={{
            ...TYPE.display,
            fontSize: 28,
            color: surface.text,
            lineHeight: 30,
            letterSpacing: -0.6,
          }}
        >
          Rolando Ando
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <IconButton surface={surface}>
            <Icon.search size={20} color={surface.text} />
          </IconButton>
          <IconButton surface={surface} badge={3}>
            <Icon.message size={20} color={surface.text} />
          </IconButton>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 4,
            gap: 12,
          }}
        >
          <NowRollingTile me surface={surface} theme={theme} />
          {PEOPLE.slice(0, 6).map((p) => (
            <NowRollingTile key={p.id} person={p} surface={surface} theme={theme} />
          ))}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            gap: 14,
          }}
        >
          {FEED.map((post) => (
            <FeedCard key={post.id} post={post} surface={surface} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </View>
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
  theme: BeltTheme;
}) {
  const p = me ? ME : person;
  if (!p) return null;
  return (
    <View style={{ alignItems: 'center', gap: 6, width: 64 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          padding: 2.5,
          backgroundColor: me ? surface.chip : theme.accent,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 32,
            padding: 2,
            backgroundColor: surface.bg,
          }}
        >
          <View style={{ flex: 1, borderRadius: 32, overflow: 'hidden' }}>
            <Image source={{ uri: p.avatar }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
          {me && (
            <View
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: theme.accent,
                borderWidth: 2,
                borderColor: surface.bg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon.plus size={12} color="#fff" />
            </View>
          )}
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...TYPE.ui,
          fontSize: 11,
          color: surface.textMuted,
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

function FeedCard({ post, surface, theme }: { post: FeedPost; surface: Surface; theme: BeltTheme }) {
  return (
    <View
      style={{
        backgroundColor: surface.bgElev,
        borderRadius: 18,
        borderWidth: 0.5,
        borderColor: surface.border,
        overflow: 'hidden',
      }}
    >
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
        <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 14 }}>
          <Text style={{ ...TYPE.ui, fontSize: 15, color: surface.text, lineHeight: 22 }}>
            {post.text}
          </Text>
        </View>
      )}

      {post.kind !== 'open-mat-event' && (
        <PostActions likes={post.likes} comments={post.comments} surface={surface} />
      )}
    </View>
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
  theme: BeltTheme;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 10,
      }}
    >
      <Avatar src={author.avatar} size={36} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ ...TYPE.ui, fontSize: 14, fontWeight: '600', color: surface.text }}>
            {author.name}
          </Text>
          {author.belt && <BeltBar color={author.belt} stripes={author.stripes ?? 0} width={22} height={6} />}
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
                  fontSize: 10,
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
        <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textDim, marginTop: 1 }}>
          {'gym' in author && author.gym ? `${author.gym} · ${time}` : time}
        </Text>
      </View>
      <View style={{ padding: 6 }}>
        <Icon.more size={18} color={surface.textDim} />
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
  theme: BeltTheme;
}) {
  const router = useRouter();
  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 21 }}>{text}</Text>
      </View>
      <Pressable
        onPress={() => router.push(`/openmat/${om.id}`)}
        style={{
          marginHorizontal: 14,
          marginBottom: 12,
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 0.5,
          borderColor: surface.border,
        }}
      >
        <View style={{ height: 140 }}>
          <Image
            source={{ uri: om.coverPhoto }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              alignItems: 'center',
              minWidth: 50,
            }}
          >
            <Text style={{ ...TYPE.ui, fontSize: 10, fontWeight: '600', color: theme.tag, letterSpacing: 0.5 }}>
              {om.day.toUpperCase()}
            </Text>
            <Text style={{ ...TYPE.display, fontSize: 22, color: '#1A1815', lineHeight: 22 }}>
              {om.date.split(' ')[1]}
            </Text>
          </View>
          {om.isToday && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: '#E8584C',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 11, fontWeight: '600', color: '#fff', letterSpacing: 0.3 }}>
                TODAY
              </Text>
            </View>
          )}
        </View>
        <View style={{ padding: 14, backgroundColor: surface.bgElev }}>
          <Text style={{ ...TYPE.ui, fontSize: 15, fontWeight: '600', color: surface.text }}>
            {om.title}
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted, marginTop: 2 }}>
            {om.time} · {om.style} · {om.level}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AvatarStack
                avatars={om.going.map((p) => ({ src: p.avatar }))}
                size={22}
                max={3}
                ringColor={surface.bgElev}
              />
              <Text style={{ ...TYPE.ui, fontSize: 12, color: surface.textMuted }}>
                {om.goingCount} going
              </Text>
            </View>
            <View
              style={{
                backgroundColor: theme.accent,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
              }}
            >
              <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '600', color: '#fff' }}>Going</Text>
            </View>
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
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 21 }}>{text}</Text>
      </View>
      <View style={{ aspectRatio: 4 / 5, marginBottom: 4 }}>
        <Image
          source={{ uri: video.thumb }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -28,
            marginTop: -28,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.92)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.play size={22} color="#1A1815" />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 11, fontWeight: '500' }}>
            {video.duration}
          </Text>
        </View>
        {tags && tags.length > 0 && (
          <View style={{ position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 6 }}>
            {tags.map((t) => (
              <View
                key={t}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 11, fontWeight: '500' }}>
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
  theme: BeltTheme;
}) {
  const router = useRouter();
  return (
    <>
      <Pressable
        onPress={() => router.push(`/gym/${gym.id}`)}
        style={{
          paddingHorizontal: 14,
          paddingBottom: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Icon.pinFill size={13} color={theme.accent} />
        <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted }}>
          at <Text style={{ color: surface.text, fontWeight: '600' }}>{gym.name}</Text> · {gym.location}
        </Text>
      </Pressable>
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.text, lineHeight: 21 }}>{text}</Text>
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
    <View style={{ paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
      <ActionButton surface={surface} icon={<Icon.heart size={20} color={surface.textMuted} />} count={likes} />
      <ActionButton surface={surface} icon={<Icon.comment size={20} color={surface.textMuted} />} count={comments} />
      <ActionButton surface={surface} icon={<Icon.share size={20} color={surface.textMuted} />} />
      <View style={{ flex: 1 }} />
      <ActionButton surface={surface} icon={<Icon.bookmark size={20} color={surface.textMuted} />} />
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {icon}
      {count !== undefined && (
        <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '500', color: surface.textMuted }}>
          {count}
        </Text>
      )}
    </View>
  );
}
