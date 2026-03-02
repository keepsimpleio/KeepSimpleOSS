import { FC } from 'react';

import { EnvironmentLayoutProps } from './EnvironmentLayout.types';

import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import EnvironmentSubSection from '@components/longevity/EnvironmentSubSection/EnvironmentSubSection';
import longevityData from '@data/longevity';

const EnvironmentLayout: FC<EnvironmentLayoutProps> = ({ locale, data }) => {
  // TODO: check image paths and move to constants
  const imgPath = '/keepsimple_/assets/longevity/sleep/';
  const strapiURl = process.env.NEXT_PUBLIC_STRAPI;
  const { environmentHeadlines } = longevityData[locale];
  return (
    <>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data?.['japanese title'] ? data?.['japanese title'] : ''}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data?.['image']?.data?.attributes?.url}`}
      />
      <LongevitySubSection
        locale={locale}
        title={environmentHeadlines.home}
        headlineBackgroundImageUrl={`${imgPath}used-devices-header.png`}
      >
        {data?.home.map((item, index) => (
          <EnvironmentSubSection
            key={index}
            description={item?.explanation}
            name={item?.title}
            iconUrl={`${strapiURl}${item?.icon?.data?.attributes?.url}`}
          />
        ))}
      </LongevitySubSection>
      <LongevitySubSection
        locale={locale}
        title={environmentHeadlines.principles}
        headlineBackgroundImageUrl={`${imgPath}used-devices-header.png`}
      >
        {data?.principles.map((item, index) => (
          <EnvironmentSubSection
            key={index}
            description={item?.explanation}
            name={item?.title}
            iconUrl={`${strapiURl}${item?.icon?.data?.attributes?.url}`}
          />
        ))}
      </LongevitySubSection>
      <LongevitySubSection
        locale={locale}
        title={environmentHeadlines.dataTracking}
        headlineBackgroundImageUrl={`${imgPath}used-devices-header.png`}
      >
        {data?.['data_tracking'].map((item, index) => (
          <EnvironmentSubSection
            key={index}
            description={item.explanation}
            name={item.title}
            iconUrl={`${strapiURl}${item?.icon?.data?.attributes?.url}`}
          />
        ))}
      </LongevitySubSection>
    </>
  );
};

export default EnvironmentLayout;
