-- Phase 0 follow-up: multi-discipline profiles.
-- - Rename ambiguous enum values (gi / no_gi) to be explicit about the art.
-- - Add full_contact and judo.
-- - Replace profiles.primary_discipline (single) with profiles.disciplines
--   (array), so a practitioner can declare every art they train.

set search_path = public;

-- Postgres allows renaming an enum value in-place; existing rows update
-- automatically because values are stored by oid, not by text.
alter type discipline rename value 'gi' to 'bjj_gi';
alter type discipline rename value 'no_gi' to 'bjj_no_gi';

-- ALTER TYPE ADD VALUE works inside a transaction since PG12, but the new
-- value cannot be referenced in the same transaction. We are only adding
-- them here, not using them yet, so this is fine.
alter type discipline add value if not exists 'full_contact';
alter type discipline add value if not exists 'judo';

-- New array column. Default to empty so the existing not-yet-onboarded rows
-- stay valid.
alter table profiles
  add column disciplines discipline[] not null default '{}';

-- Migrate any existing primary_discipline values into the new array. The
-- legacy 'bjj' value is ambiguous (could be gi, no-gi, or both) so we expand
-- it to both for safety; users can correct it in onboarding/settings.
update profiles
set disciplines = case
  when primary_discipline is null then '{}'::discipline[]
  when primary_discipline = 'bjj' then array['bjj_gi', 'bjj_no_gi']::discipline[]
  else array[primary_discipline]
end;

drop index if exists profiles_primary_discipline_idx;
alter table profiles drop column primary_discipline;

-- GIN index supports `disciplines @> array[...]` containment queries used by
-- the Discover screen to find practitioners by what they train.
create index profiles_disciplines_idx on profiles using gin (disciplines);
