import { useSession } from 'next-auth/react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  StrapiLibrariesResponse,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';
import type { IUser } from '@local-types/library/user';

import { getCookie } from '@lib/library/cookie';

import { getLibrariesList } from '@api/library/getLibrariesList';
import { getUserInfo } from '@api/library/user/getUserInfo';

import { useAuth } from '@components/Context/library/AuthContext';

interface GlobalStateContextValue {
  isGuestMode: boolean;
  isSidebarOpen: boolean;
  toggleGuestMode: () => void;
  toggleSidebar: () => void;
  user: IUser | null;
  isUserLoading: boolean;
  refetchUser: () => Promise<void>;
  libraries: StrapiLibrariesResponse | null;
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

const GlobalStateContext = createContext<GlobalStateContextValue | undefined>(
  undefined,
);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { accountData, setAccountData, token } = useAuth();

  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [libraries, setLibraries] = useState<StrapiLibrariesResponse | null>(
    null,
  );
  const [isLibrariesLoading, setIsLibrariesLoading] = useState(false);
  const [currentShelves, setCurrentShelves] = useState<
    StrapiSingleShelfEntry[]
  >([]);
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
      const data = await getLibrariesList<StrapiLibrariesResponse>();
      setLibraries(data);
    } finally {
      setIsLibrariesLoading(false);
    }
  }, []);

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
      toggleGuestMode: () => setIsGuestMode(prev => !prev),
      toggleSidebar: () => setIsSidebarOpen(prev => !prev),
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
    ],
  );

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState(): GlobalStateContextValue {
  const context = useContext(GlobalStateContext);

  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }

  return context;
}
