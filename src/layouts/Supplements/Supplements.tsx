import { SupplementsProps } from '@layouts/Supplements/Supplements.types';
import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

const SupplementsLayout: FC<SupplementsProps> = ({ locale, data }) => {
  console.log(data, 'sup');
  return (
    <>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Foundational'}
        description={data.foundational}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/foundational.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Longevity and Cellular Health'}
        description={data['longevity and cellular health']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/longevity.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Performance and Recovery'}
        description={data['performance and recovery']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/performance.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Situational'}
        description={data['situational']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/situational.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Hacks'}
        description={data.hacks}
        isHacks
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/hacks.png'
        }
      />
    </>
  );
};

export default SupplementsLayout;
