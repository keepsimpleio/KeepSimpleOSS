'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Shelf } from '@/components/organisms/Shelf';
import { Text, TypographyVariant } from '@/components/atoms/Text';
import { LIBRARY_SHELVES_REFETCH_EVENT } from '@/constants/common';
import { AddShelfModal, type ShelfType } from '@/components/molecules/AddShelfModal';
import { Button, ButtonSize, ButtonType } from '@/components/molecules/Button';
import type { StrapiLibraryEntry, StrapiSingleShelfEntry } from '@/types/library';
import type { IObject, ObjectType } from '@/types/object';
import { getSingleLibrary } from '@/api/strapi';
import { createShelf } from '@/app/api/shelf/createShelf';
import { createLibrary } from '@/app/api/library/createLibrary';
import { getLibraryIdByUsername } from '@/app/api/library/getLibraryIdByUsername';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';

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
  const { accountData } = useAuth();
  const { setCurrentShelves } = useGlobalState();

  const isOwner =
    !!accountData?.username &&
    !!libraryId &&
    accountData.username.toLowerCase() === libraryId.toLowerCase();

  // URL param is `/library/[username]` — accept either a numeric id or a username slug.
  const resolveLibraryId = useCallback(async (): Promise<number | null> => {
    if (!libraryId?.trim()) return null;
    const numeric = Number(libraryId);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
    return getLibraryIdByUsername(libraryId);
  }, [libraryId]);

  const loadLibrary = useCallback(async () => {
    if (!libraryId?.trim()) {
      setLibrary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const resolvedId = await resolveLibraryId();
    if (resolvedId == null) {
      setLibrary(null);
      setIsLoading(false);
      return;
    }
    const result = await getSingleLibrary(resolvedId);
    setLibrary(result?.data ?? null);
    setIsLoading(false);
  }, [libraryId, resolveLibraryId]);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    const onRefetch = () => {
      void loadLibrary();
    };

    window.addEventListener(LIBRARY_SHELVES_REFETCH_EVENT, onRefetch);

    return () => {
      window.removeEventListener(LIBRARY_SHELVES_REFETCH_EVENT, onRefetch);
    };
  }, [loadLibrary]);

  const modalToggler = () => {
    setIsOpen((open) => !open);
  };

  const handleCreateShelf = async (modalShelfType: ShelfType, name: string) => {
    let resolvedId = await resolveLibraryId();

    // No library yet — bootstrap one, but only if the logged-in user owns this URL.
    // The lookup in resolveLibraryId() prevents double-create on subsequent clicks.
    if (resolvedId == null && isOwner && accountData?.id) {
      resolvedId = await createLibrary(accountData.id);
    }

    if (resolvedId == null) {
      console.warn('[Library] cannot add shelf — no library found for', libraryId);
      return;
    }

    const type = modalTypeToApi[modalShelfType];
    try {
      await createShelf({
        name,
        type,
        library: resolvedId,
        ...(accountData?.id != null ? { owner: accountData.id } : {}),
      });
      setIsOpen(false);
      void loadLibrary();
    } catch (e) {
      console.error('[Library] create shelf failed', e);
    }
  };

  const shelves: StrapiSingleShelfEntry[] = library?.attributes.singleShelves?.data ?? [];

  // Publish the current library's shelves so the Header's Jump-to nav can
  // render the right list without owning its own fetch. NOTE: no cleanup —
  // resetting to [] on every dep change caused the Header (and other
  // consumers via the GlobalState memo) to flicker through an empty list,
  // which read as "right panel data disappeared" on rapid re-renders.
  useEffect(() => {
    setCurrentShelves(shelves);
  }, [shelves, setCurrentShelves]);

  const mutateShelfObjects = useCallback(
    (shelfId: number, mutator: (objects: IObject[]) => IObject[]) => {
      setLibrary((current) => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        const next = shelvesData.map((s) => {
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
    []
  );

  const handleObjectCreated = useCallback(
    (shelfId: number, created: IObject) => {
      mutateShelfObjects(shelfId, (objects) => [...objects, created]);
    },
    [mutateShelfObjects]
  );

  const handleObjectUpdated = useCallback(
    (shelfId: number, updated: IObject) => {
      mutateShelfObjects(shelfId, (objects) =>
        objects.map((o) => (o.id === updated.id ? updated : o))
      );
    },
    [mutateShelfObjects]
  );

  const handleObjectDeleted = useCallback(
    (shelfId: number, objectId: number) => {
      mutateShelfObjects(shelfId, (objects) => objects.filter((o) => o.id !== objectId));
    },
    [mutateShelfObjects]
  );

  const handleShelfDeleted = useCallback((shelfId: number) => {
    setLibrary((current) => {
      if (!current) return current;
      const shelvesData = current.attributes.singleShelves?.data ?? [];
      return {
        ...current,
        attributes: {
          ...current.attributes,
          singleShelves: { data: shelvesData.filter((s) => s.id !== shelfId) },
        },
      };
    });
  }, []);

  const handleObjectMoved = useCallback(
    (fromShelfId: number, toShelfId: number, moved: IObject) => {
      setLibrary((current) => {
        if (!current) return current;
        const shelvesData = current.attributes.singleShelves?.data ?? [];
        const next = shelvesData.map((s) => {
          if (s.id === fromShelfId) {
            const existing = s.attributes.objects?.data ?? [];
            return {
              ...s,
              attributes: {
                ...s.attributes,
                objects: { data: existing.filter((o) => o.id !== moved.id) },
              },
            };
          }
          if (s.id === toShelfId) {
            const existing = s.attributes.objects?.data ?? [];
            // Avoid duplicates if the move event somehow fires twice.
            const withoutMoved = existing.filter((o) => o.id !== moved.id);
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
    []
  );

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Text variant={TypographyVariant.TextBase}>Loading…</Text>
      ) : shelves.length === 0 ? (
        <div className={styles.empty}>
          <Text variant={TypographyVariant.TitleSecondaryBold} className={styles.text}>
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
        shelves.map((shelf) => (
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
            onShelfDeleted={handleShelfDeleted}
          />
        ))
      )}

      {isOpen && <AddShelfModal onClose={modalToggler} onAddShelf={handleCreateShelf} />}
    </div>
  );
}
