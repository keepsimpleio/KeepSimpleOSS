import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { getSleep } from '@api/longevity/sleep';
import { getSleepSupplements } from '@api/longevity/sleep-supplements';

import SleepLayout from '@layouts/SleepLayout/SleepLayout';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';
import type { TRouter } from '@local-types/global';

const Sleep = ({ sleepData, sleepSupplements }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const OGTags = {
    ogDescription: sleepData[currentLocale]?.ogDescription || '',
    ogTitle: sleepData[currentLocale]?.ogTitle || '',
    ogType: sleepData[currentLocale]?.ogType || '',
    ogImageAlt: sleepData[currentLocale]?.ogImageAlt || '',
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
          description: sleepData[currentLocale]?.Seo?.seoDescription || '',
          keywords: sleepData[currentLocale]?.Seo?.keywords || '',
          title: sleepData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: sleepData[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        ogTags={OGTags}
        createdDate={sleepData[currentLocale]?.createdAt || ''}
        modifiedDate={sleepData[currentLocale]?.updatedAt || ''}
      />
      <SleepLayout
        locale={locale}
        data={sleepData ? sleepData[currentLocale] : null}
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
