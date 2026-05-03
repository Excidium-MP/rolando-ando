import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

export default function SignInScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [magicLinkSending, setMagicLinkSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email.');
    if (password.length < 1) return setError('Enter your password.');

    setSubmitting(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    // Root layout watches auth state and redirects.
  };

  const onMagicLink = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter your email above first.');

    setMagicLinkSending(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
    });
    setMagicLinkSending(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }
    Alert.alert(
      'Check your email',
      `We sent a sign-in link to ${email}. Open it on this device.`,
    );
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
          <View style={{ alignItems: 'flex-start', marginBottom: 28 }}>
            <Wordmark color={surface.text} accent={theme.accent} size={28} />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                ...TYPE.display,
                fontSize: 28,
                color: surface.text,
                marginBottom: 6,
              }}
            >
              Welcome back
            </Text>
            <Text style={{ ...TYPE.ui, fontSize: 14, color: surface.textMuted }}>
              Sign in to track your training and find open mats.
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
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
            />

            {error && (
              <Text style={{ ...TYPE.ui, fontSize: 13, color: theme.accent }}>{error}</Text>
            )}

            <View style={{ alignItems: 'flex-end' }}>
              <Pressable onPress={() => router.push('/(auth)/forgot')} hitSlop={8}>
                <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.textMuted }}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <PrimaryButton label="Sign in" onPress={onSignIn} loading={submitting} />

            <PrimaryButton
              label={magicLinkSending ? 'Sending link...' : 'Send magic link instead'}
              onPress={onMagicLink}
              loading={magicLinkSending}
              variant="ghost"
            />
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
              New here?
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable hitSlop={6}>
                <Text style={{ ...TYPE.ui, fontSize: 13, fontWeight: '700', color: theme.accent }}>
                  Create an account
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
