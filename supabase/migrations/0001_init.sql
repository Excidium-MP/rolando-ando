-- Phase 0: Foundation
-- profiles + user_ranks + discipline/belt enums + RLS + signup trigger
-- Public read so anonymous users can browse profiles; self-only writes.

set search_path = public;

-- Restore Supabase's default role grants on the public schema. A `drop
-- schema public cascade` wipes these and leaves anon/authenticated unable to
-- query anything even when RLS policies say they should. RLS still gates
-- per-row access on top of the grants.
grant usage on schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;

-- Enums ----------------------------------------------------------------------

create type discipline as enum (
  'bjj',
  'mma',
  'muay_thai',
  'boxing',
  'wrestling',
  'kickboxing',
  'gi',
  'no_gi'
);

-- Free-form rank_text covers disciplines without belts (boxing, muay thai).
-- belt_color is optional and only meaningful for belted arts (bjj, judo, etc).
create type belt_color as enum (
  'white',
  'blue',
  'purple',
  'brown',
  'black',
  'coral',
  'red'
);

-- updated_at helper ----------------------------------------------------------

create or replace function tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles -------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  primary_discipline discipline,
  city text,
  country text,
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handle_format check (handle ~ '^[a-z0-9_]{3,30}$')
);

create index profiles_primary_discipline_idx on profiles (primary_discipline);
create index profiles_city_idx on profiles (city);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function tg_set_updated_at();

alter table profiles enable row level security;

create policy "profiles are public-read"
  on profiles for select
  using (true);

create policy "users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_ranks -----------------------------------------------------------------
-- One row per (user, discipline). Lets a user track BJJ blue belt + Muay Thai
-- separately. rank_text is free-form so it works for disciplines without belts.

create table user_ranks (
  user_id uuid not null references profiles (id) on delete cascade,
  discipline discipline not null,
  rank_text text,
  belt_color belt_color,
  years_training numeric(4, 1) check (years_training is null or years_training >= 0),
  awarded_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, discipline)
);

create index user_ranks_user_id_idx on user_ranks (user_id);

create trigger user_ranks_set_updated_at
  before update on user_ranks
  for each row execute function tg_set_updated_at();

alter table user_ranks enable row level security;

create policy "ranks are public-read"
  on user_ranks for select
  using (true);

create policy "users manage their own ranks"
  on user_ranks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Signup trigger -------------------------------------------------------------
-- Creates a placeholder profile row when a new auth user is created. The
-- onboarding screen replaces the placeholder handle with the user's chosen
-- handle. is_onboarded gates whether we route them to the tabs or onboarding.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, handle)
  values (
    new.id,
    -- placeholder, must be unique and pass handle_format check
    'user_' || substring(replace(new.id::text, '-', ''), 1, 12)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
