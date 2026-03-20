import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import { getAboutProject } from '@api/longevity/about-project';

import SeoGenerator from '@components/SeoGenerator';

import AboutProjectLayout from '@layouts/LongevityLayouts';

const AboutProject = ({ aboutTheProject }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const OGTags = {
    ogDescription: aboutTheProject[currentLocale]?.ogDescription || '',
    ogTitle: aboutTheProject[currentLocale]?.ogTitle || '',
    ogType: aboutTheProject[currentLocale]?.ogType || '',
    ogImageAlt: aboutTheProject[currentLocale]?.ogImageAlt || '',
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
          description:
            aboutTheProject[currentLocale]?.Seo?.seoDescription || '',
          keywords: aboutTheProject[currentLocale]?.Seo?.keywords || '',
          title: aboutTheProject[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: aboutTheProject[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={aboutTheProject[currentLocale]?.createdAt || ''}
        modifiedDate={aboutTheProject[currentLocale]?.updatedAt || ''}
      />
      <AboutProjectLayout
        data={aboutTheProject ? aboutTheProject[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};

export default AboutProject;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const aboutTheProject = await getAboutProject(locale);

  return {
    props: { aboutTheProject },
  };
};
