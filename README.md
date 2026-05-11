# rolando-ando

Mobile app for Jiu Jitsu practitioners. Find nearby teams, discover open mats in your area, browse games and community info.

Status: prototype.

## Stack
Expo (managed) + React Native + TypeScript, Expo Router, NativeWind, Supabase, React Query, Zustand.

See [CLAUDE.md](./CLAUDE.md) for full conventions and the [Definition of Done](./CLAUDE.md#definition-of-done).

## Setup
```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and anon key
```

## Run
```bash
npx expo start
npx expo start --ios
npx expo start --android
npm run typecheck
npm run lint
```

## Supabase

Schema is the source of truth in `/supabase/migrations`. Apply locally with the Supabase CLI:

```bash
# one-time, per machine
brew install supabase/tap/supabase            # or scoop/winget on Windows

# one-time, per project
supabase login
supabase link --project-ref <your-project-ref>

# every time the migrations folder changes
supabase db push                              # apply pending migrations to the linked remote project
npx supabase gen types typescript --linked > src/types/db.ts   # regenerate TS types
```

Local-only Postgres (for offline work) is optional via `supabase start`; not required day-to-day.

## Folder layout
See `CLAUDE.md`. Source lives under `/src` with the `@/*` alias. Routes live under `/app`. SQL migrations under `/supabase/migrations`.

## Decision log
`/docs/decisions` holds one file per architectural decision.
