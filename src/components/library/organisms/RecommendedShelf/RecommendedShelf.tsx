import cn from 'classnames';
import Image from 'next/image';
import React, {
  JSX,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  lockedLine,
  RECOMMENDED_PREFERENCES,
  RECOMMENDED_SHELF_EMPTY,
  RECOMMENDED_SHELF_MIN_BOOKS,
  RECOMMENDED_SHELF_NAME,
  RECOMMENDED_SHELF_SIZE,
} from '@constants/library/recommendations';

import type {
  BannedBook,
  RecommendedPick,
} from '@local-types/library/recommendation';

import { useAiShelf } from '@hooks/library/useAiShelf';
import { useAnimatedList } from '@hooks/library/useAnimatedList';
import { usePresence } from '@hooks/library/usePresence';

import shelfBackground from '@icons/library/images/shelfBackground.png';
import {
  ArrowIcon,
  BanIcon,
  BookIcon,
  SettingsIcon,
  SparkleIcon,
} from '@icons/library/svg';

import SpellSlot from '@components/library/atoms/SpellSlot';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import { Button, ButtonType } from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { RecommendedBookCard } from '@components/library/molecules/RecommendedBookCard';

import styles from './RecommendedShelf.module.scss';

interface RecommendedShelfProps {
  className?: string;
  readOnly?: boolean;
  /** The library the board is stocked for. */
  libraryId: number;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => Promise<void>;
}

const bookKey = (book: RecommendedPick) => book.id;

/**
 * The owner's AI shelf, standing above the rest of the library: thirteen
 * books gathered from outside it, ten answering the library as it stands
 * and three on ground it does not cover yet. Nobody else sees it.
 *
 * The shelf opens at thirty books and stocks its first board itself; every
 * board after that is a Re-Roll. A pick can be locked, and holds its place
 * through the next roll, or banned, and is never proposed again on this
 * shelf or on any magic book. What the shelf deals in, fiction or not, is
 * the owner's setting: it is remembered and holds for every later roll.
 *
 * Every departure on the board is motion: a pick that leaves fades where it
 * stood and the rest glide into place (useAnimatedList); the modal fades
 * through the shared Modal. Reduced motion is honoured in the stylesheet
 * and by the hook.
 */
