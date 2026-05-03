import type { Discipline, ProfileUpdate } from '@mma-finder/db';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field } from '@/components/Field';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Wordmark } from '@/components/Wordmark';
import { TYPE } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/store/themeStore';

// Discipline values match the public.discipline enum exactly. Display labels
// and accents are local to onboarding so the picker stays one file.
const DISCIPLINES: { value: Discipline; label: string; accent: string }[] = [
  { value: 'bjj', label: 'BJJ', accent: '#1E5BA8' },
  { value: 'mma', label: 'MMA', accent: '#C44A4A' },
  { value: 'muay_thai', label: 'Muay Thai', accent: '#E85C3A' },
  { value: 'boxing', label: 'Boxing', accent: '#D4A843' },
  { value: 'wrestling', label: 'Wrestling', accent: '#3A8C5B' },
  { value: 'kickboxing', label: 'Kickboxing', accent: '#D97035' },
  { value: 'gi', label: 'Gi', accent: '#1E5BA8' },
  { value: 'no_gi', label: 'No-Gi', accent: '#5B3A8C' },
];

const HANDLE_RE = /^[a-z0-9_]{3,30}$/;

export default function OnboardingSetupScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [primaryDiscipline, setPrimaryDiscipline] = useState<Discipline | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setError(null);
    if (!user) return setError('Not signed in.');
    if (!HANDLE_RE.test(handle))
      return setError('Handle must be 3-30 lowercase letters, numbers, or underscores.');
    if (displayName.trim().length < 1)
      return setError('Add a display name.');
    if (!primaryDiscipline) return setError('Pick a primary discipline.');

    setSubmitting(true);
    const update: ProfileUpdate = {
      handle: handle.trim().toLowerCase(),
      display_name: displayName.trim(),
      primary_discipline: primaryDiscipline,
    };
    const { error: updateError } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);
    setSubmitting(false);

    if (updateError) {
      // Most likely cause: handle uniqueness violation.
      if (updateError.code === '23505') {
        setError('That handle is taken. Try another.');
      } else {
        setError(updateError.message);
      }
      return;
    }

    // Refresh the profile cache so the root redirect logic reads the new handle.
    await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: surface.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 28 }}>
            <Wordmark color={surface.text} accent={theme.accent} size={28} />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ ...TYPE.display, fontSize: 28, color: surface.text, marginBottom: 6 }}>
              Set up your profile
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted }}>
              You can change any of this later from your profile.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <Field
              label="Handle"
              value={handle}
              onChangeText={(v) => setHandle(v.toLowerCase())}
              placeholder="yourname"
              autoCapitalize="none"
              autoCorrect={false}
              hint="3-30 lowercase letters, numbers, or underscores."
            />
            <Field
              label="Display name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              autoCapitalize="words"
              autoCorrect
            />

            <View style={{ gap: 8 }}>
              <Text
                style={{
                  ...TYPE.ui,
                  fontSize: 11,
                  fontWeight: '600',
                  color: surface.textMuted,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                Primary discipline
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {DISCIPLINES.map((d) => {
                  const active = primaryDiscipline === d.value;
                  return (
                    <Pressable
                      key={d.value}
                      onPress={() => setPrimaryDiscipline(d.value)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: active ? d.accent : surface.borderStrong,
                        backgroundColor: active ? `${d.accent}22` : surface.chip,
                      }}
                    >
                      <Text
                        style={{
                          ...TYPE.ui,
                          fontSize: 13,
                          fontWeight: active ? '700' : '500',
                          color: active ? d.accent : surface.text,
                        }}
                      >
                        {d.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error && (
              <Text style={{ ...TYPE.ui, fontSize: 13, color: theme.accent }}>{error}</Text>
            )}

            <PrimaryButton
              label="Continue"
              onPress={onSave}
              loading={submitting}
              style={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
