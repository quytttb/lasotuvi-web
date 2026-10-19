# AGENTS.md — LasoTuVi Web

## Overview

Frontend MVP for LasoTuVi: Next.js App Router app that calls LasoTuVi API directly
from the browser. No frontend backend, no auth, local IndexedDB persistence only.

## Stack

- Next.js 16.3.x (App Router), TypeScript strict, Node.js 24
- pnpm, Tailwind CSS v4, React Hook Form + Zod 4
- idb (IndexedDB), Vitest + RTL + MSW, Playwright

## Commands

```bash
pnpm install
cp .env.example .env.local
pnpm dev
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e   # requires prior pnpm build
pnpm api:types  # refresh OpenAPI snapshot from OPENAPI_SCHEMA_URL
```

CI (`.github/workflows/ci.yml`) runs `format:check` first and then the rest of
the chain above, plus the mocked `e2e/mvp.spec.ts`. Run `pnpm format` before
committing or lint-clean code will still fail CI.

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

## Environment notes

- Node 24, pnpm 10. `.nvmrc` = 24. Never use npm/yarn.
- If `.env.local` points at a LAN IP, treat it as machine-local config; keep
  `.env.example` as the source of truth for variable names. Never commit `.env.local`.
- Local build artifacts (`.next/`, `test-results/`, `tsconfig.tsbuildinfo`) are
  gitignored noise; leave them untouched.

## OpenAPI contract hygiene

- `src/types/api.generated.ts` + `openapi/openapi.json` are generated from the
  running backend via `pnpm api:types` (needs `OPENAPI_SCHEMA_URL` reachable).
- If the generated types look out of date, regenerate them first, then re-run
  `pnpm typecheck && pnpm test` before touching components. Never hand-edit
  generated files.

## Known issues (as of 2026-08-18 — resolved)

- `pnpm audit` is clean. The prior 10 vulnerabilities (postcss/sharp via Next,
  plus brace-expansion/js-yaml/nanoid transitives) were fixed by upgrading
  `next` 16.2 → 16.3.1 and pinning the remaining transitive minors via
  `pnpm.overrides` in `package.json`. Re-run `pnpm audit` after dependency bumps;
  new transitives may need additional override entries.
- `pnpm test:e2e` needs a fresh `pnpm build` first (and a live API for
  `live-api` / `compare-ref*` specs). CI only runs `mvp.spec.ts` against a
  mocked server — do not add live-API expectations to `mvp.spec.ts`.

## Audit reference

Full monorepo audit and fix plan: `../AUDIT.md` (relative to this repo).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
