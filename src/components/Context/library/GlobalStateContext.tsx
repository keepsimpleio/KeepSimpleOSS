// Guest preview motion follows the Library passport in CLAUDE.md.
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
import { flushSync } from 'react-dom';

import type {
  ILibrary,
  LibraryOwner,
  StrapiLibrariesResponse,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';
import type { IUser } from '@local-types/library/user';

import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from '@lib/library/sidebarPanel';

import { getLibrariesList } from '@api/library/getLibrariesList';

import { useAuth } from '@components/Context/library/AuthContext';

interface GlobalStateContextValue {
  isGuestMode: boolean;
  isSidebarOpen: boolean;
  toggleGuestMode: () => void;
  /** Leave guest mode outright — used when the viewed library changes. */
  setGuestMode: (value: boolean) => void;
  toggleSidebar: () => void;
  /** Close the mobile drawer (a toggle would reopen it from a closed state). */
  closeSidebar: () => void;
  /**
   * Desktop only: the info panel folded to its spine so the shelves take the
   * width. Remembered per account across every library and across refreshes
   * (see `@lib/library/sidebarPanel`); the mobile drawer ignores it.
   */
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  /**
   * Whether the viewer owns the library on screen. Decided once, by
   * `LibraryTemplate`, and published here so the Sidebar and the shelves can
   * never disagree about who is looking.
   */
  isOwner: boolean;
  setIsOwner: (value: boolean) => void;
  user: IUser | null;
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
}

const GlobalStateContext = createContext<GlobalStateContextValue | undefined>(
  undefined,
);

interface GlobalStateProviderProps {
  children: ReactNode;
  /**
   * The collapsed choice as read from the request cookie by the page's
   * `getServerSideProps`, so the server paints the panel at its final width
   * and a refresh never shows it open for a frame before folding.
   */
  initialSidebarCollapsed?: boolean;
  /**
   * The library as the server read it, anonymously, for this request. The
   * panel's About, counts and Author are published here by `LibraryTemplate`
   * after it loads, which is a paint too late for a reader who runs no
   * scripts: seeded here, the first HTML already carries them.
   */
  initialLibrary?: ILibrary | null;
}

/** The panel's reading of the owner, from the same fields the template uses. */
const ownerOf = (library: ILibrary | null): LibraryOwner | null => {
  if (!library) return null;

  const owner = library.attributes.user?.data;

  return {
    id: owner?.id,
    username: owner?.attributes.username,
    name: owner?.attributes.name,
    picture: owner?.attributes.picture,
    avatar: library.attributes.avatar?.data?.attributes?.url,
    aboutMe: library.attributes.aboutMe,
  };
};

/** Shelves in their saved sequence, as the page draws them. */
const shelvesOf = (library: ILibrary | null): StrapiSingleShelfEntry[] =>
  [...(library?.attributes.singleShelves?.data ?? [])].sort(
    (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
  );

export function GlobalStateProvider({
  children,
  initialSidebarCollapsed = false,
  initialLibrary = null,
}: GlobalStateProviderProps) {
  const { data: session } = useSession();
  const { accountData, token } = useAuth();

  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    initialSidebarCollapsed,
  );
  const [libraries, setLibraries] = useState<StrapiLibrariesResponse | null>(
    null,
  );
  const [isLibrariesLoading, setIsLibrariesLoading] = useState(false);
  const [currentShelves, setCurrentShelves] = useState<
    StrapiSingleShelfEntry[]
  >(() => shelvesOf(initialLibrary));
  const [currentOwner, setCurrentOwner] = useState<LibraryOwner | null>(() =>
    ownerOf(initialLibrary),
  );
  const [currentLibrary, setCurrentLibrary] = useState<ILibrary | null>(
    initialLibrary,
  );
  const [isOwner, setIsOwner] = useState(false);

  const refetchLibraries = useCallback(async () => {
    setIsLibrariesLoading(true);
    try {
      const data = await getLibrariesList<StrapiLibrariesResponse>();
      setLibraries(data);
    } finally {
      setIsLibrariesLoading(false);
    }
  }, []);

  // The server read the cookie for whichever account the request carried.
  // Once the account is actually known here (it can arrive later: a token in
  // localStorage before the host account finishes loading), re-read
  // that account's own choice so it wins over the anonymous default.
  const accountId = accountData?.id;
  useEffect(() => {
    if (!accountId) return;
    setIsSidebarCollapsed(readSidebarCollapsed(accountId));
  }, [accountId]);

  const toggleSidebarCollapsed = useCallback(() => {
    const next = !isSidebarCollapsed;
    writeSidebarCollapsed(accountId, next);
    setIsSidebarCollapsed(next);
  }, [accountId, isSidebarCollapsed]);

  useEffect(() => {
    // `/api/libraries` is publicly readable, so the right-panel library
    // dropdown should populate for everyone — including logged-out/incognito
    // visitors. Refetch when auth state (token/session) changes in case the
    // visible set differs for an authenticated viewer.
    void refetchLibraries();
  }, [token, session, refetchLibraries]);

  const modeTransition = useRef<{ skipTransition: () => void } | null>(null);
  useEffect(() => () => modeTransition.current?.skipTransition(), []);

  const toggleGuestMode = useCallback(() => {
    const update = () => flushSync(() => setIsGuestMode(prev => !prev));
    modeTransition.current?.skipTransition();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }

    const page = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
        skipTransition: () => void;
      };
    };
    if (page.startViewTransition) {
      const transition = page.startViewTransition(update);
      modeTransition.current = transition;
      void transition.ready
        .then(() => {
          for (const [state, opacity] of [
            ['old', [1, 0]],
            ['new', [0, 1]],
          ] as const) {
            document.documentElement.animate(
              { opacity: [...opacity] },
              {
                duration: 200,
                easing: 'ease',
                fill: 'both',
                pseudoElement: `::view-transition-${state}(root)`,
              },
            );
          }
        })
        .catch(() => {});
      void transition.finished
        .finally(() => {
          if (modeTransition.current === transition)
            modeTransition.current = null;
        })
        .catch(() => {});
    } else {
      update();
      document
        .querySelectorAll('[data-library-mode-surface]')
        .forEach(surface => {
          surface.animate?.(
            { opacity: [0, 1] },
            { duration: 200, easing: 'ease' },
          );
        });
    }
  }, []);

  const value = useMemo(
    () => ({
      isGuestMode,
      isSidebarOpen,
      toggleGuestMode,
      setGuestMode: setIsGuestMode,
      toggleSidebar: () => setIsSidebarOpen(prev => !prev),
      closeSidebar: () => setIsSidebarOpen(false),
      isSidebarCollapsed,
      toggleSidebarCollapsed,
      isOwner,
      setIsOwner,
      user: accountData,
      libraries,
      isLibrariesLoading,
      refetchLibraries,
      currentShelves,
      setCurrentShelves,
      currentOwner,
      setCurrentOwner,
      currentLibrary,
      setCurrentLibrary,
    }),
    [
      isOwner,
      isGuestMode,
      toggleGuestMode,
      isSidebarOpen,
      isSidebarCollapsed,
      toggleSidebarCollapsed,
      accountData,
      libraries,
      isLibrariesLoading,
      refetchLibraries,
      currentShelves,
      setCurrentShelves,
      currentOwner,
      setCurrentOwner,
      currentLibrary,
      setCurrentLibrary,
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
