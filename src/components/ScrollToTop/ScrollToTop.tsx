import cn from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';

import useGlobals from '@hooks/useGlobals';

import ArrowUp from '@icons/ArrowUp';

import styles from './ScrollToTop.module.scss';

const SCROLL_THRESHOLD = 300;
/* Gap between the "to top" button and the Copilot pill that sits in the
   bottom-right corner (the widget is a separate DOM root injected by the
   concierge bundle). */
const COPILOT_GAP = 16;

const ScrollToTop: FC = () => {
  const [{}, { isDarkTheme }] = useGlobals();
  const [isVisible, setIsVisible] = useState(false);
  /* Right offset so the button parks just LEFT of the Copilot pill. null
     until measured — then the inline style overrides the SCSS default. */
  const [rightOffset, setRightOffset] = useState<number | null>(null);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Measure the Copilot pill and sit to its left. The pill width varies
     by locale (RU label is wider) and open/closed state, so we measure
     live rather than hardcode. The widget bundle loads async, so retry
     shortly and watch the pill for size changes. */
  useEffect(() => {
    const compute = () => {
      const el = document.querySelector(
        '.ks-aux-pill, .ks-aux-root',
      ) as HTMLElement | null;
      if (!el) {
        setRightOffset(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) {
        setRightOffset(null);
        return;
      }
      setRightOffset(window.innerWidth - rect.left + COPILOT_GAP);
    };

    compute();
    window.addEventListener('resize', compute);
    const retry = window.setTimeout(compute, 1200);
    let ro: ResizeObserver | null = null;
    const pill = document.querySelector('.ks-aux-pill');
    if (pill && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(compute);
      ro.observe(pill);
    }
    return () => {
      window.removeEventListener('resize', compute);
      window.clearTimeout(retry);
      ro?.disconnect();
    };
  }, [isVisible]);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      className={cn(styles.scrollToTop, {
        [styles.dark]: isDarkTheme,
      })}
      style={rightOffset != null ? { right: `${rightOffset}px` } : undefined}
      onClick={handleClick}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp />
    </button>
  );
};

export default ScrollToTop;
