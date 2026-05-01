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

## Folder layout
See `CLAUDE.md`. Source lives under `/src` with the `@/*` alias. Routes live under `/app`.

## Decision log
`/docs/decisions` holds one file per architectural decision.
