import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import HabitsLayout from '@layouts/HabitsLayout/HabitsLayout';

import { getHabitsProtocol } from '@api/longevity/habits-protocol';
import SeoGenerator from '@components/SeoGenerator';

const Lifestyle = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: habitsData[currentLocale]?.Seo?.seoDescription || '',
          keywords: habitsData[currentLocale]?.Seo?.keywords || '',
          title: habitsData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: habitsData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={habitsData[currentLocale]?.OGTags || []}
        createdDate={habitsData[currentLocale]?.createdAt || ''}
        modifiedDate={habitsData[currentLocale]?.updatedAt || ''}
      />
      <HabitsLayout
        data={habitsData ? habitsData[currentLocale] : null}
        locale={locale}
      />
    </>
  );
};

export default Lifestyle;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const habitsData = await getHabitsProtocol(locale);

  return {
    props: { habitsData },
    revalidate: 5,
  };
};
