# AGENTS.md — LasoTuVi Web

## Overview

Frontend MVP for LasoTuVi: Next.js App Router app that calls LasoTuVi API v2 directly
from the browser. No frontend backend, no auth, local IndexedDB persistence only.

## Stack

- Next.js 16.2.x (App Router), TypeScript strict, Node.js 24
- pnpm, Tailwind CSS v4, React Hook Form + Zod 4
- idb (IndexedDB), Vitest + RTL + MSW, Playwright

## Commands

```bash
pnpm install
cp .env.example .env.local
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e   # requires prior pnpm build
pnpm api:types  # refresh OpenAPI snapshot from OPENAPI_SCHEMA_URL
```

## Architecture rules

- Browser fetches `NEXT_PUBLIC_LASOTUVI_API_URL` directly (`credentials: "omit"`).
- Do not add Server Actions or Route Handlers that proxy the chart API.
- Do not put birth info in the URL.
- Do not use `dangerouslySetInnerHTML` for API content.
- Print via CSS `@media print` + `window.print()` only.
- Keep Server Components for static pages; client components only where needed.
- OpenAPI types are committed under `openapi/` and `src/types/api.generated.ts`.

## Backend contract

Primary endpoint: `POST /chart/generate`. Do not also call `/chart/analyze` in the MVP flow.
