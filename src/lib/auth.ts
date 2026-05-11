import { useAuthStore } from '@/store/authStore';

import { supabase } from './supabase';

// Call once from the root layout. Resolves the current session, marks the
// store loaded, and subscribes to future auth events.
export async function initAuth() {
  const { data } = await supabase.auth.getSession();
  useAuthStore.setState({
    session: data.session,
    user: data.session?.user ?? null,
    isLoaded: true,
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      session,
      user: session?.user ?? null,
    });
  });
}

export function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithPassword(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export function signInWithOtp(email: string) {
  return supabase.auth.signInWithOtp({ email });
}

export function resetPasswordForEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export function signOut() {
  return supabase.auth.signOut();
}
