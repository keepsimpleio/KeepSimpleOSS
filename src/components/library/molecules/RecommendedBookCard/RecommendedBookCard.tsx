import cn from 'classnames';
import React, { CSSProperties, JSX, useMemo, useRef, useState } from 'react';

import type { IObject } from '@local-types/library/object';

import { BanIcon, LockIcon, SparkleIcon } from '@icons/library/svg';

import { Tooltip } from '@components/library/atoms/Tooltip';
import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';
import { RecommendedBookBrief } from '@components/library/molecules/RecommendedBookBrief';

import type { RecommendedBookCardProps } from './RecommendedBookCard.types';

import styles from './RecommendedBookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift, the action reveal, the banned dim and the light a card
// carries while it is being rolled again live in
// RecommendedBookCard.module.scss; the dossier's fade in
// ObjectHoverCard.module.scss. All hold the reduced-motion branch.

// The dossier reads a Strapi object. A pick is not one yet, so it is dressed
// as one for the panel only: nothing here is sent anywhere.
const asObject = (
  book: RecommendedBookCardProps['book'],
  index: number,
): IObject => ({
  id: index,
  attributes: {
    type: 'book',
    title: book.title,
    author: book.author,
    // The dossier under the pointer says what the book is; why the owner is
    // being given it, at its full length, is read in the brief.
    description: book.about ?? book.reason,
    publicationDate: book.year ? `${book.year}-01-01` : undefined,
    createdAt: '',
    updatedAt: '',
  },
});

let dossierSerial = 0;

/**
 * One pick standing on the AI shelf: a book whose cover is set in the
 * library's own type when no art came with it, its match score at the foot,
 * and on hover the two verdicts the owner can give it: lock it in, or ban it.
 * The dossier beside it says what the book is, in short.
 *
 * The card opens. A click, Enter or Space raises the brief, where the whole
 * of what the engine wrote is read: what the book is, why this owner is
 * being given it, the rubric behind the percent (Wolf, 2026-09-11: the
 * dossier ended in an ellipsis and the rest was unreachable).
 */
