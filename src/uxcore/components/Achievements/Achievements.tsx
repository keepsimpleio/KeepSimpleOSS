import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';

import { TRouter } from '@uxcore/local-types/global';
import { AchievementsTypes } from '@uxcore/local-types/uxcat-types/types';

import { sortAchievements } from '@uxcore/lib/uxcat-helpers';

import uxcatData from '@uxcore/data/uxcat';

import Achievement from '@uxcore/components/Achievement';
import UnlockMeter from '@uxcore/components/UnlockMeter';

import styles from './Achievements.module.scss';

type AchievementsProps = {
  pageName?: string;
  pageIcon?: JSX.Element;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  headerColor?: string;
  generalAchievements?: AchievementsTypes[];
  specialAchievements?: AchievementsTypes[];
  receivedAchievementPercentage?: number;
  isLoading?: boolean;
  hiddenAchievement?: string;
  isUXCoreAchievements?: boolean;
};

const Achievements: FC<AchievementsProps> = ({
  pageIcon,
  pageName = 'UXCore',
  dragHandleProps,
  headerColor,
  generalAchievements,
  receivedAchievementPercentage,
  isLoading,
  specialAchievements,
  hiddenAchievement,
  isUXCoreAchievements,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { hiddenTooltip, general, special } = uxcatData[locale];

  return (
    generalAchievements?.length > 0 && (
      <div className={styles.achievements}>
        <div
          className={styles.header}
          {...dragHandleProps}
          style={{ background: headerColor }}
        >
          <div className={styles.pageTitleWrapper}>
            {pageIcon}
            <h4 className={styles.pageTitle}> {pageName}</h4>
          </div>
          <div className={styles.meterAndDragWrapper}>
            <UnlockMeter
              value={
                receivedAchievementPercentage
                  ? receivedAchievementPercentage
                  : 0
              }
            />
            {/*<Image*/}
            {/*  src={'/assets/uxcat/drag.png'}*/}
            {/*  width={18}*/}
            {/*  height={18}*/}
            {/*  className={styles.dragIcon}*/}
            {/*/>*/}
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.achievementContainer}>
            <h5 className={styles.achievementType}>{general} </h5>
            <div
              className={cn(styles.list, {
                [styles.generalList]: isUXCoreAchievements,
              })}
            >
              {isLoading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div className={styles.skeletonWrapper} key={index}>
                      <Skeleton width={100} height={100} circle />
                      <Skeleton width={100} height={20} />
                    </div>
                  ))
                : sortAchievements(generalAchievements).map(
                    (achievement: any, index: number) => (
                      <Achievement
                        slug={achievement?.slug}
                        parentId={achievement?.id}
                        showTitle
                        className={styles['achievement']}
                        tooltipId={
                          isUXCoreAchievements
                            ? `uxcore-general-achievement-${achievement.slug}`
                            : `keepsimple-general-achievement-${achievement.slug}`
                        }
                        locked={!achievement?.unlockedAt}
                        key={achievement?.id}
                        description={
                          !achievement?.unlockedAt && achievement?.hidden
                            ? hiddenTooltip
                            : achievement?.description
                        }
                        title={
                          !achievement?.unlockedAt && achievement?.hidden
                            ? hiddenAchievement
                            : achievement?.name
                        }
                        icon={
                          !achievement?.unlockedAt && achievement?.hidden
                            ? achievement.hidden_icon?.url
                            : achievement?.icon?.url
                        }
                        unlocked={!!achievement.unlockedAt}
                        unlockedStatus={achievement.unlockedAt}
                        statistics={achievement.percentage}
                      />
                    ),
                  )}
            </div>
          </div>
          <div className={styles.list}>
            {!!specialAchievements && (
              <div className={styles.achievementContainer}>
                <h5 className={styles.achievementType}>{special} </h5>
                <div className={styles.specialList}>
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <div className={styles.skeletonWrapper} key={index}>
                          <Skeleton width={100} height={100} circle />
                          <Skeleton width={100} height={20} />
                        </div>
                      ))
                    : !!specialAchievements &&
                      sortAchievements(specialAchievements).map(
                        (achievement: any, index: number) => (
                          <Achievement
                            slug={achievement.slug}
                            className={styles['achievement']}
                            showTitle
                            locked={!achievement.unlockedAt}
                            tooltipId={`special-achievement-${achievement.slug}`}
                            key={achievement.id}
                            description={
                              !achievement.unlockedAt && achievement?.hidden
                                ? hiddenTooltip
                                : achievement?.description
                            }
                            title={
                              !achievement.unlockedAt && achievement?.hidden
                                ? hiddenAchievement
                                : achievement?.name
                            }
                            icon={
                              !achievement.unlockedAt && achievement?.hidden
                                ? achievement?.hidden_icon?.url
                                : achievement?.icon?.url
                            }
                            unlocked={!!achievement.unlockedAt}
                            statistics={achievement.percentage}
                            unlockedStatus={achievement.unlockedAt}
                          />
                        ),
                      )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Achievements;
