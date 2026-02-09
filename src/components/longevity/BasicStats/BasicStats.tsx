import { FC } from 'react';
import Image from 'next/image';

import Heading from '@components/Heading';

import { BasicStatsProps } from './BasicStats.types';

import styles from './BasicStats.module.scss';

const BasicStats: FC<BasicStatsProps> = ({ data, title }) => {
  return (
    <div className={styles.basicStats}>
      <Heading
        text={title}
        Tag="h3"
        showLeftIcon={false}
        showRightIcon={false}
        isBold
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