export default function RecommendedShelf({
  className,
  readOnly = false,
  libraryId,
  collapsed,
  onCollapsedChange,
}: RecommendedShelfProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);
  const unsavedChoiceRef = useRef(false);
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const foldRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number | null>(null);
  const { mounted: errorMounted, shown: errorShown } = usePresence(
    !!saveError,
    200,
  );

  const shelf = useAiShelf(libraryId, !readOnly);
  const state = shelf.state;
  const board = useMemo(() => state?.picks ?? [], [state]);
  const locked = useMemo(() => new Set(state?.locked ?? []), [state]);
  const bannedBooks: BannedBook[] = useMemo(() => state?.banned ?? [], [state]);
  const preference = state?.preference ?? 'any';
  const required = state?.required ?? RECOMMENDED_SHELF_MIN_BOOKS;
  const books = state?.books ?? 0;
  const isLocked = state?.status === 'locked';
  const [bannedOpen, setBannedOpen] = useState(false);

  useEffect(() => {
    if (!savingRef.current && !unsavedChoiceRef.current) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const measure = () => setBodyHeight(body.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    foldRef.current?.toggleAttribute('inert', isCollapsed);
    actionsRef.current?.toggleAttribute('inert', isCollapsed || readOnly);
  }, [isCollapsed, readOnly]);

  const toggleCollapsed = async () => {
    if (savingRef.current) return;
    const next = !isCollapsed;
    savingRef.current = true;
    unsavedChoiceRef.current = true;
    setSaving(true);
    setSaveError(null);
    setIsCollapsed(next);
    try {
      await onCollapsedChange(next);
      unsavedChoiceRef.current = false;
    } catch {
      setSaveError('Could not sync this setting to your account.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const { ref: cardsRef, entries } = useAnimatedList(board, bookKey, {
    enters: false,
    collapse: 'width',
  });
  const drawnKey = board.map(bookKey).join(',');

  // The banned list is a list whose members come and go like any other: an
  // unbanned book fades out where it stood and the rows below close the gap.
  const { ref: bannedListRef, entries: bannedEntries } = useAnimatedList(
    bannedBooks,
    book => book.title,
    { collapse: 'height' },
  );

  const closeBanned = useCallback(() => setBannedOpen(false), []);
  const { closeRef: bannedCloseRef, close: closeBannedAnimated } =
    useModalClose(closeBanned);

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
    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => {
      el.removeEventListener('scroll', syncScrollState);
      observer.disconnect();
    };
  }, [syncScrollState, cardsRef, drawnKey]);

  const isOverflowing = canScrollLeft || canScrollRight;

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

  // The board keeps its height in every state: what is not a pick yet is a
  // place held open for one.
  const ghosts = Math.max(0, RECOMMENDED_SHELF_SIZE - board.length);
  // A roll now answers at once and works on in the background, so `busy` no
  // longer covers it. Every control whose write the roll would overwrite when
  // it lands (it replaces the board from the snapshot it started with) waits
  // on `working` too.
  const working = shelf.loading || shelf.rolling;

  // One line, and only one: what is in the way, then what the engine said,
  // then the empty board.
  const notice = isLocked
    ? `${lockedLine(required)} (${books}/${required})`
    : shelf.error
      ? shelf.error
      : (state?.note ??
        (state && board.length === 0 && !working
          ? RECOMMENDED_SHELF_EMPTY
          : ''));

  return (
    <div
      className={cn(className, styles.wrapper, {
        [styles.collapsed]: isCollapsed,
      })}
    >
      <div className={styles.header}>
        <div className={styles.left}>
          <Tooltip
            place="bottom"
            tooltipContent={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <button
              type="button"
              className={styles.settings}
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
              aria-expanded={!isCollapsed}
              aria-controls={bodyId}
              aria-busy={saving}
              aria-disabled={saving}
              onClick={() => void toggleCollapsed()}
            >
              <SettingsIcon />
            </button>
          </Tooltip>

          <div className={styles.icon}>
            <BookIcon />
          </div>

          <span className={styles.nameWrap}>
            <Text variant={TypographyVariant.TextBase} className={styles.name}>
              {RECOMMENDED_SHELF_NAME}
            </Text>
          </span>
        </div>

        <div
          className={cn(styles.right, { [styles.readOnlyActions]: readOnly })}
          ref={actionsRef}
          aria-hidden={isCollapsed || readOnly || undefined}
        >
          {/* The setting outlives the board: it is kept even while the shelf
              is still locked, and every later roll obeys it. */}
          <div
            className={styles.preference}
            role="group"
            aria-label="What this shelf recommends"
          >
            {RECOMMENDED_PREFERENCES.map(option => (
              <Tooltip
                key={option.value}
                asChild
                place="bottom"
                tooltipContent={option.hint}
              >
                <button
                  type="button"
                  className={cn(styles.preferenceOption, {
                    [styles.preferenceOn]: preference === option.value,
                  })}
                  aria-pressed={preference === option.value}
                  disabled={readOnly || shelf.busy || working}
                  onClick={() => shelf.choosePreference(option.value)}
                >
                  {option.label}
                </button>
              </Tooltip>
            ))}
          </div>

          <button
            type="button"
            className={cn(styles.headerButton, styles.regenerate, {
              [styles.regenerateWorking]: shelf.rolling,
            })}
            disabled={readOnly || isLocked || shelf.busy || working}
            aria-busy={shelf.rolling}
            onClick={shelf.roll}
            aria-label="Re-roll every pick that is not locked"
          >
            <SparkleIcon />
            Re-Roll
          </button>
          <button
            type="button"
            className={cn(styles.headerButton, styles.bannedButton)}
            disabled={readOnly}
            onClick={() => setBannedOpen(true)}
            aria-label={`Banned books, ${bannedBooks.length}`}
          >
            <BanIcon />
            Banned Books
          </button>
        </div>
        <div className={styles.saveNotice} role="status" aria-live="polite">
          {errorMounted && (
            <span
              className={cn(styles.saveError, {
                [styles.saveErrorClosing]: !errorShown,
              })}
            >
              Could not sync this setting to your account.
            </span>
          )}
        </div>
      </div>

      <div
        id={bodyId}
        ref={foldRef}
        className={styles.fold}
        aria-hidden={isCollapsed || undefined}
        style={{ height: isCollapsed ? 0 : (bodyHeight ?? undefined) }}
      >
        <div className={styles.body} ref={bodyRef}>
          <div
            className={cn(styles.content, { [styles.working]: working })}
            aria-busy={working || undefined}
          >
            <div className={styles.noticeRow} role="status" aria-live="polite">
              {!!notice && (
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.notice}
                >
                  {notice}
                </Text>
              )}
            </div>
            {isOverflowing && (
              <>
                <Button
                  className={cn(styles.arrow, styles.arrowLeft)}
                  onClick={() => scrollJump(-1)}
                  type={ButtonType.Secondary}
                  Icon={<ArrowIcon />}
                  ariaLabel="Scroll recommendations left"
                  disabled={!canScrollLeft}
                />
                <Button
                  className={styles.arrow}
                  onClick={() => scrollJump(1)}
                  type={ButtonType.Secondary}
                  Icon={<ArrowIcon />}
                  ariaLabel="Scroll recommendations right"
                  disabled={!canScrollRight}
                />
              </>
            )}
            <div
              className={cn(styles.items, {
                [styles.scrollable]: isOverflowing,
              })}
              ref={itemsRef}
            >
              <div className={styles.cards} ref={cardsRef}>
                {entries.map(({ item: book, leaving }, index) => (
                  <div
                    key={book.id}
                    className={cn(styles.cardSlot, {
                      [styles.cardLeaving]: leaving,
                    })}
                    data-flip-id={book.id}
                    data-flip-leaving={leaving ? 'true' : undefined}
                    aria-hidden={leaving || undefined}
                  >
                    <RecommendedBookCard
                      book={book}
                      readOnly={readOnly || shelf.busy || working}
                      locked={locked.has(book.id)}
                      // A locked pick survives the roll, so it stays still
                      // while the light runs over the places that do not.
                      working={shelf.rolling && !locked.has(book.id)}
                      slotIndex={index}
                      onToggleLock={pick => shelf.toggleLock(pick.id)}
                      onToggleBan={pick => shelf.ban(pick.id)}
                    />
                  </div>
                ))}
                {Array.from({ length: ghosts }, (_, index) => (
                  <SpellSlot
                    key={`spell-${index}`}
                    index={board.length + index}
                    working={working}
                  />
                ))}
              </div>
            </div>
            <div className={styles.banner}>
              <Image src={shelfBackground} alt="" />
            </div>
          </div>
        </div>
      </div>

      {!readOnly && bannedOpen && (
        <Modal
          className={styles.bannedModal}
          title="Banned books"
          onClose={closeBanned}
          closeRef={bannedCloseRef}
        >
          <div className={styles.bannedBody}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.bannedLede}
            >
              A banned book is never recommended again, here or on a magic book,
              until you take it off this list.
            </Text>

            {bannedBooks.length === 0 ? (
              <div className={styles.bannedEmpty}>
                <span className={styles.bannedEmptyMark} aria-hidden="true">
                  <BanIcon />
                </span>
                <Text variant={TypographyVariant.TextSmall}>
                  Nothing is banned. Ban a pick on the shelf and it lands here.
                </Text>
              </div>
            ) : (
              <div className={styles.bannedScroll}>
                <div
                  className={styles.bannedList}
                  ref={bannedListRef}
                  role="list"
                >
                  {bannedEntries.map(({ item: book, leaving }) => (
                    <div
                      key={book.title}
                      role="listitem"
                      className={styles.bannedRow}
                      data-flip-id={book.title}
                      data-flip-leaving={leaving ? 'true' : undefined}
                      aria-hidden={leaving || undefined}
                    >
                      <div className={styles.bannedText}>
                        <Text
                          variant={TypographyVariant.TextBaseSemibold}
                          className={styles.bannedTitle}
                        >
                          {book.title}
                        </Text>
                        {book.author && (
                          <Text
                            variant={TypographyVariant.TextSmall}
                            className={styles.bannedAuthor}
                          >
                            {book.author}
                          </Text>
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.bannedUnban}
                        disabled={shelf.busy || working || leaving}
                        onClick={() => shelf.unban(book)}
                        aria-label={`Unban ${book.title}`}
                      >
                        Unban
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.bannedFooter}>
              {bannedBooks.length > 0 && (
                <Text
                  variant={TypographyVariant.TextSmall}
                  className={styles.bannedCount}
                >
                  {bannedBooks.length}{' '}
                  {bannedBooks.length === 1 ? 'book' : 'books'}
                </Text>
              )}
              <button
                type="button"
                className={styles.bannedDone}
                onClick={closeBannedAnimated}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
