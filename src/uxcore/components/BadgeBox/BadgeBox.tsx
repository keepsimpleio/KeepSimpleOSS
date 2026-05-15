import Starfall from '@uxcore/components/Starfall';
import Image from 'next/image';
import { FC } from 'react';

import styles from './BadgeBox.module.scss';

type BadgeBoxProps = {
  imgSrc?: string;
  title: string;
  badgeName: string;
  receivedAchievement?: any;
};

const BadgeBox: FC<BadgeBoxProps> = ({
  imgSrc = '/assets/img.png',
  title,
  badgeName,
}) => {
  return (
    <div className={styles.badgeContainer}>
      <Starfall />
      <>
        <Image
          src={'/assets/star-glow.png'}
          width={40}
          height={40}
          className={styles.starOnImg}
          alt={'star'}
          unoptimized
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI}${imgSrc}`}
          width={180}
          height={180}
          alt={title}
          className={styles.badgeImg}
          unoptimized
        />
      </>
      <div className={styles.wrapper}>
        <div className={styles.holder}>
          <div className={styles.left}></div>
          <div className={styles.top}></div>
          <div className={styles.right}></div>
          <div className={styles.bottom}></div>
        </div>
        <Image
          src={'/assets/star-glow.png'}
          width={40}
          height={40}
          className={styles.star}
          alt={'star'}
          unoptimized
        />
        <div className={styles.textContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.badgeName}>{badgeName}</span>
        </div>
      </div>
    </div>
  );
};

export default BadgeBox;
