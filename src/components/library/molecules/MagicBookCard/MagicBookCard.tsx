import cn from 'classnames';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';

import type { IObject } from '@local-types/library/object';

import { SparkleIcon } from '@icons/library/svg';

import { MagicBookBrief } from '@components/library/molecules/MagicBookBrief';
import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';

import type { MagicBookCardProps } from './MagicBookCard.types';

import styles from './MagicBookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// lift, the light while a pick is being made, the word over it, the
// crossfade between states
// and the reduced-motion branches live in MagicBookCard.module.scss; the
// dossier's fade in ObjectHoverCard.module.scss; the brief's in Modal.

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
    description: slot.pick?.about ?? slot.pick?.reason ?? slot.note,
    publicationDate: slot.pick?.year ? `${slot.pick.year}-01-01` : undefined,
    createdAt: '',
    updatedAt: '',
  },
});

/**
 * The magic book: the slot at the end of a shelf where the engine's one
 * pick stands. Nothing is chosen unasked: an empty slot offers Roll, and
 * the roll is the owner's click. A pick shows the chance the owner likes it
 * on a slip at its foot, says why in the dossier under the pointer, and
 * opens to the brief on click, where Re-roll lives. While the engine works
 * the slot holds the same geometry with a light over it, so the shelf never
 * changes length.
 */
export function MagicBookCard({
  slot,
  shelfName = 'this shelf',
  ownerUsername,
  className,
}: MagicBookCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const closeBrief = useCallback(() => setBriefOpen(false), []);
  const serial = useMemo(() => {
    dossierSerial += 1;
    return dossierSerial;
  }, []);
  const dossierId = `magic-dossier-${serial}`;
  const object = useMemo(() => asObject(slot, serial), [slot, serial]);

  const busy = slot.status === 'loading' || slot.rolling;
  const pick = slot.pick;
  const showPick = !!pick && slot.status === 'ready';
  const canRoll =
    !busy &&
    (slot.status === 'idle' ||
      slot.status === 'empty' ||
      slot.status === 'error');

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
      list.push({ label: 'Confirmed by', value: pick.source.name });
    return list;
  }, [showPick, pick]);

  const label = busy
    ? 'Magic book, choosing'
    : showPick
      ? `${pick?.title}, magic book${pick?.match != null ? `, ${pick.match} percent match` : ''}. Open the brief`
      : slot.status === 'ineligible'
        ? 'Magic book: add a book to this shelf first'
        : 'Magic book: roll one for this shelf';

  const blankText = busy
    ? 'Choosing a book for this shelf'
    : slot.status === 'ineligible'
      ? 'Add a book and one can be rolled'
      : slot.status === 'error'
        ? 'The magic books could not be read'
        : slot.status === 'empty'
          ? 'Nothing could be confirmed'
          : 'A book the engine thinks you will like';

  return (
    <div className={cn(styles.row, className)}>
      <div
        ref={cardRef}
        className={cn(styles.card, {
          [styles.busy]: busy,
          [styles.openable]: showPick,
        })}
        role={showPick ? 'button' : undefined}
        tabIndex={0}
        aria-label={label}
        aria-busy={busy || undefined}
        aria-describedby={showPick ? dossierId : undefined}
        aria-haspopup={showPick ? 'dialog' : undefined}
        onClick={() => {
          if (showPick) setBriefOpen(true);
        }}
        onKeyDown={e => {
          if (showPick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setBriefOpen(true);
          }
        }}
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
          {/* The pick and the blank paper under it crossfade: a new pick
              fades in over the old one, and the light lies over both. */}
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
            aria-hidden={showPick || undefined}
          >
            <SparkleIcon className={styles.blankIcon} />
            <span className={styles.blankText}>{blankText}</span>
            {/* Held in the blank in every state and shown only when a roll
                is possible, so the paper's layout never shifts. */}
            <button
              type="button"
              className={cn(styles.roll, { [styles.rollShown]: canRoll })}
              tabIndex={canRoll ? 0 : -1}
              aria-hidden={!canRoll || undefined}
              disabled={!canRoll}
              onClick={e => {
                e.stopPropagation();
                slot.reroll();
              }}
              aria-label={`Roll a magic book for ${shelfName}`}
            >
              <SparkleIcon />
              {slot.status === 'idle' ? 'Roll' : 'Roll again'}
            </button>
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

          <span
            className={cn(styles.status, { [styles.statusShown]: showPick })}
            aria-hidden="true"
          >
            <SparkleIcon />
            Magic
          </span>

          {/* The engine at work, over whatever the slot holds. Held in the
              DOM and revealed by class, so a roll never resizes the slot. */}
          <span
            className={cn(styles.rolling, { [styles.rollingShown]: busy })}
            aria-hidden="true"
          >
            <SparkleIcon />
            Rolling
          </span>
        </div>
      </div>

      <ObjectHoverCard
        id={dossierId}
        object={object}
        anchorRef={cardRef}
        open={previewOpen && showPick && !briefOpen}
        ownerUsername={ownerUsername}
        kindLabel="Magic book"
        rows={rows}
        showReview={false}
      />

      {briefOpen && (
        <MagicBookBrief
          slot={slot}
          shelfName={shelfName}
          onClose={closeBrief}
        />
      )}
    </div>
  );
}
