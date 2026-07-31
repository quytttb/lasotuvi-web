/**
 * Public build-time configuration.
 * Changing NEXT_PUBLIC_* requires a rebuild/redeploy.
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_LASOTUVI_API_URL ?? "http://localhost:8000";
  return trimTrailingSlash(raw.trim());
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return trimTrailingSlash(raw.trim());
}

export function getBackendRepoUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_REPO_URL?.trim();
  return raw ? raw : "https://github.com/quytttb/lasotuvi";
}

export function joinApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
