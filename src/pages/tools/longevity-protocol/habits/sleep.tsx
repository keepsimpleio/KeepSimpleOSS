import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import { getSleep } from '@api/longevity/sleep';
import { getSleepSupplements } from '@api/longevity/sleep-supplements';

import SeoGenerator from '@components/SeoGenerator';

import SleepLayout from '@layouts/SleepLayout/SleepLayout';

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
        type={'MedicalWebPage'}
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
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const sleepData = await getSleep(chosenLocale);
  const sleepSupplements = await getSleepSupplements(chosenLocale || 'en');

  return {
    props: { sleepData, locale: locale ?? 'en', sleepSupplements },
    revalidate: 10,
  };
};
