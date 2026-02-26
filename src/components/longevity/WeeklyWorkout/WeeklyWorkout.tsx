import React, { FC, useMemo, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import ProgressBar from '@components/longevity/ProgressBar/ProgressBar';
import Heading from '@components/Heading';

import { STOPS } from '@constants/longevity';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './WeeklyWorkout.module.scss';
import longevityData from '@data/longevity';
import { WeeklyWorkoutProps } from './WeeklyWorkout.types';

const WeeklyWorkout: FC<WeeklyWorkoutProps> = ({ locale }) => {
  const { totalWeeklyActivity } = longevityData[locale];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMinutes] = useMemo(() => {
    const minutes = STOPS[selectedIndex];
    const perc = (selectedIndex / (STOPS.length - 1)) * 100;
    return [minutes, perc];
  }, [selectedIndex]);

  const summary = useMemo(() => {
    const content = totalWeeklyActivity.summaryContent;
    return content?.find(r => r.minutes === selectedMinutes) ?? content?.[0];
  }, [totalWeeklyActivity.summaryContent, selectedMinutes]);

  const images = useMemo(
    () => [
      {
        src: '/keepsimple_/assets/longevity/workout/weekly-workout/0.png',
        id: 0,
        alt: 'Warrior',
      },
      {
        src: '/keepsimple_/assets/longevity/workout/weekly-workout/1.png',
        id: 1,
        alt: 'Warrior',
      },
      {
        src: '/keepsimple_/assets/longevity/workout/weekly-workout/2.png',
        id: 2,
        alt: 'Warrior',
      },
      {
        src: '/keepsimple_/assets/longevity/workout/weekly-workout/3.png',
        id: 3,
        alt: 'Warrior',
      },
      {
        src: '/keepsimple_/assets/longevity/workout/weekly-workout/4.png',
        id: 4,
        alt: 'Warrior',
      },
    ],
    [],
  );

  return (
    <section className={styles.weeklyWorkout}>
      <div className={styles.header}>
        <Heading
          text={totalWeeklyActivity.title}
          isBold
          Tag="h3"
          showLeftIcon={false}
          showRightIcon={false}
          className={styles.heading}
        />
        <span
          className={cn(styles.minutes, {
            [styles.orangeMinutes]: selectedMinutes === 150,
            [styles.greenMinutes]:
              selectedMinutes === 225 || selectedMinutes === 300,
          })}
        >
          {selectedMinutes} {totalWeeklyActivity.min}
        </span>
      </div>
      <hr className={styles.divider} />
      <ProgressBar
        stops={STOPS}
        setStopIndex={setSelectedIndex}
        stopIndex={selectedIndex}
        minutesTxt={totalWeeklyActivity.minutes}
      />
      <div className={styles.wrapper}>
        {images.map(image => {
          const isActive = image.id === selectedIndex;

          return (
            <div
              key={image.id}
              className={cn(styles.imageWrapper, {
                [styles.activeImageWrapper]: isActive,
              })}
              onClick={() => setSelectedIndex(image.id)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={152}
                height={152}
                className={styles.image}
              />
            </div>
          );
        })}
      </div>
      <div>
        <p className={styles.summary}>
          {totalWeeklyActivity.earlyDyingRisk}
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {summary?.riskOfDyingEarly}
          </span>
        </p>
        <hr className={styles.divider} />

        <p className={styles.summary}>
          {totalWeeklyActivity.dementiaRisk}
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {' '}
            {summary?.cognitiveDecline}
          </span>
        </p>
        <hr className={styles.divider} />

        <p className={styles.summary}>
          {totalWeeklyActivity.agingTrajectory}
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {summary?.brainAgingActive}
          </span>
        </p>
      </div>
    </section>
  );
};

export default WeeklyWorkout;
