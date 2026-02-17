import { GetStaticProps } from 'next';

import HabitsLayout from '@layouts/HabitsLayout/HabitsLayout';

import { getHabitsProtocol } from '@api/longevity/habits-protocol';
import SeoGenerator from '@components/SeoGenerator';

const Lifestyle = ({ habitsData }) => {
  const OGTags = {
    ogDescription: habitsData['en']?.ogDescription || '',
    ogTitle: habitsData['en']?.ogTitle || '',
    ogType: habitsData['en']?.ogType || '',
    ogImageAlt: habitsData['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: habitsData['en']?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: habitsData['en']?.Seo?.seoDescription || '',
          keywords: habitsData['en']?.Seo?.keywords || '',
          title: habitsData['en']?.Seo?.pageTitle || '',
          seoTitle: habitsData['en']?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={habitsData['en']?.createdAt || ''}
        modifiedDate={habitsData['en']?.updatedAt || ''}
      />
      <HabitsLayout data={habitsData ? habitsData['en'] : null} locale={'en'} />
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
