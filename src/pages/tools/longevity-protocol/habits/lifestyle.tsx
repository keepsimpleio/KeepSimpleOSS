import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import HabitsLayout from '@layouts/HabitsLayout/HabitsLayout';

import { getHabitsProtocol } from '@api/longevity/habits-protocol';
import SeoGenerator from '@components/SeoGenerator';

const Lifestyle = ({ habitsData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: habitsData[currentLocale]?.ogDescription || '',
    ogTitle: habitsData[currentLocale]?.ogTitle || '',
    ogType: habitsData[currentLocale]?.ogType || '',
    ogImageAlt: habitsData[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: habitsData[currentLocale]?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: habitsData[currentLocale]?.Seo?.seoDescription || '',
          keywords: habitsData[currentLocale]?.Seo?.keywords || '',
          title: habitsData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: habitsData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
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
