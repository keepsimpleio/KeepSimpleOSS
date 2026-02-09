import { FC } from 'react';
import Image from 'next/image';

import { ResultsLayoutProps } from '@layouts/ResultsLayout/ResultsLayout.types';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

import MainInfoSection from '@components/longevity/MainInfoSection';

import styles from './ResultsLayout.module.scss';

const ResultsLayout: FC<ResultsLayoutProps> = ({ data, locale }) => {
  // TODO: move to constants
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
        title={data['biological marker highlights (blood-based)']?.headline}
        description={
          data['biological marker highlights (blood-based)']?.content
        }
        headlineBackgroundImageUrl={`${imgPath}biological-marker.png`}
        date={data['biological marker highlights (blood-based)']?.date}
      />
      <LongevitySubSection
        locale={locale}
        title={data['body composition']?.headline}
        description={data['body composition']?.content}
        headlineBackgroundImageUrl={`${imgPath}body-composition.png`}
        date={data['body composition']?.date}
      />
      <LongevitySubSection
        locale={locale}
        title={data['physiological function (wearables)']?.headline}
        description={data['physiological function (wearables)']?.content}
        headlineBackgroundImageUrl={`${imgPath}wearables.png`}
        date={data['physiological function (wearables)']?.date}
      />
      <LongevitySubSection
        locale={locale}
        title={data['training summary']?.headline}
        description={data['training summary']?.content}
        headlineBackgroundImageUrl={`${imgPath}summary.png`}
        date={data['training summary']?.date}
      />
      <div className={styles.ps}>
        <Image
          src={`${imgPath}ps.png`}
          alt={'PS Quote'}
          width={948}
          height={104}
          className={styles.backgroundImg}
        />
        <div dangerouslySetInnerHTML={{ __html: data['PS Quote'] }} />
      </div>
    </div>
  );
};

export default ResultsLayout;
