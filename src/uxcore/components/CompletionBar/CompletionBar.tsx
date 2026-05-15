import UXCatPageTitle from '@uxcore/components/UXCatPageTitle';
import UXCatTooltip from '@uxcore/components/UXCatTooltip';
import useMobile from '@uxcore/hooks/useMobile';
import {
  findLevelDetail,
  formatDate,
  getPointsToNextLevel,
} from '@uxcore/lib/uxcat-helpers';
import { TRouter } from '@uxcore/local-types/global';
import { uxCatLevels } from '@uxcore/local-types/uxcat-types/types';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import styles from './CompletionBar.module.scss';

type CompletionBarProps = {
  points: number;
  userLevel?: number;
  testPoints?: number;
  isTestResultPage?: boolean;
  hideMainTitle?: boolean;
  withBorders?: boolean;
  showTotal?: boolean;
  titleBigFont?: boolean;
  lvlProgressionTxt?: string;
  yourPointsTxt?: string;
  isMilestoneReached?: boolean;
  levelsDetails?: any;
  userLevels?: any;
  uxCatLevels?: uxCatLevels[];
  codeIsActivated?: boolean;
  isUserProfile?: boolean;
  passedLevels?: number[];
  levelUpTxt?: string;
};

const CompletionBar: FC<CompletionBarProps> = ({
  points,
  hideMainTitle,
  withBorders,
  lvlProgressionTxt,
  showTotal,
  yourPointsTxt,
  titleBigFont,
  isMilestoneReached,
  levelsDetails,
  userLevel,
  testPoints,
  isTestResultPage,
  userLevels,
  uxCatLevels,
  codeIsActivated,
  isUserProfile,
  passedLevels,
  levelUpTxt,
}) => {
  const { isMobile } = useMobile()[1];
  const router = useRouter();
  const { locale } = router as TRouter;
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [leaveTimeoutId, setLeaveTimeoutId] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [initialFillPercentage, setInitialFillPercentage] = useState(0);
  const [fillAnimation, setFillAnimation] = useState(false);

  const levelDetails = levelsDetails?.data || [];
  const transition = 'width 1s ease';

  const matchingLevelDetails = level => {
    return findLevelDetail(level, levelDetails);
  };

  const firstLevels = [10, 70, 150, 220, 320, 450, 600, 750, 900, 1000];
  const milestoneLevels = [1000, 1200, 1500, 2000, 2500];

  const isLevelPassed = levelNumber => {
    return passedLevels && passedLevels.includes(levelNumber);
  };

  const levels = isMilestoneReached ? milestoneLevels : firstLevels;

  let currentLevel = levels.length - 1;

  for (let i = 0; i < levels.length; i++) {
    if (points < levels[i]) {
      currentLevel = i - 1;
      break;
    }
  }

  if (currentLevel === -1) currentLevel = 0;

  const handleMouseEnter = (index: number) => {
    if (leaveTimeoutId) {
      clearTimeout(leaveTimeoutId);
    }
    setHoveredLevel(index);
  };

  const handleMouseLeave = () => {
    const delay = points === 0 ? 500 : 20;
    const timeoutId = setTimeout(() => {
      setHoveredLevel(null);
    }, delay);

    setLeaveTimeoutId(timeoutId);
  };

  const getFillPercentage = (points: number) => {
    if (points === 0) {
      return 0;
    }

    const mobileFirstLevels = [10, 150, 450, 1000];
    const mobileMilestoneLevels = [1000, 1500, 2500];

    const mobileLevels = isMilestoneReached
      ? mobileMilestoneLevels
      : mobileFirstLevels;

    const allTypeLevels = isMobile ? mobileLevels : levels;

    for (let i = 0; i < allTypeLevels.length - 1; i++) {
      if (points >= allTypeLevels[i] && points <= allTypeLevels[i + 1]) {
        const levelRange = allTypeLevels[i + 1] - allTypeLevels[i];
        const pointWithinRange = points - allTypeLevels[i];
        const levelFill = (i / (allTypeLevels.length - 1)) * 100;
        const pointFill =
          (pointWithinRange / levelRange) * (100 / (allTypeLevels.length - 1));
        return levelFill + pointFill;
      }
    }

    return isMilestoneReached ? 0 : 100;
  };

  const milestoneTitles = ['I', 'II', 'III', 'IV', 'V'];

  const mileStoneTitle = index => {
    return milestoneTitles[index] || '';
  };

  const basePoints = points > 0 ? testPoints : points - testPoints;
  const baseFillPercentage = getFillPercentage(basePoints);
  const finalFillPercentage = getFillPercentage(points ?? testPoints);

  useEffect(() => {
    if (points >= 0 ?? testPoints > 0) {
      setInitialFillPercentage(
        isTestResultPage ? baseFillPercentage : finalFillPercentage,
      );
      const animationTimeout = setTimeout(() => {
        setInitialFillPercentage(finalFillPercentage);
        setFillAnimation(!!isTestResultPage);
      }, 1000);

      return () => {
        clearTimeout(animationTimeout);
      };
    }
  }, [baseFillPercentage, finalFillPercentage]);

  useEffect(() => {
    if (codeIsActivated) {
      setFillAnimation(true);
    } else {
      setFillAnimation(false);
    }
  }, [testPoints, codeIsActivated]);

  const fillPercentage =
    points === 0 && hoveredLevel !== null
      ? getFillPercentage(levels[hoveredLevel])
      : initialFillPercentage;

  const barPercentage = points >= 2500 ? 100 : fillPercentage;

  return (
    <>
      {!hideMainTitle && (
        <UXCatPageTitle title={lvlProgressionTxt} bigFont={titleBigFont} />
      )}
      <div
        className={cn(styles.completionBar, {
          [styles.withBorders]: withBorders,
          [styles.withShadow]: isUserProfile,
        })}
      >
        <h4
          className={cn(styles.points, {
            [styles.disabled]: points === 0,
            [styles.totalPoints]: showTotal,
            [styles.milestoneTotalPoints]: isMilestoneReached,
          })}
        >
          {yourPointsTxt ? `${yourPointsTxt} #${points}` : ''}
        </h4>
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBar}>
            {levels.map((level, index) => {
              const currentIndex = index + 1;
              const milestoneIndex = index + 11;
              const matchedDetails = matchingLevelDetails(
                isMilestoneReached ? milestoneIndex : currentIndex,
              );

              const description = matchedDetails?.attributes.description;
              const title = matchedDetails?.attributes?.lavelName;
              const badge =
                matchedDetails?.attributes?.badge.data.attributes.url;

              return (
                <div
                  key={index}
                  className={cn(styles[`pointWrapper-${index + 1}`], {
                    [styles[`milestoneWrapper-${index + 1}`]]:
                      isMilestoneReached,
                  })}
                >
                  <div
                    className={cn(
                      styles.wrapper,
                      styles[`point-${index + 1}`],
                      {
                        [styles.finalLevelWrapper]: index === levels.length - 1,
                        [styles.milestoneMobile]:
                          isMilestoneReached && index === 4,
                      },
                    )}
                    onMouseOver={() =>
                      !isMobile ? handleMouseEnter(index) : null
                    }
                    onMouseOut={!isMobile ? handleMouseLeave : null}
                    data-tooltip-id={title + '1'}
                  >
                    <span
                      className={cn(styles.levelTxt, {
                        [styles.milestoneLevelTxt]: isMilestoneReached,
                        [styles.completedTxt]:
                          points > 0 && index <= currentLevel,
                        [styles.completedMilestonTxt]:
                          isMilestoneReached &&
                          points > 0 &&
                          index <= currentLevel,
                        [styles.finalLevelTxt]: index === levels.length - 1,
                        [styles.hoveredTxtOnGuestMode]:
                          points === 0 &&
                          hoveredLevel > 0 &&
                          hoveredLevel + 1 > index,
                      })}
                    >
                      {level ? level : 0}
                    </span>
                    <div
                      className={cn(styles.step, {
                        [styles.completed]: points > 0 && index <= currentLevel,
                        [styles.completedMilestone]:
                          isMilestoneReached &&
                          points > 0 &&
                          index <= currentLevel,
                        [styles.hoveredLvl]:
                          !isMobile &&
                          points === 0 &&
                          hoveredLevel > 0 &&
                          hoveredLevel + 1 > index,
                        [styles.singleHoveredLvl]:
                          !isMobile &&
                          hoveredLevel !== 9 &&
                          points > 0 &&
                          hoveredLevel === index,
                        [styles.singleMilstoneHoveredLvl]:
                          !isMobile &&
                          isMilestoneReached &&
                          hoveredLevel !== 9 &&
                          points > 0 &&
                          hoveredLevel === index,
                        [styles.milestoneStep]: isMilestoneReached,
                      })}
                    >
                      <span
                        className={cn(styles.levelNumber, {
                          [styles.lvlTen]:
                            !isMilestoneReached && index === levels.length - 1,
                        })}
                      >
                        {isMilestoneReached ? mileStoneTitle(index) : index + 1}
                      </span>
                    </div>
                    {isLevelPassed(
                      isMilestoneReached ? milestoneIndex : currentIndex,
                    ) && (
                      <div className={styles.passedLevelWrapper}>
                        <div
                          className={cn(styles.passedLevel, {
                            [styles.passedLevelRu]: locale === 'ru',
                            [styles.passedLevelMilestone]: isMilestoneReached,
                            [styles.passedLevelMilestoneRu]:
                              isMilestoneReached && locale === 'ru',
                          })}
                        >
                          <span className={styles.levelUp}> {levelUpTxt}</span>
                          <Image
                            src={
                              !isMilestoneReached
                                ? '/assets/uxcat/up.svg'
                                : '/assets/uxcat/up-m.svg'
                            }
                            width={7}
                            height={12}
                            className={styles.img}
                            alt={'up icon'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {!!badge && (
                    <ReactTooltip
                      id={title + '1'}
                      place="bottom"
                      className={styles.tooltipContainer}
                      opacity={1}
                    >
                      <UXCatTooltip
                        isLevelTooltip
                        pointsToNextLevel={getPointsToNextLevel(
                          uxCatLevels,
                          userLevel,
                          points,
                          index,
                        )}
                        title={title}
                        description={description}
                        badge={badge}
                        className={styles.tooltip}
                        milestoneLevel={index === levels.length - 1}
                        unlocked={!!userLevels?.[index]?.unlockedAt}
                        unlockedStatus={
                          !!userLevels &&
                          formatDate(userLevels?.[index]?.unlockedAt)
                        }
                      />
                    </ReactTooltip>
                  )}
                </div>
              );
            })}
            <div className={styles.bar}>
              <div
                className={cn(styles.progress, {
                  [styles.smoothTransition]: points === 0,
                  [styles.milestoneLine]: isMilestoneReached,
                })}
                style={{
                  width: `${isTestResultPage && points === 0 ? 0 : barPercentage}%`,
                  transition: transition,
                }}
              >
                {fillAnimation && (
                  <div
                    className={cn(styles.shinyIndicator, {
                      [styles.milestoneShinyIndicator]: isMilestoneReached,
                    })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompletionBar;
