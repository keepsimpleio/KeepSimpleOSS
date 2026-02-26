import { GetStaticProps } from 'next';

import LifestyleLayout from '@layouts/LifestyleLayout/LifestyleLayout';

import { getLifestyleProtocol } from '@api/longevity/lifestyle';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';
import { useRouter } from 'next/router';
import type { TRouter } from '@local-types/global';

const Lifestyle = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

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
        ogTags={OGTags}
        createdDate={habitsData[currentLocale]?.createdAt || ''}
        modifiedDate={habitsData[currentLocale]?.updatedAt || ''}
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
  const habitsData = await getLifestyleProtocol(locale);

  return {
    props: { habitsData },
    revalidate: 5,
  };
};
