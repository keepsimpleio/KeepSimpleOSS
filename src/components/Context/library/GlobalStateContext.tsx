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
  ILibrary,
  LibraryOwner,
  StrapiLibrariesResponse,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';
import type { IUser } from '@local-types/library/user';

import { getAccessToken } from '@lib/library/cookie';

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
  /**
   * Owner of the library currently being viewed — published by
   * `LibraryTemplate` so the Sidebar's Author panel shows the library's owner
   * rather than the logged-in viewer (`/api/users/me`).
   */
  currentOwner: LibraryOwner | null;
  setCurrentOwner: (owner: LibraryOwner | null) => void;
  /**
   * The full library entry currently being viewed — published by
   * `LibraryTemplate`. The Sidebar edits this directly when it's the owner's
   * own library, so there's no separate fetch to disagree with what's on screen.
   */
  currentLibrary: ILibrary | null;
  setCurrentLibrary: (library: ILibrary | null) => void;
  /**
   * True when the owner is on their own library with no library yet and lacks
   * the `can-create-library` feature flag. Published by `LibraryTemplate` so the
   * Sidebar (right panel) can hide itself alongside the no-permission screen.
   */
  isCreateBlocked: boolean;
  setIsCreateBlocked: (value: boolean) => void;
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
  const [currentOwner, setCurrentOwner] = useState<LibraryOwner | null>(null);
  const [currentLibrary, setCurrentLibrary] = useState<ILibrary | null>(null);
  const [isCreateBlocked, setIsCreateBlocked] = useState(false);
  const didAttemptUserLoad = useRef(false);

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
    const hasToken = Boolean(getAccessToken());
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
    // `/api/libraries` is publicly readable, so the right-panel library
    // dropdown should populate for everyone — including logged-out/incognito
    // visitors. Refetch when auth state (token/session) changes in case the
    // visible set differs for an authenticated viewer.
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
      currentOwner,
      setCurrentOwner,
      currentLibrary,
      setCurrentLibrary,
      isCreateBlocked,
      setIsCreateBlocked,
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
      currentOwner,
      setCurrentOwner,
      currentLibrary,
      setCurrentLibrary,
      isCreateBlocked,
      setIsCreateBlocked,
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
