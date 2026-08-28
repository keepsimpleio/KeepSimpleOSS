import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { BookCardProps } from './BookCard.types';

import styles from './BookCard.module.scss';

export function BookCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  compact = false,
}: BookCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const tags = attributes.tags?.data ?? [];
  const title = attributes.title;

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
              src={coverUrl}
              alt={attributes.title}
              fill
              sizes="146px"
              className={styles.coverImage}
            />
          ) : (
            // No uploaded cover: a paper jacket carrying the title, so the
            // book keeps its identity and the shelf row doesn't tear into
            // blank spines.
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
