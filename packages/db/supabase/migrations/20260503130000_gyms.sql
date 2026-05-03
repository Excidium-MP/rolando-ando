-- ============================================================================
-- Migration 0002: gyms (Phase 1 Discover foundation)
-- A gym is a physical training location. An academy can later own one or many
-- gyms (Phase 2 admin claim flow); academy_id is nullable for unclaimed gyms
-- so the seed Argentina set works without an academy entity.
-- RLS: public-read (anon + authenticated), writes admin-only for now.
-- Geo: lat/lng are nullable plain doubles; PostGIS comes in a later migration
-- when we add radius search. Storing both lets the UI compute distance with a
-- haversine fallback in the meantime.
-- ============================================================================

create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid references public.academies(id) on delete set null,

  slug text not null unique
    check (slug ~ '^[a-z0-9-]{3,80}$'),
  name text not null,
  description text,

  -- Address
  address text,
  neighborhood text,
  city text,
  country text not null default 'AR'
    check (country ~ '^[A-Z]{2}$'),
  lat double precision,
  lng double precision,

  -- Identity
  primary_discipline public.discipline,
  affiliation text,
  founded_year int
    check (founded_year is null or (founded_year between 1800 and 2100)),

  -- Social / media
  instagram_handle text
    check (instagram_handle is null or instagram_handle ~ '^[A-Za-z0-9_.]{1,30}$'),
  instagram_followers int
    check (instagram_followers is null or instagram_followers >= 0),
  cover_image_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gyms_city_idx on public.gyms(city);
create index gyms_country_idx on public.gyms(country);
create index gyms_primary_discipline_idx on public.gyms(primary_discipline);
create index gyms_academy_id_idx on public.gyms(academy_id);

create trigger gyms_updated_at
before update on public.gyms
for each row execute function public.tg_set_updated_at();

alter table public.gyms enable row level security;

create policy "gyms read public"
  on public.gyms for select
  to anon, authenticated
  using (true);

-- No INSERT / UPDATE / DELETE policies = default deny for everyone except the
-- service role. Phase 2 will add admin-gated write policies via the
-- is_academy_role helper once academies start claiming their gyms.
