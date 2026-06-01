import { signOut } from 'next-auth/react';

import { IUser } from '@/types/user';

export const logout = async (): Promise<void> => {
  await signOut({
    redirect: false,
    callbackUrl: '/',
  });

  localStorage.removeItem('provider');

  // `Secure` is silently dropped by browsers on http://, so we omit it on non-HTTPS
  // (i.e. local dev) — otherwise the cookie clear is never applied.
  const secure = window.location.protocol === 'https:' ? ' Secure;' : '';
  document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;${secure} SameSite=Strict;`;

  window.location.reload();
};

export const authenticate = async (
  token: unknown,
  setAccountData: (value: IUser) => void,
  setToken: (value: string | null) => void
): Promise<void> => {
  try {
    const provider = localStorage.getItem('provider');
    if (!provider) {
      console.error('No provider found in query');
      return;
    }
    const authLink = `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/${provider}/callback?access_token=${token}`;

    const response = await fetch(authLink).then((resp) => resp.json());

    if (response.user) {
      const accessToken = response.jwt;
      setAccountData(response.user);
      setToken(accessToken);
      const secure = window.location.protocol === 'https:' ? ' Secure;' : '';
      document.cookie = `accessToken=${encodeURIComponent(
        accessToken || ''
      )}; path=/;${secure} SameSite=Strict;`;
    }
  } catch (e) {
    console.error(e);
    const secure = window.location.protocol === 'https:' ? ' Secure;' : '';
    document.cookie = `accessToken=; path=/;${secure} SameSite=Strict;`;
    localStorage.removeItem('accessToken');
  }
};
