import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { JSX } from 'react';

import { Avatar } from '@components/library/atoms/Avatar';
import { InkLine } from '@components/library/atoms/InkLine';
import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import { WashStroke } from '@components/library/atoms/WashStroke';
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

  const handleViewLibrary = () => {
    // Route by numeric id, not username: the route resolver short-circuits a
    // numeric param to a findOne-by-id, sidestepping the username→id filter
    // lookup that the public API currently 500s on. Falls back to username only
    // if an id is somehow absent.
    router.push(`/library/${id ?? username}`);
  };

  // The whole card is a showcase tile, so any click opens the library. The
  // buttons inside navigate themselves; skip the bubbled click so one press
  // doesn't push the route twice.
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleViewLibrary();
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <span className={styles.titleWrap}>
          <WashStroke accent={accent} className={styles.titleStroke} />
          <Text
            className={styles.title}
            variant={TypographyVariant.SubtitleSecondaryAlt}
          >
            {username ? (
              <>
                {username}
                <span className={styles.titleSuffix}>{"'s library"}</span>
              </>
            ) : (
              libraryName
            )}
          </Text>
        </span>
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
                Objects
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
