import cn from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';

import useGlobals from '@hooks/useGlobals';

import ArrowUp from '@icons/ArrowUp';

import styles from './ScrollToTop.module.scss';

const SCROLL_THRESHOLD = 300;

const ScrollToTop: FC = () => {
  const [{}, { isDarkTheme }] = useGlobals();
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      className={cn(styles.scrollToTop, {
        [styles.dark]: isDarkTheme,
      })}
      onClick={handleClick}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp />
    </button>
  );
};

export default ScrollToTop;
