import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX, useCallback, useRef, useState } from 'react';

import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { AudioCardProps } from './AudioCard.types';

import styles from './AudioCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift lives in AudioCard.module.scss and the dossier's fade in
// ObjectHoverCard.module.scss; both stylesheets hold the reduced-motion branch.

export function AudioCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  selectReason,
  compact = false,
  showHoverCard = !compact,
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

  // Hovering (or tabbing to) the record opens its dossier beside the shelf.
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  // The dossier is announced as this card's description while it is open.
  const dossierId = `object-dossier-${object.id}`;

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
        aria-label={
          selected ? `Open ${title} (in share selection)` : `Open ${title}`
        }
        aria-describedby={dossierId}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        // A drag captures the pointer, so no mouseleave arrives to close the
        // dossier while the card travels; the press closes it instead.
        onPointerDown={() => setPreviewOpen(false)}
        onFocus={() => setPreviewOpen(true)}
        onBlur={() => setPreviewOpen(false)}
      >
        {onSelectToggle && (
          <div className={styles.select}>
            <SelectToggle
              selected={selected}
              onToggle={onSelectToggle}
              disabled={selectDisabled && !selected}
              reason={selectReason}
            />
          </div>
        )}
        <div className={styles.placeholder} aria-hidden="true" />
        <div className={styles.cover}>
          {coverUrl && (
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
        id={dossierId}
        object={object}
        anchorRef={cardRef}
        open={previewOpen}
        disabled={!showHoverCard}
      />
    </div>
  );
}
