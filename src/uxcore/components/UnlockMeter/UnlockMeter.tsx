import { FC } from 'react';

import styles from './UnlockMeter.module.scss';

interface UnlockMeterProps {
  value: number;
}

const UnlockMeter: FC<UnlockMeterProps> = ({ value }) => {
  return (
    <>
      <div className={styles.unlockMeter}>
        <div
          className={styles.fill}
          style={{ width: `${value}%`, transition: 'width 0.5s ease' }}
        />
      </div>
      <span className={styles.value}> {Math.floor(value)}% </span>
    </>
  );
};
export default UnlockMeter;
