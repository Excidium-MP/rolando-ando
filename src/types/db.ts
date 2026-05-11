// Hand-authored DB types. Replace this file with the output of
// `npx supabase gen types typescript --linked > src/types/db.ts` once the
// Supabase project is linked. Keep the row shapes in sync with the SQL
// migrations under /supabase/migrations until then.

// Legacy 'bjj' is still present in the Postgres enum (you cannot remove enum
// values without rebuilding the type) but it is hidden from the picker. New
// signups will only ever store the explicit bjj_gi / bjj_no_gi values.
export type Discipline =
  | 'bjj'
  | 'bjj_gi'
  | 'bjj_no_gi'
  | 'mma'
  | 'muay_thai'
  | 'boxing'
  | 'wrestling'
  | 'kickboxing'
  | 'full_contact'
  | 'judo';

export type BeltColor =
  | 'white'
  | 'blue'
  | 'purple'
  | 'brown'
  | 'black'
  | 'coral'
  | 'red';

export type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  disciplines: Discipline[];
  city: string | null;
  country: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type UserRank = {
  user_id: string;
  discipline: Discipline;
  rank_text: string | null;
  belt_color: BeltColor | null;
  years_training: number | null;
  awarded_at: string | null;
  created_at: string;
  updated_at: string;
};
