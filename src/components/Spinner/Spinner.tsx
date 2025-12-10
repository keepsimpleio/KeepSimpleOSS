import type { FC } from 'react';
import useSpinner from '@hooks/useSpinner';

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
        <img src="/keepsimple_/assets/spinner/brain.svg" alt="loader" />
        <img src="/keepsimple_/assets/spinner/brain circle.svg" alt="loader" />
        <img src="/keepsimple_/assets/spinner/brain gears.svg" alt="loader" />
      </div>
    </div>
  );
};

export default Spinner;
