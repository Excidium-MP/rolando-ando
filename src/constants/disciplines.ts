import type { Discipline } from '@/types/db';

// User-visible discipline picker. Order matters: BJJ variants first (most
// common audience), then MMA, then striking arts, then grappling, then catch-
// all. The legacy 'bjj' enum value is intentionally omitted; choose Gi or
// No-Gi (or both) instead.
export const DISCIPLINES: readonly { value: Discipline; label: string }[] = [
  { value: 'bjj_gi', label: 'BJJ Gi' },
  { value: 'bjj_no_gi', label: 'BJJ No Gi' },
  { value: 'mma', label: 'MMA' },
  { value: 'muay_thai', label: 'Muay Thai' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'kickboxing', label: 'Kickboxing' },
  { value: 'full_contact', label: 'Full Contact' },
  { value: 'wrestling', label: 'Wrestling' },
  { value: 'judo', label: 'Judo' },
] as const;

export function disciplineLabel(value: Discipline | null | undefined) {
  if (!value) return null;
  // Legacy 'bjj' rows from before the multi-discipline migration still exist
  // in the DB; surface them as "BJJ" until the user re-picks in settings.
  if (value === 'bjj') return 'BJJ';
  return DISCIPLINES.find((d) => d.value === value)?.label ?? value;
}
