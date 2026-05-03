import { Link } from 'expo-router';
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
const MIN_PASSWORD = 8;

export default function SignUpScreen() {
  const { surface, theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const onSignUp = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email.');
    if (password.length < MIN_PASSWORD)
      return setError(`Password must be at least ${MIN_PASSWORD} characters.`);

    setSubmitting(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    // If the project requires email confirmation, session is null and the
    // user has to verify before signing in. Otherwise we have a session and
    // the root layout will redirect to onboarding.
    if (!data.session) {
      setConfirmationSent(true);
    }
  };

  if (confirmationSent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: surface.bg }}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          <Wordmark color={surface.text} accent={theme.accent} size={28} />
          <Text style={{ ...TYPE.display, fontSize: 28, color: surface.text, marginTop: 32 }}>
            Confirm your email
          </Text>
          <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted, marginTop: 8 }}>
            We sent a confirmation link to {email}. Open it to finish creating your account.
          </Text>
          <View style={{ marginTop: 28 }}>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <PrimaryButton label="Back to sign in" onPress={() => {}} variant="ghost" />
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={{ alignItems: 'flex-start', marginBottom: 28 }}>
            <Wordmark color={surface.text} accent={theme.accent} size={28} />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ ...TYPE.display, fontSize: 28, color: surface.text, marginBottom: 6 }}>
              Create your account
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted }}>
              We will set up your handle and primary discipline next.
            </Text>
          </View>

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
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              hint="At least 8 characters."
            />

            {error && (
              <Text style={{ ...TYPE.ui, fontSize: 13, color: theme.accent }}>{error}</Text>
            )}

            <PrimaryButton label="Create account" onPress={onSignUp} loading={submitting} />
          </View>

          <View
            style={{
              marginTop: 'auto',
              paddingTop: 32,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted }}>
              Already have an account?
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={6}>
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: theme.accent }}>
                  Sign in
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
