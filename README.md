# Open Tatame (repo codename `rolando-ando`)

Two-surface martial-arts platform: a free practitioner mobile app for finding gyms, open mats, and a training community, plus a B2B SaaS for academy owners (Phase 2+). Multi-discipline (BJJ, MMA, Muay Thai, boxing, wrestling, kickboxing, gi, no-gi).

Status: prototype. Live web build at https://rolando-ando.vercel.app.

## Stack

Expo (managed) + React Native + TypeScript, Expo Router, NativeWind, Supabase (Auth + Postgres + Storage + Realtime), React Query, Zustand. Monorepo via npm workspaces + Turborepo.

See [CLAUDE.md](./CLAUDE.md) for the full conventions and the [Definition of Done](./CLAUDE.md#definition-of-done).

## Setup

```bash
npm install
cp apps/mobile/.env.example apps/mobile/.env.local   # then fill in Supabase URL and anon key
```

## Run

```bash
cd apps/mobile && npm start             # Expo dev server, press i / a / w
npm run typecheck                       # turbo across all workspaces
npm run lint                            # turbo across all workspaces
npm run build                           # web export (apps/mobile/dist)
```

## Database

```bash
npm run gen -w @mma-finder/db           # regenerate types from live schema
npm run push -w @mma-finder/db          # apply pending migrations to linked project
npm run status -w @mma-finder/db        # show local vs remote migration list
```

## Folder layout

```
apps/mobile        Expo Router app (consumer)
apps/admin         Next.js (Phase 2)
packages/db        Supabase migrations + generated types
packages/ui        Shared design tokens (Phase 2+)
packages/api       Shared React Query hooks (Phase 2+)
```

Path alias inside `apps/mobile`: `@/*` -> `./src/*`. Cross-package: `@mma-finder/db`, `@mma-finder/ui`, `@mma-finder/api`.

## Decision log

`/docs/decisions` holds one file per architectural decision.
