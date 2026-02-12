import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ResultsLayout from '@layouts/ResultsLayout';

import { getLongevityResults } from '@api/longevity/results';
import SeoGenerator from '@components/SeoGenerator';

const Results = ({ yearlyResults }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: yearlyResults[currentLocale]?.ogDescription || '',
    ogTitle: yearlyResults[currentLocale]?.ogTitle || '',
    ogType: yearlyResults[currentLocale]?.ogType || '',
    ogImageAlt: yearlyResults[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url:
            yearlyResults[currentLocale]?.ogImage?.data?.attributes?.url || '',
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
        ogTags={OGTags}
        createdDate={yearlyResults[currentLocale]?.createdAt}
        modifiedDate={yearlyResults[currentLocale]?.updatedAt}
      />
      <ResultsLayout
        data={yearlyResults ? yearlyResults[currentLocale] : null}
        locale={locale}
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
