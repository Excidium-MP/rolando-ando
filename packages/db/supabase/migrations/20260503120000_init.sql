-- ============================================================================
-- Migration 0001: Phase 0 foundation
-- Creates: profiles, user_ranks, academies, academy_memberships
-- Helpers: tg_set_updated_at(), handle_new_user(), handle_new_academy(),
--          is_academy_role()
-- RLS:     anon read on profiles + academies + user_ranks (per locked
--          decision), owner-only write everywhere, academy admin gates via
--          is_academy_role() helper
-- ============================================================================


-- ============================================================================
-- Enums
-- ============================================================================
create type public.discipline as enum (
  'bjj', 'mma', 'muay_thai', 'boxing', 'wrestling', 'kickboxing', 'gi', 'no_gi'
);

create type public.academy_role as enum (
  'owner', 'admin', 'instructor', 'student', 'prospect'
);

create type public.membership_status as enum (
  'active', 'invited', 'left'
);


-- ============================================================================
-- Helper: tg_set_updated_at — generic trigger to maintain updated_at.
-- Attached to every table that has an updated_at column.
-- ============================================================================
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================================
-- Table: profiles (1:1 with auth.users)
-- Public-readable by anon (locked decision: anonymous browse allowed).
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null default '',
  avatar_url text,
  bio text,
  primary_discipline public.discipline,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_primary_discipline_idx on public.profiles(primary_discipline);

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.tg_set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles read public"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles update self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- INSERT happens via the handle_new_user trigger, not directly from clients.


-- ============================================================================
-- Function: handle_new_user — auto-creates a profile on auth.users insert.
-- Generates a handle from raw_user_meta_data.handle if present, else falls
-- back to "user_<first 8 chars of uuid>". The unique constraint on handle
-- will collide if two new signups land on the same fallback handle within
-- microseconds; the client retry path needs to surface that as a friendly
-- "pick a different handle" prompt.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_handle text;
begin
  v_handle := lower(coalesce(
    new.raw_user_meta_data->>'handle',
    'user_' || substr(replace(new.id::text, '-', ''), 1, 8)
  ));

  insert into public.profiles (id, handle, display_name)
  values (
    new.id,
    v_handle,
    coalesce(new.raw_user_meta_data->>'display_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- ============================================================================
-- Table: user_ranks — per-discipline rank (locked decision).
-- One row per (user, discipline). rank_text is intentionally free-form so it
-- can encode different conventions: "blue 2" for BJJ, "5-1-0" amateur record
-- for boxing, "rojo" for Muay Thai prajioud, etc.
-- ============================================================================
create table public.user_ranks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  discipline public.discipline not null,
  rank_text text not null,
  years_training numeric(4, 1),
  awarded_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, discipline)
);

create index user_ranks_user_id_idx on public.user_ranks(user_id);
create index user_ranks_discipline_idx on public.user_ranks(discipline);

create trigger user_ranks_updated_at
before update on public.user_ranks
for each row execute function public.tg_set_updated_at();

alter table public.user_ranks enable row level security;

create policy "user_ranks read public"
  on public.user_ranks for select
  to anon, authenticated
  using (true);

create policy "user_ranks write self"
  on public.user_ranks for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ============================================================================
-- Table: academies (skeleton; expanded in Phase 2 with locations, billing,
-- claim verification). Phase 0 lets any authenticated user create one for
-- testing; Phase 2 will replace the open INSERT policy with a verified RPC.
-- ============================================================================
create table public.academies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  name text not null,
  description text,
  primary_discipline public.discipline,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index academies_primary_discipline_idx on public.academies(primary_discipline);

create trigger academies_updated_at
before update on public.academies
for each row execute function public.tg_set_updated_at();

alter table public.academies enable row level security;

create policy "academies read public"
  on public.academies for select
  to anon, authenticated
  using (true);

create policy "academies insert authenticated"
  on public.academies for insert
  to authenticated
  with check (true);

-- UPDATE / DELETE policies attached after academy_memberships exists.


-- ============================================================================
-- Table: academy_memberships — the join table that drives RLS for tenanted
-- data. A user can hold multiple roles across academies (e.g., owner of one,
-- student at another). Composite PK on (user_id, academy_id) means one role
-- per academy per user; promotions update in place.
-- ============================================================================
create table public.academy_memberships (
  user_id uuid not null references public.profiles(id) on delete cascade,
  academy_id uuid not null references public.academies(id) on delete cascade,
  role public.academy_role not null,
  status public.membership_status not null default 'active',
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, academy_id)
);

create index academy_memberships_academy_id_idx on public.academy_memberships(academy_id);
create index academy_memberships_role_idx on public.academy_memberships(role);

create trigger academy_memberships_updated_at
before update on public.academy_memberships
for each row execute function public.tg_set_updated_at();

alter table public.academy_memberships enable row level security;

-- Self-read: a user can always see their own memberships.
create policy "academy_memberships read self"
  on public.academy_memberships for select
  to authenticated
  using (user_id = auth.uid());


-- ============================================================================
-- Helper: is_academy_role(academy_id, roles[])
-- security definer to bypass RLS on academy_memberships when checking
-- inside policies on the same table (avoids infinite recursion).
-- Stable so the planner can cache the result within a query.
-- ============================================================================
create or replace function public.is_academy_role(
  p_academy_id uuid,
  p_roles public.academy_role[]
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.academy_memberships m
    where m.academy_id = p_academy_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = any(p_roles)
  );
$$;

revoke all on function public.is_academy_role(uuid, public.academy_role[]) from public;
grant execute on function public.is_academy_role(uuid, public.academy_role[]) to authenticated;


-- Admin-side RLS on academy_memberships
create policy "academy_memberships read admin"
  on public.academy_memberships for select
  to authenticated
  using (public.is_academy_role(academy_id, array['owner', 'admin']::public.academy_role[]));

create policy "academy_memberships insert admin"
  on public.academy_memberships for insert
  to authenticated
  with check (public.is_academy_role(academy_id, array['owner', 'admin']::public.academy_role[]));

create policy "academy_memberships update admin"
  on public.academy_memberships for update
  to authenticated
  using (public.is_academy_role(academy_id, array['owner', 'admin']::public.academy_role[]))
  with check (public.is_academy_role(academy_id, array['owner', 'admin']::public.academy_role[]));

create policy "academy_memberships delete admin"
  on public.academy_memberships for delete
  to authenticated
  using (public.is_academy_role(academy_id, array['owner', 'admin']::public.academy_role[]));


-- Now we can wire admin-gated UPDATE / DELETE on academies
create policy "academies update admin"
  on public.academies for update
  to authenticated
  using (public.is_academy_role(id, array['owner', 'admin']::public.academy_role[]))
  with check (public.is_academy_role(id, array['owner', 'admin']::public.academy_role[]));

create policy "academies delete owner"
  on public.academies for delete
  to authenticated
  using (public.is_academy_role(id, array['owner']::public.academy_role[]));


-- ============================================================================
-- Function + trigger: handle_new_academy
-- When a new academy is inserted, the inserting user automatically becomes
-- its owner. Without this, an open academies INSERT policy combined with an
-- admin-gated memberships INSERT policy would leave new academies
-- unowned and unmanageable.
-- ============================================================================
create or replace function public.handle_new_academy()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academy_memberships (user_id, academy_id, role, status)
  values (auth.uid(), new.id, 'owner', 'active');
  return new;
end;
$$;

create trigger on_academy_created
after insert on public.academies
for each row execute function public.handle_new_academy();
