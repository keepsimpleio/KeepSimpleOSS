import { GetStaticProps } from 'next';

import DietLayout from '@layouts/DietLayout';

import { getDiet } from '@api/longevity/diet';
import SeoGenerator from '@components/SeoGenerator';

const Diet = ({ dietData }) => {
  const OGTags = {
    ogDescription: dietData['en']?.ogDescription || '',
    ogTitle: dietData['en']?.ogTitle || '',
    ogType: dietData['en']?.ogType || '',
    ogImageAlt: dietData['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: dietData['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: dietData['en']?.Seo?.seoDescription || '',
          keywords: dietData['en']?.Seo?.keywords || '',
          title: dietData['en']?.Seo?.seoTitle || '',
          seoTitle: dietData['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={dietData['en']?.createdAt || ''}
        modifiedDate={dietData['en']?.updatedAt || ''}
      />
      <DietLayout locale={'en'} data={dietData ? dietData['en'] : null} />
    </>
  );
};
export default Diet;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dietData = await getDiet(locale);

  return {
    props: { dietData },
    revalidate: 5,
  };
};
