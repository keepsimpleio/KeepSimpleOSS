import { HabitsLayoutProps } from '@layouts/HabitsLayout/HabitsLayout.types';
import { FC } from 'react';
import styles from '@layouts/LongevityLayouts/WhatIsThisLayout.module.scss';
import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

const HabitsLayout: FC<HabitsLayoutProps> = ({ data, locale }) => {
  const imgPath = '/keepsimple_/assets/longevity/habits/';

  return (
    <>
      <section className={styles.content}>
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
          title={data?.routine?.title || ''}
          description={data?.routine?.description || ''}
          headlineBackgroundImageUrl={`${imgPath}routine.png`}
          whatDamages={data?.routine?.['what damages']}
          howDamages={data?.routine?.['how damages']}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['daily movement']?.title}
          description={data?.['daily movement']?.description}
          headlineBackgroundImageUrl={`${imgPath}daily-movement.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.breathing?.title}
          description={data?.breathing?.description}
          headlineBackgroundImageUrl={`${imgPath}daily-movement.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['substance junk']?.title}
          description={data?.['substance junk']?.description}
          headlineBackgroundImageUrl={`${imgPath}substance-junk.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data['informational junk']?.title}
          description={data['informational junk']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data['cold environment']?.title}
          description={data['cold environment']?.description}
          headlineBackgroundImageUrl={`${imgPath}cold-environment.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data['mental load management']?.title}
          description={data['mental load management']?.description}
          headlineBackgroundImageUrl={`${imgPath}mental-load.png`}
        />{' '}
        <LongevitySubSection
          locale={locale}
          title={data['weekend protocol']?.title}
          description={data['weekend protocol']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
        />
        <LongevitySubSection
          locale={locale}
          title={data['weekly Lan Party']?.title}
          description={data['weekly Lan Party']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
        />
      </section>
    </>
  );
};

export default HabitsLayout;
