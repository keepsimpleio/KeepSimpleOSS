import { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import Heading from '@components/Heading';

import longevityData from '@data/longevity';
import { BRAIN_AGE_TABLE } from '@constants/longevity';

import { BrainAgeActivityProps } from './BrainAgeActivity.types';

import styles from './BrainAgeActivity.module.scss';

const BrainAgeActivity: FC<BrainAgeActivityProps> = ({ locale }) => {
  const { totalWeeklyActivity } = longevityData[locale];

  const [selectedBaseline, setSelectedBaseline] = useState<number>(32);
  const formatDelta = useCallback(
    (delta: number) => {
      const sign = delta > 0 ? '+' : '';
      return `(${sign}${delta} ${totalWeeklyActivity.years})`;
    },
    [totalWeeklyActivity.years],
  );

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
  }, [selectedBaseline, formatDelta]);

  return (
    <section
      className={cn(styles.section, {
        [styles.sectionRu]: locale === 'ru',
      })}
    >
      <Heading
        text={totalWeeklyActivity.brainAgeTitle}
        Tag={'h3'}
        showRightIcon={false}
        showLeftIcon={false}
        className={styles.heading}
      />{' '}
      <hr className={styles.hr} />
      <Heading
        text={totalWeeklyActivity.brainAgeSubTitle}
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
            <div className={styles.minimal}>
              <p className={styles.subContent}>
                <span>{totalWeeklyActivity.brainIfSedentary}</span>
                {totalWeeklyActivity.brainIfSedentarySubText && (
                  <span className={styles.subText}>
                    {totalWeeklyActivity.brainIfSedentarySubText}
                  </span>
                )}
              </p>
              <span className={styles.passive}>
                {result.sedentary} {result.sedentaryDeltaText}
              </span>
            </div>
            <div className={styles.maximal}>
              <p className={styles.subContent}>
                <span>{totalWeeklyActivity.brainIfActive}</span>
                {totalWeeklyActivity.brainIfActiveSubText && (
                  <span className={styles.subText}>
                    {totalWeeklyActivity.brainIfActiveSubText}
                  </span>
                )}
              </p>
              <span className={styles.active}>{result.active}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrainAgeActivity;
