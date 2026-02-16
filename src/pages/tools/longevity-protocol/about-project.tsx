import { GetServerSideProps } from 'next';

import { getWhatIsThis } from '@api/longevity/what-is-this';
import SeoGenerator from '@components/SeoGenerator';

import WhatIsThisLayout from '@layouts/LongevityLayouts';

const AboutProject = ({ aboutTheProject }) => {
  const OGTags = {
    ogDescription: aboutTheProject['en']?.ogDescription || '',
    ogTitle: aboutTheProject['en']?.ogTitle || '',
    ogType: aboutTheProject['en']?.ogType || '',
    ogImageAlt: aboutTheProject['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: aboutTheProject['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: aboutTheProject['en']?.Seo?.seoDescription || '',
          keywords: aboutTheProject['en']?.Seo?.keywords || '',
          title: aboutTheProject['en']?.Seo?.pageTitle || '',
          seoTitle: aboutTheProject['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={aboutTheProject['en']?.createdAt || ''}
        modifiedDate={aboutTheProject['en']?.updatedAt || ''}
      />
      <WhatIsThisLayout
        data={aboutTheProject ? aboutTheProject['en'] : null}
        locale={'en'}
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
