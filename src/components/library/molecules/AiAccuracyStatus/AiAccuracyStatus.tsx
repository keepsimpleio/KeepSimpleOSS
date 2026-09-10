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
 * owner's alone. Clicking it opens the ledger: each signal, what it earned
 * of what it could, and the cheapest step that raises it.
 */
export function AiAccuracyStatus({
  shelves,
  className,
}: AiAccuracyStatusProps): JSX.Element {
  const report = useMemo(() => scoreLibraryAccuracy(shelves), [shelves]);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { closeRef, close: closeAnimated } = useModalClose(close);

  return (
    <>
      <Tooltip
        asChild
        place="bottom"
        tooltipContent="How much the engine knows about your taste. Open for the ledger."
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
                  ? 'No books yet. Every recommendation is a guess until there are.'
                  : `What the engine can read across ${report.books} ${report.books === 1 ? 'book' : 'books'}. Every field you fill sharpens the next pick.`}
              </Text>
            </div>
            <ul className={styles.rows}>
              {report.components.map(row => (
                <li key={row.key} className={styles.row}>
                  <div className={styles.rowHead}>
                    <span className={styles.rowLabel}>{row.label}</span>
                    <span className={styles.rowPoints}>
                      {row.earned}
                      <span className={styles.rowMax}> / {row.max}</span>
                    </span>
                  </div>
                  <span className={styles.rowMeter} aria-hidden="true">
                    <span
                      className={styles.rowFill}
                      style={{
                        transform: `scaleX(${row.max === 0 ? 0 : row.earned / row.max})`,
                      }}
                    />
                  </span>
                  <div className={styles.rowFoot}>
                    <span className={styles.rowDetail}>{row.detail}</span>
                    <span className={styles.rowNext}>
                      {row.next
                        ? `${row.next.action}: +${row.next.gain}%`
                        : 'Full'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.foot}>
              <span className={styles.best}>
                {report.best
                  ? `Cheapest step: ${report.best.action}, +${report.best.gain}%`
                  : report.books === 0
                    ? 'Add a book to begin.'
                    : 'Nothing cheap is left. The engine reads all of it.'}
              </span>
              <button
                type="button"
                className={styles.done}
                onClick={closeAnimated}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
