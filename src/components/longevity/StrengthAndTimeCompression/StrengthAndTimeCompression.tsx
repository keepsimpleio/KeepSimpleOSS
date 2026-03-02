import React, { FC, useMemo, useState } from 'react';
import cn from 'classnames';

import Heading from '@components/Heading';
import ProgressBar from '@components/longevity/ProgressBar';

import { ACTIVITY_LEVELS } from '@constants/longevity';
import longevityData from '@data/longevity';

import { StrengthAndTimeCompressionProps } from './StrengthAndTimeCompression.types';

import styles from './StrengthAndTimeCompression.module.scss';

const StrengthAndTimeCompression: FC<StrengthAndTimeCompressionProps> = ({
  locale,
}) => {
  const { totalWeeklyActivity } = longevityData[locale];
  const stops = [0, 1, 2, 3, 4];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedLevel = useMemo(
    () => ACTIVITY_LEVELS[selectedIndex],
    [selectedIndex],
  );

  return (
    <section
      className={cn(styles.strengthAndTimeCompression, {
        [styles.strengthAndTimeCompressionRu]: locale === 'ru',
      })}
    >
      <Heading
        text={totalWeeklyActivity.strengthTitle}
        Tag="h3"
        isBold
        showLeftIcon={false}
        showRightIcon={false}
        className={styles.heading}
      />
      <hr className={styles.divider} />
      <Heading
        text={totalWeeklyActivity.strengthSubTitle}
        Tag="h4"
        isBold
        showLeftIcon={false}
        showRightIcon={false}
        className={styles.subHeading}
      />
      <ProgressBar
        stops={stops}
        activityLevels={totalWeeklyActivity.activityLevels}
        isStrengthSection
        setStopIndex={setSelectedIndex}
        stopIndex={selectedIndex}
      />
      <div
        className={cn({
          [styles.orangeResult]: stops[selectedIndex] === 2,
          [styles.greenResult]:
            stops[selectedIndex] === 3 || stops[selectedIndex] === 4,
        })}
      >
        <span className={styles.totalMins}>
          {selectedLevel.totalMinutesPerWeek}
        </span>
        <span className={styles.staticBigText}> {totalWeeklyActivity.min}</span>
        <span className={styles.staticSmallText}>
          {' '}
          / {totalWeeklyActivity.week}
        </span>
      </div>
      <div className={styles.result}>
        <p className={styles.perWeek}>
          <span className={styles.quantity}> 3 </span>
          <span className={styles.staticText}>
            {totalWeeklyActivity.sessionsAndWeek}
          </span>
        </p>
        <p className={styles.perSession}>
          <span className={styles.quantity}>
            {selectedLevel.minutesPerSession}
          </span>
          <span className={styles.staticText}>
            {totalWeeklyActivity.minAndSessions}
          </span>
        </p>
      </div>
    </section>
  );
};
export default StrengthAndTimeCompression;
