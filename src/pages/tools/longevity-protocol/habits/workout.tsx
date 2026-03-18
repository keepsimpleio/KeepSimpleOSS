import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import { getWorkout } from '@api/longevity/workout';

import SeoGenerator from '@components/SeoGenerator';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const OGTags = {
    ogDescription: workoutData[currentLocale]?.ogDescription || '',
    ogTitle: workoutData[currentLocale]?.ogTitle || '',
    ogType: workoutData[currentLocale]?.ogType || '',
    ogImageAlt: workoutData[currentLocale]?.ogImageAlt || '',
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
          description: workoutData[currentLocale]?.Seo?.seoDescription || '',
          keywords: workoutData[currentLocale]?.Seo?.keywords || '',
          title: workoutData[currentLocale]?.Seo?.pageTitle || '',
          seoTitle: workoutData[currentLocale]?.Seo?.seoTitle || '',
        }}
        isLongevityPage
        type={'MedicalWebPage'}
        ogTags={OGTags}
        createdDate={workoutData[currentLocale]?.createdAt || ''}
        modifiedDate={workoutData[currentLocale]?.updatedAt || ''}
      />
      <WorkoutLayout
        data={workoutData ? workoutData[currentLocale] : null}
        locale={currentLocale}
      />
    </>
  );
};
export default Workout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const workoutData = await getWorkout(chosenLocale);

  return {
    props: { workoutData },
    revalidate: 5,
  };
};
