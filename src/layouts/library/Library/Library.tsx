import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  LIBRARY_FULL_MESSAGE,
  LIBRARY_SHELVES_REFETCH_EVENT,
  MAX_SHELVES_PER_LIBRARY,
} from '@constants/library/common';
import { RECOMMENDED_SEED } from '@constants/library/recommendations';

import type {
  StrapiLibraryEntry,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';
import type {
  IObject,
  IReorderObjectEntry,
  ObjectType,
} from '@local-types/library/object';
import type {
  IReorderShelfEntry,
  ShelfVisibility,
} from '@local-types/library/shelf';

import { useAnimatedList } from '@hooks/library/useAnimatedList';
import useLibraryEditing from '@hooks/library/useLibraryEditing';
import { useMagicBooks } from '@hooks/library/useMagicBooks';
import { usePresence } from '@hooks/library/usePresence';

import {
  FAVORITES_SHELF_ID,
  FAVORITES_SHELF_NAME,
  isFavorite,
  keepFavoriteFields,
  sortFavorites,
} from '@lib/library/favorites';
import { libraryPath } from '@lib/library/libraryPath';
import { objectIdFromSlug } from '@lib/library/objectSlug';
import {
  buildSearchHaystack,
  matchesSearchTerms,
  tokenizeQuery,
} from '@lib/library/searchMatch';
import { applyDragToSequence, gatherTagShelf } from '@lib/library/tagShelf';

import { createLibrary } from '@api/library/createLibrary';
import { getLibraryIdByUsername } from '@api/library/getLibraryIdByUsername';
import {
  getSingleLibrary,
  LibraryLoadError,
} from '@api/library/getSingleLibrary';
import { createShelf } from '@api/library/shelf/createShelf';
import { reorderShelves } from '@api/library/shelf/reorderShelves';
import { reorderTag } from '@api/library/tag/reorderTag';
import { updateAiShelfCollapsed } from '@api/library/updateAiShelfCollapsed';
import { updateLibrary } from '@api/library/updateLibrary';

import { PlusIcon } from '@icons/library/svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { useDashboard } from '@components/Context/library/DashboardContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { useShareSelection } from '@components/Context/library/ShareSelectionContext';
import { Loader } from '@components/library/atoms/Loader';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import {
  AddShelfModal,
  type ShelfType,
} from '@components/library/molecules/AddShelfModal';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '@components/library/molecules/Button';
import { LibraryToolbar } from '@components/library/organisms/LibraryToolbar';
import RecommendedShelf from '@components/library/organisms/RecommendedShelf';
import { ShareSelectionPanel } from '@components/library/organisms/ShareSelectionPanel';
import {
  Shelf,
  type ShelfDragHandleProps,
} from '@components/library/organisms/Shelf';

import type { LibraryTemplateProps } from './Library.types';

import styles from './Library.module.scss';

const modalTypeToApi: Record<ShelfType, ObjectType> = {
  books: 'book',
  videos: 'video',
  audios: 'audio',
};

// motion-passport: exempt. This file carries no animation of its own: list
// motion runs through useAnimatedList and usePresence, both of which honour
// prefers-reduced-motion, and the notice keyframes in Library.module.scss
// carry their reduced-motion branch there.

// Shelves only ever travel up and down the page, so the drag transform keeps
// its vertical component and drops the horizontal one.
const verticalOnly: Modifier = ({ transform }) => ({ ...transform, x: 0 });

const shelfKey = (shelf: StrapiSingleShelfEntry) => String(shelf.id);

// One draggable shelf slot. The activator wiring is handed back to the caller
// so the grip in the shelf's own header is the only thing that starts a drag:
// the cards below keep their horizontal scroll and their clicks.
function SortableShelf(props: {
  id: number;
  disabled?: boolean;
  children: (
    handle: ShelfDragHandleProps,
    isDragging: boolean,
  ) => React.ReactNode;
}) {
  const { id, disabled = false, children } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Ride over the neighbouring boards while travelling.
    position: isDragging ? 'relative' : undefined,
    zIndex: isDragging ? 2 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(
        { ref: setActivatorNodeRef, ...attributes, ...listeners },
        isDragging,
      )}
    </div>
  );
}

