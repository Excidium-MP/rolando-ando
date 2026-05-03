import { Link, useRouter } from 'expo-router';
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
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/store/themeStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSend = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email.');

    setSubmitting(true);
    // emailRedirectTo is intentionally omitted; users open the reset link on
    // any device and Supabase routes them to a hosted password update form.
    // Phase 1 will swap to a deep link into a /reset-password mobile screen.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
    );
    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted }}>← Back</Text>
            </Pressable>
          </View>

          <View style={{ marginBottom: 32 }}>
            <Wordmark color={surface.text} accent={theme.accent} size={28} />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ ...TYPE.display, fontSize: 28, color: surface.text, marginBottom: 6 }}>
              Reset password
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted }}>
              {sent
                ? `If an account exists for ${email}, we sent a reset link.`
                : 'Enter your email and we will send a reset link.'}
            </Text>
          </View>

          {!sent && (
            <View style={{ gap: 16 }}>
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                autoCorrect={false}
              />

              {error && (
                <Text style={{ ...TYPE.ui, fontSize: 13, color: theme.accent }}>{error}</Text>
              )}

              <PrimaryButton label="Send reset link" onPress={onSend} loading={submitting} />
            </View>
          )}

          <View
            style={{
              marginTop: 'auto',
              paddingTop: 32,
              alignItems: 'center',
            }}
          >
            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={6}>
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: theme.accent }}>
                  Back to sign in
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
