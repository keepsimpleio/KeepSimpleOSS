/**
 * Shared review session for the DEV preview host.
 *
 * Google sign-in does not work on `keepsimple.administration.ae` (the DEV
 * callback URL is not registered on the shared Google OAuth client, and that
 * client is used by every developer's local environment — repointing it is not
 * an option). While the library is under joint review, everyone behind the
 * Cloudflare Access gate should land on the preview already logged in as the
 * library owner, without a per-person sign-in dance.
 *
 * The flow has two halves:
 *   1. The owner opens `/library/dev-share-session` once while logged in. That
 *      page donates the JWT already in their browser to the DEV server.
 *   2. Every later visitor with no session of their own silently claims that
 *      JWT and gets the owner's logged-in state.
 *
 * The JWT is stored server-side in a gitignored file inside the DEV container,
 * never in the repo. Both halves are hard-gated to non-production environments
 * and to the DEV/local hostnames — see `isDevSessionHost` and the matching
 * server-side guard in `pages/api/library/dev-session`.
 *
 * Remove this module when review ends and Library ships.
 */

export const DEV_SESSION_ENDPOINT = '/api/library/dev-session';

const DEV_SESSION_HOSTS = [
  'keepsimple.administration.ae',
  'localhost',
  '127.0.0.1',
];

/**
 * True only on the DEV preview host (or a local dev server) and only outside
 * production. Both conditions must hold: `NEXT_PUBLIC_ENV` alone would let a
 * mis-set env open the door on a public host, and the hostname alone would let
 * a production build of the DEV host do the same.
 */
export const isDevSessionHost = (hostname: string): boolean => {
  if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    return false;
  }

  return DEV_SESSION_HOSTS.includes(hostname);
};

export const isDevSessionEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return isDevSessionHost(window.location.hostname);
};

/**
 * Plant a donated JWT into this browser exactly the way the real login flows
 * do — `storeJwtSession` writes both, and the library stack reads the cookie
 * first with a localStorage fallback.
 */
const adoptJwt = (jwt: string): void => {
  window.localStorage.setItem('accessToken', jwt);
  document.cookie = `accessToken=${encodeURIComponent(
    jwt,
  )}; path=/; Secure; SameSite=Strict;`;
};

/**
 * Claim the donated owner session. Returns true when a JWT was adopted, so the
 * caller can refetch the account instead of rendering a logged-out shell.
 */
export const claimDevSession = async (): Promise<boolean> => {
  if (!isDevSessionEnabled()) {
    return false;
  }

  try {
    const response = await fetch(DEV_SESSION_ENDPOINT);
    if (!response.ok) {
      return false;
    }

    const body = await response.json();
    if (!body?.jwt) {
      return false;
    }

    adoptJwt(body.jwt);

    return true;
  } catch {
    return false;
  }
};

/** Hand this browser's JWT to the DEV server so other reviewers can claim it. */
export const donateDevSession = async (
  jwt: string,
): Promise<{ ok: boolean; message?: string }> => {
  if (!isDevSessionEnabled()) {
    return { ok: false, message: 'Not available on this host.' };
  }

  try {
    const response = await fetch(DEV_SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return { ok: false, message: body?.message || `HTTP ${response.status}` };
    }

    return { ok: true };
  } catch (error: any) {
    return { ok: false, message: error?.message };
  }
};