export function LibraryTemplate({
  libraryId,
  hideSharePanel = false,
  initialLibrary = null,
}: LibraryTemplateProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [library, setLibrary] = useState<StrapiLibraryEntry | null>(
    initialLibrary,
  );
  const [isLoading, setIsLoading] = useState(!initialLibrary);
  // Set when the library could not be fetched at all. Distinct from "no
  // library": that one renders the empty state, this one an error with retry.
  const [loadError, setLoadError] = useState<string | null>(null);
  // Set when a shelf drag was undone because the save failed.
  const [shelfOrderError, setShelfOrderError] = useState<string | null>(null);
  // Set when the URL named an object that is not on any visible shelf.
  const [objectNotice, setObjectNotice] = useState<string | null>(null);
  const { accountData, token } = useAuth();
  const loadSequence = useRef(0);
  const {
    isGuestMode,
    setGuestMode,
    setCurrentShelves,
    setCurrentOwner,
    setCurrentLibrary,
    setIsCreateBlocked,
    setIsOwner,
  } = useGlobalState();
  const {
    libraryTags,
    setLibraryTags,
    refreshLibraryTags,
    activeTagId,
    setActiveTagId,
  } = useDashboard();
  const {
    selectedObjects,
    limitReached,
    reorder: reorderSelection,
    remove: removeSelection,
    removeMany: removeManySelection,
    replace: replaceSelection,
    clear: clearSelection,
  } = useShareSelection();

  // Ownership is decided once, here, and published to GlobalState so the
  // Sidebar reads the same answer. Three signals, any one suffices: the owner
  // relation's id against my account id, its username against mine, or the URL
  // slug against my username (the window before a library exists, so an owner
  // can still bootstrap one). The slug is sometimes a numeric library id, which
  // is why the id match matters: that page used to look owned in the right
  // panel and foreign in the shelves.
  const ownerRelation = library?.attributes.user?.data;
  const ownerUsername = ownerRelation?.attributes.username ?? null;
  const myUsername = accountData?.username?.toLowerCase() ?? null;
  const myId = accountData?.id != null ? String(accountData.id) : null;
  const isOwner =
    (!!myId || !!myUsername) &&
    ((!!myId &&
      ownerRelation?.id != null &&
      String(ownerRelation.id) === myId) ||
      (!!myUsername &&
        ((!!ownerUsername && ownerUsername.toLowerCase() === myUsername) ||
          (!!libraryId && libraryId.toLowerCase() === myUsername))));

  useEffect(() => {
    setIsOwner(isOwner);
  }, [isOwner, setIsOwner]);

  // A new library is a clean slate: the search box, the share selection and
  // guest mode all belonged to the previous page, so none of it carries over.
  useEffect(() => {
    setSearch('');
    setObjectNotice(null);
    clearSelection();
    setGuestMode(false);
  }, [libraryId, clearSelection, setGuestMode]);

  // Guest mode lets an owner preview their library exactly as a public visitor
  // sees it. Owner-only data logic (library bootstrap, create-permission gating)
  // still keys off the real `isOwner`; everything user-facing — edit/add UI and
  // private-shelf visibility — keys off this so the preview is faithful.
  const supportsEditing = useLibraryEditing();
  const viewAsOwner = isOwner && (!isGuestMode || !supportsEditing);

  // A phone is a reading surface. Every control that changes the library —
  // add shelf, add object, rename, reorder, settings, edit, delete — stays on
  // desktop; here the owner sees their library exactly as they left it, private
  // shelves included (`viewAsOwner` still governs those). False on the server
  // and on first paint, so the markup hydrates identically everywhere.
  const canEditHere = viewAsOwner && supportsEditing;

  // The magic books are read once the owner is known to be editing here:
  // desktop, own library, not previewing as a guest. The engine's own store
  // answers at once for shelves it has already picked for.
  const magicFor = useMagicBooks(
    library?.id ?? null,
    canEditHere && !!accountData,
  );

  // Creating a library is gated by the `can-create-library` feature flag from
  // GET /api/users/me. The gate only matters before a library exists — once one
  // is created, owners keep full control. Decide at render time from the flag,
  // never by probing POST /api/libraries (that would create one for flag-holders).
  const canCreateLibrary =
    accountData?.featureNames?.includes('can-create-library') ?? false;
  const showNoCreatePermission =
    isOwner && library === null && !canCreateLibrary;

  // URL param is `/library/[username]` — accept either a numeric id or a username slug.
  const resolveLibraryId = useCallback(async (): Promise<number | null> => {
    if (!libraryId?.trim()) return null;
    const numeric = Number(libraryId);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
    return getLibraryIdByUsername(libraryId);
  }, [libraryId]);

  const loadLibrary = useCallback(
    async (options?: { silent?: boolean; libraryId?: number }) => {
      const sequence = ++loadSequence.current;
      if (options?.libraryId == null && !libraryId?.trim()) {
        setLibrary(null);
        setIsLoading(false);
        return;
      }

      // Silent reloads (e.g. right after creating a shelf) skip the loading
      // flag so the shelf list stays on screen instead of flashing "Loading…".
      // A non-silent load is a navigation to a (possibly different) library, so
      // drop the previous library first — otherwise its owner stays published to
      // GlobalState and the Sidebar shows the prior page's identity (e.g. mine)
      // over someone else's library until the new data arrives.
      if (!options?.silent) {
        setIsLoading(true);
        setLibrary(null);
      }
      setLoadError(null);
      try {
        // Prefer an explicitly supplied id over re-resolving the slug. Right
        // after bootstrapping a brand-new library, the username lookup is a
        // filtered read-after-write that can still return null
        // (publish/replication lag) — a direct GET by the id we just created
        // is reliable.
        const resolvedId = options?.libraryId ?? (await resolveLibraryId());
        if (sequence !== loadSequence.current) return;
        if (resolvedId == null) {
          setLibrary(null);
          return;
        }
        const result = await getSingleLibrary(resolvedId);
        if (sequence === loadSequence.current) setLibrary(result?.data ?? null);
      } catch (e) {
        if (sequence !== loadSequence.current) return;
        // A dead backend must not read as an empty library: that screen
        // invites the owner to "add a first shelf", which would create a
        // second library on top of the one that failed to load.
        console.error('[Library] load failed', e);
        setLoadError(
          e instanceof LibraryLoadError && e.status === 401
            ? 'Your session has expired. Reload the page and sign in again.'
            : 'Could not load this library. Check your connection and try again.',
        );
        setLibrary(null);
      } finally {
        if (sequence === loadSequence.current) setIsLoading(false);
      }
    },
    [libraryId, resolveLibraryId],
  );

  // The server already painted this library, so the browser's own first read
  // is a refresh rather than a load: silent, so the shelves on screen are
  // never swapped for "Loading…" only to come back the same. Every later read
  // (a sign-in, another library) is a real load again.
  const serverPainted = useRef(!!initialLibrary);

  useEffect(() => {
    void loadLibrary(serverPainted.current ? { silent: true } : undefined);
    serverPainted.current = false;
    return () => {
      loadSequence.current += 1;
    };
  }, [loadLibrary, token]);

  useEffect(() => {
    const onRefetch = (event: Event) => {
      // EditLibraryModal may carry the resolved (possibly just-created) library
      // id so we reload by a direct GET — the slug→id resolution can't find a
      // freshly bootstrapped row through the restricted owner relation-filter.
      const id = (event as CustomEvent<{ libraryId?: number }>).detail
        ?.libraryId;
      void loadLibrary(
        id != null ? { silent: true, libraryId: id } : undefined,
      );
    };

    window.addEventListener(LIBRARY_SHELVES_REFETCH_EVENT, onRefetch);

    return () => {
      window.removeEventListener(LIBRARY_SHELVES_REFETCH_EVENT, onRefetch);
    };
  }, [loadLibrary]);

  const modalToggler = () => {
    setIsOpen(open => !open);
  };

  const handleCreateShelf = async (
    modalShelfType: ShelfType,
    name: string,
    description = '',
  ) => {
    // resolveLibraryId throws when the lookup itself fails; the modal shows
    // that as an error, which is right: we must not bootstrap a library on
    // top of one we simply could not read.
    let resolvedId = await resolveLibraryId();

    // No library yet — bootstrap one, but only if the logged-in user owns this URL.
    // The lookup in resolveLibraryId() prevents double-create on subsequent clicks.
    if (resolvedId == null && isOwner && accountData?.id) {
      resolvedId = await createLibrary(accountData.id);
    }

    if (resolvedId == null) {
      console.warn(
        '[Library] cannot add shelf — no library could be resolved',
        {
          libraryId,
          isOwner,
          hasAccount: !!accountData,
          accountId: accountData?.id,
          accountUsername: accountData?.username,
        },
      );
      // Surface it: a resolved promise here read as success in the modal,
      // which stopped its spinner and sat there with no shelf and no message.
      throw new Error('No library could be found to add this shelf to.');
    }

    // Append at the end: stamp the new shelf with an order past the current
    // max so it lands last instead of colliding at order 0 (which sorts into
    // the middle of the existing shelves).
    const existingShelves = library?.attributes.singleShelves?.data ?? [];
    const nextOrder =
      existingShelves.reduce(
        (max, s) => Math.max(max, s.attributes.order ?? 0),
        -1,
      ) + 1;

    const type = modalTypeToApi[modalShelfType];
    try {
      await createShelf({
        name,
        ...(description ? { description } : {}),
        type,
        library: resolvedId,
        order: nextOrder,
        ...(accountData?.id != null ? { owner: accountData.id } : {}),
      });
      // Silent reload keeps the shelves on screen (no "Loading…" swap) while the
      // AddShelfModal shows its own in-flight spinner until this resolves. Pass
      // the resolved id so a freshly bootstrapped library loads by id instead of
      // re-resolving the slug (which can lag and return null on first create).
      await loadLibrary({ silent: true, libraryId: resolvedId });
      setIsOpen(false);
    } catch (e) {
      console.error('[Library] create shelf failed', e);
      // Surface the failure so AddShelfModal can warn (e.g. duplicate name)
      // instead of silently swallowing it and leaving the modal hanging.
      throw e;
    }
  };

  // Render in persisted-order sequence. Strapi's `populate` of singleShelves
  // does NOT honor the schema's admin-only defaultSort, and the public REST
  // API defaults to id order — so without this client-side sort the saved
  // `order` (from POST /single-shelves/reorder) never shows on refresh.
  // Memoized so the array identity stays stable until `library` changes,
  // keeping the setCurrentShelves effect below from firing every render.
  const shelves: StrapiSingleShelfEntry[] = useMemo(() => {
    const data = library?.attributes.singleShelves?.data ?? [];
    // Private shelves are owner-only — hide them from visitors so the
    // public/private toggle actually controls who can see a shelf.
    const visible = viewAsOwner
      ? data
      : data.filter(s => s.attributes.visibility !== 'private');
    return [...visible].sort(
      (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
    );
  }, [library, viewAsOwner]);

  // The shelf tree as the callbacks below read it, without rebuilding every one
  // of them each time the library changes.
  const shelvesRef = useRef<StrapiSingleShelfEntry[]>(shelves);
  shelvesRef.current = shelves;

  // The Favorites shelf: every starred book on the shelves above, which for a
  // visitor already leaves out the private ones. It is a synthetic entry the
  // Shelf component draws like any other; it stands only while a book is
  // starred, and for visitors only when the owner has made it public.
  const favoritesVisibility: ShelfVisibility =
    library?.attributes.favoritesVisibility ?? 'private';
  const favoritesDescription = library?.attributes.favoritesDescription ?? '';
  const favoritesShelf = useMemo<StrapiSingleShelfEntry | null>(() => {
    const starred = sortFavorites(
      shelves.flatMap(s =>
        (s.attributes.objects?.data ?? []).filter(isFavorite),
      ),
    );
    if (starred.length === 0) return null;
    return {
      id: FAVORITES_SHELF_ID,
      attributes: {
        name: FAVORITES_SHELF_NAME,
        description: favoritesDescription,
        visibility: favoritesVisibility,
        type: 'book',
        order: -1,
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
        objects: { data: starred },
      },
    };
  }, [shelves, favoritesVisibility, favoritesDescription]);
  const showFavoritesShelf =
    favoritesShelf != null && (viewAsOwner || favoritesVisibility === 'public');

  // Which real shelf holds an object: the Favorites shelf's callbacks arrive
  // with the synthetic id and are routed here to the shelf that owns the book.
  const shelfIdForObject = useCallback(
    (objectId: number) =>
      shelvesRef.current.find(s =>
        (s.attributes.objects?.data ?? []).some(o => o.id === objectId),
      )?.id,
    [],
  );

  // Everything standing on one shelf: the ids that leave the share selection
  // when that shelf turns private or is deleted, since a link may only carry
  // objects that are still public and still exist.
  const objectIdsOnShelf = useCallback(
    (shelfId: number) =>
      (
        shelvesRef.current.find(s => s.id === shelfId)?.attributes.objects
          ?.data ?? []
      ).map(o => o.id),
    [],
  );

  // Search filters the in-memory object tree — the whole library is already
  // client-side, so no API round-trip. Match title + author + tag names (the
  // fields people search by); description is intentionally excluded to keep
  // results predictable. Shelves with no match drop out so results stay dense.
  //
  // The shelves themselves are never rewritten: each keeps its full object
  // list (so counts, the shelf capacity, reorder payloads and the open object
  // all read the real shelf) and carries a set of matching ids that only
  // decides which cards are drawn.
  // The box answers to what people actually type: extra spaces, wrong case,
  // accents, punctuation and a slipped key all still find the item. See
  // @lib/library/searchMatch for the rules.
  const searchTerms = useMemo(() => tokenizeQuery(search), [search]);
  const hasSearch = searchTerms.length > 0;
  const { displayedShelves, matchedIdsByShelf } = useMemo(() => {
    if (!hasSearch) {
      return {
        displayedShelves: shelves,
        matchedIdsByShelf: null as Map<number, Set<number>> | null,
      };
    }
    const matchedIdsByShelf = new Map<number, Set<number>>();
    const displayedShelves = shelves.filter(shelf => {
      const objects = shelf.attributes.objects?.data ?? [];
      const matched = new Set<number>();
      for (const o of objects) {
        const { title, author, tags } = o.attributes;
        const haystack = buildSearchHaystack([
          title,
          author,
          ...(tags?.data ?? []).map(t => t.attributes.name),
        ]);
        if (matchesSearchTerms(haystack, searchTerms)) matched.add(o.id);
      }
      if (matched.size === 0) return false;
      matchedIdsByShelf.set(shelf.id, matched);
      return true;
    });
    return { displayedShelves, matchedIdsByShelf };
  }, [shelves, hasSearch, searchTerms]);

  // The Favorites shelf stays for the length of its fade after the last star
  // comes off or a search starts, drawn from the last entry it had.
  const { mounted: favoritesMounted, shown: favoritesShown } = usePresence(
    showFavoritesShelf && !hasSearch,
    240,
  );
  const lastFavoritesShelf = useRef(favoritesShelf);
  if (favoritesShelf) lastFavoritesShelf.current = favoritesShelf;

  // Favorites stands above the draggable shelf order on the page, so its jump
  // pill leads the toolbar's row and the reader's first pill matches the first
  // board they see. It leaves the row on the same condition it leaves the page,
  // which keeps the toolbar's "on N shelves" count over the searched shelves.
  const jumpShelves = useMemo(
    () =>
      showFavoritesShelf && !hasSearch && favoritesShelf
        ? [favoritesShelf, ...displayedShelves]
        : displayedShelves,
    [showFavoritesShelf, hasSearch, favoritesShelf, displayedShelves],
  );

  // ---- The tag filter -------------------------------------------------
  //
  // One tag at a time. While it stands, every shelf steps aside, the AI shelf
  // and Favorites with them, and the books that tag labels are gathered into a
  // single row, in the tag's own order.

  const activeTag = useMemo(
    () => libraryTags.find(tag => tag.id === activeTagId) ?? null,
    [libraryTags, activeTagId],
  );

  // The page crossfades between the shelves and the gathered row: the content
  // on screen is swapped at the trough of the fade, so nothing is ever seen
  // half-replaced. Same 200ms ease the guest preview switches with.
  const [renderedTagId, setRenderedTagId] = useState<number | null>(
    activeTagId,
  );
  const [tagFading, setTagFading] = useState(false);
  useEffect(() => {
    if (activeTagId === renderedTagId) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setRenderedTagId(activeTagId);
      return;
    }
    setTagFading(true);
    const swap = window.setTimeout(() => {
      setRenderedTagId(activeTagId);
      setTagFading(false);
    }, 200);
    return () => window.clearTimeout(swap);
  }, [activeTagId, renderedTagId]);

  const renderedTag = useMemo(
    () => libraryTags.find(tag => tag.id === renderedTagId) ?? null,
    [libraryTags, renderedTagId],
  );

  const gathered = useMemo(
    () => (renderedTag ? gatherTagShelf(renderedTag, shelves) : null),
    [renderedTag, shelves],
  );

  // The address a link arrived with, and whether it has been answered yet.
  // Reading it comes first: the writer below would otherwise clear an incoming
  // `#deep-work` on the first paint, before the tags it names have loaded.
  const addressRead = useRef(false);
  const hashApplied = useRef<string | null>(null);

  // The address is read back the moment the tags are known, so a link opens
  // straight into the filtered view. A tag that no longer exists, or that
  // labels nothing this viewer can open, simply leaves the library unfiltered.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const apply = () => {
      const raw = window.location.hash.replace(/^#/, '');
      if (!raw) {
        addressRead.current = true;
        return;
      }
      // The list decides what the address means, so nothing is answered until
      // it has arrived.
      if (libraryTags.length === 0) return;
      const slug = decodeURIComponent(raw).toLowerCase();
      addressRead.current = true;
      if (hashApplied.current === slug) return;
      hashApplied.current = slug;
      const tag = libraryTags.find(t => t.slug?.toLowerCase() === slug);
      // A tag labelling nothing is not a filter here either: the panel gives
      // it no click, and a link to it opens the library as it stands.
      setActiveTagId(tag && tag.objects.length > 0 ? tag.id : null);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [libraryTags, setActiveTagId]);

  // A filtered library is a linkable one: the tag's own address rides on the
  // library URL as `#deep-work`. Written with the History API rather than the
  // router so the page is not re-rendered for a fragment, and re-applied after
  // a navigation (opening an object pushes a path of its own).
  useEffect(() => {
    if (typeof window === 'undefined' || !addressRead.current) return;
    const wanted = activeTag ? `#${encodeURIComponent(activeTag.slug)}` : '';
    if (window.location.hash === wanted) return;
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${wanted}`,
    );
  }, [activeTag, libraryTags, router.asPath]);

  // Search runs inside the active tag: typing narrows the gathered row and
  // never clears the filter.
  const tagMatchedIds = useMemo(() => {
    if (!gathered || !hasSearch) return null;
    const matched = new Set<number>();
    for (const o of gathered.shelf.attributes.objects?.data ?? []) {
      const { title, author, tags } = o.attributes;
      const haystack = buildSearchHaystack([
        title,
        author,
        ...(tags?.data ?? []).map(t => t.attributes.name),
      ]);
      if (matchesSearchTerms(haystack, searchTerms)) matched.add(o.id);
    }
    return matched;
  }, [gathered, hasSearch, searchTerms]);

  // Everything standing on one shelf, and the shelf a book stands on: the
  // gathered row is not a shelf, so an edit made from it lands on the book's
  // own shelf through these.
  const objectsOfShelf = useCallback(
    (shelfId: number) =>
      shelvesRef.current.find(s => s.id === shelfId)?.attributes.objects
        ?.data ?? [],
    [],
  );

  // A drag in the gathered row saves the tag's sequence, never a shelf's. The
  // whole sequence is sent, so books this viewer cannot see keep their places.
  const handleTagOrder = useCallback(
    async (ordered: IReorderObjectEntry[]) => {
      const tag = renderedTag;
      if (!tag) return;
      const previous = tag.objects;
      const next = applyDragToSequence(
        previous,
        ordered.map(o => o.id),
      );
      const stamp = (objects: number[]) =>
        setLibraryTags(current =>
          current.map(t => (t.id === tag.id ? { ...t, objects } : t)),
        );

      stamp(next);
      try {
        await reorderTag({
          tagId: tag.id,
          objects: next.map((id, index) => ({ id, order: index })),
        });
      } catch (error) {
        stamp(previous);
        throw error;
      }
    },
    [renderedTag, setLibraryTags],
  );

  const matchedCount = useMemo(() => {
    // While a tag stands, the count is of what it holds: the search runs
    // inside the filter, not across the library behind it.
    if (gathered) return tagMatchedIds ? tagMatchedIds.size : null;
    if (!matchedIdsByShelf) return null;
    let total = 0;
    matchedIdsByShelf.forEach(ids => {
      total += ids.size;
    });
    return total;
  }, [gathered, tagMatchedIds, matchedIdsByShelf]);

  // A deep link to an object that no visible shelf holds (deleted, on a
  // private shelf, or from another library) used to open nothing and leave
  // the URL pointing at it. Say so and fall back to the library itself.
  const objectParam = router.query.object;
  const activeSlug = Array.isArray(objectParam) ? objectParam[0] : objectParam;
  const requestedObjectId = objectIdFromSlug(activeSlug);
  useEffect(() => {
    if (isLoading || loadError || requestedObjectId == null) return;
    const found = shelves.some(shelf =>
      (shelf.attributes.objects?.data ?? []).some(
        o => o.id === requestedObjectId,
      ),
    );
    if (found) return;
    setObjectNotice(
      "That item isn't available here. It may have been removed or made private.",
    );
    void router.replace(libraryPath(ownerUsername), undefined, {
      shallow: true,
      scroll: false,
    });
  }, [isLoading, loadError, requestedObjectId, shelves, router, ownerUsername]);

  // Publish the current library's shelves so the Header's Jump-to nav can
  // render the right list without owning its own fetch. NOTE: no cleanup —
  // resetting to [] on every dep change caused the Header (and other
  // consumers via the GlobalState memo) to flicker through an empty list,
  // which read as "right panel data disappeared" on rapid re-renders.
  useEffect(() => {
    setCurrentShelves(shelves);
  }, [shelves, setCurrentShelves]);

  // Publish the viewed library's owner so the Sidebar's Author panel shows the
  // library owner (populated `user` relation + the library's `aboutMe`) rather
  // than the logged-in viewer from /api/users/me.
  const owner = useMemo(() => {
    if (!library) return null;
    const ownerAttributes = library.attributes.user?.data?.attributes;
    return {
      id: library.attributes.user?.data?.id,
      username: ownerAttributes?.username,
      name: ownerAttributes?.name,
      picture: ownerAttributes?.picture,
      avatar: library.attributes.avatar?.data?.attributes?.url,
      aboutMe: library.attributes.aboutMe,
    };
  }, [library]);

  useEffect(() => {
    setCurrentOwner(owner);
  }, [owner, setCurrentOwner]);

  // Publish the full viewed library so the Sidebar edits exactly what's on
  // screen — no second `getMyLibrary` fetch that can disagree or come back null.
  useEffect(() => {
    setCurrentLibrary(library);
  }, [library, setCurrentLibrary]);

  // Mirror the no-permission screen into GlobalState so the Sidebar (right
  // panel) hides itself when we're showing only the permission message.
  useEffect(() => {
    setIsCreateBlocked(showNoCreatePermission);
  }, [showNoCreatePermission, setIsCreateBlocked]);

  const mutateShelfObjects = useCallback(
    (shelfId: number, mutator: (objects: IObject[]) => IObject[]) => {
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        const next = shelvesData.map(s => {
          if (s.id !== shelfId) return s;
          const existing = s.attributes.objects?.data ?? [];
          return {
            ...s,
            attributes: {
              ...s.attributes,
              objects: { data: mutator(existing) },
            },
          };
        });
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: { data: next },
          },
        };
      });
    },
    [],
  );

  const handleObjectCreated = useCallback(
    (shelfId: number, created: IObject) => {
      mutateShelfObjects(shelfId, objects => [...objects, created]);
      // A new book may arrive already labelled, and it lands at the end of
      // every tag it carries.
      void refreshLibraryTags();
    },
    [mutateShelfObjects, refreshLibraryTags],
  );

  // Every mutation also reaches the share selection: it stores whole object
  // snapshots, so an edit must refresh the copy and a delete must drop it, or
  // the link gets minted with a stale title, a stale cover, or a dead id.
  const handleObjectUpdated = useCallback(
    (shelfId: number, updated: IObject) => {
      // A save's response may be silent about the star; the copy on the shelf
      // keeps it (keepFavoriteFields), so an edit never unstars a book.
      mutateShelfObjects(shelfId, objects =>
        objects.map(o =>
          o.id === updated.id ? keepFavoriteFields(o, updated) : o,
        ),
      );
      replaceSelection(updated);
      // The tag set may have changed with the edit, and with it which rows
      // this book stands in.
      void refreshLibraryTags();
    },
    [mutateShelfObjects, replaceSelection, refreshLibraryTags],
  );

  const handleObjectDeleted = useCallback(
    (shelfId: number, objectId: number) => {
      mutateShelfObjects(shelfId, objects =>
        objects.filter(o => o.id !== objectId),
      );
      removeSelection(objectId);
      // The book leaves every tag it carried with it.
      void refreshLibraryTags();
    },
    [mutateShelfObjects, removeSelection, refreshLibraryTags],
  );

  // The shelf's privacy switch lands on the library tree, where the visitor
  // filter above reads it. Before this the switch lived in the shelf alone:
  // guest mode kept showing a shelf just made private, and any refetch quietly
  // flipped the menu back.
  const handleShelfVisibilityChanged = useCallback(
    (shelfId: number, visibility: ShelfVisibility) => {
      // A shelf that just turned private takes its objects out of the share
      // selection with it: the backend refuses to mint a link holding them, so
      // leaving them in the bar only buys a rejection at Share time.
      if (visibility === 'private') {
        removeManySelection(objectIdsOnShelf(shelfId));
      }
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: {
              data: shelvesData.map(s =>
                s.id === shelfId
                  ? { ...s, attributes: { ...s.attributes, visibility } }
                  : s,
              ),
            },
          },
        };
      });
    },
    [removeManySelection, objectIdsOnShelf],
  );

  const handleObjectsReordered = useCallback(
    (shelfId: number, ordered: { id: number; order: number }[]) => {
      const orderById = new Map(ordered.map(o => [o.id, o.order]));
      mutateShelfObjects(shelfId, objects =>
        objects.map(o =>
          orderById.has(o.id)
            ? {
                ...o,
                attributes: { ...o.attributes, order: orderById.get(o.id) },
              }
            : o,
        ),
      );
    },
    [mutateShelfObjects],
  );

  // The Favorites shelf's callbacks: each lands on the book's real shelf.
  const handleFavoriteObjectUpdated = useCallback(
    (_: number, updated: IObject) => {
      const shelfId = shelfIdForObject(updated.id);
      if (shelfId != null) handleObjectUpdated(shelfId, updated);
    },
    [shelfIdForObject, handleObjectUpdated],
  );

  const handleFavoriteObjectDeleted = useCallback(
    (_: number, objectId: number) => {
      const shelfId = shelfIdForObject(objectId);
      if (shelfId != null) handleObjectDeleted(shelfId, objectId);
    },
    [shelfIdForObject, handleObjectDeleted],
  );

  // A drag on the Favorites shelf stamps `favoriteOrder` on the books, each
  // on the shelf it lives on; the favorites memo re-sorts at render.
  const handleFavoritesReordered = useCallback(
    (_: number, ordered: { id: number; order: number }[]) => {
      const orderById = new Map(ordered.map(o => [o.id, o.order]));
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: {
              data: shelvesData.map(s => ({
                ...s,
                attributes: {
                  ...s.attributes,
                  objects: {
                    data: (s.attributes.objects?.data ?? []).map(o =>
                      orderById.has(o.id)
                        ? {
                            ...o,
                            attributes: {
                              ...o.attributes,
                              favoriteOrder: orderById.get(o.id),
                            },
                          }
                        : o,
                    ),
                  },
                },
              })),
            },
          },
        };
      });
    },
    [],
  );

  // The Favorites shelf's privacy is a field on the library itself. Saved
  // here, then stamped on the loaded library so a refetch cannot flip it back.
  const saveFavoritesVisibility = useCallback(
    async (visibility: ShelfVisibility) => {
      if (!library) return;
      const result = await updateLibrary(library.id, {
        favoritesVisibility: visibility,
      });
      if (result.data?.attributes.favoritesVisibility !== visibility) {
        throw new Error('Favorites visibility was not saved.');
      }
      setLibrary(current =>
        current
          ? {
              ...current,
              attributes: {
                ...current.attributes,
                favoritesVisibility: visibility,
              },
            }
          : current,
      );
    },
    [library],
  );

  // The Favorites shelf's hint is a field on the library itself, saved the
  // same way as its privacy and stamped on the loaded library afterwards.
  const saveFavoritesDescription = useCallback(
    async (description: string) => {
      if (!library) return;
      const result = await updateLibrary(library.id, {
        favoritesDescription: description,
      });
      if (
        (result.data?.attributes.favoritesDescription ?? '') !== description
      ) {
        throw new Error('The Favorites description was not saved.');
      }
      setLibrary(current =>
        current
          ? {
              ...current,
              attributes: {
                ...current.attributes,
                favoritesDescription: description,
              },
            }
          : current,
      );
    },
    [library],
  );

  // Stamps each shelf's new position onto the loaded library. The `shelves`
  // memo re-sorts by `order` at render, so the list lands in the new sequence
  // without a refetch.
  const applyShelfOrder = useCallback((ordered: IReorderShelfEntry[]) => {
    const orderById = new Map(ordered.map(o => [o.id, o.order]));
    setLibrary(current => {
      if (!current) return current;
      const shelvesData = current.attributes.singleShelves?.data ?? [];
      const next = shelvesData.map(s =>
        orderById.has(s.id)
          ? {
              ...s,
              attributes: { ...s.attributes, order: orderById.get(s.id)! },
            }
          : s,
      );
      return {
        ...current,
        attributes: {
          ...current.attributes,
          singleShelves: { data: next },
        },
      };
    });
  }, []);

  // Reordering is direct manipulation: grab the grip on a shelf header and the
  // whole board travels. Owner-only, and only on an unfiltered list — a search
  // result is a subset, so a position inside it says nothing about where the
  // shelf belongs in the library.
  const canReorderShelves =
    canEditHere && !hasSearch && displayedShelves.length > 1;

  // A shelf that is added rises in, one that is deleted or filtered out by a
  // search folds away where it stood and the boards below slide up with it.
  // Reorder moves are left to the drag itself (dnd-kit already animates the
  // drop), so the hook only handles arrivals and departures here.
  // A failed save puts the boards back where they were after a network
  // round-trip, long after the drag ended: that one reorder is not the drag's
  // to animate, so the list motion glides it for the commit it lands in.
  const [glideRollback, setGlideRollback] = useState(false);
  useEffect(() => {
    if (glideRollback) setGlideRollback(false);
  }, [glideRollback]);
  // The owner's notice fades in and out of its held row.
  const { mounted: noticeMounted, shown: noticeShown } = usePresence(
    Boolean(shelfOrderError || objectNotice),
    160,
  );
  const { ref: shelfListRef, entries: shelfEntries } = useAnimatedList(
    displayedShelves,
    shelfKey,
    { moves: glideRollback, collapse: 'height' },
  );
  // One save at a time: a second drag while the first is still persisting
  // would capture a baseline that already holds the optimistic move, and a
  // late failure would then "restore" a mixed order.
  const reorderInFlight = useRef(false);

  const shelfSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleShelfDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (reorderInFlight.current) return;
    const oldIndex = shelves.findIndex(s => s.id === active.id);
    const newIndex = shelves.findIndex(s => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous: IReorderShelfEntry[] = shelves.map((shelf, index) => ({
      id: shelf.id,
      order: shelf.attributes.order ?? index,
    }));
    const ordered: IReorderShelfEntry[] = arrayMove(
      shelves,
      oldIndex,
      newIndex,
    ).map((shelf, index) => ({ id: shelf.id, order: index }));

    // Land the shelf first, persist after: the drop has to feel immediate. A
    // failed save puts every shelf back where it was and says so.
    setShelfOrderError(null);
    applyShelfOrder(ordered);
    reorderInFlight.current = true;
    reorderShelves(ordered)
      .catch(e => {
        console.error('[Library] shelf reorder failed', e);
        setGlideRollback(true);
        applyShelfOrder(previous);
        setShelfOrderError(
          'Could not save the new shelf order. The shelves are back where they were.',
        );
      })
      .finally(() => {
        reorderInFlight.current = false;
      });
  };

  const handleShelfRenamed = useCallback(
    (shelfId: number, name: string, description: string) => {
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: {
              data: shelvesData.map(s =>
                s.id === shelfId
                  ? { ...s, attributes: { ...s.attributes, name, description } }
                  : s,
              ),
            },
          },
        };
      });
    },
    [],
  );

  const handleShelfDeleted = useCallback(
    (shelfId: number) => {
      // The shelf's objects are gone with it, so they leave the selection too.
      removeManySelection(objectIdsOnShelf(shelfId));
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: { data: shelvesData.filter(s => s.id !== shelfId) },
          },
        };
      });
    },
    [removeManySelection, objectIdsOnShelf],
  );

  const handleObjectMoved = useCallback(
    (fromShelfId: number, toShelfId: number, moved: IObject) => {
      let landedOnPrivateShelf = false;
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        // The star travels with the book: the response of a move may not
        // carry it, so it is read off the copy leaving the old shelf.
        const previous = shelvesData
          .flatMap(s => s.attributes.objects?.data ?? [])
          .find(o => o.id === moved.id);
        const next = shelvesData.map(s => {
          if (s.id === fromShelfId) {
            const existing = s.attributes.objects?.data ?? [];
            return {
              ...s,
              attributes: {
                ...s.attributes,
                objects: { data: existing.filter(o => o.id !== moved.id) },
              },
            };
          }
          if (s.id === toShelfId) {
            landedOnPrivateShelf = s.attributes.visibility === 'private';
            const existing = s.attributes.objects?.data ?? [];
            // Avoid duplicates if the move event somehow fires twice.
            const withoutMoved = existing.filter(o => o.id !== moved.id);
            // It joins at the end: a stale `order` from the old shelf would
            // otherwise sort it into the middle of the new one.
            const nextOrder =
              withoutMoved.reduce(
                (max, o) => Math.max(max, o.attributes.order ?? 0),
                -1,
              ) + 1;
            const kept = keepFavoriteFields(previous, moved);
            const placed: IObject = {
              ...kept,
              attributes: { ...kept.attributes, order: nextOrder },
            };
            return {
              ...s,
              attributes: {
                ...s.attributes,
                objects: { data: [...withoutMoved, placed] },
              },
            };
          }
          return s;
        });
        return {
          ...current,
          attributes: {
            ...current.attributes,
            singleShelves: { data: next },
          },
        };
      });
      // Only public-shelf objects can be shared; one that just moved onto a
      // private shelf leaves the selection with it.
      if (landedOnPrivateShelf) removeSelection(moved.id);
      else replaceSelection(moved);
    },
    [removeSelection, replaceSelection],
  );

  const renderShelf = (
    shelf: StrapiSingleShelfEntry,
    dragHandleProps?: ShelfDragHandleProps,
    isDragging?: boolean,
  ) => (
    <Shelf
      key={shelf.id}
      title={shelf.attributes.name}
      shelf={shelf}
      // The URL slug is sometimes a numeric library id, so name the owner from
      // the loaded library first — the rating headings read it as a person.
      ownerUsername={ownerUsername ?? libraryId}
      isOwner={canEditHere}
      visibleObjectIds={matchedIdsByShelf?.get(shelf.id) ?? null}
      reorderLocked={canEditHere && !canReorderShelves && shelves.length > 1}
      onObjectCreated={handleObjectCreated}
      onObjectUpdated={handleObjectUpdated}
      onObjectDeleted={handleObjectDeleted}
      onObjectMoved={handleObjectMoved}
      onObjectsReordered={handleObjectsReordered}
      onShelfDeleted={handleShelfDeleted}
      onShelfRenamed={handleShelfRenamed}
      onShelfVisibilityChanged={handleShelfVisibilityChanged}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
      magic={magicFor(shelf.id)}
    />
  );

  const atShelfLimit = shelves.length >= MAX_SHELVES_PER_LIBRARY;

  // Selecting objects to share is an owner control on the cards, and those
  // go with the rest of the editing UI on a phone — a bar with nothing to
  // select into would be dead weight at the bottom of the screen.
  const showSharePanel = canEditHere && !hideSharePanel;

  return (
    <div
      data-library-mode-surface
      className={classNames(styles.wrapper, {
        [styles.withShareBar]: showSharePanel,
      })}
    >
      {/* `shelves.length` alone let the toolbar (and its mobile About button,
          which is position-independent of the loader's container) sit on screen
          during a load that still had the previous library in state. Gate on
          the load itself so the toolbar never outlives the shelves it acts on. */}
      {!isLoading && shelves.length > 0 && (
        <LibraryToolbar
          shelves={gathered ? [gathered.shelf] : jumpShelves}
          search={search}
          onSearchChange={setSearch}
          matchedCount={matchedCount}
        />
      )}
      {/* Notices land in a slot held from the start, so the shelf list never
          jumps when one appears. Owner-only: every message here follows an
          owner action (a reorder, an object move), so for a visitor the held
          row was a band of empty page above the first shelf. */}
      {canEditHere && (
        <div className={styles.noticeRow} role="status" aria-live="polite">
          {noticeMounted && (
            <div
              className={classNames(styles.notice, {
                [styles.noticeClosing]: !noticeShown,
              })}
            >
              <Text variant={TypographyVariant.TextSmall}>
                {shelfOrderError ?? objectNotice}
              </Text>
              <button
                type="button"
                className={styles.noticeDismiss}
                aria-label="Dismiss"
                onClick={() => {
                  setShelfOrderError(null);
                  setObjectNotice(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
      {isLoading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : loadError ? (
        <div className={styles.empty}>
          <Text
            variant={TypographyVariant.TitleSecondaryBold}
            className={styles.text}
          >
            {loadError}
          </Text>
          <Button
            label="Try again"
            onClick={() => void loadLibrary()}
            type={ButtonType.Primary}
            size={ButtonSize.Wide}
            ariaLabel="Try loading the library again"
            className={styles.button}
          />
        </div>
      ) : showNoCreatePermission ? (
        <div className={styles.empty}>
          <Text
            variant={TypographyVariant.TitleSecondaryBold}
            className={styles.text}
          >
            You don&apos;t have permission to create a library
          </Text>
        </div>
      ) : shelves.length === 0 ? (
        <div className={styles.empty}>
          <Text
            variant={TypographyVariant.TitleSecondaryBold}
            className={styles.text}
          >
            {canEditHere
              ? 'Begin your journey by adding your first shelf'
              : 'This library is empty'}
          </Text>

          {canEditHere && (
            <Button
              label="Add shelf"
              onClick={modalToggler}
              type={ButtonType.Primary}
              size={ButtonSize.Wide}
              ariaLabel="Add shelf"
              className={styles.button}
            />
          )}
        </div>
      ) : gathered ? (
        <div
          className={classNames(styles.filterSwap, {
            [styles.filterSwapOut]: tagFading,
          })}
        >
          {hasSearch && tagMatchedIds && tagMatchedIds.size === 0 ? (
            <div className={styles.empty}>
              <Text
                variant={TypographyVariant.TitleSecondaryBold}
                className={styles.text}
              >
                Nothing in “{gathered.shelf.attributes.name}” matches “
                {search.trim()}”
              </Text>
              <Button
                label="Clear search"
                onClick={() => setSearch('')}
                type={ButtonType.Secondary}
                size={ButtonSize.Wide}
                ariaLabel="Clear search"
                className={styles.button}
              />
            </div>
          ) : (
            <Shelf
              tagFilter
              title={gathered.shelf.attributes.name}
              shelf={gathered.shelf}
              ownerUsername={ownerUsername ?? libraryId}
              isOwner={canEditHere}
              visibleObjectIds={tagMatchedIds}
              hiddenObjectIds={gathered.hiddenObjectIds}
              saveOrder={handleTagOrder}
              shelfOfObject={shelfIdForObject}
              objectsOfShelf={objectsOfShelf}
              onObjectUpdated={handleObjectUpdated}
              onObjectDeleted={handleObjectDeleted}
              onObjectMoved={handleObjectMoved}
              onObjectsReordered={handleObjectsReordered}
            />
          )}
        </div>
      ) : hasSearch && displayedShelves.length === 0 ? (
        <div className={styles.empty}>
          <Text
            variant={TypographyVariant.TitleSecondaryBold}
            className={styles.text}
          >
            Nothing matches “{search.trim()}”
          </Text>
          <Button
            label="Clear search"
            onClick={() => setSearch('')}
            type={ButtonType.Secondary}
            size={ButtonSize.Wide}
            ariaLabel="Clear search"
            className={styles.button}
          />
        </div>
      ) : (
        <div
          className={classNames(styles.filterSwap, {
            [styles.filterSwapOut]: tagFading,
          })}
        >
          {viewAsOwner && !hasSearch && library && (
            <RecommendedShelf
              key={library.id}
              readOnly={!canEditHere}
              pool={RECOMMENDED_SEED}
              collapsed={library.attributes.aiShelfCollapsed === true}
              onCollapsedChange={async collapsed => {
                const id = library.id;
                await updateAiShelfCollapsed(id, collapsed);
                setLibrary(current =>
                  current?.id === id
                    ? {
                        ...current,
                        attributes: {
                          ...current.attributes,
                          aiShelfCollapsed: collapsed,
                        },
                      }
                    : current,
                );
              }}
            />
          )}
          {/* Favorites follows AI Shelf, outside the draggable shelf order. */}
          {favoritesMounted && lastFavoritesShelf.current && (
            <div
              className={classNames(styles.favoritesSlot, {
                [styles.favoritesSlotClosing]: !favoritesShown,
              })}
              aria-hidden={!favoritesShown || undefined}
            >
              <Shelf
                favorites
                title={FAVORITES_SHELF_NAME}
                shelf={lastFavoritesShelf.current}
                ownerUsername={ownerUsername ?? libraryId}
                isOwner={canEditHere}
                onFavoritesVisibilityChange={saveFavoritesVisibility}
                onFavoritesDescriptionChange={saveFavoritesDescription}
                onObjectUpdated={handleFavoriteObjectUpdated}
                onObjectDeleted={handleFavoriteObjectDeleted}
                onObjectMoved={handleObjectMoved}
                onObjectsReordered={handleFavoritesReordered}
              />
            </div>
          )}
          <div className={styles.shelfList} ref={shelfListRef}>
            {/* One tree whether or not the boards can be dragged: switching
              between a sortable list and a plain one remounted every shelf on
              the first keystroke of a search, so the whole library flashed. The
              drag is simply switched off while a search narrows the list. */}
            <DndContext
              sensors={shelfSensors}
              collisionDetection={closestCenter}
              modifiers={[verticalOnly]}
              onDragEnd={handleShelfDragEnd}
            >
              <SortableContext
                items={displayedShelves.map(shelf => shelf.id)}
                strategy={verticalListSortingStrategy}
              >
                {shelfEntries.map(({ item: shelf, leaving }) => (
                  <div
                    key={shelf.id}
                    className={classNames(styles.shelfSlot, {
                      [styles.shelfLeaving]: leaving,
                    })}
                    data-flip-id={String(shelf.id)}
                    data-flip-leaving={leaving ? 'true' : undefined}
                    aria-hidden={leaving || undefined}
                  >
                    {/* A departing board is no longer sortable: it only has
                      to hold its picture while it folds away. */}
                    {leaving ? (
                      renderShelf(shelf)
                    ) : (
                      <SortableShelf
                        id={shelf.id}
                        disabled={!canReorderShelves}
                      >
                        {(handleProps, isDragging) =>
                          canReorderShelves
                            ? renderShelf(shelf, handleProps, isDragging)
                            : renderShelf(shelf)
                        }
                      </SortableShelf>
                    )}
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}

      {/* The next shelf is added
 from where it will appear: directly under the
          last board. The toolbar at the top of the page no longer carries this
          control. */}
      {canEditHere &&
        !isLoading &&
        !gathered &&
        displayedShelves.length > 0 && (
          <div className={styles.addShelfRow}>
            <Tooltip
              place="top"
              tooltipContent={atShelfLimit ? LIBRARY_FULL_MESSAGE : ''}
              wrapperClassName={classNames({
                [styles.tooltipOff]: !atShelfLimit,
              })}
            >
              <Button
                label="Add shelf"
                ariaLabel="Add shelf"
                onClick={modalToggler}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                Icon={<PlusIcon />}
                iconPosition={IconPosition.Right}
                className={styles.addShelfButton}
                disabled={atShelfLimit}
              />
            </Tooltip>
          </div>
        )}

      {canEditHere && isOpen && (
        <AddShelfModal
          onClose={modalToggler}
          onAddShelf={handleCreateShelf}
          existingNames={shelves.map(s => s.attributes.name)}
        />
      )}

      {showSharePanel && (
        <ShareSelectionPanel
          objects={selectedObjects}
          ownerUsername={ownerUsername ?? libraryId}
          limitReached={limitReached}
          onReorder={reorderSelection}
          onRemove={removeSelection}
          onClear={clearSelection}
        />
      )}
    </div>
  );
}
