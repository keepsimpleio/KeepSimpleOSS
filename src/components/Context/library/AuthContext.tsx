import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import { IUser } from '@local-types/library/user';

import { getAccessToken, removeCookie } from '@lib/library/cookie';

import { logout } from '@api/auth';

import { GlobalContext } from '@components/Context/GlobalContext';

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

  const { accountData, setAccountData, setToken } = useContext(GlobalContext);
  const token = accountData ? (getAccessToken() ?? null) : null;

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
      removeCookie('next-auth.session-token');

      setTimeout(() => {
        router.replace(`/auth?provider=${provider}`);
      }, 100);
    } else {
      router.push(`/auth?provider=${provider}`);
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    removeCookie('accessToken');
    setToken(null);
    setAccountData(null);
  }, [setAccountData, setToken]);

  useEffect(() => {
    const syncLogout = () => {
      if (!getAccessToken()) {
        removeCookie('accessToken');
        setAccountData(null);
        setToken(null);
      }
    };
    window.addEventListener('storage', syncLogout);
    window.addEventListener('focus', syncLogout);
    window.addEventListener('auth:expired', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
      window.removeEventListener('focus', syncLogout);
      window.removeEventListener('auth:expired', syncLogout);
    };
  }, [setAccountData, setToken]);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) removeCookie('accessToken');
    setToken(accessToken || null);
  }, [session, setToken]);

  return (
    <AuthContext.Provider
      value={{
        token,
        accountData: token ? accountData : null,
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
