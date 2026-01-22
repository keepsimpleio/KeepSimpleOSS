import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import { SleepLayoutProps } from '@layouts/SleepLayout/SleepLayout.types';

const SleepLayout: FC<SleepLayoutProps> = ({ locale, data }) => {
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
      {/*<LongevitySubSection*/}
      {/*  locale={locale}*/}
      {/*  title={data['key brain rules'].headline}*/}
      {/*  description={data['key brain rules'].content}*/}
      {/*  // headlineBackgroundImageUrl={`${imgPath}biological-marker.png`}*/}
      {/*/>*/}
    </>
  );
};

export default SleepLayout;
