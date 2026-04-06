import { getLifestyleImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getLifestyleProtocol } from '@api/longevity/lifestyle';

import SeoGenerator from '@components/SeoGenerator';

import LifestyleLayout from '@layouts/LifestyleLayout/LifestyleLayout';

const Lifestyle = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = habitsData?.[currentLocale];
  const imageUrls = getLifestyleImageUrls(data);
  usePreloadImages(imageUrls);

  const OGTags = {
    ogDescription: habitsData[currentLocale]?.ogDescription || '',
    ogTitle: habitsData[currentLocale]?.ogTitle || '',
    ogType: habitsData[currentLocale]?.ogType || '',
    ogImageAlt: habitsData[currentLocale]?.ogImageAlt || '',
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
          description: habitsData[currentLocale]?.Seo?.seoDescription || '',
          keywords: habitsData[currentLocale]?.Seo?.keywords || '',
          title: habitsData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: habitsData[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={habitsData[currentLocale]?.createdAt || ''}
        modifiedDate={habitsData[currentLocale]?.updatedAt || ''}
        preloadImages={imageUrls}
      />
      <LifestyleLayout
        data={habitsData ? habitsData[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};

export default Lifestyle;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const habitsData = await getLifestyleProtocol(chosenLocale);

  return {
    props: { habitsData },
    revalidate: 10,
  };
};
