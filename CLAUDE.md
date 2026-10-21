# CLAUDE.md - eCampus KPI Project Guide

## Project Overview

Electronic Campus (eCampus) for Igor Sikorsky Kyiv Polytechnic Institute - a full-stack web application for educational management. Supports study sheet management, certificates, grading, announcements, and academic modules.

## Tech Stack

- **Framework**: Next.js 15.4.7 (App Router with Turbopack)
- **React**: 19.1.0 with Server Components
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4.1.10
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **i18n**: next-intl (Ukrainian default, English)
- **Backend**: External Campus API (REST with JWT auth)

## Quick Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Run production server
npm run lint         # Run Oxlint
npm run lint:fix     # Fix auto-fixable lint issues
npm run format       # Format with Oxfmt (including imports and Tailwind classes)
npm run format:check # Check formatting without writing
npm run tsc          # Type check only
npm run storybook    # Start Storybook on port 6006
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (uk, en)
│   │   ├── (public)/      # Public routes (auth, support)
│   │   └── (private)/     # Protected routes (modules)
│   └── api/               # API routes (healthz, kpi-id)
├── actions/               # Server actions (auth, certificates, etc.)
├── components/
│   ├── ui/               # shadcn/ui components (43+)
│   └── typography/       # Text components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities & constants
├── middleware/           # Auth & i18n middleware
├── types/                # TypeScript types & enums
├── messages/             # Translation files (en.json, uk.json)
└── i18n/                 # i18n configuration
```

## Code Style

- **Oxlint**: `.oxlintrc.json` preserves supported Next.js, React, React Hooks, accessibility, and import rules, plus required braces. The legacy `react/no-deprecated` rule has no native equivalent; JSX usage tracking rules are unnecessary without ESLint's unused-variable analysis.
- **Oxfmt**: `.oxfmtrc.json` uses single quotes, trailing commas, 120 print width, LF line endings, and built-in Tailwind class sorting with the project's Tailwind v4 stylesheet.
- **Imports**: Sorted with Oxfmt into external packages, `@/` aliases, and relative imports. Run `npm run format` after `npm run lint:fix`.
- **Path alias**: `@/*` maps to `./src/*`

## TypeScript Configuration

Strict mode enabled with:

- `noUnusedLocals`, `noUnusedParameters`
- `noImplicitReturns`, `strictNullChecks`
- `noFallthroughCasesInSwitch`

## Key Patterns

### Server Actions

```typescript
'use server';
// Actions in src/actions/*.actions.ts
```

### API Client

```typescript
import { campusFetch } from '@/lib/client';
// Automatically injects JWT from cookies
```

### Translations

- Files: `src/messages/{uk,en}.json`
- Supported tags: `<p>`, `<br/>`, `<h1-h6>`, `<ul>`, `<li>`, `<tel>`, `<email>`

### SVG Imports

```typescript
import Icon from './icon.svg'; // As React component
import iconUrl from './icon.svg?url'; // As URL string
```

## Environment Variables

Required in `.env.development` / `.env.production`:

- `CAMPUS_API_BASE_PATH` - Backend API URL
- `MAIN_COOKIE_DOMAIN`, `ROOT_COOKIE_DOMAIN` - Cookie domains
- `OLD_CAMPUS_URL` - Legacy campus URL
- `NEXT_PUBLIC_RECAPTCHA_KEY` - reCAPTCHA v3 key
- `NEXT_PUBLIC_KPI_ID_APP_ID` - OAuth app ID

## Authentication

- JWT stored in cookies
- Middleware handles auth checks (`src/middleware/`)
- Multiple account types: student, lecturer, curator, admin
- Code of honor acceptance required for new users

## Locales

- Default: Ukrainian (uk)
- Supported: English (en)
- URL pattern: `/{locale}/...`

## Deployment

- Docker multi-stage build (Node 18-alpine)
- Standalone output mode
- GitHub Actions CI/CD
- Image: `kpiua/ecampus.kpi.ua`

## Testing

No testing framework currently configured.

## Useful Paths

- Components: `src/components/ui/`
- Server actions: `src/actions/`
- Types/Enums: `src/types/`
- Translations: `src/messages/`
- Middleware: `src/middleware/`
