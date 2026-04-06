import { getWorkoutImageUrls } from '@utils/getLongevityImageUrls';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ogImage } from '@constants/longevity';

import type { TRouter } from '@local-types/global';

import usePreloadImages from '@hooks/usePreloadImages';

import { getWorkout } from '@api/longevity/workout';

import SeoGenerator from '@components/SeoGenerator';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const data = workoutData?.[currentLocale];
  const imageUrls = getWorkoutImageUrls(data);
  usePreloadImages(imageUrls);
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
        preloadImages={imageUrls}
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
    revalidate: 10,
  };
};
