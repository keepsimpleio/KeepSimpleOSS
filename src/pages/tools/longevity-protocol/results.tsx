import { getResultsImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getLongevityResults } from '@api/longevity/results';

import SeoGenerator from '@components/SeoGenerator';

import ResultsLayout from '@layouts/ResultsLayout';

const Results = ({ yearlyResults }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = yearlyResults?.[currentLocale];
  const imageUrls = getResultsImageUrls(data);
  usePreloadImages(imageUrls);
  const OGTags = {
    ogDescription: yearlyResults[currentLocale]?.ogDescription || '',
    ogTitle: yearlyResults[currentLocale]?.ogTitle || '',
    ogType: yearlyResults[currentLocale]?.ogType || '',
    ogImageAlt: yearlyResults[currentLocale]?.ogImageAlt || '',
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
          description: yearlyResults[currentLocale]?.Seo?.seoDescription,
          keywords: yearlyResults[currentLocale]?.Seo?.keywords,
          title: yearlyResults[currentLocale]?.Seo?.pageTitle,
          seoTitle: yearlyResults[currentLocale]?.Seo?.seoTitle,
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={yearlyResults[currentLocale]?.createdAt}
        modifiedDate={yearlyResults[currentLocale]?.updatedAt}
        preloadImages={imageUrls}
      />
      <ResultsLayout
        data={yearlyResults ? yearlyResults[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};

export default Results;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const yearlyResults = await getLongevityResults(locale);

  return {
    props: { yearlyResults },
    revalidate: 10,
  };
};
