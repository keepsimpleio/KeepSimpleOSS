import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';

import toolsData from '@data/tools';

import BobMedal from '@icons/tools/bob-medal.svg';
import Star from '@icons/tools/star.svg';
import StarDark from '@icons/tools/star-dark.svg';

import { BobAchievementsProps } from './BobAchievements.types';

import styles from './BobAchievements.module.scss';

const BobAchievements: FC<BobAchievementsProps> = ({
  className,
  darkTheme,
}) => {
  const { locale } = useRouter();
  const t = toolsData[locale as keyof typeof toolsData] ?? toolsData.en;

  return (
    <div
      className={cn(styles.root, className, { [styles.darkTheme]: darkTheme })}
    >
      <span className={styles.title}>
        <BobMedal aria-hidden /> {t.firstBehaviorAgent}
      </span>
      <div className={styles.achievements}>
        <div className={styles.rating}>
          <span className={styles.value}>
            {' '}
            {darkTheme ? <StarDark aria-hidden /> : <Star aria-hidden />} 4.7
          </span>
          <span className={styles.category}>{t.ratings} (40+) </span>
        </div>
        <div className={styles.productivity}>
          <span className={styles.value}> {t.productivity}</span>
          <span className={styles.category}>{t.category} </span>
        </div>
        <div className={styles.conversations}>
          <span className={styles.value}> 3900+</span>
          <span className={styles.category}>{t.conversations} </span>
        </div>
      </div>
    </div>
  );
};

export default BobAchievements;
