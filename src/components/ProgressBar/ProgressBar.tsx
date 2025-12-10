import { useCallback, useEffect, useState } from 'react';
import styles from './ProgressBar.module.scss';

const ProgressBar = () => {
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [width, setWidth] = useState<string>('0%');

  const calculateRPBWidth = useCallback(
    function () {
      const pageHeight = document.body.offsetHeight - window.innerHeight;
      const currentPoistion =
        window.pageYOffset || document.documentElement.scrollTop;
      const RPBWidth = currentPoistion / (pageHeight / 100);
      setWidth(`${RPBWidth}%`);
    },
    [windowHeight],
  );

  const updateWindowHeight = function () {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    calculateRPBWidth();
  }, [windowHeight]);

  useEffect(() => {
    updateWindowHeight();

    window.addEventListener('scroll', calculateRPBWidth);
    window.addEventListener('resize', updateWindowHeight);

    return () => {
      window.removeEventListener('scroll', calculateRPBWidth);
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  return <div className={styles.readingProgressBar} style={{ width }} />;
};

export default ProgressBar;
