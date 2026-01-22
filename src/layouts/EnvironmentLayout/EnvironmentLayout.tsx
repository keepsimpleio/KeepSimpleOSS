import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import { EnvironmentLayoutProps } from '@layouts/EnvironmentLayout/EnvironmentLayout.types';

const EnvironmentLayout: FC<EnvironmentLayoutProps> = ({ locale, data }) => {
  return (
    <MainInfoSection
      title={data?.title}
      description={data?.description}
      basicStats={data?.basicStats}
      locale={locale}
      japaneseText={data['japanese title']}
      backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['image']?.data?.attributes.url}`}
    />
  );
};

export default EnvironmentLayout;
