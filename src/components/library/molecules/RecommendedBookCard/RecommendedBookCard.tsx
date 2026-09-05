import classNames from 'classnames';
import React, { JSX, useMemo, useRef, useState } from 'react';

import type { IObject } from '@local-types/library/object';

import { ObjectHoverCard } from '@components/library/molecules/ObjectHoverCard';

import type { RecommendedBookCardProps } from './RecommendedBookCard.types';

import styles from './RecommendedBookCard.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// card's hover lift and the chip strip's reveal live in
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

let dossierSerial = 0;

/**
 * One pick standing on the recommended shelf: the same book body every
 * shelved book has, with its title and author typeset on the front when no
 * cover came with it. Hover reveals the two answers the owner can give it
 * (take it, or pass) and the dossier beside it says why it is here.
 */
export function RecommendedBookCard({
  book,
  className,
  onAdd,
  onHide,
}: RecommendedBookCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const serial = useMemo(() => {
    dossierSerial += 1;
    return dossierSerial;
  }, []);
  const dossierId = `recommended-dossier-${serial}`;
  const object = useMemo(() => asObject(book, serial), [book, serial]);
  const rows = useMemo(
    () => (book.source ? [{ label: 'Source', value: book.source.name }] : []),
    [book.source],
  );

  return (
    <div className={classNames(styles.row, className)}>
      <div
        ref={cardRef}
        className={styles.card}
        tabIndex={0}
        aria-label={`${book.title}, recommended`}
        aria-describedby={dossierId}
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
        onFocus={() => setPreviewOpen(true)}
        onBlur={e => {
          // Focus moving between the card and its own chips keeps the
          // dossier open; leaving the card altogether closes it.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setPreviewOpen(false);
          }
        }}
      >
        <div className={styles.actions}>
          <button
            type="button"
            className={classNames(styles.chip, styles.chipAdd)}
            onClick={() => onAdd?.(book)}
            aria-label={`Add ${book.title} to my library`}
            title="Add this book to one of your shelves"
          >
            Add
          </button>
          <button
            type="button"
            className={styles.chip}
            onClick={() => onHide?.(book)}
            aria-label={`Hide ${book.title} from recommendations`}
            title="Hide this recommendation"
          >
            Hide
          </button>
        </div>
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
                <span className={styles.frontAuthor}>{book.author}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <ObjectHoverCard
        id={dossierId}
        object={object}
        anchorRef={cardRef}
        open={previewOpen}
        kindLabel="Recommended"
        rows={rows}
        showReview={false}
      />
    </div>
  );
}
