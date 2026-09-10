import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ITag, LibraryTag } from '@local-types/library/tag';

import { getLibraryTags } from '@api/library/tag/getLibraryTags';

import { useAuth } from '@components/Context/library/AuthContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';

interface DashboardContextValue {
  /**
   * The tags of the library on screen, each carrying its own book sequence.
   * A tag belongs to a library, so this list is fetched by library id and not
   * by account: an owner keeping two libraries sees each one's own vocabulary.
   */
  libraryTags: LibraryTag[];
  /**
   * Stamps a tag's own sequence after a drag, so the gathered row keeps the
   * order it was dropped into while the save is in flight.
   */
  setLibraryTags: Dispatch<SetStateAction<LibraryTag[]>>;
  /** The same list in the Strapi entry shape the tag forms read. */
  tags: ITag[];
  /** Re-reads the list after a tag is created, renamed, recoloured or deleted. */
  refreshLibraryTags: () => Promise<void>;
  /**
   * The tag the library is filtered down to, or null. One at a time: choosing
   * another replaces it, choosing the same one again clears the filter.
   */
  activeTagId: number | null;
  setActiveTagId: (id: number | null) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined,
);

interface DashboardProviderProps {
  children: ReactNode;
  /**
   * The tags as the server read them for this request, anonymously. Without
   * them the panel's first HTML says `No tags yet` to a reader who runs no
   * scripts, whatever the library actually holds.
   */
  initialTags?: LibraryTag[];
}

export function DashboardProvider({
  children,
  initialTags = [],
}: DashboardProviderProps) {
  const { token } = useAuth();
  const { currentLibrary } = useGlobalState();
  const libraryId = currentLibrary?.id ?? null;

  const [libraryTags, setLibraryTags] = useState<LibraryTag[]>(initialTags);
  const [activeTagId, setActiveTagId] = useState<number | null>(null);

  const refreshLibraryTags = useCallback(async () => {
    if (libraryId == null) {
      setLibraryTags([]);
      return;
    }
    setLibraryTags(await getLibraryTags(libraryId));
  }, [libraryId]);

  // The token matters as much as the library: signing in turns the visitor's
  // answer (tags labelling a public book) into the owner's own palette.
  useEffect(() => {
    void refreshLibraryTags();
  }, [refreshLibraryTags, token]);

  // A different library is a different vocabulary, so nothing filters until
  // its own tags arrive.
  useEffect(() => {
    setActiveTagId(null);
  }, [libraryId]);

  // A tag that is gone (deleted, or no longer visible to this viewer) cannot
  // stay the filter: the page would show a gathered shelf nothing names.
  useEffect(() => {
    setActiveTagId(current =>
      current != null && !libraryTags.some(t => t.id === current)
        ? null
        : current,
    );
  }, [libraryTags]);

  const tags = useMemo<ITag[]>(
    () =>
      libraryTags.map(tag => ({
        id: tag.id,
        attributes: {
          id: tag.id,
          name: tag.name,
          color: tag.color,
          description: tag.description ?? '',
          slug: tag.slug,
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
        },
      })),
    [libraryTags],
  );

  const value = useMemo(
    () => ({
      libraryTags,
      setLibraryTags,
      tags,
      refreshLibraryTags,
      activeTagId,
      setActiveTagId,
    }),
    [libraryTags, tags, refreshLibraryTags, activeTagId],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
}
