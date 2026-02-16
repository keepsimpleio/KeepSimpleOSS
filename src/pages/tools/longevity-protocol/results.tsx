import { GetServerSideProps } from 'next';

import ResultsLayout from '@layouts/ResultsLayout';

import { getLongevityResults } from '@api/longevity/results';
import SeoGenerator from '@components/SeoGenerator';

const Results = ({ yearlyResults }) => {
  const OGTags = {
    ogDescription: yearlyResults['en']?.ogDescription || '',
    ogTitle: yearlyResults['en']?.ogTitle || '',
    ogType: yearlyResults['en']?.ogType || '',
    ogImageAlt: yearlyResults['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: yearlyResults['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: yearlyResults['en']?.Seo?.seoDescription,
          keywords: yearlyResults['en']?.Seo?.keywords,
          title: yearlyResults['en']?.Seo?.pageTitle,
          seoTitle: yearlyResults['en']?.Seo?.seoTitle,
        }}
        ogTags={OGTags}
        createdDate={yearlyResults['en']?.createdAt}
        modifiedDate={yearlyResults['en']?.updatedAt}
      />
      <ResultsLayout
        data={yearlyResults ? yearlyResults['en'] : null}
        locale={'en'}
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
