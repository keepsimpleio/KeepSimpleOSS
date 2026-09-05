import classNames from 'classnames';
import React, { JSX, useMemo, useRef, useState } from 'react';

import type { IObject } from '@local-types/library/object';

import { BanIcon, LockIcon } from '@icons/library/svg';

import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';

import type { RecommendedBookCardProps } from './RecommendedBookCard.types';

import styles from './RecommendedBookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift, the action reveal and the banned dim live in
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
    description: book.reason,
    publicationDate: book.year ? `${book.year}-01-01` : undefined,
    createdAt: '',
    updatedAt: '',
  },
});

const TINTS = 6;

let dossierSerial = 0;

/**
 * One pick standing on the AI shelf: a book whose cover is set in the
 * library's own type when no art came with it, its match score at the foot,
 * and on hover the two verdicts the owner can give it: lock it in, or ban it.
 * The dossier beside it says why it is here.
 */
export function RecommendedBookCard({
  book,
  className,
  tint = 0,
  locked = false,
  banned = false,
  onToggleLock,
  onToggleBan,
}: RecommendedBookCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const serial = useMemo(() => {
    dossierSerial += 1;
    return dossierSerial;
  }, []);
  const dossierId = `recommended-dossier-${serial}`;
  const object = useMemo(() => asObject(book, serial), [book, serial]);
  const rows = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (book.match != null)
      list.push({ label: 'Match', value: `${book.match}%` });
    if (book.source) list.push({ label: 'Source', value: book.source.name });
    return list;
  }, [book.match, book.source]);

  const state = banned ? 'banned' : locked ? 'locked' : 'open';
  const stateLabel =
    state === 'banned' ? 'banned' : state === 'locked' ? 'locked in' : '';

  return (
    <div className={classNames(styles.row, className)}>
      <div
        ref={cardRef}
        className={classNames(styles.card, styles[`tint${tint % TINTS}`], {
          [styles.locked]: locked,
          [styles.banned]: banned,
        })}
        tabIndex={0}
        aria-label={`${book.title}, recommended${stateLabel ? `, ${stateLabel}` : ''}`}
        aria-describedby={dossierId}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        onFocus={() => setPreviewOpen(true)}
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
            <span className={styles.match}>{book.match}% match</span>
          )}

          {/* The pick's standing, pinned at the head of the cover. Held in
              the DOM in every state so a verdict never resizes the card. */}
          <span
            className={classNames(styles.status, {
              [styles.statusLocked]: state === 'locked',
              [styles.statusBanned]: state === 'banned',
            })}
            aria-hidden={state === 'open' || undefined}
          >
            {state === 'banned' ? <BanIcon /> : <LockIcon />}
            {state === 'banned' ? 'Banned' : 'Locked'}
          </span>

          <div className={styles.actions}>
            {!banned && (
              <button
                type="button"
                className={styles.action}
                onClick={() => onToggleLock?.(book)}
                aria-label={
                  locked
                    ? `Unlock ${book.title}`
                    : `Lock ${book.title} on the shelf`
                }
                title={
                  locked
                    ? 'Unlock: a re-generate may replace it'
                    : 'Lock: keeps this pick through a re-generate'
                }
              >
                <LockIcon />
                {locked ? 'Unlock' : 'Lock'}
              </button>
            )}
            <button
              type="button"
              className={styles.action}
              onClick={() => onToggleBan?.(book)}
              aria-label={
                banned
                  ? `Unban ${book.title}`
                  : `Ban ${book.title} from recommendations`
              }
              title={
                banned
                  ? 'Unban: this book may be recommended again'
                  : 'Ban: never recommend this book'
              }
            >
              <BanIcon />
              {banned ? 'Unban' : 'Ban'}
            </button>
          </div>
        </div>
      </div>

      <ObjectHoverCard
        id={dossierId}
        object={object}
        anchorRef={cardRef}
        open={previewOpen}
        kindLabel={
          state === 'banned'
            ? 'Banned'
            : state === 'locked'
              ? 'Locked in'
              : 'Recommended'
        }
        rows={rows}
        showReview={false}
      />
    </div>
  );
}
