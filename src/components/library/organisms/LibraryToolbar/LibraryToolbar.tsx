import classNames from 'classnames';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import { useLibrarySwitcher } from '@hooks/library/useLibrarySwitcher';

import { ArrowIcon, LibrarianIcon, PanelIcon } from '@icons/library/svg';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { Input } from '@components/library/molecules/Input';

import type { LibraryToolbarProps } from './LibraryToolbar.types';

import styles from './LibraryToolbar.module.scss';

// Keep jump pills compact: shelf names longer than 20 chars are clipped with
// an ellipsis. The full name stays in the aria-label.
const truncateLabel = (name: string) =>
  name.length > 20 ? `${name.slice(0, 20)}…` : name;

export function LibraryToolbar(props: LibraryToolbarProps): JSX.Element {
  const {
    shelves,
    matchedCount = null,
    search = '',
    onSearchChange,
    className,
  } = props;
  const { toggleSidebar } = useGlobalState();
  const switcher = useLibrarySwitcher();
  const [selectedJumpShelfId, setSelectedJumpShelfId] = useState<number | null>(
    null,
  );

  // Horizontal scroller for the jump pills: when the row overflows, page
  // through it with the same arrows the shelves use.
  const jumpRef = useRef<HTMLDivElement>(null);
  const [canJumpLeft, setCanJumpLeft] = useState(false);
  const [canJumpRight, setCanJumpRight] = useState(false);

  const syncJumpScroll = useCallback(() => {
    const el = jumpRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanJumpLeft(scrollLeft > 1);
    setCanJumpRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = jumpRef.current;
    if (!el) return;
    syncJumpScroll();
    el.addEventListener('scroll', syncJumpScroll, { passive: true });
    const observer = new ResizeObserver(syncJumpScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', syncJumpScroll);
      observer.disconnect();
    };
  }, [syncJumpScroll, shelves.length]);

  const scrollJump = (direction: -1 | 1) => {
    const el = jumpRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const jumpOverflowing = canJumpLeft || canJumpRight;

  // Default to the first shelf as soon as the list lands; let the user
  // override by clicking, but keep their choice when the list identity
  // changes (e.g. after a surgical mutation).
  useEffect(() => {
    if (shelves.length === 0) {
      setSelectedJumpShelfId(null);
      return;
    }
    setSelectedJumpShelfId(prev =>
      prev != null && shelves.some(s => s.id === prev) ? prev : shelves[0].id,
    );
  }, [shelves]);

  // Where the page really starts: the global header and this sticky toolbar
  // together cover the top of the viewport, so a shelf brought to the very
  // top would sit under them with its header and half its objects hidden.
  // Measured live, since the toolbar's height changes with the breakpoint.
  const toolbarRef = useRef<HTMLDivElement>(null);
  const coveredTop = () =>
    toolbarRef.current?.getBoundingClientRect().bottom ?? 0;

  const handleJumpTo = (shelfId: number) => {
    // The pill list is the rendered list, so the target always exists.
    const el = document.getElementById(`shelf-${shelfId}`);
    if (!el) return;
    setSelectedJumpShelfId(shelfId);
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - coveredTop(),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  // Keep the highlighted pill honest while the page scrolls: the shelf
  // nearest the top of the viewport is the one the reader is on.
  useEffect(() => {
    if (shelves.length === 0 || typeof window === 'undefined') return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let bestId: number | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      const top = coveredTop();
      for (const shelf of shelves) {
        const el = document.getElementById(`shelf-${shelf.id}`);
        if (!el) continue;
        const distance = Math.abs(el.getBoundingClientRect().top - top);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = shelf.id;
        }
      }
      if (bestId != null) setSelectedJumpShelfId(bestId);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [shelves]);

  const searchSummary =
    matchedCount == null
      ? ''
      : matchedCount === 0
        ? 'No matches'
        : `${matchedCount} ${matchedCount === 1 ? 'match' : 'matches'} on ${shelves.length} ${shelves.length === 1 ? 'shelf' : 'shelves'}`;

  return (
    <div ref={toolbarRef} className={classNames(styles.toolbar, className)}>
      {/* The heading is the library switcher itself: it names whose library
          this is and opens the list of every other one. Beside it, on phones,
          the only opener for the About panel — the panel is an off-screen
          drawer there. */}
      <div className={styles.identity}>
        <Dropdown
          options={switcher.options}
          value={switcher.value}
          onChange={switcher.onChange}
          placeholder="Select library"
          ariaLabel="Switch library"
          className={styles.librarySwitcher}
        />
        <button
          type="button"
          className={styles.aboutButton}
          onClick={toggleSidebar}
          aria-label="About this library"
        >
          <PanelIcon />
        </button>
      </div>
      <div className={styles.jumpScrollerWrap}>
        {jumpOverflowing && (
          <Button
            className={classNames(styles.arrow, styles.arrowLeft)}
            onClick={() => scrollJump(-1)}
            type={ButtonType.Secondary}
            Icon={<ArrowIcon />}
            ariaLabel="Scroll shelves left"
            disabled={!canJumpLeft}
          />
        )}
        <div
          ref={jumpRef}
          className={classNames(styles.jumpButtons, styles.jumpScroll)}
        >
          {shelves.map(shelf => {
            const isSelected = shelf.id === selectedJumpShelfId;
            return (
              <span
                key={shelf.id}
                title={
                  shelf.attributes.name.length > 20
                    ? shelf.attributes.name
                    : undefined
                }
              >
                <Button
                  label={truncateLabel(shelf.attributes.name)}
                  ariaLabel={`Jump to ${shelf.attributes.name}`}
                  onClick={() => handleJumpTo(shelf.id)}
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  className={classNames(styles.jumpButton, {
                    [styles.jumpSelected]: isSelected,
                  })}
                />
              </span>
            );
          })}
        </div>
        {jumpOverflowing && (
          <Button
            className={styles.arrow}
            onClick={() => scrollJump(1)}
            type={ButtonType.Secondary}
            Icon={<ArrowIcon />}
            ariaLabel="Scroll shelves right"
            disabled={!canJumpRight}
          />
        )}
      </div>

      <div className={styles.searchWrap}>
        <Input
          type="search"
          value={search}
          placeholder="Search everywhere"
          placeholderColor="#C4C4C4"
          onChange={e => onSearchChange?.(e.target.value)}
          onClear={() => onSearchChange?.('')}
          wrapperClassName={styles.search}
          ariaLabel="Search everywhere"
        />
        {/* The count sits in a line held from the start, so typing never
              pushes the toolbar around. */}
        <Text
          variant={TypographyVariant.TextSmall}
          className={styles.searchSummary}
          aria-live="polite"
        >
          {searchSummary}
        </Text>
      </div>

      {/* The Librarian: a chat with an agent that knows this library, opened
          in a modal rather than the site-wide Copilot pill (hidden on library
          pages). Disabled until the agent ships. */}
      <button
        type="button"
        className={styles.librarian}
        disabled
        aria-disabled="true"
        title="Coming soon"
      >
        <LibrarianIcon aria-hidden="true" />
        <span className={styles.librarianLabel}>AI Librarian</span>
      </button>
    </div>
  );
}
