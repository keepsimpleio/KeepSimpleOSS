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

// Match the host login flow. A leftover cookie cannot restore a signed-out account.
export const getAccessToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem('accessToken') ?? undefined;
};
