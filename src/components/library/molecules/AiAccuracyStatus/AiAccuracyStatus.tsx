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
 * owner's alone. Clicking it opens the ledger: one line per signal with
 * what it earned of what it could, the counts behind it on hover, and at
 * the foot the one step that buys the most.
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
            <ul className={styles.rows}>
              {report.components.map(row => (
                <Tooltip
                  asChild
                  place="bottom"
                  key={row.key}
                  tooltipContent={
                    row.next
                      ? `${row.detail}. ${row.next.action}: +${row.next.gain}%.`
                      : `${row.detail}.`
                  }
                >
                  <li className={styles.row} tabIndex={0}>
                    <span className={styles.rowLabel}>{row.label}</span>
                    <span className={styles.rowMeter} aria-hidden="true">
                      <span
                        className={styles.rowFill}
                        style={{
                          transform: `scaleX(${row.max === 0 ? 0 : row.earned / row.max})`,
                        }}
                      />
                    </span>
                    <span className={styles.rowPoints}>
                      {row.earned}
                      <span className={styles.rowMax}> / {row.max}</span>
                    </span>
                  </li>
                </Tooltip>
              ))}
            </ul>
            <p className={styles.foot}>
              {report.best
                ? `${report.best.action}: +${report.best.gain}%`
                : report.books === 0
                  ? 'Add a book to begin.'
                  : 'The engine reads all of it.'}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
