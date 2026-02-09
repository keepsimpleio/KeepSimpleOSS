import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { getWhatIsThis } from '@api/longevity/what-is-this';
import SeoGenerator from '@components/SeoGenerator';

import WhatIsThisLayout from '@layouts/LongevityLayouts';

const WhatIsThis = ({ aboutTheProject }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

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
        ogTags={aboutTheProject[currentLocale]?.OGTags || []}
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

export default WhatIsThis;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const aboutTheProject = await getWhatIsThis(locale);

  return {
    props: { aboutTheProject },
  };
};
