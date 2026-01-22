import { FC } from 'react';
import Image from 'next/image';

import MainInfoSection from '@components/longevity/MainInfoSection';

import { ResultsLayoutProps } from '@layouts/ResultsLayout/ResultsLayout.types';

import styles from './ResultsLayout.module.scss';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

const ResultsLayout: FC<ResultsLayoutProps> = ({ data, locale }) => {
  const imgPath = '/keepsimple_/assets/longevity/results/';

  return (
    <div className={styles.smg}>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['background image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        title={data['biological marker highlights (blood-based)'].headline}
        description={data['biological marker highlights (blood-based)'].content}
        headlineBackgroundImageUrl={`${imgPath}biological-marker.png`}
        date={'December 2025'}
      />
      <LongevitySubSection
        locale={locale}
        title={data['body composition'].headline}
        description={data['body composition'].content}
        headlineBackgroundImageUrl={`${imgPath}body-composition.png`}
        date={'December 2025'}
      />
      <LongevitySubSection
        locale={locale}
        title={data['physiological function (wearables)'].headline}
        description={data['physiological function (wearables)'].content}
        headlineBackgroundImageUrl={`${imgPath}wearables.png`}
        date={'December 2025'}
      />
      <LongevitySubSection
        locale={locale}
        title={data['training summary'].headline}
        description={data['training summary'].content}
        headlineBackgroundImageUrl={`${imgPath}summary.png`}
        date={'December 2025'}
      />
      <div className={styles.ps}>
        <Image
          src={`${imgPath}ps.png`}
          alt={'PS Quote'}
          width={948}
          height={104}
          className={styles.backgroundImg}
        />
        <p>{data['PS Quote']}</p>
      </div>
    </div>
  );
};

export default ResultsLayout;
