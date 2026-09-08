import classNames from 'classnames';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Text } from '@components/library/atoms/Text';

import styles from './ExpandableText.module.scss';

interface ExpandableTextProps {
  text: string;
  /** Lines kept on the sheet while the passage is folded. */
  lines?: number;
  className?: string;
  /** Names the passage in the control, e.g. "author biography". */
  subject: string;
}

// Free text the owner writes has no length limit, so a long passage used to
// push the panel's remaining sections past the bottom of the sticky column.
// The passage folds to a measured number of lines instead: line height comes
// from the rendered paragraph, never from a hardcoded pixel cap, so a locale
// or font change cannot cut a line in half.
const ExpandableText = ({
  text,
  lines = 6,
  className,
  subject,
}: ExpandableTextProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [foldedHeight, setFoldedHeight] = useState<number | null>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const passageId = useId();

  const measure = useCallback(() => {
    const node = contentRef.current;
    if (!node) return;

    const { lineHeight, fontSize } = window.getComputedStyle(node);
    const parsedLineHeight = parseFloat(lineHeight);
    // `normal` computes to a keyword rather than a length; 1.5 matches the
    // panel's body copy and only ever acts as the fallback.
    const step = Number.isNaN(parsedLineHeight)
      ? parseFloat(fontSize) * 1.5
      : parsedLineHeight;

    setFoldedHeight(step * lines);
    setFullHeight(node.scrollHeight);
  }, [lines]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;

    measure();

    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, text]);

  // Before the first measurement the passage renders whole: an unmeasured fold
  // would flash a clipped paragraph on load.
  const measured = foldedHeight !== null && fullHeight !== null;
  const overflows = measured && fullHeight > foldedHeight + 1;
  const folded = overflows && !expanded;

  return (
    <div className={styles.wrapper}>
      <div
        id={passageId}
        className={classNames(styles.passage, { [styles.folded]: folded })}
        style={
          measured
            ? { maxHeight: `${folded ? foldedHeight : fullHeight}px` }
            : undefined
        }
      >
        <div ref={contentRef}>
          <Text className={className}>{text}</Text>
        </div>
      </div>
      {overflows && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setExpanded(current => !current)}
          aria-expanded={expanded}
          aria-controls={passageId}
          aria-label={`${expanded ? 'Show less of the' : 'Show the full'} ${subject}`}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
