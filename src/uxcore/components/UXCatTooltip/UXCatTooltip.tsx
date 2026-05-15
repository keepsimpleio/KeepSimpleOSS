import uxcatData from '@uxcore/data/uxcat';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';

import styles from './UXCatTooltip.module.scss';

type UXCatTooltipProps = {
  statistics?: number;
  unlocked?: boolean;
  title: string;
  description: string;
  className?: string;
  badge?: string;
  unlockedStatus?: string;
  parentClassName?: string;
  milestoneLevel?: boolean;
  pointsToNextLevel?: string;
  isLevelTooltip?: boolean;
};
const UXCatTooltip: FC<UXCatTooltipProps> = ({
  unlocked,
  title = 'I made it work',
  description,
  statistics,
  badge,
  unlockedStatus,
  className,
  parentClassName,
  milestoneLevel,
  pointsToNextLevel,
  isLevelTooltip,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { locked, unlockedTxt, usersHaveThis } = uxcatData[locale];

  const unlockedState = !!unlockedStatus
    ? `${unlockedTxt} ${unlockedStatus}`
    : locked;

  return (
    <div
      className={cn(styles.tooltip, parentClassName, {
        [styles.milestoneLevel]: milestoneLevel,
      })}
    >
      <div className={cn(styles.achievementInfo, className)}>
        <div className={styles.imgWrapper}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI}${badge}`}
            width={100}
            height={100}
            alt={title}
          />
        </div>
        <div className={styles.infoContainer}>
          <div
            className={cn(styles.top, {
              [styles.unlocked]: unlocked,
            })}
          >
            <div className={styles.txtWrapper}>
              <span className={styles.title}> {title} </span>
              <span className={styles.unlockedTxt}>{`(${unlockedState})`}</span>
            </div>
            <span className={styles.pointsToNextLevel}>
              {!unlocked && pointsToNextLevel}
            </span>
          </div>
          <p
            className={cn(styles.description, {
              [styles.withoutStatistics]: Number(statistics) === 0.0,
            })}
          >
            {description}
          </p>
          {!isLevelTooltip && Number(statistics) !== 0.0 && (
            <span className={styles.statisticsTxt}>
              {`${statistics}${usersHaveThis}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default UXCatTooltip;
