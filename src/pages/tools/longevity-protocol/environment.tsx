import { getEnvironmentImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import usePreloadImages from '@hooks/usePreloadImages';

import { getEnvironment } from '@api/longevity/environment';

import SeoGenerator from '@components/SeoGenerator';

import EnvironmentLayout from '@layouts/EnvironmentLayout/EnvironmentLayout';

const Environment = ({ environment }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = environment?.[currentLocale];
  const imageUrls = getEnvironmentImageUrls(data);
  usePreloadImages(imageUrls);
  const OGTags = {
    ogDescription: environment[currentLocale]?.ogDescription || '',
    ogTitle: environment[currentLocale]?.ogTitle || '',
    ogType: environment[currentLocale]?.ogType || '',
    ogImageAlt: environment[currentLocale]?.ogImageAlt || '',
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
          description: environment[currentLocale]?.Seo?.seoDescription || '',
          keywords: environment[currentLocale]?.Seo?.keywords || '',
          title: environment[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: environment[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={environment[currentLocale]?.createdAt || ''}
        modifiedDate={environment[currentLocale]?.updatedAt || ''}
        preloadImages={imageUrls}
      />
      <EnvironmentLayout
        data={environment ? environment[currentLocale] : null}
        locale={locale}
      />
    </>
  );
};

export default Environment;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const environment = await getEnvironment(locale);

  return {
    props: { environment },
    revalidate: 10,
  };
};
