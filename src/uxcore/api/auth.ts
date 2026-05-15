// SHARED with keepsimpleio/KeepSimpleOSS at the same path — sync edits to both repos.
import { signOut } from 'next-auth/react';

type MagicLinkLocale = 'en' | 'ru' | 'hy';

export type MagicLinkConsumeData =
  | { jwt: string; user: any }
  | { requiresProfile: true; registrationToken: string; email: string };

export type MagicLinkResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; status: number; message?: string };

export const logout = async (): Promise<void> => {
  await signOut({
    redirect: false,
    callbackUrl: '/',
  });

  localStorage.removeItem('accessToken');
  localStorage.removeItem('googleToken');
  localStorage.removeItem('provider');

  document.cookie =
    'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict;';

  window.location.reload();
};

export const authenticate = async (
  token: unknown,
  setAccountData: any,
  setToken: (value: any) => void,
): Promise<void> => {
  try {
    const provider = localStorage.getItem('provider');
    if (!provider) {
      console.error('No provider found in query');
      return;
    }
    const authLink = `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/${provider}/callback?access_token=${token}`;
    if (typeof token === 'string') {
      localStorage.setItem('googleToken', token);
    }
    const response = await fetch(authLink).then(resp => resp.json());
    if (response.jwt) {
      //Open Source TODO check here
      localStorage.setItem('accessToken', response.jwt);
    }

    if (response.user) {
      setAccountData(response.user);
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);
      document.cookie = `accessToken=${encodeURIComponent(
        accessToken,
      )}; path=/; Secure; SameSite=Strict;`;
    }
  } catch (e) {
    console.error(e);
    document.cookie = `accessToken=; path=/; Secure; SameSite=Strict;`;
    localStorage.removeItem('accessToken');
  }
};

// Shared JWT persistence used by both OAuth and magic-link flows. Keep this
// the only writer so the two flows behave identically once a JWT is in hand.
export const storeJwtSession = (
  jwt: string,
  user: any,
  setAccountData: (value: any) => void,
  setToken: (value: any) => void,
): void => {
  localStorage.setItem('accessToken', jwt);
  setAccountData(user);
  setToken(jwt);
  document.cookie = `accessToken=${encodeURIComponent(
    jwt,
  )}; path=/; Secure; SameSite=Strict;`;
};

const magicLinkUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/magic-link/${path}`;

const parseError = async (
  response: Response,
): Promise<{ code: string; status: number; message?: string }> => {
  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return {
    code: body?.error?.code || body?.code || 'UNKNOWN_ERROR',
    status: response.status,
    message: body?.error?.message || body?.message,
  };
};

export const requestMagicLink = async ({
  email,
  locale,
}: {
  email: string;
  locale: MagicLinkLocale;
}): Promise<MagicLinkResult<null>> => {
  try {
    const response = await fetch(magicLinkUrl('request'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, locale }),
    });
    if (!response.ok) {
      return { ok: false, ...(await parseError(response)) };
    }
    return { ok: true, data: null };
  } catch (e: any) {
    return { ok: false, code: 'NETWORK_ERROR', status: 0, message: e?.message };
  }
};

export const consumeMagicLink = async (
  token: string,
): Promise<MagicLinkResult<MagicLinkConsumeData>> => {
  try {
    const response = await fetch(magicLinkUrl('consume'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      return { ok: false, ...(await parseError(response)) };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, code: 'NETWORK_ERROR', status: 0, message: e?.message };
  }
};

export const completeMagicLinkRegistration = async ({
  registrationToken,
  name,
  surname,
}: {
  registrationToken: string;
  name: string;
  surname: string;
}): Promise<MagicLinkResult<{ jwt: string; user: any }>> => {
  try {
    const response = await fetch(magicLinkUrl('complete-registration'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationToken, name, surname }),
    });
    if (!response.ok) {
      return { ok: false, ...(await parseError(response)) };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, code: 'NETWORK_ERROR', status: 0, message: e?.message };
  }
};
