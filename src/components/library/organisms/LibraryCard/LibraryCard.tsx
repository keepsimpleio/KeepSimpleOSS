import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { JSX } from 'react';

import LibraryMark from '@icons/navbar/library.svg';

import { Avatar } from '@components/library/atoms/Avatar';
import { InkLine } from '@components/library/atoms/InkLine';
import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import { Button, ButtonType } from '@components/library/molecules/Button';
import { Object, ObjectType } from '@components/library/molecules/Object';

import type { LibraryCardProps } from './LibraryCard.types';

import styles from './LibraryCard.module.scss';

export function LibraryCard(props: LibraryCardProps): JSX.Element {
  const {
    id,
    username,
    libraryName,
    description,
    bookCount,
    videoCount,
    songCount,
    avatar,
    coverUrls = [],
    accent = 0,
  } = props;
  const router = useRouter();

  // Route by numeric id, not username: the route resolver short-circuits a
  // numeric param to a findOne-by-id, sidestepping the username→id filter
  // lookup that the public API currently 500s on. Falls back to username only
  // if an id is somehow absent.
  const libraryHref = `/library/${id ?? username}`;

  const handleViewLibrary = () => {
    router.push(libraryHref);
  };

  const openInNewTab = () => {
    window.open(libraryHref, '_blank', 'noopener');
  };

  // The whole card is a showcase tile, so any click opens the library. The
  // buttons inside navigate themselves; skip the bubbled click so one press
  // doesn't push the route twice.
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    // A modified click means "open it elsewhere", the same as on a real link.
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      openInNewTab();
      return;
    }
    handleViewLibrary();
  };

  // A middle press never reaches onClick, so the tile handles the auxiliary
  // button itself and opens the library in a new tab the way a link would.
  const handleCardAuxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 1) {
      return;
    }
    e.preventDefault();
    openInNewTab();
  };

  // Suppressing the middle-button mousedown keeps the browser from switching
  // into autoscroll mode before the aux click lands.
  const handleCardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      onAuxClick={handleCardAuxClick}
      onMouseDown={handleCardMouseDown}
    >
      <div className={styles.header}>
        {/* The Library's own mark stands in front of every library the way
            Trello fronts a board with its own, so the tile reads as belonging
            here. Same glyph the navbar carries. */}
        <LibraryMark className={styles.titleMark} aria-hidden="true" />
        <Text
          className={styles.title}
          variant={TypographyVariant.SubtitleSecondaryAlt}
        >
          {username || libraryName}
        </Text>
      </div>

      <InkLine seed={accent * 3 + 1} className={styles.divider} />

      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.avatar}>
            <Avatar url={avatar} />
          </div>
          <div className={styles.info}>
            <div className={styles.section}>
              <Text
                className={styles.subtitle}
                variant={TypographyVariant.TextBaseBold}
              >
                About
              </Text>
              <Text
                className={styles.text}
                variant={TypographyVariant.TextBase}
              >
                {description}
              </Text>
            </div>
            <InkLine seed={accent * 3 + 2} className={styles.dividerInner} />
            <div className={styles.section}>
              <Text
                className={styles.subtitle}
                variant={TypographyVariant.TextBaseBold}
              >
                Content
              </Text>
              <div className={styles.objects}>
                <Object
                  className={styles.count}
                  type={ObjectType.Book}
                  number={bookCount}
                />
                <Object
                  className={styles.count}
                  type={ObjectType.Video}
                  number={videoCount}
                />
                <Object
                  className={styles.count}
                  type={ObjectType.Audio}
                  number={songCount}
                />
              </div>
            </div>
          </div>
        </div>
        {coverUrls.length > 0 ? (
          // The shelf ends in the "View Library" tile: the call to action is
          // the logical continuation of the covers on display.
          <div className={styles.shelf}>
            <div className={styles.shelfRow}>
              {coverUrls.map(src => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={44}
                  height={64}
                  loading="lazy"
                  className={styles.cover}
                />
              ))}
              <button
                type="button"
                aria-label="View Library"
                onClick={handleViewLibrary}
                className={styles.viewTile}
              >
                {/* Same Text variant the Button molecule uses for its label,
                    so both ways in are one typeface, size and weight. */}
                <Text
                  tag={TagType.Span}
                  variant={TypographyVariant.TextBaseSemibold}
                >
                  View Library
                </Text>
                <Text
                  tag={TagType.Span}
                  variant={TypographyVariant.TextBaseSemibold}
                  aria-hidden="true"
                >
                  →
                </Text>
              </button>
            </div>
          </div>
        ) : (
          // No covers, no shelf — the plain ghost button keeps the way in.
          <Button
            onClick={handleViewLibrary}
            type={ButtonType.Primary}
            label="View Library"
            ariaLabel="View Library"
            className={styles.viewButton}
          />
        )}
      </div>
    </div>
  );
}
