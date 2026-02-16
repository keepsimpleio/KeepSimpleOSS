import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import EnvironmentLayout from '@layouts/EnvironmentLayout/EnvironmentLayout';

import { getEnvironment } from '@api/longevity/environment';
import SeoGenerator from '@components/SeoGenerator';

const Environment = ({ environment }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: environment['en']?.ogDescription || '',
    ogTitle: environment['en']?.ogTitle || '',
    ogType: environment['en']?.ogType || '',
    ogImageAlt: environment['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: environment['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: environment['en']?.Seo?.seoDescription || '',
          keywords: environment['en']?.Seo?.keywords || '',
          title: environment['en']?.Seo?.pageTitle || '',
          seoTitle: environment['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={environment[currentLocale]?.createdAt || ''}
        modifiedDate={environment[currentLocale]?.updatedAt || ''}
      />
      <EnvironmentLayout
        data={environment ? environment[currentLocale] : null}
        locale={locale}
      />
    </>
  );
};

export default Environment;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const environment = await getEnvironment(locale);

  return {
    props: { environment },
    revalidate: 5,
  };
};
