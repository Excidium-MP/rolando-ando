import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/db';

export function useProfile(userId: string | null | undefined) {
  return useQuery<Profile | null>({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}
