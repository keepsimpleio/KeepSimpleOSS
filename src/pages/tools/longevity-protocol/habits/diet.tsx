import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';

import DietLayout from '@layouts/DietLayout';

import { getDiet } from '@api/longevity/diet';
import SeoGenerator from '@components/SeoGenerator';

const Diet = ({ dietData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: dietData[currentLocale]?.Seo?.seoDescription || '',
          keywords: dietData[currentLocale]?.Seo?.keywords || '',
          title: dietData[currentLocale]?.Seo?.seoTitle || '',
          seoTitle: dietData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={dietData[currentLocale]?.OGTags || []}
        createdDate={dietData[currentLocale]?.createdAt || ''}
        modifiedDate={dietData[currentLocale]?.updatedAt || ''}
      />
      <DietLayout
        locale={locale}
        data={dietData ? dietData[currentLocale] : null}
      />
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
