import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import styles from './ExpandableText.module.scss';

interface ExpandableTextProps {
  text: string;
  /** Heading the passage carries when it opens in full. */
  title: string;
  /** Lines kept on the sheet; the rest opens in the dialog. */
  lines?: number;
  className?: string;
  /** Names the passage in the control, e.g. "author biography". */
  subject: string;
}

// Owner-written passages have no length limit, so a long one filled the info
// panel and pushed Content, Author, Tags and the library link past the bottom
// of the column. The panel keeps the opening lines and hands the whole text to
// a dialog. The cap is a line count, not a pixel height, so a longer line or a
// different locale still cuts on a line boundary.
const ExpandableText = ({
  text,
  title,
  lines = 8,
  className,
  subject,
}: ExpandableTextProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [clipped, setClipped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { closeRef, close } = useModalClose(() => setIsOpen(false));

  const measure = useCallback(() => {
    const passage = wrapperRef.current?.firstElementChild;
    if (!passage) return;
    setClipped(passage.scrollHeight - passage.clientHeight > 1);
  }, []);

  useEffect(() => {
    const passage = wrapperRef.current?.firstElementChild;
    if (!passage) return undefined;

    measure();

    if (typeof ResizeObserver === 'undefined') return undefined;
    // The column narrows on the panel fold and on every viewport change, and
    // the same text takes more lines when it does.
    const observer = new ResizeObserver(measure);
    observer.observe(passage);
    return () => observer.disconnect();
  }, [measure, text]);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      style={{ '--expandable-lines': lines } as React.CSSProperties}
    >
      <Text className={classNames(styles.passage, className)}>{text}</Text>
      {clipped && (
        <button
          type="button"
          className={styles.showAll}
          onClick={() => setIsOpen(true)}
          aria-label={`Show the full ${subject}`}
        >
          Show all
        </button>
      )}
      {isOpen && (
        <Modal
          className={styles.modal}
          title={title}
          onClose={() => setIsOpen(false)}
          closeRef={closeRef}
        >
          <div className={styles.body}>
            <Text
              className={styles.fullText}
              variant={TypographyVariant.TextRegular}
            >
              {text}
            </Text>
          </div>
          <div className={styles.footer}>
            <Button
              label="Close"
              onClick={close}
              type={ButtonType.Primary}
              size={ButtonSize.Wide}
              ariaLabel="Close"
              className={styles.close}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpandableText;
