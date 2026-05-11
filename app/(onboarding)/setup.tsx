import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthShell, ErrorBanner, Field, PrimaryButton } from '@/components/AuthForm';
import { DISCIPLINES } from '@/constants/disciplines';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/store/themeStore';
import type { Discipline } from '@/types/db';

const HANDLE_RE = /^[a-z0-9_]{3,30}$/;

export default function OnboardingSetup() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDiscipline = (value: Discipline) => {
    setDisciplines((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
  };

  const onSubmit = async () => {
    setError(null);

    const normalized = handle.trim().toLowerCase();
    if (!HANDLE_RE.test(normalized)) {
      setError('Handle must be 3-30 characters, lowercase letters, numbers, or underscores.');
      return;
    }
    if (!displayName.trim()) {
      setError('Add a display name so people know who you are on the mats.');
      return;
    }
    if (disciplines.length === 0) {
      setError('Pick at least one discipline you train. You can change this later.');
      return;
    }
    if (!user) {
      setError('Session expired. Please sign in again.');
      return;
    }

    setLoading(true);
    const { error: e } = await supabase
      .from('profiles')
      .update({
        handle: normalized,
        display_name: displayName.trim(),
        disciplines,
        is_onboarded: true,
      })
      .eq('id', user.id);
    setLoading(false);

    if (e) {
      // 23505 is Postgres unique_violation: handle is already taken.
      if ((e as { code?: string }).code === '23505') {
        setError(`The handle @${normalized} is taken. Try another.`);
        return;
      }
      setError(e.message);
      return;
    }

    // Refresh the cached profile so (onboarding)/_layout sees is_onboarded
    // and lets the redirect to '/' through.
    await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    router.replace('/');
  };

  return (
    <AuthShell
      surface={surface}
      title="Set up your profile"
      subtitle="A handle and the disciplines you train so other practitioners can find you."
    >
      {error ? <ErrorBanner surface={surface} message={error} /> : null}

      <Field
        surface={surface}
        label="Handle"
        value={handle}
        onChangeText={(t) => setHandle(t.toLowerCase())}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="e.g. mateo_bjj"
      />
      <Field
        surface={surface}
        label="Display name"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="e.g. Mateo Vargas"
      />

      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              ...TYPE.ui,
              fontSize: 11,
              color: surface.textDim,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            Disciplines you train
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 11, color: surface.textDim }}>
            Pick one or more
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {DISCIPLINES.map((d) => {
            const active = disciplines.includes(d.value);
            return (
              <Pressable
                key={d.value}
                onPress={() => toggleDiscipline(d.value)}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 0.5,
                  backgroundColor: active ? theme.accent : surface.bgElev,
                  borderColor: active ? theme.accent : surface.border,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text
                  style={{
                    ...TYPE.ui,
                    fontSize: 13,
                    fontWeight: '600',
                    color: active ? '#fff' : surface.text,
                  }}
                >
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <PrimaryButton theme={theme} label="Continue" onPress={onSubmit} loading={loading} />
      </View>
    </AuthShell>
  );
}
