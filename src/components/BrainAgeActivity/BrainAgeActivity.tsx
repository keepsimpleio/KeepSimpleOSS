import { FC, useMemo, useState } from 'react';
import cn from 'classnames';

import Heading from '@components/Heading';

import { BRAIN_AGE_TABLE } from '@constants/longevity';

import styles from './BrainAgeActivity.module.scss';

function formatDelta(delta: number) {
  const sign = delta > 0 ? '+' : '';
  return `(${sign}${delta} years)`;
}

const BrainAgeActivity: FC = () => {
  const [selectedBaseline, setSelectedBaseline] = useState<number>(32);

  const result = useMemo(() => {
    const row = BRAIN_AGE_TABLE.find(r => r.baseline === selectedBaseline);
    if (!row) return null;

    const activeDelta = row.active - row.baseline;
    const sedentaryDelta = row.sedentary - row.baseline;

    return {
      selectedBaseline: row.baseline,
      active: row.active,
      sedentary: row.sedentary,
      activeDeltaText: formatDelta(activeDelta),
      sedentaryDeltaText: formatDelta(sedentaryDelta),
    };
  }, [selectedBaseline]);

  return (
    <section className={styles.section}>
      <Heading
        text={'Brain age with different activity levels'}
        Tag={'h3'}
        showRightIcon={false}
        showLeftIcon={false}
        className={styles.heading}
      />{' '}
      <hr className={styles.hr} />
      <Heading
        text={'Select baseline age to see the difference'}
        Tag={'h4'}
        showRightIcon={false}
        showLeftIcon={false}
        className={styles.subHeading}
      />
      <div className={styles.buttonContainer}>
        {BRAIN_AGE_TABLE.map(row => (
          <button
            key={row.baseline}
            onClick={() => setSelectedBaseline(row.baseline)}
            className={cn(styles.ageButton, {
              [styles.selectedButton]: selectedBaseline === row.baseline,
            })}
          >
            {row.baseline}
          </button>
        ))}
      </div>
      <div>
        {result && (
          <div className={styles.result}>
            <p className={styles.minimal}>
              Brain age if sedentary
              <span className={styles.passive}>
                {result.sedentary} {result.sedentaryDeltaText}
              </span>
            </p>
            <p className={styles.maximal}>
              Brain age if active{' '}
              <span className={styles.active}>{result.active}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrainAgeActivity;
