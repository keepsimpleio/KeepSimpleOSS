import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ResultsLayout from '@layouts/ResultsLayout';

import type { TRouter } from '@local-types/global';

import { getLongevityResults } from '@api/longevity/results';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';

const Results = ({ yearlyResults }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
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
        ogTags={OGTags}
        createdDate={yearlyResults[currentLocale]?.createdAt}
        modifiedDate={yearlyResults[currentLocale]?.updatedAt}
      />
      <ResultsLayout
        data={yearlyResults ? yearlyResults[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const yearlyResults = await getLongevityResults(locale);

  return {
    props: { yearlyResults },
  };
};
