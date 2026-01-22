import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import { WorkoutLayoutProps } from './WorkoutLayout.types';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

const WorkoutLayout: FC<WorkoutLayoutProps> = ({ locale, data }) => {
  //Mandatory workouts
  return (
    <>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Mandatory Workouts'}
        description={data['mandatory workouts']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/mandatory-workouts.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Optional workouts'}
        description={data['optional workouts']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/optional-workouts.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Workout supplements'}
        description={data['workout supplements']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/img.png'
        }
      />
    </>
  );
};

export default WorkoutLayout;
