import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';

import { getWorkout } from '@api/longevity/workout';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router;
  return <WorkoutLayout data={workoutData[locale]} locale={locale} />;
};
export default Workout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const workoutData = await getWorkout(locale);

  return {
    props: { workoutData },
    revalidate: 5,
  };
};
