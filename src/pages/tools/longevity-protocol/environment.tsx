import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import EnvironmentLayout from '@layouts/EnvironmentLayout/EnvironmentLayout';

import { getEnvironment } from '@api/longevity/environment';
import SeoGenerator from '@components/SeoGenerator';

const Environment = ({ environment }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: environment[currentLocale]?.Seo?.seoDescription || '',
          keywords: environment[currentLocale]?.Seo?.keywords || '',
          title: environment[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: environment[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={environment[currentLocale]?.OGTags || []}
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
