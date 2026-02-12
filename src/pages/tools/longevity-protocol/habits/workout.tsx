import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

import { getWorkout } from '@api/longevity/workout';
import SeoGenerator from '@components/SeoGenerator';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const OGTags = {
    ogDescription: workoutData[currentLocale]?.ogDescription || '',
    ogTitle: workoutData[currentLocale]?.ogTitle || '',
    ogType: workoutData[currentLocale]?.ogType || '',
    ogImageAlt: workoutData[currentLocale]?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: workoutData[currentLocale]?.ogImage?.data?.attributes?.url || '',
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: workoutData[currentLocale]?.Seo?.seoDescription || '',
          keywords: workoutData[currentLocale]?.Seo?.keywords || '',
          title: workoutData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: workoutData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={OGTags}
        createdDate={workoutData[currentLocale]?.createdAt || ''}
        modifiedDate={workoutData[currentLocale]?.updatedAt || ''}
      />
      <WorkoutLayout
        data={workoutData ? workoutData[currentLocale] : null}
        locale={locale}
      />
    </>
  );
};
export default Workout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const workoutData = await getWorkout(locale);

  return {
    props: { workoutData },
    revalidate: 5,
  };
};
