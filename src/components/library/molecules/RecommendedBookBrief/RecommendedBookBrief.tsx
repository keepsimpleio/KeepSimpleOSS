import cn from 'classnames';
import React, { JSX } from 'react';

import type { MagicRubric } from '@local-types/library/magicBook';
import type { RecommendedPick } from '@local-types/library/recommendation';

import { BanIcon, LockIcon, SparkleIcon } from '@icons/library/svg';

import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import type { RecommendedBookBriefProps } from './RecommendedBookBrief.types';

import styles from './RecommendedBookBrief.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// dialog fades through the shared Modal; the cover's light and the button
// transitions live in RecommendedBookBrief.module.scss, reduced motion
// included.

const RUBRIC_LABELS: Record<keyof MagicRubric, string> = {
  theme: 'Fits what you read',
  notes: 'Runs along your notes',
  tags: 'Speaks your tags',
  difficulty: 'Lands in your band',
  distance: 'Far from what you disliked',
};

/**
 * A pick from the AI shelf, opened. The card has room for a cover and a
 * number and nothing else, so everything the engine wrote is read here: what
 * the book is, why this owner is being given it, the rubric behind the
 * percent, the ground it opens when it opens any, and the source that
 * confirmed it. Nothing is cut short (Wolf, 2026-09-11: the hover ended in
 * an ellipsis and the text was lost). Lock and Ban are here too, so a verdict
 * can be given from the same place the case is read.
 */
export function RecommendedBookBrief({
  book,
  locked = false,
  banned = false,
  readOnly = false,
  onToggleLock,
  onToggleBan,
  onClose,
}: RecommendedBookBriefProps): JSX.Element {
  const { closeRef, close } = useModalClose(onClose);
  const stretch = book.kind === 'stretch';
  const rubric = (book as RecommendedPick).rubric as MagicRubric | undefined;
  const rubricRows = rubric
    ? (Object.keys(RUBRIC_LABELS) as (keyof MagicRubric)[])
        .map(key => ({ key, label: RUBRIC_LABELS[key], value: rubric[key] }))
        .filter(row => typeof row.value === 'number' && row.value > 0)
    : [];

  return (
    <Modal
      className={styles.modal}
      title={stretch ? 'New ground' : 'Recommended for you'}
      onClose={onClose}
      closeRef={closeRef}
    >
      <div className={styles.body}>
        <div className={styles.cover} aria-hidden="true">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt="" className={styles.coverImage} />
          ) : (
            <div className={styles.coverBlank}>
              <SparkleIcon />
            </div>
          )}
          <span className={styles.coverLight} />
        </div>

        <div className={styles.text}>
          <Text
            variant={TypographyVariant.SubtitleSecondarySemi}
            className={styles.title}
            tag={TagType.H3}
          >
            {book.title}
          </Text>
          <span className={styles.byline}>
            {[book.author, book.year].filter(Boolean).join(', ')}
          </span>

          {book.match != null && (
            <div className={styles.match}>
              <span className={styles.matchValue}>{book.match}%</span>
              <span className={styles.matchLabel}>
                {stretch ? 'how far it reaches' : 'chance you like it'}
              </span>
            </div>
          )}

          {book.about && (
            <section className={styles.part}>
              <h4 className={styles.partLabel}>What it is</h4>
              <p className={styles.prose}>{book.about}</p>
            </section>
          )}

          {book.reason && (
            <section className={styles.part}>
              <h4 className={styles.partLabel}>Why you</h4>
              <p className={styles.prose}>{book.reason}</p>
            </section>
          )}

          {book.newGround && (
            <span className={styles.ground}>
              <SparkleIcon />
              New ground: {book.newGround}
            </span>
          )}

          {rubricRows.length > 0 && (
            <ul className={styles.rubric}>
              {rubricRows.map(row => (
                <li key={row.key} className={styles.rubricRow}>
                  <span className={styles.rubricLabel}>{row.label}</span>
                  <span className={styles.rubricDots} aria-hidden="true">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span
                        key={n}
                        className={cn(styles.dot, {
                          [styles.dotOn]: n <= row.value,
                        })}
                      />
                    ))}
                  </span>
                  <span className={styles.rubricValue}>{row.value}/5</span>
                </li>
              ))}
            </ul>
          )}

          {book.source && (
            <span className={styles.source}>
              Confirmed by{' '}
              {book.source.url ? (
                <a
                  href={book.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.source.name}
                </a>
              ) : (
                book.source.name
              )}
            </span>
          )}
        </div>

        <div className={styles.foot}>
          <span className={styles.footNote}>
            {banned
              ? 'Banned. It will not be recommended again.'
              : locked
                ? 'Locked in. The next roll leaves it standing.'
                : ''}
          </span>
          <div className={styles.footActions}>
            <button type="button" className={styles.secondary} onClick={close}>
              Close
            </button>
            {!readOnly && !banned && (
              <button
                type="button"
                className={styles.secondary}
                onClick={() => onToggleLock?.(book)}
              >
                <LockIcon />
                {locked ? 'Unlock' : 'Lock'}
              </button>
            )}
            {!readOnly && (
              <button
                type="button"
                className={styles.primary}
                onClick={() => onToggleBan?.(book)}
              >
                <BanIcon />
                {banned ? 'Unban' : 'Ban'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
