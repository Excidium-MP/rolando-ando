# Project: Open Tatame (repo codename `rolando-ando`, internal packages `@mma-finder/*`)

A two-surface platform for the martial arts community, competing with bjjlink.com.

1. **Open Tatame** (consumer mobile app, free): find nearby gyms, discover open mats, log training, follow grapplers, message, share progress. Multi-discipline (BJJ, MMA, Muay Thai, boxing, wrestling, kickboxing, gi, no-gi).
2. **Open Tatame Studio** (academy SaaS, paid B2B, Phase 2+): student management, class scheduling, attendance, billing, curriculum, retail, payroll, analytics, kiosk check-in.

Repo folder name `rolando-ando` and internal npm package names (`@mma-finder/mobile`, `@mma-finder/db`, `@mma-finder/ui`, `@mma-finder/api`) intentionally keep their old identifiers so EAS dev clients keep working and refactors stay scoped to user-visible surfaces.

Both surfaces share one Supabase backend. Repo folder name `rolando-ando` is a codename and stays as-is.

Status: prototype UI complete (mobile only), no real backend yet. Owner: Manuel, solo dev. Platforms: iOS + Android (mobile), web PWA (admin).

## Roadmap

Approved phased plan lives at `C:\Users\Pc\.claude\plans\how-would-you-build-lucky-cake.md`. Locked decisions (2026-05-03):

- Anonymous browse for gyms / open mats / public feed; sign-in required to post, message, check in, follow.
- Any verified user can create open-mat events; gym admins inherit edit rights when they claim their academy.
- Per-discipline rank system (`user_ranks` table). User picks a primary discipline. BJJ uses belts + stripes (existing `BeltBar`); other disciplines use their own conventions.
- Admin shell at MVP is Next.js PWA only (kiosk via fullscreen). No native admin app at v1.
- SaaS pricing is flat per-academy per month.
- Billing geography deferred. Launch US-only with Stripe Tax. Schema designed currency-agnostic.

## Stack

**Current (mobile)**: Expo (managed) + React Native + TypeScript. Expo Router for navigation. NativeWind for styling. Supabase for backend (Postgres + Auth + Storage + Realtime + Edge Functions). React Query for server state, Zustand for client state. expo-secure-store for tokens, AsyncStorage for non-sensitive persistent state. EAS Build / Submit.

**Planned (admin, Phase 2)**: Next.js 15 App Router + shadcn/ui, deployed on Vercel. Same Supabase backend.

**Planned services**: Sentry (Phase 0), Resend for transactional email (Phase 1), Expo Push (Phase 1), Stripe + Stripe Connect (Phase 3), Stripe Terminal for retail POS (Phase 4).

## Folder structure (current, single Expo app at root)
```
/app                  Expo Router routes (file-based)
  /(auth)             Auth-only routes
  /(tabs)             Main tabs
  _layout.tsx         Root layout
/src
  /components         Reusable UI, PascalCase, one per file
  /hooks              Custom hooks, prefix with use, one per file
  /lib                External clients (supabase)
  /utils              Pure helpers, no side effects
  /types              Shared TypeScript types
  /constants          Theme, colors, sizes
/assets               Images, fonts, icons, splash
/supabase
  /migrations         SQL migrations and RLS policies
/docs
  /decisions          One file per architectural decision
app.config.ts         Expo config (single source of truth)
.env.example          Template, never commit real .env
eas.json              EAS Build profiles
```

Path alias: `@/*` -> `./src/*`. Use `@/components/...`, `@/hooks/...`, etc.

## Folder structure (target monorepo, Phase 0 in progress)
```
/apps
  /mobile             Current Expo app, moved from root
  /admin              Next.js 15 App Router (Phase 2)
  /marketing          Next.js + MDX (Phase 5)
/packages
  /db                 Supabase migrations + generated types + zod schemas
  /ui                 Shared design tokens + primitives (mobile + web)
  /api                Shared React Query hooks + RPC wrappers
/supabase             Edge functions + (until packages/db lands) migrations
pnpm-workspace.yaml
turbo.json
```

After conversion, the mobile path alias becomes `@/*` -> `./apps/mobile/src/*` (configured in `apps/mobile/tsconfig.json` and `babel.config.js`). Workspace deps imported as `@mma-finder/db`, `@mma-finder/ui`, `@mma-finder/api`.

**Workspace tool: npm workspaces + Turborepo** (chosen over pnpm to avoid Metro symlink issues on Windows). npm 11+ supports workspaces natively, no global install needed.

## Coding conventions
- TypeScript everywhere. No `any` unless justified in a comment.
- Functional components only. One per file. PascalCase filenames.
- Hooks always prefix with `use`. One hook per file.
- Variables camelCase, constants SCREAMING_SNAKE_CASE, booleans prefixed `is/has/should`.
- Imports order: external libs, internal modules, types last. Use `@/...` aliases.
- Comments explain *why*, not *what*.
- No em dashes anywhere. Use commas, parentheses, or split sentences.
- Surface errors with friendly copy, never raw stack traces.
- Pull magic values into named constants in `/src/constants`.

