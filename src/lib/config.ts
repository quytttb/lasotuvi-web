/**
 * Public build-time configuration.
 * Changing NEXT_PUBLIC_* requires a rebuild/redeploy.
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_LASOTUVI_API_URL;
  if (raw && (!raw.includes("localhost") || process.env.NODE_ENV === "test")) {
    return trimTrailingSlash(raw.trim());
  }
  return "https://lasotuvi-api.onrender.com";
}

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null);

  if (raw && !raw.includes("localhost")) {
    return trimTrailingSlash(raw.trim());
  }

  return "https://lasotuvi-web.vercel.app";
}

export function getBackendRepoUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_REPO_URL?.trim();
  return raw ? raw : "https://github.com/quytttb/lasotuvi";
}

export function getFrontendRepoUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRONTEND_REPO_URL?.trim();
  return raw ? raw : "https://github.com/quytttb/lasotuvi-web";
}

export function getContactPhone(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
  return raw ? raw : "0394 432 955";
}

export function getContactFacebook(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_FACEBOOK?.trim();
  return raw ? raw : "https://www.facebook.com/ly.buihuu.7";
}

export function joinApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
