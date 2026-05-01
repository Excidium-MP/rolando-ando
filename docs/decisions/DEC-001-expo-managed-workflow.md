# DEC-001: Use Expo managed workflow over bare React Native

Date: 2026-05-01

## Context
Bootstrapping a new Jiu Jitsu mobile app. Need iOS + Android from a small team, fast iteration, OTA updates for JS-only changes, and managed builds without owning Xcode/Android Studio toolchains day-to-day.

## Decision
Use Expo SDK 54 managed workflow with EAS Build / Submit. File-based routing via Expo Router. NativeWind for styling. Supabase for backend.

## Tradeoffs
- Native modules outside the Expo SDK require a custom dev client build.
- Some bleeding-edge native APIs may need a config plugin or a switch to bare workflow later.
- In exchange we get: simpler upgrades, OTA updates, EAS Build, no native project files in the repo, faster onboarding.

If we ever hit a native ceiling we can `npx expo prebuild` into bare without losing JS code.
