# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SMK Negeri 7 student mobile app built with Expo SDK 56 (React Native 0.85.3, React 19, TypeScript). File-based routing via expo-router. Targets Android, iOS, and Web.

Connects to a Laravel backend at `/home/kcn/Coding/smk7-academic-system` via REST API (Sanctum auth).

**Read the exact versioned Expo docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.**

## Commands

```bash
npx expo start              # Start dev server
npx expo start --android    # Start on Android
npx expo start --ios        # Start on iOS
npx expo start --web        # Start on web
npx expo lint               # Run linter
```

## Architecture

### Routing (expo-router)

File-based routing in `src/app/`. Structure:
- `(auth)/` — Login, Register (unauthenticated)
- `(app)/(tabs)/` — Main tab screens (Dashboard, Attendance, Scan QR, Exams, Profile)
- `exams/[id]` — Exam detail
- `exams/attempt` — Active exam attempt (full screen)
- `excuses/create` — Create excuse form
- `excuses/[id]` — Excuse detail

### Data Layer

- **API client**: `src/api/client.ts` — Axios instance with Sanctum token interceptor
- **API modules**: `src/api/` — auth, dashboard, attendance, exams, excuses, profile
- **React Query hooks**: `src/hooks/` — use-auth, use-dashboard, use-attendance, use-exams, use-excuses, use-profile
- **Types**: `src/types/` — TypeScript interfaces for API responses

### Auth Flow

- Token stored in `expo-secure-store`
- `AuthProvider` in `src/hooks/use-auth.tsx` manages auth state
- Auth gate: `(app)/_layout.tsx` redirects to login if not authenticated
- `(auth)/_layout.tsx` redirects to tabs if already authenticated

### Styling

NativeWind (Tailwind CSS for React Native). Use `className` prop with Tailwind classes.

### Key Directories

- `src/app/` — screens and layouts
- `src/api/` — API client and endpoint functions
- `src/hooks/` — React Query hooks and auth context
- `src/components/ui/` — reusable UI components (Button, Input, Card, Badge, LoadingSpinner, EmptyState)
- `src/types/` — TypeScript type definitions
- `src/lib/` — utilities (secure-store, query-client)
- `src/constants/` — API config, theme

### Backend API

Base URL configured in `src/constants/api.ts`. All endpoints under `/api/v1/`:
- `POST /v1/login`, `/v1/register`, `/v1/logout`, `GET /v1/me`
- Student endpoints under `/v1/student/`: dashboard, attendance, exams, excuses, profile

## Configuration

- **TypeScript strict mode** enabled
- **React Compiler** experiment enabled
- **Typed routes** experiment enabled
- **NativeWind** configured via babel.config.js, metro.config.js, tailwind.config.js
- Path aliases: `@/*` → `./src/*`
