// motion-passport: exempt — cookie helpers, render no markup and ship no styles.
import Cookies from 'js-cookie';

/**
 * The Library's own light or dark reading. A device choice, not an account
 * one: the person at the screen picks the light they read in. It lives in a
 * cookie so the page can be painted server-side in the right theme and never
 * flashes light before turning dark.
 */
export type LibraryTheme = 'light' | 'dark';

export const THEME_COOKIE = 'ks_library_theme';
const ONE_YEAR_DAYS = 365;

const asTheme = (value: string | undefined): LibraryTheme | null =>
  value === 'dark' || value === 'light' ? value : null;

/** Server side: the theme out of the raw `Cookie` request header. */
export const readThemeFromHeader = (
  cookieHeader: string | undefined,
): LibraryTheme | null => {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === THEME_COOKIE) {
      return asTheme(part.slice(eq + 1).trim());
    }
  }
  return null;
};

/** Client side: the same choice, read from `document.cookie`. */
export const readTheme = (): LibraryTheme | null =>
  asTheme(Cookies.get(THEME_COOKIE));

export const writeTheme = (theme: LibraryTheme): void => {
  Cookies.set(THEME_COOKIE, theme, {
    expires: ONE_YEAR_DAYS,
    path: '/',
    sameSite: 'lax',
  });
};
