import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import Heading from '@components/Heading';

import { BasicStatsProps } from './BasicStats.types';

import styles from './BasicStats.module.scss';

const BasicStats: FC<BasicStatsProps> = ({ data, title, locale }) => {
  return (
    <div
      className={cn(styles.basicStats, {
        [styles.basicStatsRu]: locale === 'ru',
      })}
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
          <div key={index} className={styles.statItem}>
            <Image
              width={23}
              height={20}
              src={stat.icon}
              alt={stat.label}
              className={styles.icon}
            />

            <span className={styles.statValue}>
              {stat.label}: {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BasicStats;
