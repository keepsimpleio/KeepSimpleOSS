import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { toEditorHtml } from '@lib/library/richText';

import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';

import styles from './ExpandableText.module.scss';

interface ExpandableTextProps {
  /** Stored rich text in the editor dialect (see lib/library/richText). */
  value: string;
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
//
// The writer's own marks travel with the text: line breaks, bold, italic,
// strikethrough and links all render here exactly as the editor stored them,
// sanitized back down to that dialect on the way in.
const ExpandableText = ({
  value,
  title,
  lines = 8,
  className,
  subject,
}: ExpandableTextProps) => {
  const passageRef = useRef<HTMLDivElement>(null);
  const [clipped, setClipped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { closeRef, close } = useModalClose(() => setIsOpen(false));

  const html = useMemo(() => toEditorHtml(value), [value]);

  const measure = useCallback(() => {
    const passage = passageRef.current;
    if (!passage) return;
    setClipped(passage.scrollHeight - passage.clientHeight > 1);
  }, []);

  useEffect(() => {
    const passage = passageRef.current;
    if (!passage) return undefined;

    measure();

    if (typeof ResizeObserver === 'undefined') return undefined;
    // The column narrows on the panel fold and on every viewport change, and
    // the same text takes more lines when it does.
    const observer = new ResizeObserver(measure);
    observer.observe(passage);
    return () => observer.disconnect();
  }, [measure, html]);

  return (
    <div
      className={styles.wrapper}
      style={{ '--expandable-lines': lines } as React.CSSProperties}
    >
      <div
        ref={passageRef}
        className={classNames(styles.passage, className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
            <div
              className={styles.fullText}
              dangerouslySetInnerHTML={{ __html: html }}
            />
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
