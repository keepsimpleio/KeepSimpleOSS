import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import {
  RECOMMENDED_SHELF_EMPTY,
  RECOMMENDED_SHELF_HINT,
  RECOMMENDED_SHELF_NAME,
} from '@constants/library/recommendations';

import type { IObject } from '@local-types/library/object';
import type { IRecommendedBook } from '@local-types/library/recommendation';

import { useAnimatedList } from '@hooks/library/useAnimatedList';

import shelfBackground from '@icons/library/images/shelfBackground.png';
import { ArrowIcon, LibrarianIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Button, ButtonType } from '@components/library/molecules/Button';
import { RecommendedBookCard } from '@components/library/molecules/RecommendedBookCard';
import { ShelfGhostRow } from '@components/library/molecules/ShelfGhostRow';
import { AddObjectModal } from '@components/library/organisms/AddObjectModal';

import type { RecommendedShelfProps } from './RecommendedShelf.types';

import styles from './RecommendedShelf.module.scss';

const bookKey = (book: IRecommendedBook) => book.id;

// The ghost props are dealt per shelf id; this shelf has none, so it keeps
// one of its own that no Strapi shelf can share.
const GHOST_SEED = -1;

/**
 * The owner's own shelf, standing above the rest of the library: books
 * gathered from outside it that the owner might want in it. Nobody else sees
 * it, and nothing on it is theirs until they take it.
 *
 * Every arrival and departure on the board is motion: a hidden pick fades
 * where it stood and the rest glide into its place (useAnimatedList), and
 * the scrollbar strip eases in under an overflowing row. Reduced motion is
 * honoured in the stylesheet and by the hook.
 */
export function RecommendedShelf({
  className,
  books,
  onObjectCreated,
}: RecommendedShelfProps): JSX.Element {
  // Picks the owner has passed on. Kept for the session only: the engine
  // will own this memory once it exists.
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const shown = books.filter(book => !hidden.has(book.id));
  const drawnKey = shown.map(book => book.id).join(',');

  const { ref: cardsRef, entries } = useAnimatedList(shown, bookKey, {
    enters: false,
    collapse: 'width',
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  // The pick being taken, so the add flow can be seeded from it later.
  const [taking, setTaking] = useState<IRecommendedBook | null>(null);

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

  // Ghost props fill whatever the picks leave free on the board, measured
  // from the last card's own right edge (see Shelf for why not scrollWidth).
  const [ghostLeft, setGhostLeft] = useState(0);
  const [ghostWidth, setGhostWidth] = useState(0);

  const measureGhostSpace = useCallback(() => {
    const el = itemsRef.current;
    const cards = cardsRef.current;
    if (!el) return;
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const slots = cards?.children;
    const last =
      slots && slots.length > 0
        ? (slots[slots.length - 1] as HTMLElement)
        : null;
    const left = last ? last.offsetLeft + last.offsetWidth + 38 : padLeft;
    setGhostLeft(left);
    setGhostWidth(Math.max(0, el.clientWidth - left - 24));
  }, [cardsRef]);

  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    measureGhostSpace();
    const observer = new ResizeObserver(measureGhostSpace);
    observer.observe(el);
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, [measureGhostSpace, cardsRef, drawnKey]);

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

  const hide = (book: IRecommendedBook) => {
    setHidden(prev => {
      const next = new Set(prev);
      next.add(book.id);
      return next;
    });
  };

  const take = (book: IRecommendedBook) => {
    setTaking(book);
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setTaking(null);
  };

  const handleCreated = (created: IObject) => {
    // The pick is now a book on the owner's shelf, so it leaves this one.
    if (taking) hide(taking);
    onObjectCreated?.(created);
  };

  const countTitle = `${shown.length} ${
    shown.length === 1 ? 'book' : 'books'
  } recommended`;

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.icon}>
            <LibrarianIcon />
          </div>

          <span className={styles.count} title={countTitle}>
            ({shown.length})
          </span>

          <span className={styles.nameWrap}>
            <Text variant={TypographyVariant.TextBase}>
              {RECOMMENDED_SHELF_NAME}
            </Text>
          </span>

          <Text variant={TypographyVariant.TextSmall} className={styles.hint}>
            {RECOMMENDED_SHELF_HINT}
          </Text>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.noticeRow} role="status" aria-live="polite">
          {shown.length === 0 && (
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
            {entries.map(({ item: book, leaving }) => (
              <div
                key={book.id}
                className={classNames(styles.cardSlot, {
                  [styles.cardLeaving]: leaving,
                })}
                data-flip-id={book.id}
                data-flip-leaving={leaving ? 'true' : undefined}
                aria-hidden={leaving || undefined}
              >
                <RecommendedBookCard book={book} onAdd={take} onHide={hide} />
              </div>
            ))}
          </div>
        </div>
        <ShelfGhostRow
          seed={GHOST_SEED}
          availableWidth={ghostWidth}
          className={styles.ghostRow}
          style={{ left: ghostLeft }}
        />
        <div className={styles.banner}>
          <Image src={shelfBackground} alt="" />
        </div>
      </div>

      {isAddOpen && (
        <AddObjectModal
          objectType="book"
          onClose={closeAdd}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
