import type { Discipline, Gym } from '@mma-finder/db';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UseGymsOptions = {
  /** Filter by primary discipline. Pass null/undefined for "all". */
  discipline?: Discipline | null;
  /** Free-text match against name/description/affiliation/city. */
  search?: string;
};

export function useGyms({ discipline, search }: UseGymsOptions = {}) {
  return useQuery({
    queryKey: ['gyms', { discipline, search }],
    queryFn: async (): Promise<Gym[]> => {
      let query = supabase.from('gyms').select('*').order('name');

      if (discipline) {
        query = query.eq('primary_discipline', discipline);
      }
      if (search && search.trim().length > 0) {
        const pattern = `%${search.trim()}%`;
        // Postgres ilike via PostgREST `.or()` covers a few obvious fields.
        query = query.or(
          `name.ilike.${pattern},city.ilike.${pattern},affiliation.ilike.${pattern}`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGymBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['gym', slug],
    enabled: !!slug,
    queryFn: async (): Promise<Gym | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

// Build the Instagram profile URL for a gym handle (without @).
export function instagramUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
}

// Build a Google Maps search URL from the address parts. Falls back to the
// city if no street address is available.
export function googleMapsUrl(gym: Pick<Gym, 'address' | 'city' | 'country'>): string | null {
  const parts = [gym.address, gym.city, gym.country].filter(Boolean);
  if (parts.length === 0) return null;
  const query = encodeURIComponent(parts.join(', '));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
