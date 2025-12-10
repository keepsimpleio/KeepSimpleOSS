import { signOut } from 'next-auth/react';

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
