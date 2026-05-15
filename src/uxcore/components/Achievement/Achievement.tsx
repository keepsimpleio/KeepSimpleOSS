import AchievementModal from '@uxcore/components/AchievementModal';
import AnimatedText from '@uxcore/components/AnimatedText';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import type { AchievementProps } from './Achievement.types';

import styles from './Achievement.module.scss';

const UXCatTooltip = dynamic(() => import('@uxcore/components/UXCatTooltip'), {
  ssr: false,
});

const Achievement: FC<AchievementProps> = ({
  statistics,
  unlocked = true,
  showTitle = true,
  title,
  description,
  unlockedStatus,
  icon,
  locked,
  loading,
  tooltipId,
  activatedDuration,
  codeIsActivated,
  flipDelay,
  randomDelay,
  animated,
  slug,
  delay,
  className,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const openModalHandler = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      setOpenModal(prevState => !prevState);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (openModal && window.innerWidth > 900) {
          setOpenModal(false);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [openModal]);

  return (
    <>
      <div
        className={cn(styles.achievement, className, {
          [styles.locked]: locked && !codeIsActivated,
          [styles.flippingAchievement]: codeIsActivated,
        })}
        onClick={openModalHandler}
      >
        <div data-tooltip-id={tooltipId}>
          <div
            className={cn(styles.achievementName, {
              [styles.unlockedAchievement]: !!animated && unlocked,
            })}
            style={{
              // @ts-ignore
              '--random-delay': `${unlocked && randomDelay}s`,
            }}
          >
            {loading ? (
              <Skeleton width={100} height={100} circle count={2} />
            ) : !codeIsActivated ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI}${icon}`}
                width={100}
                height={100}
                alt={title}
                className={styles.img}
              />
            ) : (
              <div className={styles.flipping}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI}${icon}`}
                  width={100}
                  height={100}
                  alt={title}
                  className={cn(styles.img, styles.front, {
                    [styles.flipFront]: activatedDuration >= 1 + flipDelay,
                    [styles.flipReset]: activatedDuration === 12,
                  })}
                />
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI}${icon}`}
                  width={100}
                  height={100}
                  alt={title}
                  className={cn(styles.img, styles.back, {
                    [styles.flipBack]: activatedDuration >= 1 + flipDelay,
                    [styles.flipBackReset]: activatedDuration === 12,
                  })}
                />
              </div>
            )}
            {showTitle &&
              (!codeIsActivated ? (
                <span className={styles.title}> {title} </span>
              ) : (
                activatedDuration >= 1 + flipDelay && (
                  <AnimatedText
                    text={title}
                    delay={delay}
                    codeIsActivated={codeIsActivated}
                  />
                )
              ))}
          </div>
        </div>
        {!!icon && (
          <ReactTooltip
            id={tooltipId}
            place="bottom"
            className={styles.tooltipContainer}
            opacity={1}
          >
            <UXCatTooltip
              description={description}
              parentClassName={styles['tooltipContainer']}
              title={title}
              statistics={slug === 'EARLY' ? 0 : statistics}
              unlocked={!!unlocked}
              unlockedStatus={unlockedStatus}
              badge={icon}
            />
          </ReactTooltip>
        )}
      </div>
      {openModal && (
        <AchievementModal
          icon={icon}
          title={title}
          unlockedStatus={unlockedStatus}
          description={description}
          userStatistic={slug === 'EARLY' ? 0 : statistics}
          closeHandler={openModalHandler}
          lockedAchievement={locked}
        />
      )}
    </>
  );
};

export default Achievement;
