import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import Heading from '@components/Heading';

import { BasicStatsProps } from './BasicStats.types';

import styles from './BasicStats.module.scss';

const BasicStats: FC<BasicStatsProps> = ({ data, title, locale }) => {
  return (
    <div
      className={cn(styles.basicStats, {
        [styles.basicStatsRu]: locale === 'ru',
      })}
      data-cy="basic-stats"
    >
      <Heading
        text={title}
        Tag="h3"
        showLeftIcon={false}
        showRightIcon={false}
        isBold
        className={styles.heading}
      />
      <div className={styles.statsList}>
        {data.map((stat, index) => (
          <div key={index} className={styles.statItem} data-cy="stat-item">
            <Image
              width={23}
              height={20}
              src={stat.icon}
              alt={stat.label}
              className={styles.icon}
            />

            <span className={styles.statValue} data-cy="stat-value">
              {stat.label}: {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BasicStats;
