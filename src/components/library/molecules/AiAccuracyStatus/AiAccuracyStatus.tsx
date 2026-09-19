import classNames from 'classnames';
import React, { JSX, useCallback, useMemo, useState } from 'react';

import { scoreLibraryAccuracy } from '@lib/library/aiAccuracy';

import { SparkleIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import type { AiAccuracyStatusProps } from './AiAccuracyStatus.types';

import styles from './AiAccuracyStatus.module.scss';

// motion-passport: exempt — this file carries no animation of its own. The
// meter's fill, the hover and the modal's fade live in
// AiAccuracyStatus.module.scss and Modal.module.scss, reduced motion included.

/**
 * AI accuracy: how much of what the engine reads is written into this
 * library, as a percent on a meter where the Librarian opener stood. The
 * owner's alone. Clicking it opens the ledger.
 *
 * The ledger says what the number is made of, in the open (Wolf,
 * 2026-09-11: the bare "20 / 25" told him nothing). One block per signal:
 * its name, the points it earns of the points it is worth, its meter, and
 * underneath, in words, the count those points were read from. The header
 * says once that the six signals share 100 points, so no row has to. The
 * hover carries only the next step, and the foot the best win there is: the
 * move that pays the most percent per book touched, said in full rather than
 * cut to a token one percent.
 */
export function AiAccuracyStatus({
  shelves,
  className,
}: AiAccuracyStatusProps): JSX.Element {
  const report = useMemo(() => scoreLibraryAccuracy(shelves), [shelves]);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { closeRef } = useModalClose(close);

  return (
    <>
      <Tooltip
        asChild
        place="bottom"
        tooltipContent="How much of your taste the engine can read. Open for the ledger."
      >
        <button
          type="button"
          className={classNames(styles.status, className)}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`AI accuracy ${report.total} percent. Open the ledger`}
        >
          <SparkleIcon aria-hidden="true" />
          <span className={styles.label}>AI accuracy</span>
          <span className={styles.meter} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ transform: `scaleX(${report.total / 100})` }}
            />
          </span>
          <span className={styles.value}>{report.total}%</span>
        </button>
      </Tooltip>

      {open && (
        <Modal
          className={styles.modal}
          title="AI accuracy"
          onClose={close}
          closeRef={closeRef}
        >
          <div className={styles.body}>
            <div className={styles.head}>
              <span className={styles.total}>{report.total}%</span>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.lede}
              >
                {report.books === 0
                  ? 'No books yet. Every pick is a guess until there are.'
                  : `How much of your taste the engine can read from ${report.books} ${report.books === 1 ? 'book' : 'books'}.`}
              </Text>
            </div>
            {report.books > 0 && (
              <p className={styles.legend}>
                Six signals, 100 points between them. The score is what they add
                up to.
              </p>
            )}
            <ul className={styles.rows}>
              {report.components.map(row => (
                <Tooltip
                  asChild
                  place="bottom"
                  key={row.key}
                  tooltipContent={
                    row.next
                      ? `${row.next.action}: +${row.next.gain}% on the score.`
                      : row.earned >= row.max - 0.5
                        ? 'This signal is full. Nothing to add here.'
                        : 'Rating books fills this one. The move is counted on Ratings, so it is not charged twice.'
                  }
                >
                  <li className={styles.row} tabIndex={0}>
                    <span className={styles.rowHead}>
                      <span className={styles.rowLabel}>{row.label}</span>
                      <span className={styles.rowPoints}>
                        {Math.round(row.earned)}
                        <span className={styles.rowMax}>
                          {' '}
                          of {row.max} points
                        </span>
                      </span>
                    </span>
                    <span className={styles.rowMeter} aria-hidden="true">
                      <span
                        className={styles.rowFill}
                        style={{
                          transform: `scaleX(${row.max === 0 ? 0 : row.earned / row.max})`,
                        }}
                      />
                    </span>
                    <span className={styles.rowDetail}>{row.detail}</span>
                  </li>
                </Tooltip>
              ))}
            </ul>
            <p className={styles.foot}>
              {report.best ? (
                <>
                  <span className={styles.footLabel}>Your best win:</span>{' '}
                  {report.best.action}
                  <span className={styles.footGain}> +{report.best.gain}%</span>
                </>
              ) : report.books === 0 ? (
                'Add a book to begin.'
              ) : (
                'The engine reads all of it.'
              )}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