export function RecommendedBookCard({
  book,
  className,
  readOnly = false,
  locked = false,
  banned = false,
  working = false,
  slotIndex = 0,
  onToggleLock,
  onToggleBan,
}: RecommendedBookCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const serial = useMemo(() => {
    dossierSerial += 1;
    return dossierSerial;
  }, []);
  const dossierId = `recommended-dossier-${serial}`;
  const object = useMemo(() => asObject(book, serial), [book, serial]);
  const stretch = book.kind === 'stretch';
  // A stretch pick is not scored for fit and does not claim to be: what it
  // shows is how far it reaches, and the ground it opens.
  const scoreLabel = stretch ? 'Reach' : 'Match';
  const rows = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (book.match != null)
      list.push({ label: scoreLabel, value: `${book.match}%` });
    if (book.newGround)
      list.push({ label: 'New ground', value: book.newGround });
    if (book.source) list.push({ label: 'Source', value: book.source.name });
    return list;
  }, [book.match, book.newGround, book.source, scoreLabel]);

  const state = banned
    ? 'banned'
    : locked
      ? 'locked'
      : stretch
        ? 'stretch'
        : 'open';
  const stateLabel =
    state === 'banned'
      ? 'banned'
      : state === 'locked'
        ? 'locked in'
        : state === 'stretch'
          ? 'new ground'
          : '';

  return (
    <div className={cn(styles.row, className)}>
      <div
        ref={cardRef}
        className={cn(styles.card, {
          [styles.locked]: locked,
          [styles.banned]: banned,
          [styles.working]: working,
        })}
        style={{ '--slot': slotIndex } as CSSProperties}
        // No interactive role here: Lock and Ban are real buttons inside this
        // box, and a button may not hold buttons. The card stays focusable and
        // labelled, and its own keys open the brief.
        tabIndex={0}
        aria-busy={working || undefined}
        aria-haspopup="dialog"
        aria-label={`${book.title}, recommended${stateLabel ? `, ${stateLabel}` : ''}. Open the brief`}
        aria-describedby={dossierId}
        onClick={() => setBriefOpen(true)}
        onKeyDown={e => {
          // Only the card's own keys open the brief. A keydown on Lock or Ban
          // bubbles here before the browser turns it into a click, so calling
          // preventDefault on it would swallow the button's activation and
          // open the brief instead of giving the verdict.
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setBriefOpen(true);
          }
        }}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        // Only a keyboard focus opens the dossier. Focus also lands here when a
        // modal closes and hands it back, with the pointer nowhere near, and
        // the panel then stood open until something else was hovered.
        onFocus={e => {
          if (e.currentTarget.matches(':focus-visible')) setPreviewOpen(true);
        }}
        onBlur={e => {
          // Focus moving between the card and its own buttons keeps the
          // dossier open; leaving the card altogether closes it.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setPreviewOpen(false);
          }
        }}
      >
        <div className={styles.placeholder} aria-hidden="true" />
        <div className={styles.cover}>
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={book.title}
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.front} aria-hidden="true">
              <span className={styles.frontTitle}>{book.title}</span>
              {book.author && (
                <span className={styles.frontAuthor}>
                  <span className={styles.by}>by</span>
                  {book.author}
                </span>
              )}
            </div>
          )}

          {book.match != null && (
            <span className={styles.match}>
              {book.match}% {stretch ? 'reach' : 'match'}
            </span>
          )}

          {/* The pick's standing, pinned at the head of the cover. Held in
              the DOM in every state so a verdict never resizes the card. */}
          <span
            className={cn(styles.status, {
              [styles.statusLocked]: state === 'locked',
              [styles.statusBanned]: state === 'banned',
              [styles.statusStretch]: state === 'stretch',
            })}
            aria-hidden={state === 'open' || undefined}
          >
            {state === 'banned' ? (
              <BanIcon />
            ) : state === 'stretch' ? (
              <SparkleIcon />
            ) : (
              <LockIcon />
            )}
            {state === 'banned'
              ? 'Banned'
              : state === 'stretch'
                ? 'New ground'
                : 'Locked'}
          </span>

          {/* The engine at work on this place, over the pick it is about to
              replace. Held in the DOM and revealed by class, so a roll never
              resizes the card. */}
          <span
            className={cn(styles.rolling, { [styles.rollingShown]: working })}
            aria-hidden="true"
          >
            <SparkleIcon />
            Rolling
          </span>

          {!readOnly && (
            <div className={styles.actions}>
              {!banned && (
                <Tooltip
                  asChild
                  tooltipContent={
                    locked
                      ? 'Unlock: a re-generate may replace it'
                      : 'Lock: keeps this pick through a re-generate'
                  }
                >
                  <button
                    type="button"
                    className={styles.action}
                    onClick={e => {
                      e.stopPropagation();
                      onToggleLock?.(book);
                    }}
                    aria-label={
                      locked
                        ? `Unlock ${book.title}`
                        : `Lock ${book.title} on the shelf`
                    }
                  >
                    <LockIcon />
                    {locked ? 'Unlock' : 'Lock'}
                  </button>
                </Tooltip>
              )}
              <Tooltip
                asChild
                tooltipContent={
                  banned
                    ? 'Unban: this book may be recommended again'
                    : 'Ban: never recommend this book'
                }
              >
                <button
                  type="button"
                  className={styles.action}
                  onClick={e => {
                    e.stopPropagation();
                    onToggleBan?.(book);
                  }}
                  aria-label={
                    banned
                      ? `Unban ${book.title}`
                      : `Ban ${book.title} from recommendations`
                  }
                >
                  <BanIcon />
                  {banned ? 'Unban' : 'Ban'}
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
        open={previewOpen && !briefOpen}
        kindLabel={
          state === 'banned'
            ? 'Banned'
            : state === 'locked'
              ? 'Locked in'
              : state === 'stretch'
                ? 'New ground'
                : 'Recommended'
        }
        rows={rows}
        showReview={false}
      />

      {briefOpen && (
        <RecommendedBookBrief
          book={book}
          locked={locked}
          banned={banned}
          readOnly={readOnly}
          onToggleLock={onToggleLock}
          onToggleBan={onToggleBan}
          onClose={() => setBriefOpen(false)}
        />
      )}
    </div>
  );
}
