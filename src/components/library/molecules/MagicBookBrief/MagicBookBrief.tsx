import cn from 'classnames';
import React, { JSX } from 'react';

import type { MagicRubric } from '@local-types/library/magicBook';

import { SparkleIcon } from '@icons/library/svg';

import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import type { MagicBookBriefProps } from './MagicBookBrief.types';

import styles from './MagicBookBrief.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// dialog fades through the shared Modal; the cover crossfade and the busy
// light live in MagicBookBrief.module.scss with their reduced-motion branch.

/** Rated books the engine wants before it shows a percent. Mirrors
 * MAGIC_MIN_RATED_FOR_MATCH on the server. */
const MIN_RATED_FOR_MATCH = 3;

const RUBRIC_LABELS: Record<keyof MagicRubric, string> = {
  theme: 'Fits the shelf',
  notes: 'Runs along your notes',
  tags: 'Speaks your tags',
  difficulty: 'Lands in your band',
  distance: 'Far from what you disliked',
};

/**
 * The magic book opened: cover, title, author and year, the chance you like
 * it with the rubric that made the number, the engine's reason in your own
 * terms, the source that confirmed the book, and Re-roll. A roll from here
 * swaps the brief in place once the engine answers.
 */
export function MagicBookBrief({
  slot,
  shelfName,
  onClose,
}: MagicBookBriefProps): JSX.Element {
  const { closeRef, close } = useModalClose(onClose);
  const pick = slot.pick;
  const busy = slot.rolling;
  const showPick = !!pick && slot.status === 'ready';
  const rubricRows = pick
    ? (Object.keys(RUBRIC_LABELS) as (keyof MagicRubric)[])
        .map(key => ({
          key,
          label: RUBRIC_LABELS[key],
          value: pick.rubric[key],
        }))
        .filter(row => typeof row.value === 'number' && row.value > 0)
    : [];

  return (
    <Modal
      className={styles.modal}
      title={`Magic book for ${shelfName}`}
      onClose={onClose}
      closeRef={closeRef}
    >
      <div className={cn(styles.body, { [styles.busy]: busy })}>
        <div className={styles.cover} aria-hidden={!showPick || undefined}>
          {showPick && pick?.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pick.coverUrl} alt="" className={styles.coverImage} />
          ) : (
            <div className={styles.coverBlank}>
              <SparkleIcon />
            </div>
          )}
          <span className={styles.coverLight} aria-hidden="true" />
        </div>

        <div className={styles.text}>
          {showPick && pick ? (
            <>
              <Text
                variant={TypographyVariant.SubtitleSecondarySemi}
                className={styles.title}
                tag={TagType.H3}
              >
                {pick.title}
              </Text>
              <span className={styles.byline}>
                {[pick.author, pick.year].filter(Boolean).join(', ')}
              </span>

              <div className={styles.match}>
                <span className={styles.matchValue}>
                  {pick.match != null ? `${pick.match}%` : '—'}
                </span>
                <span className={styles.matchLabel}>
                  {pick.match != null
                    ? 'chance you like it'
                    : `rate ${MIN_RATED_FOR_MATCH} books to see the chance`}
                </span>
              </div>
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

              <p className={styles.reason}>{pick.reason}</p>

              <span className={styles.source}>
                Confirmed by{' '}
                {pick.source.url ? (
                  <a
                    href={pick.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pick.source.name}
                  </a>
                ) : (
                  pick.source.name
                )}
              </span>
            </>
          ) : (
            <>
              <Text
                variant={TypographyVariant.SubtitleSecondarySemi}
                className={styles.title}
                tag={TagType.H3}
              >
                {busy ? 'Choosing a book' : 'No book yet'}
              </Text>
              <p className={styles.reason}>
                {busy
                  ? 'The engine is reading this shelf and your notes. Twenty seconds or so.'
                  : (slot.note ?? 'Roll to get a book for this shelf.')}
              </p>
            </>
          )}
        </div>

        <div className={styles.foot}>
          <span className={styles.footNote} role="status" aria-live="polite">
            {busy ? 'Rolling…' : ''}
          </span>
          <div className={styles.footActions}>
            <button type="button" className={styles.secondary} onClick={close}>
              Close
            </button>
            {slot.status !== 'ineligible' && slot.status !== 'error' && (
              <button
                type="button"
                className={styles.primary}
                disabled={busy}
                onClick={() => slot.reroll()}
              >
                <SparkleIcon />
                {showPick ? 'Re-roll' : 'Roll'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