## Mobile-specific rules
- Lists: use `FlatList` or `FlashList`. Never `ScrollView` with `.map()` over more than ~10 items.
- Wrap every screen in `SafeAreaView` or use `useSafeAreaInsets`.
- Forms: wrap in `KeyboardAvoidingView` and dismiss keyboard on tap outside.
- Images: use `expo-image`, not `Image` from react-native.
- Touch targets: minimum 44x44 px (iOS) / 48x48 dp (Android).
- No web-only APIs. No `window`, `document`, `localStorage`. Use `AsyncStorage` or `expo-secure-store`.
- Test every change on both iOS and Android. Use `Platform.OS` only when behavior must differ.

## Git workflow
- `main` is always deployable.
- Branches: `feat/...`, `fix/...`, `chore/...`, `refactor/...`.
- Conventional Commits. One logical change per commit. Atomic and reversible.
- Never commit: `.env`, production `google-services.json` / `GoogleService-Info.plist`, keystores, secrets, `node_modules`, build output.

## Environment & secrets
- All secrets live in `.env.local`. Never committed.
- `.env.example` lists every required key with dummy values.
- Public values prefixed `EXPO_PUBLIC_` ship in the JS bundle. Treat as public.
- Server-only secrets go in Supabase Edge Functions or EAS Secrets.

## Database (Supabase)
- All schema changes via migrations in `/supabase/migrations` (will move to `/packages/db/supabase/migrations` after Phase 0).
- Every table has Row Level Security enabled. Default deny.
- User-owned tables include `user_id` with a matching RLS policy.
- Tenant-scoped tables (academy data: students, classes, attendance, billing, etc.) include `academy_id` and use the `is_academy_role(academy_id, roles[])` security-definer helper for RLS.
- Tables: snake_case, plural. Every table has `created_at` and `updated_at`.
- Indexes on every foreign key and on columns used in `WHERE`.
- Anonymous (`anon` role) read access is allowed for: `gyms`, `events` (open mats), public `feed_posts`, public `profiles`. All write paths require `authenticated`.

## Native dependencies & permissions
- Prefer Expo SDK modules over community packages when both exist.
- Any new native dependency requires a fresh dev client build.
- Declare every permission in `app.config.ts` with a clear user-facing reason string.
- Request permissions at the moment of use, not on app launch.

## AI collaboration rules
- Before coding: state the plan in 2 to 3 bullets and confirm ambiguous parts.
- One clarifying question at a time when context is missing.
- No unrequested refactors. Touch only the files needed for the task.
- Show the diff: list files changed, one line summary per file.
- Comment new code in plain language. Reader is conceptually fluent but not deeply technical.
- Flag tradeoffs honestly.
- Never invent APIs, packages, or Expo modules. Verify they exist and match the current Expo SDK.
- No em dashes in any output. Use commas, parentheses, or split sentences.
- **Stop and ask** before touching: auth flows, payments, RLS policies, migrations on existing tables, native config (`app.config.ts`), permissions, monorepo restructure, or anything destructive.
- Native-aware: if a change requires a new native module, flag that a new dev client build is needed.
- Platform check: confirm fixes work on both iOS and Android, or flag the platform-specific assumption.
- Multi-discipline: do not assume BJJ-only. Schema, copy, and discoverability cover all disciplines listed in `src/constants/theme.ts`.

## Definition of Done
A feature is done when:
- [ ] Builds with no type errors (`npm run typecheck`)
- [ ] Lints clean (`npm run lint`)
- [ ] Works on iOS simulator
- [ ] Works on Android emulator
- [ ] Tested on at least one physical device
- [ ] No secrets committed
- [ ] New env vars added to `.env.example` and EAS Secrets if needed
- [ ] DB migrations applied and reversible
- [ ] RLS reviewed for any new tables
- [ ] New permissions have user-facing reason strings
- [ ] Loading, empty, and error states handled
- [ ] Offline behavior considered
- [ ] README or this file updated if conventions changed

## Run commands

**Current (pre-monorepo)**
```
npm install
npx expo start
npx expo start --ios
npx expo start --android
npm run typecheck
npm run lint
eas build --profile development --platform ios
eas build --profile development --platform android
```

**Target (after Phase 0 monorepo conversion, npm workspaces + Turborepo)**
```
npm install                          # installs all workspaces
npm run dev -w @mma-finder/mobile    # start Expo dev server
npm run dev -w @mma-finder/admin     # start Next.js (Phase 2)
npm run gen -w @mma-finder/db        # regenerate Supabase types (Phase 0)
npm run typecheck                    # turbo runs all packages
npm run lint                         # turbo runs all packages
npm run eas:dev:ios -w @mma-finder/mobile
npm run eas:dev:android -w @mma-finder/mobile
```
