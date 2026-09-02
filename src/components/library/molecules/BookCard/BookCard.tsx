import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX, useRef, useState } from 'react';

import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { BookCardProps } from './BookCard.types';

import styles from './BookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift lives in BookCard.module.scss and the dossier's fade in
// ObjectHoverCard.module.scss; both stylesheets hold the reduced-motion branch.

export function BookCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  compact = false,
  ownerUsername,
}: BookCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const tags = attributes.tags?.data ?? [];
  const title = attributes.title;

  // Hovering (or tabbing to) the book opens its dossier beside the shelf.
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleActivate = () => {
    // Opening the overview covers the card, so the dossier steps aside first.
    setPreviewOpen(false);
    onClick?.(object);
  };

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
        ref={cardRef}
        className={classNames(styles.card, { [styles.selected]: selected })}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title}`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        onFocus={() => setPreviewOpen(true)}
        onBlur={() => setPreviewOpen(false)}
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
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={attributes.title}
              fill
              sizes="146px"
              className={styles.coverImage}
            />
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

      <ObjectHoverCard
        object={object}
        anchorRef={cardRef}
        open={previewOpen}
        disabled={compact}
        ownerUsername={ownerUsername}
      />
    </div>
  );
}
