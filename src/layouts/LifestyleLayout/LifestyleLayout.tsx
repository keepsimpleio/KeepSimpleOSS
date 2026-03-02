import { FC } from 'react';

import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

import { LifestyleLayoutProps } from './LifestyleLayout.types';

import styles from './LifestyleLayout.module.scss';

const LifestyleLayout: FC<LifestyleLayoutProps> = ({ data, locale }) => {
  const imgPath = '/keepsimple_/assets/longevity/habits/';

  return (
    <>
      <section className={styles.content}>
        <MainInfoSection
          title={data?.title}
          description={data?.description}
          basicStats={data?.basicStats}
          locale={locale}
          japaneseText={data?.['japanese title']}
          backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data?.['background image']?.data?.attributes.url}`}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.routine?.title || ''}
          description={data?.routine?.description || ''}
          headlineBackgroundImageUrl={`${imgPath}routine.png`}
          whatDamages={data?.routine?.['damage type']}
          damageTypeHeadline={data?.routine?.['damage type headline']}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['daily movement']?.title}
          description={data?.['daily movement']?.description}
          headlineBackgroundImageUrl={`${imgPath}daily-movement.png`}
          whatDamages={data?.['daily movement']?.['damage type']}
          damageTypeHeadline={
            data?.['daily movement']?.['damage type headline']
          }
        />
        <LongevitySubSection
          locale={locale}
          title={data?.breathing?.title}
          description={data?.breathing?.description}
          headlineBackgroundImageUrl={`${imgPath}daily-movement.png`}
          damageTypeHeadline={data?.breathing?.['damage type headline']}
          whatDamages={data?.breathing?.['damage type']}
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['substance junk']?.title}
          description={data?.['substance junk']?.description}
          headlineBackgroundImageUrl={`${imgPath}substance-junk.png`}
          whatDamages={data?.['substance junk']?.['damage type']}
          damageTypeHeadline={
            data?.['substance junk']?.['damage type headline']
          }
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['informational junk']?.title}
          description={data?.['informational junk']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
          whatDamages={data?.['informational junk']?.['damage type']}
          damageTypeHeadline={
            data?.['informational junk']?.['damage type headline']
          }
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['cold environment']?.title}
          description={data?.['cold environment']?.description}
          headlineBackgroundImageUrl={`${imgPath}cold-environment.png`}
          whatDamages={data?.['cold environment']?.['damage type']}
          damageTypeHeadline={
            data?.['cold environment']?.['damage type headline']
          }
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['mental load management']?.title}
          description={data?.['mental load management']?.description}
          headlineBackgroundImageUrl={`${imgPath}mental-load.png`}
          whatDamages={data?.['mental load management']?.['damage type']}
          damageTypeHeadline={
            data?.['mental load management']?.['damage type headline']
          }
        />{' '}
        <LongevitySubSection
          locale={locale}
          title={data?.['weekend protocol']?.title}
          description={data?.['weekend protocol']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
          whatDamages={data?.['weekend protocol']?.['damage type']}
          damageTypeHeadline={
            data?.['weekend protocol']?.['damage type headline']
          }
        />
        <LongevitySubSection
          locale={locale}
          title={data?.['weekly Lan Party']?.title}
          description={data?.['weekly Lan Party']?.description}
          headlineBackgroundImageUrl={`${imgPath}informational-junk.png`}
          whatDamages={data?.['weekly Lan Party']?.['damage type']}
          damageTypeHeadline={
            data?.['weekly Lan Party']?.['damage type headline']
          }
        />
      </section>
    </>
  );
};

export default LifestyleLayout;
