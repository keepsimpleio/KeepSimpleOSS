import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  MAX_OBJECTS_PER_SHELF,
  MAX_SHARE_OBJECTS,
  MAX_SHELF_DESCRIPTION_LENGTH,
  SHELF_FULL_MESSAGE,
  SHELF_NAME_MAX_LENGTH,
} from '@constants/library/common';

import type { IObject, ObjectType } from '@local-types/library/object';
import type { ShelfVisibility } from '@local-types/library/shelf';

import { useAnimatedList } from '@hooks/library/useAnimatedList';

import { isFavorite, sortFavorites } from '@lib/library/favorites';
import { libraryPath } from '@lib/library/libraryPath';
import { objectIdFromSlug, objectSlug } from '@lib/library/objectSlug';

import { reorderFavorites } from '@api/library/object/reorderFavorites';
import { reorderObjects } from '@api/library/object/reorderObjects';
import { updateObject } from '@api/library/object/updateObject';
import { deleteShelf } from '@api/library/shelf/deleteShelf';
import { updateShelf } from '@api/library/shelf/updateShelf';

import shelfBackground from '@icons/library/images/shelfBackground.png';
import {
  ArrowIcon,
  AudioIcon,
  BookIcon,
  DragHandleIcon,
  PlusIcon,
  SettingsIcon,
  StarIcon,
  VideoIcon,
} from '@icons/library/svg';

import { useShareSelection } from '@components/Context/library/ShareSelectionContext';
import { CharCount } from '@components/library/atoms/CharCount';
import { IconName } from '@components/library/atoms/Icon';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import { AudioCard } from '@components/library/molecules/AudioCard';
import { BookCard } from '@components/library/molecules/BookCard';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { Input } from '@components/library/molecules/Input';
import { MagicBookCard } from '@components/library/molecules/MagicBookCard';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { ShelfGhostRow } from '@components/library/molecules/ShelfGhostRow';
import { Textarea } from '@components/library/molecules/Textarea';
import { VideoCard } from '@components/library/molecules/VideoCard';
import { AddObjectModal } from '@components/library/organisms/AddObjectModal';
import { ObjectOverviewModal } from '@components/library/organisms/ObjectOverviewModal';

import type { ShelfProps } from './Shelf.types';

import styles from './Shelf.module.scss';

const SHELF_TYPE_ICON: Record<string, JSX.Element> = {
  video: <VideoIcon />,
  book: <BookIcon />,
  audio: <AudioIcon />,
};

const SHELF_TYPE_LABEL: Record<string, string> = {
  video: 'video',
  book: 'book',
  audio: 'audio',
};

const SETTINGS_OPTIONS = [
  {
    value: 'privacy',
    label: 'Privacy',
    subOptions: [
      { value: 'private', label: 'Private' },
      { value: 'public', label: 'Public' },
    ],
  },
  { value: 'delete', label: 'Delete shelf' },
];

// The Favorites shelf cannot be deleted: it stands as long as a book is
// starred. Only its privacy is the owner's to set.
const FAVORITES_SETTINGS_OPTIONS = SETTINGS_OPTIONS.filter(
  option => option.value === 'privacy',
);

const objectKey = (o: IObject) => String(o.id);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A shelf is a row, so a card only ever travels sideways; the vertical
// component of the pointer is dropped rather than lifting the card off the row.
const horizontalOnly = ({
  transform,
}: {
  transform: { x: number; y: number; scaleX: number; scaleY: number };
}) => ({ ...transform, y: 0 });

/**
 * One card's place in the row, wired to dnd-kit so the owner can drag it into
 * a new position. The listeners sit on the slot rather than on a grip: the
 * whole object is the handle, and a press that never travels 4px stays a click
 * that opens the object.
 *
 * No `attributes` spread: the card inside is already a `role="button"` with its
 * own tab stop, and dnd-kit's would put a second one on the wrapper. Keyboard
 * reordering keeps its home in the object's edit screen, step 2.
 */
function SortableCardSlot(props: {
  id: number;
  disabled: boolean;
  leaving: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const { id, disabled, leaving, children } = props;
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      className={classNames(styles.cardSlot, {
        [styles.cardLeaving]: leaving,
        [styles.cardDraggable]: !disabled,
        // The card being dragged rides in the overlay; its slot stays as the
        // gap the rest of the row opens and closes around.
        [styles.cardDragging]: isDragging,
      })}
      data-flip-id={String(id)}
      data-flip-leaving={leaving ? 'true' : undefined}
      aria-hidden={leaving || undefined}
      {...(disabled ? {} : listeners)}
    >
      {children}
    </div>
  );
}

// Said on the shelf's own "Select shelf" button and on every card chip, so the
// owner reads one rule in one wording wherever the refusal meets them.
const SHELF_PRIVATE_SELECT_REASON =
  'Make this shelf public to add its items to a share link.';

