import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

import { getWorkout } from '@api/longevity/workout';
import SeoGenerator from '@components/SeoGenerator';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: workoutData[currentLocale]?.Seo?.seoDescription || '',
          keywords: workoutData[currentLocale]?.Seo?.keywords || '',
          title: workoutData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: workoutData[currentLocale]?.Seo?.seoTitle || '',
        }}
        ogTags={workoutData[currentLocale]?.OGTags || []}
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
