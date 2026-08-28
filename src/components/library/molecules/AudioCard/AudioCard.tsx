import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX, useCallback, useState } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { AudioCardProps } from './AudioCard.types';

import styles from './AudioCard.module.scss';

export function AudioCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  compact = false,
}: AudioCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const tags = attributes.tags?.data ?? [];
  const title = attributes.title;

  const [coverLoaded, setCoverLoaded] = useState(false);

  // A cached image can finish decoding before React attaches `onLoad`, leaving
  // it stuck at opacity 0. Catch that case via the ref's `complete` flag.
  const coverRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) {
      setCoverLoaded(true);
    }
  }, []);

  const handleActivate = () => onClick?.(object);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      className={classNames(styles.row, className, {
        [styles.compact]: compact,
      })}
    >
      <div
        className={classNames(styles.card, { [styles.selected]: selected })}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title}`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
      >
        {onSelectToggle && (
          <div className={styles.select}>
            <SelectToggle
              selected={selected}
              onToggle={onSelectToggle}
              disabled={selectDisabled && !selected}
            />
          </div>
        )}
        <div className={styles.placeholder} aria-hidden="true" />
        <div className={styles.cover}>
          {coverUrl ? (
            <Image
              ref={coverRef}
              src={coverUrl}
              alt={title}
              fill
              sizes="190px"
              className={classNames(styles.coverImage, {
                [styles.coverImageLoaded]: coverLoaded,
              })}
              onLoad={() => setCoverLoaded(true)}
            />
          ) : (
            // No album art: a paper sleeve carrying the title, so the record
            // keeps its identity instead of standing blank on the shelf.
            <div className={styles.coverFallback} aria-hidden="true">
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.fallbackTitle}
              >
                {title}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Always render the tag column (even when empty) so the card keeps a
          consistent width whether or not the object has tags. */}
      <div className={styles.tags} aria-label="Tags">
        {tags.map(tag => (
          <span
            key={tag.id}
            className={styles.tagDot}
            style={{ backgroundColor: tag.attributes.color }}
            title={tag.attributes.name}
          />
        ))}
      </div>
    </div>
  );
}