export function Shelf(props: ShelfProps): JSX.Element {
  const {
    className,
    title,
    shelf,
    ownerUsername = '',
    isOwner = false,
    visibleObjectIds = null,
    reorderLocked = false,
    onShelfVisibilityChanged,
    onObjectCreated,
    onObjectUpdated,
    onObjectDeleted,
    onShelfDeleted,
    onShelfRenamed,
    onObjectMoved,
    onObjectsReordered,
    favorites = false,
    onFavoritesVisibilityChange,
    onFavoritesDescriptionChange,
    tagFilter = false,
    hiddenObjectIds = null,
    saveOrder,
    shelfOfObject,
    objectsOfShelf,
    dragHandleProps,
    isDragging = false,
    magic = null,
  } = props;
  const shelfType = shelf.attributes.type as ObjectType;
  // Render in persisted-order sequence. Strapi's populate doesn't sort the
  // relation, so without this the drag order (saved via reorderObjects) never
  // shows. Stable: objects with no `order` keep their natural position.
  // The Favorites shelf keeps its own order (`favoriteOrder`, then the time
  // of the star), since its books each hold an `order` on their real shelf.
  // A tag's row arrives in the tag's own order, which is a property of the
  // tag and not of any shelf: re-sorting it by `order` here would draw the
  // books in the sequence of whichever shelf each one happens to stand on.
  const objects = tagFilter
    ? (shelf.attributes.objects?.data ?? [])
    : favorites
      ? sortFavorites(shelf.attributes.objects?.data ?? [])
      : [...(shelf.attributes.objects?.data ?? [])].sort(
          (a, b) => (a.attributes.order ?? 0) - (b.attributes.order ?? 0),
        );
  // What a search leaves on screen. Everything else below (count, cap, the
  // reorder grid, the open object) keeps reading `objects`, the real shelf.
  const drawnObjects = visibleObjectIds
    ? objects.filter(o => visibleObjectIds.has(o.id))
    : objects;

  // What is actually on the board right now. Every measurement below keys off
  // this, not off `objects.length`: a search leaves the shelf's own count
  // untouched while changing every card position on the board.
  const drawnKey = drawnObjects.map(o => o.id).join(',');

  // The order a just-finished drag put the cards in, held until the saved
  // order comes back through the library tree. Without it the row would snap
  // back to the server sequence for the length of the round trip.
  const [orderOverride, setOrderOverride] = useState<number[] | null>(null);
  // The object currently under the pointer, and the frame after the drop:
  // while either is true the FLIP glide stands down, since dnd-kit is already
  // moving the cards and two engines on one card fight.
  const [draggingObjectId, setDraggingObjectId] = useState<number | null>(null);
  const [dropSettling, setDropSettling] = useState(false);
  // Set when a drag was undone because the save failed.
  const [objectOrderError, setObjectOrderError] = useState<string | null>(null);
  // A drag ends with a click on the card it started from; without this the
  // drop would also open the object.
  const dragJustEnded = useRef(false);
  // The travelling card is portaled to the body, which only exists once the
  // page is on the client.
  const [overlayReady, setOverlayReady] = useState(false);
  useEffect(() => setOverlayReady(true), []);

  // Computed every render rather than memoized on the id list: an edit changes
  // an object in place without changing a single id, and a cache keyed on the
  // ids would keep serving the card as it was before the edit.
  const orderedByDrag = (): IObject[] => {
    if (!orderOverride) return drawnObjects;
    const byId = new Map(drawnObjects.map(o => [o.id, o]));
    const held = orderOverride
      .map(id => byId.get(id))
      .filter((o): o is IObject => !!o);
    const heldIds = new Set(held.map(o => o.id));
    // Anything that arrived while the save was in flight keeps its own place
    // at the end rather than dropping off the board.
    return [...held, ...drawnObjects.filter(o => !heldIds.has(o.id))];
  };
  const boardObjects = orderedByDrag();

  // The library tree has caught up with the drag: let the server order lead
  // again.
  useEffect(() => {
    if (!orderOverride) return;
    if (drawnKey === orderOverride.join(',')) setOrderOverride(null);
  }, [drawnKey, orderOverride]);

  // Every change of membership or order on the board is motion, never a
  // snap: a removed or filtered-out card fades out where it stood, the rest
  // glide into the space, and a card that arrives rises in (the slot's own
  // CSS mount animation, so entrances are left to it here).
  const { ref: cardsRef, entries: cardEntries } = useAnimatedList(
    boardObjects,
    objectKey,
    {
      enters: false,
      collapse: 'width',
      moves: draggingObjectId == null && !dropSettling,
    },
  );

  const typeIcon = favorites ? (
    <StarIcon />
  ) : (
    (SHELF_TYPE_ICON[shelfType] ?? <BookIcon />)
  );
  const typeLabel = SHELF_TYPE_LABEL[shelfType] ?? 'item';

  // Backend caps a shelf at 50 objects (all types combined). Pre-disable the
  // Add control once the shelf is full — the backend stays the source of truth
  // (AddObjectModal still surfaces the 400), this just stops a doomed attempt.
  const atObjectLimit = objects.length >= MAX_OBJECTS_PER_SHELF;

  const router = useRouter();
  // On the share-link page the object opens through a query parameter, so
  // the token stays in the address: pushing the library's own object path
  // from there is a full navigation that drops the shared selection.
  const onShareRoute = router.pathname.includes('/share/');
  // The opened object is addressed by the URL, not local state: the last path
  // segment is the object slug (see objectSlug). We match on the slug's trailing
  // id so the right shelf — the one actually holding that object — renders the
  // overview, with its real shelf context, and a title edit can't orphan the URL.
  const usernameParam = router.query.username;
  const urlUsername = Array.isArray(usernameParam)
    ? usernameParam[0]
    : (usernameParam ?? '');
  const objectParam = onShareRoute ? router.query.o : router.query.object;
  const activeSlug = Array.isArray(objectParam) ? objectParam[0] : objectParam;
  const activeObjectId = objectIdFromSlug(activeSlug);

  const [isAddOpen, setIsAddOpen] = useState(false);
  // Selection is shared across all shelves (one share link spans the whole
  // library), so it lives in context rather than per-shelf local state.
  const {
    isSelected,
    toggle: toggleSelection,
    selectMany,
    removeMany,
    limitReached,
  } = useShareSelection();
  const [deleteShelfOpen, setDeleteShelfOpen] = useState(false);
  const [deleteShelfLoading, setDeleteShelfLoading] = useState(false);
  const [deleteShelfError, setDeleteShelfError] = useState<string | null>(null);
  const [deleteShelfSuccess, setDeleteShelfSuccess] = useState(false);
  // A shelf with no stored visibility is public: that is what the visitor
  // filter treats it as, so the owner's menu must say the same.
  const savedVisibility = (shelf.attributes.visibility ??
    'public') as ShelfVisibility;
  const [visibility, setVisibility] =
    useState<ShelfVisibility>(savedVisibility);
  useEffect(() => {
    setVisibility(savedVisibility);
  }, [savedVisibility]);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  // Only objects on a public shelf can be shared (the backend refuses the
  // rest), so the shelf's own privacy governs both the "Select shelf" button
  // and every Select chip on the cards below.
  // The Favorites shelf's own privacy says nothing about sharing: each book
  // there is shareable by the rule of the shelf it lives on, which the backend
  // enforces at share time.
  const isPublic = favorites || visibility === 'public';
  const shareLinkFullReason = `The share link is full (${MAX_SHARE_OBJECTS} items). Remove some to select more.`;
  // How many objects a "Select shelf" could not add because the link was full.
  const [selectNotice, setSelectNotice] = useState<string | null>(null);
  const [shelfName, setShelfName] = useState(title ?? '');
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(title ?? '');
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  // What the owner wrote about the shelf. Shown beside the name only when
  // there is something to show; follows the library tree after a save.
  const savedDescription = shelf.attributes.description ?? '';
  const [shelfDescription, setShelfDescription] = useState(savedDescription);
  useEffect(() => {
    setShelfDescription(savedDescription);
  }, [savedDescription]);
  const [renameDescription, setRenameDescription] = useState(savedDescription);

  // Horizontal scroller: keep every card on one row. When the row overflows we
  // expose the styled scrollbar (`.scrollable`) so the overflow is discoverable
  // by drag/swipe.
  const itemsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = itemsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener('scroll', syncScrollState, { passive: true });
    // Both boxes matter: the scroller's width (the panel folding beside it)
    // and the row of cards inside it (a search filtering them away).
    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => {
      el.removeEventListener('scroll', syncScrollState);
      observer.disconnect();
    };
  }, [syncScrollState, cardsRef, drawnKey]);

  // Ghost props fill whatever the real objects leave free on the board. The
  // row is measured, not guessed: card widths differ by type, and the free
  // space shrinks with every object the owner adds until it is gone.
  const [ghostLeft, setGhostLeft] = useState(0);
  const [ghostWidth, setGhostWidth] = useState(0);

  const measureGhostSpace = useCallback(() => {
    const el = itemsRef.current;
    const cards = cardsRef.current;
    if (!el) return;
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    // Measure the last card's own right edge, NOT the row's scrollWidth: the
    // cards row carries min-width: 100%, so its scrollWidth is the whole
    // viewport even when it holds nothing, which left the props zero space.
    const slots = cards?.children;
    const last =
      slots && slots.length > 0
        ? (slots[slots.length - 1] as HTMLElement)
        : null;
    // offsetLeft is measured from the scroll row, so it already carries the
    // row's own left padding. Objects push the props right by one card gap.
    const left = last ? last.offsetLeft + last.offsetWidth + 38 : padLeft;
    setGhostLeft(left);
    // The trailing 24px keeps the last prop clear of the board's right edge.
    setGhostWidth(Math.max(0, el.clientWidth - left - 24));
  }, [cardsRef]);

  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    measureGhostSpace();
    const observer = new ResizeObserver(measureGhostSpace);
    observer.observe(el);
    // The props start where the last card ends, so the row of cards is the
    // box that decides it. Without this a search left the props parked at the
    // old last card and the covers stood right through them.
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, [measureGhostSpace, cardsRef, drawnKey]);

  const isOverflowing = canScrollLeft || canScrollRight;

  // The object the owner just added. A full row appends it past the right
  // edge, out of sight, so once it stands on the board the row scrolls to it.
  const revealObjectId = useRef<number | null>(null);

  useEffect(() => {
    const id = revealObjectId.current;
    if (id == null || !drawnKey.split(',').includes(String(id))) return;
    revealObjectId.current = null;
    const el = itemsRef.current;
    const slot = cardsRef.current?.querySelector<HTMLElement>(
      `[data-flip-id="${id}"]`,
    );
    if (!el || !slot) return;
    // offsetLeft is measured from the scroll row, the same box that scrolls.
    const padRight = parseFloat(getComputedStyle(el).paddingRight) || 0;
    const target =
      slot.offsetLeft + slot.offsetWidth + padRight - el.clientWidth;
    // Already in view: leave the row where the owner left it.
    if (target <= el.scrollLeft) return;
    el.scrollTo({
      left: target,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [drawnKey, cardsRef]);

  // Advance one card per click. The stride is the distance between two adjacent
  // slots (card width + gap); with a single card fall back to its own width, and
  // with none to most of a viewport.
  const scrollJump = (direction: -1 | 1) => {
    const el = itemsRef.current;
    if (!el) return;
    const slots = cardsRef.current?.children;
    let step = el.clientWidth * 0.8;
    if (slots && slots.length > 0) {
      const first = slots[0] as HTMLElement;
      step =
        slots.length > 1
          ? (slots[1] as HTMLElement).offsetLeft - first.offsetLeft
          : first.offsetWidth;
    }
    el.scrollBy({
      left: direction * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  const closeRename = useCallback(() => {
    if (renameLoading) return;
    setRenameOpen(false);
    setRenameError(null);
  }, [renameLoading]);
  const { closeRef: renameCloseRef, close: closeRenameAnimated } =
    useModalClose(closeRename);

  const openAdd = () => {
    if (atObjectLimit) return;
    setIsAddOpen(true);
  };
  const closeAdd = () => setIsAddOpen(false);

  // Open/close are URL transitions, kept shallow so the library underneath is
  // never refetched or unmounted — only the overview modal appears/disappears
  // over the current page. `scroll: false` keeps the shelf scroll position.
  const openObject = (object: IObject) => {
    // The click that closes a drag belongs to the drag, not to the object.
    if (dragJustEnded.current) {
      dragJustEnded.current = false;
      return;
    }
    if (onShareRoute) {
      void router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, o: objectSlug(object) },
        },
        undefined,
        { shallow: true, scroll: false },
      );
      return;
    }
    void router.push(
      `${libraryPath(ownerUsername || urlUsername)}/${objectSlug(object)}`,
      undefined,
      { shallow: true, scroll: false },
    );
  };
  const closeObject = () => {
    if (onShareRoute) {
      const rest = { ...router.query };
      delete rest.o;
      void router.push({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
        scroll: false,
      });
      return;
    }
    void router.push(libraryPath(ownerUsername || urlUsername), undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // The object this shelf currently owns *and* the URL points at, if any.
  // The Favorites shelf never opens one: the same book stands on its real
  // shelf, and that shelf's overview is the one that knows where it lives.
  // A gathered row is drawn from the tag's own list, so taking that tag off a
  // book takes the book out of the row under the click that did it. The
  // overview belongs to the book, not to the row it was opened from: when the
  // row no longer holds it, it is found on the shelf it actually stands on,
  // and only a book gone from the library closes the overview.
  const homeOfActive =
    !favorites && activeObjectId != null && tagFilter
      ? shelfOfObject?.(activeObjectId)
      : undefined;
  const activeObject =
    !favorites && activeObjectId != null
      ? (objects.find(o => o.id === activeObjectId) ??
        (homeOfActive != null
          ? (objectsOfShelf?.(homeOfActive)?.find(
              o => o.id === activeObjectId,
            ) ?? null)
          : null))
      : null;

  // Dragging a card into a new place is the owner's own shelf, on a desktop
  // pointer (`isOwner` is already owner + desktop), with nothing filtered: a
  // search shows part of the shelf, and an order dragged out of a part says
  // nothing about the objects it hides.
  const canReorderObjects =
    isOwner && visibleObjectIds === null && objects.length > 1;

  // The magic book is the owner's, on a real book shelf, with nothing
  // filtered. Favorites and a tag's row are views of other shelves' books,
  // and a pick made for them would be a pick for no shelf at all.
  const showMagic =
    isOwner &&
    !favorites &&
    !tagFilter &&
    shelfType === 'book' &&
    visibleObjectIds === null;

  // 4px of travel separates a drag from a click, the same threshold the
  // reorder grid in the object's edit screen uses.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const draggingObject =
    draggingObjectId != null
      ? (boardObjects.find(o => o.id === draggingObjectId) ?? null)
      : null;

  // One card, drawn the same whether it is standing on the shelf or riding
  // under the cursor. The travelling copy carries no controls: its Select chip
  // and its dossier belong to the card that stayed behind.
  const renderCard = (obj: IObject, travelling = false) => {
    const selected = isSelected(obj.id);
    // In a gathered row every book brings its own shelf's privacy with it.
    const cardHidden = !!hiddenObjectIds?.has(obj.id);
    const cardPublic = tagFilter ? !cardHidden : isPublic;
    // Only the owner can build a share link, so a visitor never sees the chip.
    // The owner sees it on every kind of object (book, video, audio), and it
    // carries its own reason when it cannot be used: the backend refuses
    // objects on a private shelf, and a chip that simply vanished there read as
    // "this kind of object cannot be shared".
    const onSelectToggle =
      isOwner && !travelling ? () => toggleSelection(obj) : undefined;
    const selectDisabled = !cardPublic || limitReached;
    // Short enough to stand on the chip over the artwork; the shelf's own
    // Select button carries the full sentence.
    const selectReason = !cardPublic
      ? 'Shelf is private'
      : limitReached
        ? 'Link is full'
        : undefined;
    const shared = {
      object: obj,
      onClick: travelling ? undefined : openObject,
      selected,
      onSelectToggle,
      selectDisabled,
      selectReason,
      showHoverCard: !travelling,
    };

    if (shelfType === 'video') return <VideoCard {...shared} />;
    if (shelfType === 'audio') return <AudioCard {...shared} />;
    return (
      <BookCard
        {...shared}
        hidden={cardHidden}
        ownerUsername={ownerUsername}
        favorite={isFavorite(obj)}
        onFavoriteToggle={
          isOwner && !travelling ? () => toggleFavorite(obj) : undefined
        }
        favoriteBusy={favoriteBusyId === obj.id}
      />
    );
  };

  // The star on a card. The library tree flips first so the star and the
  // Favorites shelf answer at once; the save follows, and a failure puts the
  // book back and says so on the shelf.
  const [favoriteBusyId, setFavoriteBusyId] = useState<number | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const toggleFavorite = (obj: IObject) => {
    if (favoriteBusyId != null) return;
    const next = !isFavorite(obj);
    setFavoriteError(null);
    setFavoriteBusyId(obj.id);
    onObjectUpdated?.(shelf.id, {
      ...obj,
      attributes: {
        ...obj.attributes,
        favorite: next,
        favoritedAt: next ? new Date().toISOString() : null,
        favoriteOrder: null,
      },
    });
    updateObject(obj.id, { favorite: next })
      .then(response => {
        onObjectUpdated?.(shelf.id, {
          ...obj,
          attributes: {
            ...obj.attributes,
            ...response.data.attributes,
            favorite: next,
          },
        });
      })
      .catch(e => {
        console.error('[Shelf] favorite save failed', e);
        onObjectUpdated?.(shelf.id, obj);
        setFavoriteError(
          next
            ? `Could not add “${obj.attributes.title}” to favorites.`
            : `Could not remove “${obj.attributes.title}” from favorites.`,
        );
      })
      .finally(() => setFavoriteBusyId(null));
  };

  const handleObjectDragStart = (event: DragStartEvent) => {
    setObjectOrderError(null);
    setDraggingObjectId(Number(event.active.id));
  };

  const endObjectDrag = () => {
    setDraggingObjectId(null);
    dragJustEnded.current = true;
    // The guard is for the click the drop itself produces. If the browser
    // never sends one, it must not sit there and swallow the next real click.
    window.setTimeout(() => {
      dragJustEnded.current = false;
    }, 300);
    // The FLIP glide stays down for the frame in which the new order lands:
    // dnd-kit has already slid the cards there, so a second animation would
    // pull them back and replay the move.
    setDropSettling(true);
    window.requestAnimationFrame(() => setDropSettling(false));
  };

  const handleObjectDragEnd = (event: DragEndEvent) => {
    endObjectDrag();
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = boardObjects.map(o => o.id);
    const from = ids.indexOf(Number(active.id));
    const to = ids.indexOf(Number(over.id));
    if (from === -1 || to === -1) return;

    const nextIds = arrayMove(ids, from, to);
    const previousIds = ids;
    // Show the new order at once and hold it until the library tree carries
    // the saved positions back.
    setOrderOverride(nextIds);
    const ordered = nextIds.map((id, index) => ({ id, order: index }));
    onObjectsReordered?.(shelf.id, ordered);

    const save = saveOrder
      ? saveOrder(ordered)
      : favorites
        ? reorderFavorites({ objects: ordered })
        : reorderObjects({ shelfId: shelf.id, objects: ordered });
    save.catch(error => {
      console.error('[Shelf] object reorder failed to persist', {
        shelfId: shelf.id,
        objects: ordered,
        error,
      });
      // Put the shelf back the way the server still has it, and say so: a
      // silent failure would show the new order until the next reload.
      onObjectsReordered?.(
        shelf.id,
        previousIds.map((id, index) => ({ id, order: index })),
      );
      setOrderOverride(null);
      setObjectOrderError(
        tagFilter
          ? `Could not save the new order for “${shelfName}”. The tag is unchanged.`
          : `Could not save the new ${typeLabel} order. The shelf is unchanged.`,
      );
    });
  };

  // "Select shelf" bulk-toggles every object on this shelf into the share
  // selection. It's owner-only and stays visible regardless of visibility — the
  // private/public toggle only governs guest access, not the owner's toolbar.
  // The share backend 400s on non-public objects, so on a private shelf the
  // button is shown but disabled (with a tooltip) rather than vanishing. When
  // all are already selected it clears them; otherwise it adds them (selectMany
  // stops at the cap).
  const allSelected =
    objects.length > 0 && objects.every(o => isSelected(o.id));
  const selectShelfDisabled =
    !isPublic || objects.length === 0 || (!allSelected && limitReached);
  // Every reason the control is off is spelled out where the pointer rests.
  const selectShelfReason = !isPublic
    ? SHELF_PRIVATE_SELECT_REASON
    : objects.length === 0
      ? 'Nothing on this shelf to select yet.'
      : !allSelected && limitReached
        ? shareLinkFullReason
        : null;
  const handleSelectShelf = () => {
    setSelectNotice(null);
    if (allSelected) {
      removeMany(objects.map(o => o.id));
      return;
    }
    const leftOut = selectMany(objects);
    if (leftOut > 0) {
      setSelectNotice(
        `${leftOut} ${leftOut === 1 ? 'item was' : 'items were'} left out: a share link holds ${MAX_SHARE_OBJECTS} at most.`,
      );
    }
  };

  useEffect(() => {
    if (!selectNotice) return;
    const timer = window.setTimeout(() => setSelectNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [selectNotice]);

  const openRename = () => {
    setRenameError(null);
    setRenameValue(shelfName);
    setRenameDescription(shelfDescription);
    setRenameOpen(true);
  };

  const handleSettingsChange = (value: string) => {
    if (value === 'delete') {
      setDeleteShelfError(null);
      setDeleteShelfOpen(true);
      return;
    }
    if (value === 'private' || value === 'public') {
      const previous = visibility;
      if (previous === value) return;
      setVisibility(value);
      setVisibilityError(null);
      // The Favorites shelf's privacy is the library's own field, saved by
      // the library; its books stay shareable either way, since each is
      // still on its real shelf.
      if (favorites) {
        (onFavoritesVisibilityChange?.(value) ?? Promise.resolve()).catch(e => {
          console.error('[Shelf] failed to update favorites visibility', e);
          setVisibility(previous);
          setVisibilityError(
            `Could not make this shelf ${value}. It is still ${previous}.`,
          );
        });
        return;
      }
      updateShelf(shelf.id, { visibility: value })
        .then(() => {
          // Only public-shelf objects are shareable. Going private strips
          // this shelf's objects from the share selection once the save is
          // real, so a failed save costs the owner nothing.
          if (value === 'private') {
            removeMany(objects.map(o => o.id));
          }
          onShelfVisibilityChanged?.(shelf.id, value);
        })
        .catch(e => {
          console.error('[Shelf] failed to update visibility', e);
          setVisibility(previous);
          setVisibilityError(
            `Could not make this shelf ${value}. It is still ${previous}.`,
          );
        });
    }
  };

  // The Favorites shelf keeps its name; only its hint is the owner's to write,
  // and it lives on the library rather than on a shelf.
  const editsFavorites = favorites && !!onFavoritesDescriptionChange;

  const confirmRename = async () => {
    const trimmed = editsFavorites ? shelfName : renameValue.trim();
    const trimmedDescription = renameDescription.trim();
    const nameChanged = !editsFavorites && !!trimmed && trimmed !== shelfName;
    const descriptionChanged = trimmedDescription !== shelfDescription.trim();
    if (!trimmed || (!nameChanged && !descriptionChanged)) {
      setRenameOpen(false);
      return;
    }
    setRenameLoading(true);
    setRenameError(null);
    try {
      if (editsFavorites) {
        await onFavoritesDescriptionChange(trimmedDescription);
      } else {
        // Only what changed travels; an empty description clears the hint.
        const saved = await updateShelf(shelf.id, {
          ...(nameChanged ? { name: trimmed } : {}),
          ...(descriptionChanged ? { description: trimmedDescription } : {}),
        });
        // A CMS without the field answers 200 and drops it: the answer, not
        // the request, says what was kept.
        const stored = saved.data?.attributes;
        if (
          !stored ||
          (nameChanged && stored.name !== trimmed) ||
          (descriptionChanged &&
            (stored.description ?? '') !== trimmedDescription)
        ) {
          throw new Error('The shelf was not saved. Please try again.');
        }
      }
      setShelfName(trimmed);
      setShelfDescription(trimmedDescription);
      onShelfRenamed?.(shelf.id, trimmed, trimmedDescription);
      setRenameOpen(false);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to rename shelf. Please try again.';
      setRenameError(message);
    } finally {
      setRenameLoading(false);
    }
  };

  const confirmDeleteShelf = async () => {
    setDeleteShelfLoading(true);
    setDeleteShelfError(null);
    try {
      await deleteShelf(shelf.id);
      setDeleteShelfOpen(false);
      setDeleteShelfSuccess(true);
      // The shelf is gone on the server: tell the library now, not when the
      // success card is dismissed, or the ghost still counts toward the
      // 21-shelf cap and still blocks its own name for a new shelf.
      onShelfDeleted?.(shelf.id);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to delete shelf. Please try again.';
      setDeleteShelfError(message);
    } finally {
      setDeleteShelfLoading(false);
    }
  };

  // The modal stays up after a create: it shows its own confirmation (and
  // any reorder warning) and closes itself. Closing it from here unmounted
  // that confirmation before it could appear.
  // A gathered row is not a shelf. Everything an object does from here (an
  // edit, a move, a delete, the sequence in step 2) lands on the shelf the
  // book actually stands on.
  const homeShelfId = (objectId: number) =>
    tagFilter ? (shelfOfObject?.(objectId) ?? shelf.id) : shelf.id;

  const handleCreated = (created: IObject) => {
    revealObjectId.current = created.id;
    onObjectCreated?.(shelf.id, created);
  };

  const handleUpdated = (updated: IObject) => {
    const from = homeShelfId(updated.id);
    const newShelfId = updated.attributes.shelf?.data?.id;
    // Move detected — pop out of this shelf, drop into the new one, and
    // close the overview so the user sees the move take effect.
    if (newShelfId != null && newShelfId !== from) {
      onObjectMoved?.(from, newShelfId, updated);
      closeObject();
      return;
    }
    // No need to track the object locally — it flows back through `objects` and
    // the URL still points at its id, so the overview re-renders with the edit.
    onObjectUpdated?.(from, updated);
  };

  const handleDeleted = (id: number) => {
    onObjectDeleted?.(homeShelfId(id), id);
    closeObject();
  };

  return (
    <div
      id={`shelf-${shelf.id}`}
      className={classNames(className, styles.wrapper, {
        [styles.dragging]: isDragging,
      })}
    >
      <div className={styles.header}>
        <div className={styles.left}>
          {isOwner && dragHandleProps && (
            <button
              type="button"
              className={styles.dragHandle}
              aria-label={`Drag to reorder ${shelfName}`}
              {...dragHandleProps}
            >
              <DragHandleIcon />
            </button>
          )}
          {isOwner && !dragHandleProps && reorderLocked && (
            <Tooltip
              place="bottom"
              tooltipContent="Clear the search to reorder shelves."
            >
              <span
                className={classNames(styles.dragHandle, styles.dragHandleOff)}
                aria-hidden="true"
              >
                <DragHandleIcon />
              </span>
            </Tooltip>
          )}

          {isOwner && !tagFilter && (
            <Dropdown
              className={styles.settingsDropdown}
              menuClassName={styles.settingsMenu}
              triggerClassName={styles.settingsTrigger}
              options={
                favorites ? FAVORITES_SETTINGS_OPTIONS : SETTINGS_OPTIONS
              }
              onChange={handleSettingsChange}
              value={visibility}
              customHeader={
                <Button
                  className={classNames(styles.settings, {
                    [styles.settingsPrivate]: visibility === 'private',
                    [styles.settingsPublic]: visibility === 'public',
                  })}
                  onClick={() => {}}
                  type={ButtonType.Secondary}
                  Icon={<SettingsIcon />}
                  ariaLabel={`Shelf settings (${visibility})`}
                />
              }
            />
          )}

          <div className={styles.icon}>{typeIcon}</div>

          <span className={styles.count}>({objects.length})</span>

          <span className={styles.nameWrap}>
            {isOwner && !tagFilter && (!favorites || editsFavorites) ? (
              <button
                type="button"
                className={styles.nameButton}
                onClick={openRename}
                aria-label={editsFavorites ? 'Edit Favorites' : 'Edit shelf'}
              >
                <Text variant={TypographyVariant.TextBase}>{shelfName}</Text>
              </button>
            ) : (
              <Text variant={TypographyVariant.TextBase}>{shelfName}</Text>
            )}
          </span>

          {/* The owner's word about the shelf, for anyone who rests on the
              mark. Absent entirely while there is nothing written. */}
          {shelfDescription.trim() && (
            <Tooltip asChild place="bottom" tooltipContent={shelfDescription}>
              <button
                type="button"
                className={styles.hint}
                aria-label={`About ${shelfName}: ${shelfDescription}`}
              >
                ?
              </button>
            </Tooltip>
          )}
        </div>

        <div className={styles.right}>
          {isOwner && !tagFilter && (
            <Tooltip
              place="bottom"
              tooltipContent={selectShelfReason ?? ''}
              wrapperClassName={classNames(styles.selectShelfWrap, {
                [styles.tooltipOff]: !selectShelfReason,
              })}
            >
              <Button
                label={allSelected ? 'Deselect shelf' : 'Select shelf'}
                ariaLabel={allSelected ? 'Deselect shelf' : 'Select shelf'}
                onClick={handleSelectShelf}
                disabled={selectShelfDisabled}
                type={ButtonType.Secondary}
                size={ButtonSize.Default}
                className={styles.button}
                labelClassName={styles.text}
              />
            </Tooltip>
          )}

          {isOwner && !favorites && !tagFilter && (
            <Tooltip
              place="bottom"
              tooltipContent={
                atObjectLimit
                  ? `${SHELF_FULL_MESSAGE} Delete an item to add a new one.`
                  : ''
              }
              wrapperClassName={classNames(styles.addWrap, {
                [styles.tooltipOff]: !atObjectLimit,
              })}
            >
              <Button
                label={`Add ${typeLabel}`}
                ariaLabel={`Add ${typeLabel}`}
                onClick={openAdd}
                type={ButtonType.Text}
                size={ButtonSize.Default}
                Icon={<PlusIcon />}
                iconPosition={IconPosition.Right}
                className={styles.button}
                disabled={atObjectLimit}
              />
            </Tooltip>
          )}
        </div>
      </div>

      {/* The shelf's own messages, laid over the air above the board: a
          failed privacy save or a truncated bulk select never shifts the
          board, and the owner's shelf stands exactly as tall as a visitor's.
          Owner-only surface; visitors have nothing to be told here. */}
      <div className={styles.content}>
        {isOwner && (
          <div
            className={styles.shelfNoticeRow}
            role="status"
            aria-live="polite"
          >
            {(visibilityError ||
              objectOrderError ||
              favoriteError ||
              selectNotice) && (
              <Text
                variant={TypographyVariant.TextSmall}
                className={classNames(styles.shelfNotice, {
                  [styles.shelfNoticeError]:
                    !!visibilityError || !!objectOrderError || !!favoriteError,
                })}
              >
                {visibilityError ??
                  objectOrderError ??
                  favoriteError ??
                  selectNotice}
              </Text>
            )}
          </div>
        )}
        {isOverflowing && (
          <>
            <Button
              className={classNames(styles.arrow, styles.arrowLeft)}
              onClick={() => scrollJump(-1)}
              type={ButtonType.Secondary}
              Icon={<ArrowIcon />}
              ariaLabel={`Scroll ${typeLabel}s left`}
              disabled={!canScrollLeft}
            />
            <Button
              className={styles.arrow}
              onClick={() => scrollJump(1)}
              type={ButtonType.Secondary}
              Icon={<ArrowIcon />}
              ariaLabel={`Scroll ${typeLabel}s right`}
              disabled={!canScrollRight}
            />
          </>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[horizontalOnly]}
          onDragStart={handleObjectDragStart}
          onDragEnd={handleObjectDragEnd}
          onDragCancel={endObjectDrag}
        >
          <div
            className={classNames(styles.items, {
              [styles.scrollable]: isOverflowing,
              [styles.reordering]: draggingObjectId != null,
            })}
            ref={itemsRef}
          >
            {/* Only the cards actually standing on the shelf are sortable: one
                on its way out is still in the row for its fade, and it must not
                become a drop target or a place in the sequence. */}
            <SortableContext
              items={boardObjects.map(obj => obj.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div
                className={classNames(styles.cards, {
                  // While a card travels, the row stops answering the pointer:
                  // otherwise every card the dragged one passes lifts and opens
                  // its dossier behind the drag.
                  [styles.cardsReordering]: draggingObjectId != null,
                })}
                ref={cardsRef}
              >
                {cardEntries.map(({ item: obj, leaving }) => (
                  <SortableCardSlot
                    key={obj.id}
                    id={obj.id}
                    disabled={!canReorderObjects || leaving}
                    leaving={leaving}
                  >
                    {renderCard(obj)}
                  </SortableCardSlot>
                ))}
                {/* The magic book stands after the last book, outside the
                    sortable set: it is not the owner's yet, so it cannot be
                    dragged or dropped on. Absent while a search narrows the
                    row, since a pick made for the whole shelf says nothing
                    about a part of it. */}
                {showMagic && magic && (
                  <div className={styles.cardSlot} data-magic-book>
                    <MagicBookCard slot={magic} ownerUsername={ownerUsername} />
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
          {/* Mounted after hydration, so the server and the first client
              render agree; it stays mounted from then on, since the drop
              animation plays as the travelling card is handed back. */}
          {overlayReady &&
            createPortal(
              // Portaled to the body for the same reason the hover dossier is:
              // the scroll row clips itself, and a card dragged near the left
              // edge would be sliced by that clip.
              <div className="library">
                <DragOverlay
                  // The card settles into its new place instead of blinking
                  // there; a reader who asked for less motion gets the plain
                  // hand-off.
                  dropAnimation={prefersReducedMotion() ? null : undefined}
                >
                  {draggingObject ? (
                    <div className={styles.dragOverlayCard}>
                      {renderCard(draggingObject, true)}
                    </div>
                  ) : null}
                </DragOverlay>
              </div>,
              document.body,
            )}
        </DndContext>
        <ShelfGhostRow
          seed={shelf.id}
          availableWidth={ghostWidth}
          className={styles.ghostRow}
          style={{ left: ghostLeft }}
        />
        <div className={styles.banner}>
          <Image src={shelfBackground} alt="" />
        </div>
      </div>

      {isOwner && isAddOpen && (
        <AddObjectModal
          objectType={shelfType}
          defaultShelfId={shelf.id}
          shelfObjects={objects}
          onClose={closeAdd}
          onCreated={handleCreated}
          onReordered={ordered => onObjectsReordered?.(shelf.id, ordered)}
        />
      )}

      {activeObject && (
        <ObjectOverviewModal
          object={activeObject}
          isOwner={isOwner}
          ownerUsername={ownerUsername}
          // Step 2 of the edit form sets a position on a shelf, so it is
          // handed the book's own shelf and everything standing on it, never
          // the gathered row, whose sequence belongs to the tag.
          shelfObjects={
            tagFilter
              ? (objectsOfShelf?.(homeShelfId(activeObject.id)) ?? objects)
              : objects
          }
          defaultShelfId={homeShelfId(activeObject.id)}
          onClose={closeObject}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          onObjectsReordered={ordered =>
            onObjectsReordered?.(homeShelfId(activeObject.id), ordered)
          }
        />
      )}

      {isOwner && renameOpen && (
        <Modal
          className={styles.renameModal}
          title={editsFavorites ? 'Edit Favorites' : 'Edit shelf'}
          onClose={closeRename}
          closeRef={renameCloseRef}
        >
          <div className={styles.renameWrapper}>
            {!editsFavorites && (
              <div className={styles.renameField}>
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.renameLabel}
                >
                  Shelf name
                </Text>
                <Input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !renameLoading) {
                      e.preventDefault();
                      void confirmRename();
                    }
                  }}
                  placeholder="My shelf"
                  placeholderColor="#9E9E9E"
                  ariaLabel="Shelf name"
                  maxLength={SHELF_NAME_MAX_LENGTH}
                />
                <CharCount
                  current={renameValue.length}
                  max={SHELF_NAME_MAX_LENGTH}
                />
              </div>
            )}

            <div className={styles.renameField}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.renameLabel}
              >
                Description
              </Text>
              <Textarea
                value={renameDescription}
                onChange={e => setRenameDescription(e.target.value)}
                placeholder="Shown beside the shelf name on hover"
                placeholderColor="#9E9E9E"
                ariaLabel="Shelf description"
                rows={3}
                maxLength={MAX_SHELF_DESCRIPTION_LENGTH}
              />
              <CharCount
                current={renameDescription.length}
                max={MAX_SHELF_DESCRIPTION_LENGTH}
              />
              {renameError && (
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.renameError}
                >
                  {renameError}
                </Text>
              )}
            </div>

            <div className={styles.renameFooter}>
              <Button
                label="Cancel"
                onClick={closeRenameAnimated}
                type={ButtonType.Secondary}
                size={ButtonSize.Wide}
                ariaLabel="Cancel"
              />
              <Button
                label={renameLoading ? 'Saving…' : 'Save'}
                onClick={confirmRename}
                type={ButtonType.Primary}
                size={ButtonSize.Wide}
                ariaLabel="Save shelf"
                disabled={
                  renameLoading ||
                  (!editsFavorites && renameValue.trim().length === 0)
                }
              />
            </div>
          </div>
        </Modal>
      )}

      {isOwner && deleteShelfOpen && (
        <ConfirmationModal
          variant="delete"
          title={`Are you sure you want to delete "${shelfName}" shelf?`}
          text={
            deleteShelfError ??
            (objects.length > 0
              ? `This will permanently delete the shelf and all ${objects.length} ${typeLabel}${
                  objects.length === 1 ? '' : 's'
                } on it. This cannot be undone.`
              : 'This action is irreversible.')
          }
          actionButtonLabel={deleteShelfLoading ? 'Deleting…' : 'Delete'}
          actionButtonType={ButtonType.Warning}
          isLoading={deleteShelfLoading}
          onClose={() => {
            if (deleteShelfLoading) return;
            setDeleteShelfOpen(false);
            setDeleteShelfError(null);
          }}
          onConfirm={confirmDeleteShelf}
        />
      )}

      {deleteShelfSuccess && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title="Shelf deleted"
          text={`"${shelfName}" has been removed from the library.`}
          actionButtonLabel="Close"
          actionButtonType={ButtonType.Secondary}
          onClose={() => setDeleteShelfSuccess(false)}
          onConfirm={() => setDeleteShelfSuccess(false)}
        />
      )}
    </div>
  );
}
