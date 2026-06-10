import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { LIBRARY_SHELVES_REFETCH_EVENT } from '@constants/library/common';

import type {
  StrapiLibraryEntry,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';
import type { IObject, ObjectType } from '@local-types/library/object';

import { createLibrary } from '@api/library/createLibrary';
import { getLibraryIdByUsername } from '@api/library/getLibraryIdByUsername';
import { getSingleLibrary } from '@api/library/getSingleLibrary';
import { createShelf } from '@api/library/shelf/createShelf';

import { useAuth } from '@components/Context/library/AuthContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { useShareSelection } from '@components/Context/library/ShareSelectionContext';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  AddShelfModal,
  type ShelfType,
} from '@components/library/molecules/AddShelfModal';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { LibraryToolbar } from '@components/library/organisms/LibraryToolbar';
import { ShareSelectionPanel } from '@components/library/organisms/ShareSelectionPanel';
import { Shelf } from '@components/library/organisms/Shelf';

import type { LibraryTemplateProps } from './Library.types';

import styles from './Library.module.scss';

const modalTypeToApi: Record<ShelfType, ObjectType> = {
  books: 'book',
  videos: 'video',
  audios: 'audio',
};

export function LibraryTemplate({ libraryId }: LibraryTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [library, setLibrary] = useState<StrapiLibraryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Briefly true right after a reorder so the shelf list can fade out/in as it
  // re-sequences into the new order (see `resequencing` in Library.module.scss).
  const [isResequencing, setIsResequencing] = useState(false);
  const resequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { accountData } = useAuth();
  const {
    setCurrentShelves,
    setCurrentOwner,
    setCurrentLibrary,
    setIsCreateBlocked,
  } = useGlobalState();
  const {
    selectedObjects,
    limitReached,
    reorder: reorderSelection,
    remove: removeSelection,
    clear: clearSelection,
  } = useShareSelection();

  // Ownership is decided by the loaded library's owner, not the URL slug — the
  // slug is sometimes a numeric library id (Sidebar dropdown, LibraryCard
  // fallback) which never equals a username. The slug check is kept only as a
  // fallback so a logged-in user visiting their own `/library/[username]` can
  // still bootstrap a library before one exists (nothing to load owner from).
  const ownerUsername =
    library?.attributes.user?.data?.attributes.username ?? null;
  const myUsername = accountData?.username?.toLowerCase() ?? null;
  const isOwner =
    !!myUsername &&
    ((!!ownerUsername && ownerUsername.toLowerCase() === myUsername) ||
      (!!libraryId && libraryId.toLowerCase() === myUsername));

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
      // Prefer an explicitly supplied id over re-resolving the slug. Right after
      // bootstrapping a brand-new library, the username lookup is a filtered
      // read-after-write that can still return null (publish/replication lag) —
      // a direct GET by the id we just created is reliable.
      const resolvedId = options?.libraryId ?? (await resolveLibraryId());
      if (resolvedId == null) {
        setLibrary(null);
        setIsLoading(false);
        return;
      }
      const result = await getSingleLibrary(resolvedId);
      setLibrary(result?.data ?? null);
      setIsLoading(false);
    },
    [libraryId, resolveLibraryId],
  );

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

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

  useEffect(
    () => () => {
      if (resequenceTimer.current) clearTimeout(resequenceTimer.current);
    },
    [],
  );

  const modalToggler = () => {
    setIsOpen(open => !open);
  };

  const handleCreateShelf = async (modalShelfType: ShelfType, name: string) => {
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
      return;
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
    const visible = isOwner
      ? data
      : data.filter(s => s.attributes.visibility !== 'private');
    return [...visible].sort(
      (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
    );
  }, [library, isOwner]);

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
    },
    [mutateShelfObjects],
  );

  const handleObjectUpdated = useCallback(
    (shelfId: number, updated: IObject) => {
      mutateShelfObjects(shelfId, objects =>
        objects.map(o => (o.id === updated.id ? updated : o)),
      );
    },
    [mutateShelfObjects],
  );

  const handleObjectDeleted = useCallback(
    (shelfId: number, objectId: number) => {
      mutateShelfObjects(shelfId, objects =>
        objects.filter(o => o.id !== objectId),
      );
    },
    [mutateShelfObjects],
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

  const handleShelvesReordered = useCallback(
    (ordered: { id: number; order: number }[]) => {
      const orderById = new Map(ordered.map(o => [o.id, o.order]));
      // Kick the fade: clear it first so a rapid re-save restarts the animation
      // instead of being swallowed (re-adding a still-present class won't replay).
      setIsResequencing(false);
      if (resequenceTimer.current) clearTimeout(resequenceTimer.current);
      requestAnimationFrame(() => {
        setIsResequencing(true);
        resequenceTimer.current = setTimeout(
          () => setIsResequencing(false),
          450,
        );
      });
      // Only stamp the new `order` onto each shelf; the `shelves` memo
      // re-sorts by `order` at render, so no need to reorder the array here.
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
    },
    [],
  );

  const handleShelfRenamed = useCallback((shelfId: number, name: string) => {
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
                ? { ...s, attributes: { ...s.attributes, name } }
                : s,
            ),
          },
        },
      };
    });
  }, []);

  const handleShelfDeleted = useCallback((shelfId: number) => {
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
  }, []);

  const handleObjectMoved = useCallback(
    (fromShelfId: number, toShelfId: number, moved: IObject) => {
      setLibrary(current => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
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
            const existing = s.attributes.objects?.data ?? [];
            // Avoid duplicates if the move event somehow fires twice.
            const withoutMoved = existing.filter(o => o.id !== moved.id);
            return {
              ...s,
              attributes: {
                ...s.attributes,
                objects: { data: [...withoutMoved, moved] },
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
    },
    [],
  );

  return (
    <div className={styles.wrapper}>
      {isOwner && shelves.length > 0 && (
        <LibraryToolbar
          shelves={shelves}
          onAddShelf={modalToggler}
          onShelvesReordered={handleShelvesReordered}
        />
      )}
      {isLoading ? (
        <Text variant={TypographyVariant.TextBase}>Loading…</Text>
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
            Begin your journey by adding your first shelf
          </Text>

          <Button
            label="Add shelf"
            onClick={modalToggler}
            type={ButtonType.Primary}
            size={ButtonSize.Wide}
            ariaLabel="Add shelf"
            className={styles.button}
          />
        </div>
      ) : (
        <div
          className={classNames(styles.shelfList, {
            [styles.resequencing]: isResequencing,
          })}
        >
          {shelves.map(shelf => (
            <Shelf
              key={shelf.id}
              title={shelf.attributes.name}
              shelf={shelf}
              ownerUsername={libraryId}
              isOwner={isOwner}
              onObjectCreated={handleObjectCreated}
              onObjectUpdated={handleObjectUpdated}
              onObjectDeleted={handleObjectDeleted}
              onObjectMoved={handleObjectMoved}
              onObjectsReordered={handleObjectsReordered}
              onShelfDeleted={handleShelfDeleted}
              onShelfRenamed={handleShelfRenamed}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <AddShelfModal
          onClose={modalToggler}
          onAddShelf={handleCreateShelf}
          existingNames={shelves.map(s => s.attributes.name)}
        />
      )}

      {isOwner && (
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
