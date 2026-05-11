import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AuthShell,
  ErrorBanner,
  Field,
  GhostButton,
  InfoBanner,
  PrimaryButton,
} from '@/components/AuthForm';
import { TYPE } from '@/constants/theme';
import { signInWithOtp, signInWithPassword } from '@/lib/auth';
import { useTheme } from '@/store/themeStore';

export default function SignInScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSignIn = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error: e } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (e) {
      setError(friendlySignInError(e.message));
      return;
    }
    // Successful sign-in fires onAuthStateChange which (auth)/_layout uses to
    // redirect back to '/'. No manual navigation needed.
  };

  const onMagicLink = async () => {
    if (!email.trim()) {
      setError('Enter your email to get a magic link.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: e } = await signInWithOtp(email.trim());
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    setInfo(`We sent a sign-in link to ${email.trim()}. Open it on this device to continue.`);
  };

  return (
    <AuthShell
      surface={surface}
      title="Welcome back"
      subtitle="Sign in to post, RSVP to open mats, and message other practitioners."
      onBack={() => router.back()}
    >
      {error ? <ErrorBanner surface={surface} message={error} /> : null}
      {info ? <InfoBanner surface={surface} message={info} /> : null}

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
        autoComplete="password"
        placeholder="Your password"
        textContentType="password"
      />

      <PrimaryButton theme={theme} label="Sign in" onPress={onSignIn} loading={loading} />
      <GhostButton surface={surface} label="Email me a magic link instead" onPress={onMagicLink} />

      <View style={{ alignItems: 'center', marginTop: 6 }}>
        <Link href="/(auth)/forgot" asChild>
          <Text style={{ ...TYPE.ui, color: surface.textMuted, fontSize: 13 }}>
            Forgot your password?
          </Text>
        </Link>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 4 }}>
        <Text style={{ ...TYPE.ui, color: surface.textMuted, fontSize: 13 }}>
          New to Open Tatame?
        </Text>
        <Link href="/(auth)/sign-up" asChild>
          <Text style={{ ...TYPE.ui, color: theme.accent, fontSize: 13, fontWeight: '600' }}>
            Create an account
          </Text>
        </Link>
      </View>
    </AuthShell>
  );
}

function friendlySignInError(raw: string) {
  if (/invalid login credentials/i.test(raw)) return 'Email or password is incorrect.';
  if (/email not confirmed/i.test(raw)) return 'Check your email to confirm your account first.';
  return raw;
}
