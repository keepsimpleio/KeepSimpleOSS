import { getWorkout } from '@api/longevity/workout';
import { useRouter } from 'next/router';
import WorkoutLayout from '@layouts/WorkoutLayout/WorkoutLayout';
import { GetServerSideProps } from 'next';

const Workout = ({ workoutData }) => {
  const router = useRouter();
  const { locale } = router;
  return <WorkoutLayout data={workoutData[locale]} locale={locale} />;
};
export default Workout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const workoutData = await getWorkout(locale);

  return {
    props: { workoutData },
  };
};
