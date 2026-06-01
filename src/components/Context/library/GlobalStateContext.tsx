'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';

import { getLibrariesList, getUserInfo } from '@/api/strapi';
import { useAuth } from '@/context/AuthContext';
import { getCookie } from '@/libraries/cookie';

import type { IUser } from '@/types/user';
import type { StrapiSingleShelfEntry } from '@/types/library';

interface GlobalStateContextValue {
  isGuestMode: boolean;
  isSidebarOpen: boolean;
  toggleGuestMode: () => void;
  toggleSidebar: () => void;
  user: IUser | null;
  isUserLoading: boolean;
  refetchUser: () => Promise<void>;
  libraries: unknown | null;
  isLibrariesLoading: boolean;
  refetchLibraries: () => Promise<void>;
  /**
   * Shelves of the library currently being viewed — populated by
   * `LibraryTemplate` so the Header can render the Jump-to nav without
   * having to fetch its own copy.
   */
  currentShelves: StrapiSingleShelfEntry[];
  setCurrentShelves: (shelves: StrapiSingleShelfEntry[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextValue | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { accountData, setAccountData, token } = useAuth();

  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [libraries, setLibraries] = useState<unknown>(null);
  const [isLibrariesLoading, setIsLibrariesLoading] = useState(false);
  const [currentShelves, setCurrentShelves] = useState<StrapiSingleShelfEntry[]>([]);
  const didAttemptUserLoad = useRef(false);
  const didAttemptLibrariesLoad = useRef(false);

  const refetchUser = useCallback(async () => {
    setIsUserLoading(true);
    try {
      const data = await getUserInfo();
      setAccountData(data);
    } finally {
      setIsUserLoading(false);
    }
  }, [setAccountData]);

  const refetchLibraries = useCallback(async () => {
    setIsLibrariesLoading(true);
    try {
      const data = await getLibrariesList();
      setLibraries(data);
    } finally {
      setIsLibrariesLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchLibraries();
  }, [refetchLibraries]);

  useEffect(() => {
    const hasToken = Boolean(getCookie('accessToken'));
    if (!hasToken) {
      didAttemptUserLoad.current = false;
      return;
    }
    if (accountData || didAttemptUserLoad.current) {
      return;
    }
    didAttemptUserLoad.current = true;
    void refetchUser();
  }, [accountData, session, refetchUser]);

  useEffect(() => {
    if (!token) {
      didAttemptLibrariesLoad.current = false;
      setLibraries(null);
      return;
    }
    if (didAttemptLibrariesLoad.current) {
      return;
    }
    didAttemptLibrariesLoad.current = true;
    void refetchLibraries();
  }, [token, session, refetchLibraries]);

  const value = useMemo(
    () => ({
      isGuestMode,
      isSidebarOpen,
      toggleGuestMode: () => setIsGuestMode((prev) => !prev),
      toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
      user: accountData,
      isUserLoading,
      refetchUser,
      libraries,
      isLibrariesLoading,
      refetchLibraries,
      currentShelves,
      setCurrentShelves,
    }),
    [
      isGuestMode,
      isSidebarOpen,
      accountData,
      isUserLoading,
      refetchUser,
      libraries,
      isLibrariesLoading,
      refetchLibraries,
      currentShelves,
      setCurrentShelves,
    ]
  );

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
}

export function useGlobalState(): GlobalStateContextValue {
  const context = useContext(GlobalStateContext);

  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }

  return context;
}
