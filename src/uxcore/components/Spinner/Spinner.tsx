import useSpinner from '@uxcore/hooks/useSpinner';
import type { FC } from 'react';

import styles from './Spinner.module.scss';

type SpinnerProps = {
  visible?: boolean;
};

const Spinner: FC<SpinnerProps> = ({ visible }) => {
  const { isVisible } = useSpinner()[1];

  if (!isVisible && !visible) return null;

  return (
    <div className={styles.PreloaderContainer}>
      <div className={styles.Preloader}>
        <img src="/assets/spinner/brain.svg" alt="loader" />
        <img src="/assets/spinner/brain circle.svg" alt="loader" />
        <img src="/assets/spinner/brain gears.svg" alt="loader" />
      </div>
    </div>
  );
};

export default Spinner;
