import cn from 'classnames';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { BRAIN_AGE_TABLE } from '@constants/longevity';

import longevityData from '@data/longevity';

import Heading from '@components/Heading';
import Digit from '@components/longevity/Digit/Digit';

import { BorderedPill } from '../longevity/BorderedPill/BorderedPill';
import { BrainAgeActivityProps } from './BrainAgeActivity.types';

import styles from './BrainAgeActivity.module.scss';

const BrainAgeActivity: FC<BrainAgeActivityProps> = ({ locale }) => {
  const { totalWeeklyActivity } = longevityData[locale];

  const [selectedBaseline, setSelectedBaseline] = useState<number>(32);
  const formatDelta = useCallback(
    (delta: number): ReactNode => {
      const sign = delta > 0 ? '+ ' : '';
      return (
        <span>
          ({sign}
          <Digit value={Math.abs(delta)} size={24} />{' '}
          {totalWeeklyActivity.years})
        </span>
      );
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
    } as {
      selectedBaseline: number;
      active: number;
      sedentary: number;
      activeDeltaText: ReactNode;
      sedentaryDeltaText: ReactNode;
    };
  }, [selectedBaseline, formatDelta]);

  return (
    <section
      className={cn(styles.section, {
        [styles.sectionRu]: locale === 'ru',
      })}
      data-cy="brain-age-activity"
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
            data-cy="age-button"
            data-active={selectedBaseline === row.baseline}
            data-baseline={row.baseline}
          >
            <Digit value={row.baseline} size={32} />
          </button>
        ))}
      </div>
      <div>
        {result && (
          <div
            className={styles.result}
            data-cy="brain-age-result"
            data-sedentary={result.sedentary}
            data-active-age={result.active}
          >
            <BorderedPill
              className={styles.minimal}
              contentClassName={styles.content}
            >
              <p className={styles.subContent}>
                <span>{totalWeeklyActivity.brainIfSedentary}</span>
                {totalWeeklyActivity.brainIfSedentarySubText && (
                  <span className={styles.subText}>
                    {totalWeeklyActivity.brainIfSedentarySubText}
                  </span>
                )}
              </p>
              <div className={styles.valueWrapper}>
                <span className={styles.passive}>
                  <Digit value={result.sedentary} size={24} />{' '}
                  {result.sedentaryDeltaText}
                </span>
              </div>
            </BorderedPill>
            <BorderedPill
              className={styles.maximal}
              contentClassName={styles.content}
            >
              <p className={styles.subContent}>
                <span>{totalWeeklyActivity.brainIfActive}</span>
                {totalWeeklyActivity.brainIfActiveSubText && (
                  <span className={styles.subText}>
                    {totalWeeklyActivity.brainIfActiveSubText}
                  </span>
                )}
              </p>
              <div className={styles.valueWrapper}>
                <span className={styles.active}>
                  <Digit value={result.active} size={24} />
                </span>
              </div>
            </BorderedPill>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrainAgeActivity;
