import { GetStaticProps } from 'next';

import StudyLayout from '@layouts/StudyLayout';

import { getStudy } from '@api/longevity/study';
import SeoGenerator from '@components/SeoGenerator';

const Study = ({ studyData }) => {
  const OGTags = {
    ogDescription: studyData['en']?.ogDescription || '',
    ogTitle: studyData['en']?.ogTitle || '',
    ogType: studyData['en']?.ogType || '',
    ogImageAlt: studyData['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: studyData['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: studyData['en']?.Seo?.seoDescription || '',
          keywords: studyData['en']?.Seo?.keywords || '',
          title: studyData['en']?.Seo?.pageTitle || '',
          seoTitle: studyData['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={studyData['en']?.createdAt || ''}
        modifiedDate={studyData['en']?.updatedAt || ''}
      />
      <StudyLayout data={studyData ? studyData['en'] : null} locale={'en'} />
    </>
  );
};
export default Study;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const studyData = await getStudy(locale);

  return {
    props: { studyData },
    revalidate: 5,
  };
};
