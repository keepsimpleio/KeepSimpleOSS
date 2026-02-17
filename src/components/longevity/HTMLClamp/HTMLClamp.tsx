import React, { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { HTMLClampTypes } from '@components/longevity/HTMLClamp/HTMLClamp.types';

import styles from './HTMLClamp.module.scss';

const HtmlClamp: FC<HTMLClampTypes> = ({ html, lines = 9, className }) => {
  const shouldClamp = true;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      if (!shouldClamp) {
        setHasOverflow(false);
        return;
      }

      if (!expanded) {
        setHasOverflow(el.scrollHeight > el.clientHeight + 1);
      } else {
        setExpanded(false);
        requestAnimationFrame(() => {
          const el2 = contentRef.current;
          if (el2) setHasOverflow(el2.scrollHeight > el2.clientHeight + 1);
          setExpanded(true);
        });
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [html, lines, shouldClamp]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.description}>
        <div
          ref={contentRef}
          className={cn(styles.htmlContent, className, {
            [styles.clamped]: !expanded,
          })}
          dangerouslySetInnerHTML={{ __html: html || '' }}
        />
        {hasOverflow && (
          <button
            type="button"
            className={styles.showMoreBtn}
            onClick={() => setExpanded(v => !v)}
          >
            {/*Keeping show less just in case*/}
            {expanded ? 'Show less' : 'Learn more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default HtmlClamp;
