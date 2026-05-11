import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AuthShell,
  ErrorBanner,
  Field,
  InfoBanner,
  PrimaryButton,
} from '@/components/AuthForm';
import { TYPE } from '@/constants/theme';
import { signUpWithPassword } from '@/lib/auth';
import { useTheme } from '@/store/themeStore';

export default function SignUpScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const onSubmit = async () => {
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error: e } = await signUpWithPassword(email.trim(), password);
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    // If Supabase project requires email confirmation, session will be null
    // and the user needs to confirm before logging in.
    if (!data.session) {
      setNeedsConfirm(true);
      return;
    }
    // Otherwise onAuthStateChange will fire and the gate sends them onward.
  };

  return (
    <AuthShell
      surface={surface}
      title="Create your account"
      subtitle="Find your people on the mats. Browse open mats, follow gyms, share your training."
      onBack={() => router.back()}
    >
      {error ? <ErrorBanner surface={surface} message={error} /> : null}
      {needsConfirm ? (
        <InfoBanner
          surface={surface}
          message={`Check ${email.trim()} for a confirmation link. After confirming, come back and sign in.`}
        />
      ) : null}

      <Field
        surface={surface}
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="you@example.com"
        textContentType="emailAddress"
      />
      <Field
        surface={surface}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        placeholder="At least 8 characters"
        textContentType="newPassword"
      />

      <PrimaryButton theme={theme} label="Create account" onPress={onSubmit} loading={loading} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 4 }}>
        <Text style={{ ...TYPE.ui, color: surface.textMuted, fontSize: 13 }}>
          Already have an account?
        </Text>
        <Link href="/(auth)/sign-in" asChild>
          <Text style={{ ...TYPE.ui, color: theme.accent, fontSize: 13, fontWeight: '600' }}>
            Sign in
          </Text>
        </Link>
      </View>
    </AuthShell>
  );
}
