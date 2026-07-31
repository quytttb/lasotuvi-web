# LasoTuVi Web

[Bản tiếng Việt](README.md)

Vietnamese web app for generating and viewing Zi Wei Dou Shu charts via the [LasoTuVi API](https://github.com/quytttb/lasotuvi).

## Product goals

1. Enter birth day, month, year, and hour.
2. Generate a chart with `POST /chart/generate`.
3. View the traditional 12-palace board layout.
4. View Life/Bureau info, stem–branch, formations, and per-palace interpretations.
5. Save / open / rename / export / delete charts on-device (IndexedDB).
6. Print or save PDF via the browser (`window.print()`).
7. No login, no dedicated frontend backend, and no user data stored on a frontend server.

## Stack

- Next.js 16.2.12 (App Router) · TypeScript strict · Node.js 24
- pnpm · Tailwind CSS v4
- React Hook Form · Zod 4 · `@hookform/resolvers`
- `idb` · Lucide (when needed)
- Vitest · React Testing Library · MSW · Playwright
- ESLint flat config · Prettier

## Local setup

```bash
# Node.js 24 LTS
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Sample env file

```env
NEXT_PUBLIC_LASOTUVI_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_REPO_URL=https://github.com/quytttb/lasotuvi
OPENAPI_SCHEMA_URL=http://localhost:8000/openapi.json
```

`NEXT_PUBLIC_*` variables are **build-time**. After changing the API URL on Vercel, **rebuild/redeploy**.

## Running with a local backend

1. In the `lasotuvi` repo: `./run_api.sh` (default `:8000`).
2. Set `NEXT_PUBLIC_LASOTUVI_API_URL=http://localhost:8000`.
3. Ensure backend CORS allows `http://localhost:3000` (or `*` when credentials are off).

The browser calls the API **directly** — there is no Next.js proxy.

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium   # first time
pnpm test:e2e
```

E2E mocks the API with Playwright routes — CI does **not** call Render production.

## Updating OpenAPI / types

Committed snapshots live at `openapi/openapi.json` and `src/types/api.generated.ts`.

```bash
# With the local backend running:
OPENAPI_SCHEMA_URL=http://localhost:8000/openapi.json pnpm api:types
```

OpenAPI is not downloaded on every `build`.

## Local data model

IndexedDB database `lasotuvi-web`, store `charts`:

```ts
type SavedChart = {
  id: string;
  schemaVersion: 1;
  title: string;
  createdAt: string;
  updatedAt: string;
  birthInput: BirthInfoRequest;
  chart: ChartResponse;
};
```

Charts are saved only when the user clicks **Save chart**. JSON import is supported (Zod-validated; no silent overwrite of duplicate IDs unless overwrite is chosen).

## Deploy on Vercel

1. Import the `lasotuvi-web` repo into Vercel.
2. Framework: Next.js · Install: `pnpm install --frozen-lockfile` · Build: `pnpm build`.
3. Env:
   - `NEXT_PUBLIC_LASOTUVI_API_URL` = Render API URL
   - `NEXT_PUBLIC_SITE_URL` = production domain
4. Redeploy after every `NEXT_PUBLIC_*` change.

Basic settings are in `vercel.json`.

## Backend CORS

After you have a frontend domain, configure the backend:

```env
LASOTUVI_CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

The API does not use credentials, so early stages may keep `*`. When tightening CORS, add the production origin and localhost.

**Note:** Vercel preview domains change dynamically; if the backend only allows the production origin, previews will fail CORS.

## Render Free / cold start limits

Free hosts may sleep. The UI shows hints after ~8s and ~30s; timeout is 90s; there is a **Cancel** button. Chart `POST` requests are never auto-retried.

## Lunar leap months

`BirthInfoRequest` currently has **no** `is_leap_month`. The form notes that direct leap-month input is not fully supported.

## Privacy statement

- Chart generation sends birth date/time to the public API for computation.
- The frontend has no cloud database and no analytics in the MVP.
- Local save happens only when the user chooses it; data stays on that browser.
- Birth data is not put in the URL and is not logged in production.

## Scripts

| Script | Description |
|---|---|
| `dev` | Dev server |
| `build` / `start` | Production |
| `lint` / `typecheck` | Code quality |
| `test` / `test:watch` | Unit + component |
| `test:e2e` | Playwright |
| `api:types` | Refresh OpenAPI snapshot |
