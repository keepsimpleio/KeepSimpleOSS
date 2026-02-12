import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import StudyLayout from '@layouts/StudyLayout';

import { getStudy } from '@api/longevity/study';
import SeoGenerator from '@components/SeoGenerator';

const Study = ({ studyData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: studyData[currentLocale]?.ogDescription || '',
    ogTitle: studyData[currentLocale]?.ogTitle || '',
    ogType: studyData[currentLocale]?.ogType || '',
    ogImageAlt: studyData[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: studyData[currentLocale]?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: studyData[currentLocale]?.Seo?.seoDescription || '',
          keywords: studyData[currentLocale]?.Seo?.keywords || '',
          title: studyData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: studyData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={studyData[currentLocale]?.createdAt || ''}
        modifiedDate={studyData[currentLocale]?.updatedAt || ''}
      />
      <StudyLayout
        data={studyData ? studyData[currentLocale] : null}
        locale={locale}
      />
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
