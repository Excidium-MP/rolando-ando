# Project: rolando-ando (Jiu Jitsu Mobile)

A social platform for Jiu Jitsu practitioners. Find nearby teams, discover open mats, browse games and reviews.

Status: prototype. Owner: Manuel. Platforms: iOS + Android.

## Stack
Expo (managed) + React Native + TypeScript. Expo Router for navigation. NativeWind for styling. Supabase for backend (Postgres + Auth + Storage). React Query for server state, Zustand for client state. expo-secure-store for tokens, AsyncStorage for non-sensitive persistent state. EAS Build / Submit.

## Folder structure
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
- All schema changes via migrations in `/supabase/migrations`.
- Every table has Row Level Security enabled. Default deny.
- Multi-tenant tables include `user_id` with a matching RLS policy.
- Tables: snake_case, plural. Every table has `created_at` and `updated_at`.
- Indexes on every foreign key and on columns used in `WHERE`.

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
- No em dashes in any output.
- **Stop and ask** before touching: auth flows, payments, RLS policies, migrations on existing tables, native config (`app.config.ts`), permissions, or anything destructive.
- Native-aware: if a change requires a new native module, flag that a new dev client build is needed.
- Platform check: confirm fixes work on both iOS and Android, or flag the platform-specific assumption.

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
