import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { getWhatIsThis } from '@api/longevity/what-is-this';
import SeoGenerator from '@components/SeoGenerator';

import WhatIsThisLayout from '@layouts/LongevityLayouts';

const AboutProject = ({ aboutTheProject }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: aboutTheProject[currentLocale]?.ogDescription || '',
    ogTitle: aboutTheProject[currentLocale]?.ogTitle || '',
    ogType: aboutTheProject[currentLocale]?.ogType || '',
    ogImageAlt: aboutTheProject[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url:
            aboutTheProject[currentLocale]?.ogImage?.data?.attributes?.url ||
            '',
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
        ogTags={OGTags}
        createdDate={aboutTheProject[currentLocale]?.createdAt || ''}
        modifiedDate={aboutTheProject[currentLocale]?.updatedAt || ''}
      />
      <WhatIsThisLayout
        data={aboutTheProject ? aboutTheProject[currentLocale] : null}
        locale={locale}
      />
    </>
  );
};

export default AboutProject;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const aboutTheProject = await getWhatIsThis(locale);

  return {
    props: { aboutTheProject },
  };
};
