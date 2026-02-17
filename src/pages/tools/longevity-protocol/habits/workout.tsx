import { GetStaticProps } from 'next';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

import { getWorkout } from '@api/longevity/workout';
import SeoGenerator from '@components/SeoGenerator';
import { ogImage } from '@constants/longevity';

const Workout = ({ workoutData }) => {
  const OGTags = {
    ogDescription: workoutData['en']?.ogDescription || '',
    ogTitle: workoutData['en']?.ogTitle || '',
    ogType: workoutData['en']?.ogType || '',
    ogImageAlt: workoutData['en']?.ogImageAlt || '',
    ogImage: {
      data: {
        attributes: {
          url: ogImage,
        },
      },
    },
  };

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: workoutData['en']?.Seo?.seoDescription || '',
          keywords: workoutData['en']?.Seo?.keywords || '',
          title: workoutData['en']?.Seo?.pageTitle || '',
          seoTitle: workoutData['en']?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        ogTags={OGTags}
        createdDate={workoutData['en']?.createdAt || ''}
        modifiedDate={workoutData['en']?.updatedAt || ''}
      />
      <WorkoutLayout
        data={workoutData ? workoutData['en'] : null}
        locale={'en'}
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
