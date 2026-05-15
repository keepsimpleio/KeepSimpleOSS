import { signOut } from 'next-auth/react';

type MagicLinkLocale = 'en' | 'ru';

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

// Shared JWT persistence used by both OAuth and magic-link flows. The two flows
// MUST behave identically once a JWT is in hand — keep this the only writer.
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

export type AuthenticateErrorCode =
  | 'EMAIL_TAKEN'
  | 'NO_PROVIDER'
  | 'AUTH_FAILED'
  | 'NETWORK_ERROR';

export type AuthenticateResult =
  | { ok: true }
  | { ok: false; code: AuthenticateErrorCode; message?: string };

export const authenticate = async (
  token: unknown,
  setAccountData: any,
  setToken: (value: any) => void,
): Promise<AuthenticateResult> => {
  try {
    const provider = localStorage.getItem('provider');
    if (!provider) {
      console.error('No provider found in query');
      return { ok: false, code: 'NO_PROVIDER' };
    }
    const authLink = `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/${provider}/callback?access_token=${token}`;
    if (typeof token === 'string') {
      localStorage.setItem('googleToken', token);
    }
    const response = await fetch(authLink);
    const body = await response.json().catch(() => null);

    if (response.ok && body?.jwt && body?.user) {
      storeJwtSession(body.jwt, body.user, setAccountData, setToken);
      return { ok: true };
    }

    // Strapi users-permissions rejects the callback when the email is already
    // bound to a different provider. Surface that distinctly so the UI can
    // tell the user to use their original sign-in method.
    const rawMessage: string =
      body?.error?.message ||
      body?.message?.[0]?.messages?.[0]?.message ||
      (typeof body?.message === 'string' ? body.message : '') ||
      '';
    const code: AuthenticateErrorCode = /taken|exist/i.test(rawMessage)
      ? 'EMAIL_TAKEN'
      : 'AUTH_FAILED';
    return { ok: false, code, message: rawMessage };
  } catch (e: any) {
    console.error(e);
    document.cookie = `accessToken=; path=/; Secure; SameSite=Strict;`;
    localStorage.removeItem('accessToken');
    return { ok: false, code: 'NETWORK_ERROR', message: e?.message };
  }
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

const twitterEmailChangeUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/twitter/email-change/${path}`;

export const requestTwitterEmailChange = async ({
  email,
  locale,
  token,
}: {
  email: string;
  locale: MagicLinkLocale;
  token: string;
}): Promise<MagicLinkResult<null>> => {
  try {
    const response = await fetch(twitterEmailChangeUrl('request'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

export const confirmTwitterEmailChange = async (
  token: string,
): Promise<MagicLinkResult<{ email: string }>> => {
  try {
    const response = await fetch(twitterEmailChangeUrl('confirm'), {
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
