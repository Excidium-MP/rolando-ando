import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoaded: boolean;
};

type AuthActions = {
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Module-level guard so HMR or accidental double-mounts do not stack
// onAuthStateChange subscribers.
let didInitialize = false;

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  session: null,
  user: null,
  isLoaded: false,

  initialize: async () => {
    if (didInitialize) return;
    didInitialize = true;

    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      isLoaded: true,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will fire with null session, the store will update.
  },
}));
