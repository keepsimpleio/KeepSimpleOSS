import Achievement from '@uxcore/components/Achievement';
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import styles from './TestResultsAchievements.module.scss';

interface TestResultsAchievementsProps {
  unlockedAchievements: any;
  loading: boolean;
  achievementUnlocked: string;
}

const TestResultsAchievements: FC<TestResultsAchievementsProps> = ({
  unlockedAchievements,
  achievementUnlocked,
  loading,
}) => {
  return (
    <>
      {unlockedAchievements?.length > 0 && (
        <div className={styles.achievements}>
          <span className={styles.emoji}>🏆</span>
          <h3 className={styles.achievementTitle}> {achievementUnlocked} </h3>
          <div className={styles.achievementsWrapper}>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div className={styles.skeletonWrapper} key={index}>
                    <Skeleton width={100} height={100} circle />
                    <Skeleton width={100} height={20} />
                  </div>
                ))
              : !!unlockedAchievements &&
                unlockedAchievements.map((achievement: any, index: number) => (
                  <Achievement
                    slug={achievement?.data?.slug}
                    showTitle
                    tooltipId={`achievement-${index}`}
                    locked={!achievement?.unlockedAt}
                    key={achievement?.data.id}
                    description={achievement?.data.description}
                    title={achievement?.data?.name}
                    icon={achievement?.data?.icon?.url}
                    unlocked={achievement?.unlockedAt}
                    unlockedStatus={achievement?.unlockedAt}
                    statistics={achievement?.percentage}
                  />
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TestResultsAchievements;
