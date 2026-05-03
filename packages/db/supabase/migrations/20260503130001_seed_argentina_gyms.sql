-- ============================================================================
-- Seed: 10 Argentina gyms (CABA, GBA, Córdoba)
-- Curated by Manuel for Open Tatame's first market. Idempotent via
-- ON CONFLICT (slug). Re-running is safe; existing rows are not overwritten,
-- so any manual edits in Studio are preserved.
-- Lat/lng intentionally null until geocoded in a later migration.
-- ============================================================================

insert into public.gyms (
  slug, name, description, address, neighborhood, city, country,
  primary_discipline, affiliation, founded_year,
  instagram_handle, instagram_followers
) values
  (
    'breakers-mma-villa-crespo',
    'Breakers MMA',
    'Villa Crespo HQ. Also has gyms in Villa Martelli, San Miguel, and Carlos Paz.',
    'Serrano 457', 'Villa Crespo', 'Buenos Aires', 'AR',
    'mma', 'Breakers', null,
    'breakers.mma', 44000
  ),
  (
    'mma-goa-liniers',
    'MMA GOA',
    'Liniers HQ. Also has gyms in Béccar, Pacheco, and Paso del Rey.',
    'Madero 218', 'Liniers', 'Buenos Aires', 'AR',
    'mma', 'MMA GOA', null,
    'mmagoa.arg', 20000
  ),
  (
    'united-fight-center-almagro',
    'United Fight Center',
    'Nova União Argentina HQ.',
    'Av. Córdoba 4156', 'Almagro', 'Buenos Aires', 'AR',
    'mma', 'Nova União Argentina', null,
    'unitedfightcenter', 18000
  ),
  (
    'mr-artes-marciales-cordoba',
    'MR Artes Marciales',
    'Córdoba Capital. Muay Thai focus (MR Thai Team).',
    'Ayacucho 12', null, 'Córdoba', 'AR',
    'muay_thai', 'MR Thai', null,
    'mr.thai.team', 22000
  ),
  (
    'destroyer-fight-club-ramos-mejia',
    'Destroyer Fight Club',
    'Zona Oeste. Founded 1992.',
    'Av. San Martín 748', null, 'Ramos Mejía', 'AR',
    'mma', null, 1992,
    'destroyer_fight_club', 8000
  ),
  (
    'gfteam-villa-urquiza',
    'GFTeam Argentina',
    'Affiliate of GFTeam, the Brazilian global BJJ powerhouse.',
    'Manuela Pedraza 5349', 'Villa Urquiza', 'Buenos Aires', 'AR',
    'bjj', 'GFTeam', null,
    'gfteamarg', null
  ),
  (
    'club-center-fight-academy-san-cristobal',
    'Club Center Fight Academy',
    'Part of the SportClub network.',
    'Solís 1213', 'San Cristóbal', 'Buenos Aires', 'AR',
    'mma', 'SportClub', null,
    'clubcenterfightacademy', null
  ),
  (
    'mma-academy-liniers',
    'MMA Academy',
    'Hosts amateur MMA tournaments.',
    'Cnel. Ramón L. Falcón 6859', 'Liniers', 'Buenos Aires', 'AR',
    'mma', null, null,
    null, null
  ),
  (
    'casa-do-lutador-cordoba',
    'Casa do Lutador',
    'BJJ and MMA in Córdoba.',
    'Martín García 1630', null, 'Córdoba', 'AR',
    'bjj', null, null,
    'casadolutador_', null
  ),
  (
    'evolution-academy-cordoba',
    'Evolution Academy',
    'Multi-discipline academy in Complejo Villa Sol, Córdoba.',
    'Colón 4933', 'Complejo Villa Sol', 'Córdoba', 'AR',
    'mma', null, null,
    'evolution_academy14', null
  )
on conflict (slug) do nothing;
