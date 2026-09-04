import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX, useCallback, useRef, useState } from 'react';

import { VideoShadowIcon } from '@icons/library/svg';

import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { VideoCardProps } from './VideoCard.types';

import styles from './VideoCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift lives in VideoCard.module.scss and the dossier's fade in
// ObjectHoverCard.module.scss; both stylesheets hold the reduced-motion branch.

export function VideoCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  compact = false,
  showHoverCard = !compact,
}: VideoCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const title = attributes.title;

  // The thumbnail fades in once it decodes instead of popping over the white
  // frame. A cached image can finish before React attaches `onLoad`, so the
  // ref's `complete` flag catches that case.
  const [coverLoaded, setCoverLoaded] = useState(false);
  const coverRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setCoverLoaded(true);
  }, []);

  // Hovering (or tabbing to) the video opens its dossier beside the shelf.
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
      className={classNames(styles.wrap, className, {
        [styles.compact]: compact,
      })}
    >
      {!compact && <VideoShadowIcon className={styles.shadow} aria-hidden />}
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
            />
          </div>
        )}
        <div className={styles.thumbWrap}>
          <div className={styles.thumb}>
            {coverUrl ? (
              <Image
                ref={coverRef}
                src={coverUrl}
                alt={title}
                fill
                sizes="231px"
                className={classNames(styles.coverImage, {
                  [styles.coverImageLoaded]: coverLoaded,
                })}
                onLoad={() => setCoverLoaded(true)}
              />
            ) : (
              <div className={styles.coverPlaceholder} />
            )}
          </div>
        </div>

        {/* The title is not printed on the card: the dossier that opens on
            hover already names the object, and the shelf reads as a row of
            covers, the way the book and audio cards do. */}
        <div className={styles.bar} aria-hidden />
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
