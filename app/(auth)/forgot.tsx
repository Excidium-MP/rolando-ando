import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
  AuthShell,
  ErrorBanner,
  Field,
  InfoBanner,
  PrimaryButton,
} from '@/components/AuthForm';
import { resetPasswordForEmail } from '@/lib/auth';
import { useTheme } from '@/store/themeStore';

export default function ForgotPasswordScreen() {
  const { surface, theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    const { error: e } = await resetPasswordForEmail(email.trim());
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      surface={surface}
      title="Reset your password"
      subtitle="We'll email you a link to set a new password."
      onBack={() => router.back()}
    >
      {error ? <ErrorBanner surface={surface} message={error} /> : null}
      {sent ? (
        <InfoBanner
          surface={surface}
          message={`If an account exists for ${email.trim()}, a reset link is on its way.`}
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

      <PrimaryButton theme={theme} label="Send reset link" onPress={onSubmit} loading={loading} />
    </AuthShell>
  );
}
