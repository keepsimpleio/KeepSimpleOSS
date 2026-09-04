// motion-passport: exempt — cookie helpers, render no markup and ship no styles.
import Cookies from 'js-cookie';

/**
 * Whether the desktop info panel (the right column: About / Author / Tags /
 * Share) is collapsed to its spine. One answer per account, shared across
 * every library the account opens, and it must survive a refresh without the
 * panel flashing open first — so it lives in a cookie the page reads
 * server-side, not in localStorage.
 *
 * The cookie is keyed by the account id so two people on one browser do not
 * inherit each other's choice; a logged-out visitor gets the `anon` key.
 */
const COOKIE_PREFIX = 'ks_library_panel_collapsed_';
const ONE_YEAR_DAYS = 365;
const ANON = 'anon';

export type PanelUserId = string | number | null | undefined;

export const sidebarPanelCookieName = (userId: PanelUserId): string =>
  `${COOKIE_PREFIX}${userId ?? ANON}`;

/** Server side: read the choice out of the raw `Cookie` request header. */
export const readSidebarCollapsedFromHeader = (
  cookieHeader: string | undefined,
  userId: PanelUserId,
): boolean => {
  if (!cookieHeader) return false;
  const wanted = sidebarPanelCookieName(userId);
  return cookieHeader.split(';').some(part => {
    const eq = part.indexOf('=');
    if (eq === -1) return false;
    return (
      part.slice(0, eq).trim() === wanted && part.slice(eq + 1).trim() === '1'
    );
  });
};

/** Client side: the same choice, read from `document.cookie`. */
export const readSidebarCollapsed = (userId: PanelUserId): boolean =>
  Cookies.get(sidebarPanelCookieName(userId)) === '1';

export const writeSidebarCollapsed = (
  userId: PanelUserId,
  collapsed: boolean,
): void => {
  Cookies.set(sidebarPanelCookieName(userId), collapsed ? '1' : '0', {
    expires: ONE_YEAR_DAYS,
    path: '/',
    sameSite: 'lax',
  });
};

/**
 * The account id inside the Strapi JWT (`{ id, iat, exp }`), read without
 * verifying the signature: this only picks which preference cookie to read,
 * so a forged id buys nothing. Returns null for a missing or malformed token.
 */
export const userIdFromAccessToken = (
  token: string | undefined,
): string | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    // base64url → base64: the token is read on the server (getServerSideProps)
    // and this module is also bundled for the client, so decode with the
    // global that exists on both sides rather than Node's Buffer.
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as { id?: string | number };
    return payload.id === undefined || payload.id === null
      ? null
      : String(payload.id);
  } catch {
    return null;
  }
};

/**
 * Server side, one call per page: which account is asking (from the
 * `accessToken` cookie the login flow writes) and whether they collapsed the
 * panel. Feeds `GlobalStateProvider`'s `initialSidebarCollapsed` so the first
 * paint already has the right width.
 */
export const readSidebarCollapsedForRequest = (
  cookieHeader: string | undefined,
): boolean => {
  const token = cookieHeader
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('accessToken='))
    ?.slice('accessToken='.length);
  const userId = userIdFromAccessToken(
    token ? decodeURIComponent(token) : undefined,
  );
  return readSidebarCollapsedFromHeader(cookieHeader, userId);
};
