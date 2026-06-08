import Cookies from 'js-cookie';

export const getCookie = (name: string) => {
  return Cookies?.get(name) as string | number;
};

export const removeCookie = (name: string) => {
  return Cookies.remove(name);
};

// Set default expires to 3 days if not provided
export const setCookie = (name: string, value: string, expires: number = 3) => {
  return Cookies.set(name, value, { expires });
};

// The login flow writes the JWT to BOTH localStorage and a session cookie, but
// only the cookie is read by the library stack. The cookie has no `expires` (so
// it dies with the browser session) and is `Secure` (dropped on http in some
// browsers), whereas localStorage persists. Falling back to localStorage keeps
// the library authenticated whenever the rest of the app still is.
export const getAccessToken = (): string | undefined => {
  const fromCookie = Cookies?.get('accessToken');
  if (fromCookie) return fromCookie;
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('accessToken') ?? undefined;
  }
  return undefined;
};
