import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

type AuthState = {
  session: Session | null;
  user: User | null;
  // false until the first getSession() call resolves. Gate redirects on this
  // so the splash does not flash the sign-in screen for an already-logged-in
  // user.
  isLoaded: boolean;
};

export const useAuthStore = create<AuthState>(() => ({
  session: null,
  user: null,
  isLoaded: false,
}));
