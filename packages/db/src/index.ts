// Generated Supabase types are the single source of truth for the data model.
// Run `npm run gen -w @mma-finder/db` after every migration to refresh.
export type { Database, Json } from './types';

import type { Database } from './types';

// Convenience row aliases so consumers do not have to spell out the deep paths.
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserRank = Database['public']['Tables']['user_ranks']['Row'];
export type UserRankInsert = Database['public']['Tables']['user_ranks']['Insert'];
export type UserRankUpdate = Database['public']['Tables']['user_ranks']['Update'];

export type Academy = Database['public']['Tables']['academies']['Row'];
export type AcademyInsert = Database['public']['Tables']['academies']['Insert'];
export type AcademyUpdate = Database['public']['Tables']['academies']['Update'];

export type AcademyMembership = Database['public']['Tables']['academy_memberships']['Row'];
export type AcademyMembershipInsert = Database['public']['Tables']['academy_memberships']['Insert'];
export type AcademyMembershipUpdate = Database['public']['Tables']['academy_memberships']['Update'];

// Enum aliases.
export type Discipline = Database['public']['Enums']['discipline'];
export type AcademyRole = Database['public']['Enums']['academy_role'];
export type MembershipStatus = Database['public']['Enums']['membership_status'];
