import cn from 'classnames';
import React, { JSX, useMemo, useRef, useState } from 'react';

import type { IObject } from '@local-types/library/object';

import { SparkleIcon } from '@icons/library/svg';

import { Tooltip } from '@components/library/atoms/Tooltip';
import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';

import type { MagicBookCardProps } from './MagicBookCard.types';

import styles from './MagicBookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// lift, the shimmer while a pick is being made, the crossfade between picks
// and the reduced-motion branches live in MagicBookCard.module.scss; the
// dossier's fade in ObjectHoverCard.module.scss.

/** Rated books the engine wants before it shows a percent. Mirrors
 * MAGIC_MIN_RATED_FOR_MATCH on the server. */
const MIN_RATED_FOR_MATCH = 3;

let dossierSerial = 0;

const asObject = (
  slot: MagicBookCardProps['slot'],
  index: number,
): IObject => ({
  id: -index,
  attributes: {
    type: 'book',
    title: slot.pick?.title ?? 'Magic book',
    author: slot.pick?.author,
    description: slot.pick?.reason ?? slot.note,
    publicationDate: slot.pick?.year ? `${slot.pick.year}-01-01` : undefined,
    createdAt: '',
    updatedAt: '',
  },
});

/**
 * The magic book: the one pick standing at the end of a shelf, the chance
 * the owner likes it on a slip at its foot, and under the pointer one
 * verdict, roll again. While the engine works the slot holds the same
 * geometry with a shimmer over it, so the shelf never changes length.
 */
export function MagicBookCard({
  slot,
  ownerUsername,
  className,
}: MagicBookCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const serial = useMemo(() => {
    dossierSerial += 1;
    return dossierSerial;
  }, []);
  const dossierId = `magic-dossier-${serial}`;
  const object = useMemo(() => asObject(slot, serial), [slot, serial]);

  const busy = slot.status === 'loading' || slot.rolling;
  const pick = slot.pick;
  const showPick = !!pick && slot.status === 'ready';

  const rows = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (!showPick) return list;
    if (pick?.match != null)
      list.push({ label: 'Match', value: `${pick.match}%` });
    else {
      list.push({
        label: 'Match',
        value: `Rate ${MIN_RATED_FOR_MATCH} books to see one`,
      });
    }
    if (pick?.source)
      list.push({ label: 'Verified by', value: pick.source.name });
    return list;
  }, [showPick, pick]);

  const label = busy
    ? 'Magic book, choosing'
    : showPick
      ? `${pick?.title}, magic book${pick?.match != null ? `, ${pick.match} percent match` : ''}`
      : 'Magic book, nothing this time';

  return (
    <div className={cn(styles.row, className)}>
      <div
        ref={cardRef}
        className={cn(styles.card, {
          [styles.busy]: busy,
          [styles.empty]: !busy && !showPick,
        })}
        tabIndex={0}
        aria-label={label}
        aria-busy={busy || undefined}
        aria-describedby={dossierId}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        onFocus={e => {
          if (e.currentTarget.matches(':focus-visible')) setPreviewOpen(true);
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setPreviewOpen(false);
          }
        }}
      >
        <div className={styles.placeholder} aria-hidden="true" />
        <div className={styles.cover}>
          {/* The pick and the paper it is drawn on crossfade: a new pick
              fades in over the old one, and the shimmer lies over both. */}
          <div className={cn(styles.face, { [styles.faceShown]: showPick })}>
            {pick?.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pick.coverUrl}
                alt={pick.title}
                className={styles.coverImage}
              />
            ) : (
              <div className={styles.front} aria-hidden="true">
                <span className={styles.frontTitle}>{pick?.title}</span>
                {pick?.author && (
                  <span className={styles.frontAuthor}>
                    <span className={styles.by}>by</span>
                    {pick.author}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(styles.blank, { [styles.blankShown]: !showPick })}
            aria-hidden="true"
          >
            <SparkleIcon className={styles.blankIcon} />
            <span className={styles.blankText}>
              {busy
                ? 'Choosing a book for this shelf'
                : slot.status === 'ineligible'
                  ? 'Add a book and one will be recommended'
                  : slot.status === 'error'
                    ? 'The magic books could not be read'
                    : 'Nothing could be confirmed. Roll again'}
            </span>
          </div>
          <div className={styles.shimmer} aria-hidden="true" />

          <span
            className={cn(styles.match, {
              [styles.matchShown]: showPick && pick?.match != null,
            })}
            aria-hidden={!(showPick && pick?.match != null) || undefined}
          >
            {pick?.match != null ? `${pick.match}% match` : ''}
          </span>

          <span className={styles.status} aria-hidden="true">
            <SparkleIcon />
            Magic
          </span>

          {slot.status !== 'ineligible' && slot.status !== 'error' && (
            <div className={styles.actions}>
              <Tooltip
                asChild
                tooltipContent="Roll again: another book for this shelf"
              >
                <button
                  type="button"
                  className={styles.action}
                  disabled={busy}
                  onClick={() => slot.reroll()}
                  aria-label="Roll another magic book for this shelf"
                >
                  <SparkleIcon />
                  Re-roll
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      <ObjectHoverCard
        id={dossierId}
        object={object}
        anchorRef={cardRef}
        open={previewOpen && !busy}
        ownerUsername={ownerUsername}
        kindLabel="Magic book"
        rows={rows}
        showReview={false}
      />
    </div>
  );
}
