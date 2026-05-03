import type { Profile } from '@mma-finder/db';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

// Heuristic: handle_new_user assigns "user_<8 hex chars>" as the placeholder
// handle until the user picks one in onboarding.
const PLACEHOLDER_HANDLE_RE = /^user_[a-f0-9]{8}$/;

export function isPlaceholderProfile(profile: Profile | null | undefined) {
  if (!profile) return false;
  return PLACEHOLDER_HANDLE_RE.test(profile.handle);
}

export function useProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
