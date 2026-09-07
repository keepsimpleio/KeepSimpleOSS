import classNames from 'classnames';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import {
  RECOMMENDED_SHELF_EMPTY,
  RECOMMENDED_SHELF_HINT,
  RECOMMENDED_SHELF_NAME,
  RECOMMENDED_SHELF_SIZE,
} from '@constants/library/recommendations';

import type { IRecommendedBook } from '@local-types/library/recommendation';

import { useAnimatedList } from '@hooks/library/useAnimatedList';

import {
  ArrowIcon,
  BanIcon,
  BookIcon,
  SettingsIcon,
  SparkleIcon,
} from '@icons/library/svg';

import { PixelShelfBoard } from '@components/library/atoms/PixelShelfBoard';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import { Button, ButtonType } from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { RecommendedBookCard } from '@components/library/molecules/RecommendedBookCard';

import type { RecommendedShelfProps } from './RecommendedShelf.types';

import styles from './RecommendedShelf.module.scss';

const bookKey = (book: IRecommendedBook) => book.id;

/**
 * The owner's AI shelf, standing above the rest of the library: books
 * gathered from outside it that the owner might want in it. Nobody else sees
 * it. A pick can be locked (it survives a re-generate) or banned (it dims,
 * and is never dealt again until unbanned); the banned list opens from the
 * header.
 *
 * Every verdict, every re-generate and every departure on the board is
 * motion: replaced picks fade where they stood and the rest glide into
 * place (useAnimatedList); the modal fades through the shared Modal.
 * Reduced motion is honoured in the stylesheet and by the hook.
 *
 * Mocked: the engine is not built yet. The pool is a seed list, the scores
 * are placeholders, and verdicts live for the session only.
 */
export function RecommendedShelf({
  className,
  pool,
}: RecommendedShelfProps): JSX.Element {
  // Which of the pool stand on the board, in order. Starts at the top of it.
  const [boardIds, setBoardIds] = useState<string[]>(() =>
    pool.slice(0, RECOMMENDED_SHELF_SIZE).map(bookKey),
  );
  const [locked, setLocked] = useState<Set<string>>(() => new Set());
  const [banned, setBanned] = useState<Set<string>>(() => new Set());
  const [bannedOpen, setBannedOpen] = useState(false);

  const byId = new Map(pool.map(book => [book.id, book]));
  const board = boardIds
    .map(id => byId.get(id))
    .filter((book): book is IRecommendedBook => !!book);
  const bannedBooks = pool.filter(book => banned.has(book.id));
  const drawnKey = boardIds.join(',');

  const { ref: cardsRef, entries } = useAnimatedList(board, bookKey, {
    enters: false,
    collapse: 'width',
  });

  const toggleLock = (book: IRecommendedBook) => {
    setLocked(prev => {
      const next = new Set(prev);
      if (next.has(book.id)) next.delete(book.id);
      else next.add(book.id);
      return next;
    });
  };

  const toggleBan = (book: IRecommendedBook) => {
    setBanned(prev => {
      const next = new Set(prev);
      if (next.has(book.id)) next.delete(book.id);
      else next.add(book.id);
      return next;
    });
    // A banned pick is nobody's keeper.
    setLocked(prev => {
      if (!prev.has(book.id)) return prev;
      const next = new Set(prev);
      next.delete(book.id);
      return next;
    });
  };

  // Mocked re-generate: every open pick on the board is swapped for the
  // next unseen, unbanned book in the pool, in order. Locked and banned
  // picks hold their places. When the pool runs dry the open picks stay.
  const regenerate = () => {
    setBoardIds(current => {
      const onBoard = new Set(current);
      const fresh = pool
        .map(bookKey)
        .filter(id => !onBoard.has(id) && !banned.has(id));
      let dealt = 0;
      return current.map(id => {
        if (locked.has(id) || banned.has(id)) return id;
        const next = fresh[dealt];
        if (!next) return id;
        dealt += 1;
        return next;
      });
    });
  };

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

  const openCount = board.filter(book => !banned.has(book.id)).length;

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Tooltip place="bottom" tooltipContent={RECOMMENDED_SHELF_HINT}>
            <button
              type="button"
              className={styles.settings}
              aria-label={`Shelf settings. ${RECOMMENDED_SHELF_HINT}`}
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

        <div className={styles.right}>
          <button
            type="button"
            className={classNames(styles.headerButton, styles.regenerate)}
            onClick={regenerate}
            aria-label="Re-generate the open picks on this shelf"
          >
            <SparkleIcon />
            Re-Generate
          </button>
          <button
            type="button"
            className={classNames(styles.headerButton, styles.bannedButton)}
            onClick={() => setBannedOpen(true)}
            aria-label={`Banned books, ${bannedBooks.length}`}
          >
            <BanIcon />
            Banned Books
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.noticeRow} role="status" aria-live="polite">
          {openCount === 0 && (
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.notice}
            >
              {RECOMMENDED_SHELF_EMPTY}
            </Text>
          )}
        </div>
        {isOverflowing && (
          <>
            <Button
              className={classNames(styles.arrow, styles.arrowLeft)}
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
          className={classNames(styles.items, {
            [styles.scrollable]: isOverflowing,
          })}
          ref={itemsRef}
        >
          <div className={styles.cards} ref={cardsRef}>
            {entries.map(({ item: book, leaving }, index) => (
              <div
                key={book.id}
                className={classNames(styles.cardSlot, {
                  [styles.cardLeaving]: leaving,
                })}
                data-flip-id={book.id}
                data-flip-leaving={leaving ? 'true' : undefined}
                aria-hidden={leaving || undefined}
              >
                <RecommendedBookCard
                  book={book}
                  tint={index}
                  locked={locked.has(book.id)}
                  banned={banned.has(book.id)}
                  onToggleLock={toggleLock}
                  onToggleBan={toggleBan}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.board}>
          <PixelShelfBoard seed={7} />
        </div>
      </div>

      {bannedOpen && (
        <Modal
          className={styles.bannedModal}
          title="Banned books"
          onClose={closeBanned}
          closeRef={bannedCloseRef}
        >
          <div className={styles.bannedBody}>
            {bannedBooks.length === 0 ? (
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.bannedEmpty}
              >
                No banned books yet. Ban a pick on the shelf and it lands here.
              </Text>
            ) : (
              <ul className={styles.bannedList}>
                {bannedBooks.map(book => (
                  <li key={book.id} className={styles.bannedRow}>
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
                      className={classNames(
                        styles.headerButton,
                        styles.bannedButton,
                      )}
                      onClick={() => toggleBan(book)}
                      aria-label={`Unban ${book.title}`}
                    >
                      Unban
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.bannedFooter}>
              <button
                type="button"
                className={classNames(styles.headerButton, styles.regenerate)}
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
