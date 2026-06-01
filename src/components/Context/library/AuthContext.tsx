import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { IUser } from '@local-types/library/user';

import { getCookie } from '@lib/library/cookie';

import { logout } from '@api/auth';

type AuthContextValue = {
  accountData: IUser | null;
  setAccountData: (value: IUser | null) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  handleProviderSignIn: (provider: string) => void;
  handleLogout: () => void;
};

const defaultValues: AuthContextValue = {
  accountData: null,
  setAccountData: () => {},
  token: null,
  setToken: () => {},
  handleProviderSignIn: () => {},
  handleLogout: () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultValues);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [token, setToken] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<IUser | null>(null);

  const handleProviderSignIn = async (provider: string) => {
    // Store current page as return URL before login
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      // Don't store auth or dashboard pages as return URLs
      if (
        !currentPath.includes('/auth') &&
        !currentPath.includes('/dashboard')
      ) {
        localStorage.setItem('returnUrl', currentPath);
      }
    }

    if (session && accountData === null) {
      await signOut({ redirect: false });

      sessionStorage.clear();
      document.cookie =
        'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      setTimeout(() => {
        router.replace(`/auth?provider=${provider}`);
      }, 100);
    } else {
      router.push(`/auth?provider=${provider}`);
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    const secure = window.location.protocol === 'https:' ? ' Secure;' : '';
    document.cookie = `accessToken=; path=/;${secure} SameSite=Strict;`;
  }, []);

  useEffect(() => {
    const accessToken = getCookie('accessToken') as string | undefined;
    setToken(accessToken || null);
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        token,
        accountData,
        setToken,
        setAccountData,
        handleLogout,
        handleProviderSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Auth component must be used within AuthProvider');
  }

  return context;
}
