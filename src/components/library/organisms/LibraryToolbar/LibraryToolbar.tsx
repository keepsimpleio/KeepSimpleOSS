import classNames from 'classnames';
import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ArrowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
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
    isOwner = true,
    ownerName,
    search = '',
    onSearchChange,
    className,
  } = props;
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

  // Visitor banner: the tags actually used on this library's objects, deduped
  // by name (no cross-account tag fetch — mirror the Sidebar's derivation).
  const tagNames = useMemo(() => {
    const names = new Set<string>();
    for (const shelf of shelves) {
      for (const obj of shelf.attributes.objects?.data ?? []) {
        for (const tag of obj.attributes.tags?.data ?? []) {
          names.add(tag.attributes.name);
        }
      }
    }
    return Array.from(names);
  }, [shelves]);

  // Pick two distinct tags to tease in the welcome line; re-rolls only when the
  // available tag set changes, not on every render.
  const featuredTags = useMemo(() => {
    const pool = [...tagNames];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 2);
  }, [tagNames]);

  const collectionsClause =
    featuredTags.length >= 2
      ? `curated collections on ${featuredTags[0]} and ${featuredTags[1]}, `
      : featuredTags.length === 1
        ? `curated collections on ${featuredTags[0]}, `
        : 'curated collections, ';

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

  const handleJumpTo = (shelfId: number) => {
    setSelectedJumpShelfId(shelfId);
    const el = document.getElementById(`shelf-${shelfId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isOwner) {
    return (
      <div className={classNames(styles.toolbar, className)}>
        <div className={classNames(styles.controls, styles.controlsGuest)}>
          <div className={styles.welcome}>
            <Text
              variant={TypographyVariant.TitleSecondaryBold}
              className={styles.welcomeTitle}
            >
              Welcome to {ownerName}&rsquo;s hive
            </Text>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.welcomeText}
            >
              Discover and explore {collectionsClause}along with an incredible
              playlist full of his favorite songs.
            </Text>
          </div>

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
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.toolbar, className)}>
      <div className={styles.controls}>
        <Text className={styles.text}>Jump to →</Text>

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
                <Button
                  key={shelf.id}
                  label={truncateLabel(shelf.attributes.name)}
                  ariaLabel={`Jump to ${shelf.attributes.name}`}
                  onClick={() => handleJumpTo(shelf.id)}
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  className={classNames(styles.jumpButton, {
                    [styles.jumpSelected]: isSelected,
                  })}
                />
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
      </div>
    </div>
  );
}
