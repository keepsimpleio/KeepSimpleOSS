import { getStudyImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getStudy } from '@api/longevity/study';

import SeoGenerator from '@components/SeoGenerator';

import StudyLayout from '@layouts/StudyLayout';

const Study = ({ studyData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = studyData?.[currentLocale];
  const imageUrls = getStudyImageUrls(data);
  usePreloadImages(imageUrls);

  const OGTags = {
    ogDescription: studyData[currentLocale]?.ogDescription || '',
    ogTitle: studyData[currentLocale]?.ogTitle || '',
    ogType: studyData[currentLocale]?.ogType || '',
    ogImageAlt: studyData[currentLocale]?.ogImageAlt || '',
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
          description: studyData[currentLocale]?.Seo?.seoDescription || '',
          keywords: studyData[currentLocale]?.Seo?.keywords || '',
          title: studyData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: studyData[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={studyData[currentLocale]?.createdAt || ''}
        modifiedDate={studyData[currentLocale]?.updatedAt || ''}
        preloadImages={imageUrls}
      />
      <StudyLayout
        data={studyData ? studyData[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};
export default Study;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const studyData = await getStudy(locale);

  return {
    props: { studyData },
    revalidate: 10,
  };
};
