import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import Slider from 'react-slick';

import ProgressBar from '@components/longevity/ProgressBar/ProgressBar';
import Heading from '@components/Heading';

import { ACTIVITY_LEVEL_SUMMARY, STOPS } from '@constants/longevity';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './WeeklyWorkout.module.scss';

const WeeklyWorkout: FC = () => {
  const slider = useRef<Slider | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMinutes] = useMemo(() => {
    const minutes = STOPS[selectedIndex];
    const perc = (selectedIndex / (STOPS.length - 1)) * 100;
    return [minutes, perc];
  }, [selectedIndex]);

  type Minutes = (typeof ACTIVITY_LEVEL_SUMMARY)[number]['minutes'];
  function useActivitySummary(selectedMinutes: Minutes) {
    return useMemo(() => {
      return (
        ACTIVITY_LEVEL_SUMMARY.find(r => r.minutes === selectedMinutes) ??
        ACTIVITY_LEVEL_SUMMARY[0]
      );
    }, [selectedMinutes]);
  }
  const summary = useActivitySummary(selectedMinutes);

  // TODO
  // The 'images' array makes the dependencies of useMemo Hook (at line 115) change on every render.
  // To fix this, wrap the initialization of 'images' in its own useMemo() Hook. (react-hooks/exhaustive-deps)
  const images = [
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
  ];

  const slideIndexBySelectedId = useMemo(() => {
    const idx = images.findIndex(img => img.id === selectedIndex);
    return idx === -1 ? 0 : idx;
  }, [images, selectedIndex]);

  useEffect(() => {
    slider.current?.slickGoTo(slideIndexBySelectedId);
  }, [slideIndexBySelectedId]);

  return (
    <section className={styles.weeklyWorkout}>
      <div className={styles.header}>
        <Heading
          text={'Total weekly activity'}
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
          {selectedMinutes} min
        </span>
      </div>
      <hr className={styles.divider} />
      <ProgressBar
        stops={STOPS}
        setStopIndex={setSelectedIndex}
        stopIndex={selectedIndex}
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
          Risk of Dying Early{' '}
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {summary.riskOfDyingEarly}
          </span>
        </p>
        <hr className={styles.divider} />

        <p className={styles.summary}>
          Estimated ↓ Cognitive Decline / Dementia Risk
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {' '}
            {summary.cognitiveDecline}
          </span>
        </p>
        <hr className={styles.divider} />

        <p className={styles.summary}>
          Brain Aging Trajectory
          <span
            className={cn({
              [styles.orangeRisk]: selectedMinutes === 150,
              [styles.greenRisk]:
                selectedMinutes === 225 || selectedMinutes === 300,
            })}
          >
            {summary.brainAgingActive}
          </span>
        </p>
      </div>
    </section>
  );
};

export default WeeklyWorkout;
