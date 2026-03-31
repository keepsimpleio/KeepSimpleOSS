import cn from 'classnames';
import { FC } from 'react';

import BobMedal from '@icons/tools/bob-medal.svg';
import Star from '@icons/tools/star.svg';
import StarDark from '@icons/tools/star-dark.svg';

import { BobAchievementsProps } from './BobAchievements.types';

import styles from './BobAchievements.module.scss';

const BobAchievements: FC<BobAchievementsProps> = ({
  className,
  darkTheme,
}) => {
  return (
    <div
      className={cn(styles.root, className, { [styles.darkTheme]: darkTheme })}
    >
      <span className={styles.title}>
        <BobMedal aria-hidden /> First Behavior + UX Agent on OpenAI
      </span>
      <div className={styles.achievements}>
        <div className={styles.rating}>
          <span className={styles.value}>
            {' '}
            {darkTheme ? <StarDark aria-hidden /> : <Star aria-hidden />} 4.7
          </span>
          <span className={styles.category}>Ratings (40+) </span>
        </div>
        <div className={styles.productivity}>
          <span className={styles.value}> Productivity</span>
          <span className={styles.category}>Category </span>
        </div>
        <div className={styles.conversations}>
          <span className={styles.value}> 3906</span>
          <span className={styles.category}>Conversations </span>
        </div>
      </div>
    </div>
  );
};

export default BobAchievements;
