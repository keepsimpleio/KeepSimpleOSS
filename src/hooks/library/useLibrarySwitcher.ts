import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { libraryPath } from '@lib/library/libraryPath';

import { useAuth } from '@components/Context/library/AuthContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';

export interface LibrarySwitcherOption {
  value: string;
  label: string;
  isOwnLibrary: boolean;
  ownerInitial: string;
}

export interface LibrarySwitcher {
  options: LibrarySwitcherOption[];
  /** The option that names the library on screen; '' until the list lands. */
  value: string;
  /** Navigate to another library by its username. */
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
  const { accountData } = useAuth();

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
    ).filter(lib => Boolean(lib.username));
  }, [libraries]);

  const [selectedLibraryId, setSelectedLibraryId] = useState(
    currentLibraryId ||
      (libraryCards[0] ? (libraryCards[0].username ?? '') : ''),
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
    setSelectedLibraryId(libraryCards[0].username ?? '');
  }, [libraryCards, selectedLibraryId]);

  const options = useMemo(
    () =>
      libraryCards
        .map(lib => ({
          // Navigate by the URL slug (username) — the route is /library/[username].
          // Entries without an owner username are excluded from public navigation.
          value: lib.username ?? '',
          label: lib.libraryName,
          ownerInitial:
            Array.from(lib.username ?? '').find(char => /\p{L}/u.test(char)) ??
            '',
          isOwnLibrary: Boolean(
            accountData?.id &&
            libraries?.data?.some(
              entry =>
                entry.id === lib.id &&
                String(entry.attributes.user?.data?.id) ===
                  String(accountData.id),
            ),
          ),
        }))
        .sort((a, b) => Number(b.isOwnLibrary) - Number(a.isOwnLibrary)),
    [libraryCards, libraries, accountData?.id],
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
    return match ? (match.username ?? '') : selectedLibraryId;
  }, [libraryCards, selectedLibraryId]);

  const onChange = (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    onSelect?.();
    router.push(libraryPath(libraryId));
  };

  return { options, value, onChange };
}
