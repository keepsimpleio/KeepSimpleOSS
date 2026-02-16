import React, { FC } from 'react';
import Image from 'next/image';

import Heading from '@components/Heading';

import { AboutTheProductProps } from './AboutTheProduct.types';

import styles from './AboutTheProduct.module.scss';

const AboutTheProduct: FC<AboutTheProductProps> = ({ title, content }) => {
  return (
    <div className={styles.aboutProduct}>
      <Heading
        className={styles.tooltipHeading}
        text={title}
        Tag={'h5'}
        showRightIcon={false}
        showLeftIcon={false}
      />
      <span className={styles.subText}> CONSUMPTION CONSEQUENCES </span>
      <Image
        src={'/keepsimple_/assets/longevity/diet/tooltip-line.png'}
        alt={'info'}
        width={459}
        height={2}
        className={styles.divider}
      />
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className={styles.content}
      />
    </div>
  );
};

export default AboutTheProduct;
