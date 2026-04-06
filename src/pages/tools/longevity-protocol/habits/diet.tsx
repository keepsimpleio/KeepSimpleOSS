import { getDietImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getDiet } from '@api/longevity/diet';

import SeoGenerator from '@components/SeoGenerator';

import DietLayout from '@layouts/DietLayout';

const Diet = ({ dietData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = dietData?.[currentLocale];
  const imageUrls = getDietImageUrls(data);
  usePreloadImages(imageUrls);

  const OGTags = {
    ogDescription: dietData?.[currentLocale]?.ogDescription || '',
    ogTitle: dietData?.[currentLocale]?.ogTitle || '',
    ogType: dietData?.[currentLocale]?.ogType || '',
    ogImageAlt: dietData?.[currentLocale]?.ogImageAlt || '',
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
          description: dietData[currentLocale]?.Seo?.seoDescription || '',
          keywords: dietData[currentLocale]?.Seo?.keywords || '',
          title: dietData[currentLocale]?.Seo?.seoTitle || '',
          seoTitle: dietData[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        ogTags={OGTags}
        type={'MedicalWebPage'}
        createdDate={dietData[currentLocale]?.createdAt || ''}
        modifiedDate={dietData[currentLocale]?.updatedAt || ''}
        preloadImages={imageUrls}
      />
      <DietLayout
        locale={currentLocale}
        data={dietData ? dietData[currentLocale] : null}
      />
    </>
  );
};
export default Diet;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';

  const dietData = await getDiet(chosenLocale);

  return {
    props: { dietData },
    revalidate: 10,
  };
};
