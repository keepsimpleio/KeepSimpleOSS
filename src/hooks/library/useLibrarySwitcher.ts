import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';

export interface LibrarySwitcherOption {
  value: string;
  label: string;
}

export interface LibrarySwitcher {
  options: LibrarySwitcherOption[];
  /** The option that names the library on screen; '' until the list lands. */
  value: string;
  /** Navigate to another library by its username (or numeric id fallback). */
  onChange: (libraryId: string) => void;
}

/**
 * One switcher, two homes: the page heading and the About panel both show
 * "whose library is this" as a dropdown of every library the viewer may
 * open. Selecting one navigates to `/library/[username]`.
 */
export function useLibrarySwitcher(onSelect?: () => void): LibrarySwitcher {
  const router = useRouter();
  const { libraries } = useGlobalState();

  // The library being viewed is always the `[username]` route segment — read it
  // from the router params, not the URL tail. On nested routes
  // (`/library/[username]/[slug]`, `/library/[username]/share/[token]`) the tail
  // is the object slug or share token, not the library.
  const usernameParam = router.query.username;
  const currentLibraryId =
    (Array.isArray(usernameParam) ? usernameParam[0] : usernameParam) ?? '';

  const libraryCards = useMemo(() => {
    if (!libraries || !Array.isArray(libraries.data)) {
      return [];
    }
    return mapStrapiLibrariesResponseToCards(
      libraries,
      process.env.NEXT_PUBLIC_STRAPI,
    );
  }, [libraries]);

  const [selectedLibraryId, setSelectedLibraryId] = useState(
    currentLibraryId ||
      (libraryCards[0]
        ? (libraryCards[0].username ?? String(libraryCards[0].id))
        : ''),
  );

  useEffect(() => {
    if (currentLibraryId) {
      setSelectedLibraryId(currentLibraryId);
    }
  }, [currentLibraryId]);

  useEffect(() => {
    if (selectedLibraryId || libraryCards.length === 0) {
      return;
    }
    setSelectedLibraryId(
      libraryCards[0].username ?? String(libraryCards[0].id),
    );
  }, [libraryCards, selectedLibraryId]);

  const options = useMemo(
    () =>
      libraryCards.map(lib => ({
        // Navigate by the URL slug (username) — the route is /library/[username].
        // Fall back to the numeric id only when a library has no linked username.
        value: lib.username ?? String(lib.id),
        label: lib.libraryName,
      })),
    [libraryCards],
  );

  // The address may spell the username in another case, or carry the numeric
  // id instead: resolve it to the option it means, so the trigger shows the
  // library you are standing in rather than "Select library".
  const value = useMemo(() => {
    const wanted = selectedLibraryId.toLowerCase();
    const match = libraryCards.find(
      lib =>
        (lib.username ?? '').toLowerCase() === wanted ||
        String(lib.id) === wanted,
    );
    return match ? (match.username ?? String(match.id)) : selectedLibraryId;
  }, [libraryCards, selectedLibraryId]);

  const onChange = (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    onSelect?.();
    router.push(`/library/${encodeURIComponent(libraryId)}`);
  };

  return { options, value, onChange };
}
