import { GetStaticProps } from 'next';

import { getSleep } from '@api/longevity/sleep';
import { getSleepSupplements } from '@api/longevity/sleep-supplements';

import SleepLayout from '@layouts/SleepLayout/SleepLayout';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';

const Sleep = ({ sleepData, sleepSupplements }) => {
  const OGTags = {
    ogDescription: sleepData['en']?.ogDescription || '',
    ogTitle: sleepData['en']?.ogTitle || '',
    ogType: sleepData['en']?.ogType || '',
    ogImageAlt: sleepData['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: ogImage,
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: sleepData['en']?.Seo?.seoDescription || '',
          keywords: sleepData['en']?.Seo?.keywords || '',
          title: sleepData['en']?.Seo?.pageTitle || '',
          seoTitle: sleepData['en']?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        ogTags={OGTags}
        createdDate={sleepData['en']?.createdAt || ''}
        modifiedDate={sleepData['en']?.updatedAt || ''}
      />
      <SleepLayout
        locale={'en'}
        data={sleepData ? sleepData['en'] : null}
        supplements={sleepSupplements?.supplements}
      />
    </>
  );
};
export default Sleep;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const sleepData = await getSleep(locale);
  const sleepSupplements = await getSleepSupplements(locale || 'en');

  return {
    props: { sleepData, locale: locale ?? 'en', sleepSupplements },
    revalidate: 5,
  };
};
