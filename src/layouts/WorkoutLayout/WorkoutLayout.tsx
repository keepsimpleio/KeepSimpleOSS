import { FC, useEffect, useState } from 'react';

import longevityData from '@data/longevity';

import BrainAgeActivity from '@components/BrainAgeActivity';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import MainInfoSection from '@components/longevity/MainInfoSection';
import StrengthAndTimeCompression from '@components/longevity/StrengthAndTimeCompression';
import WeeklyWorkout from '@components/longevity/WeeklyWorkout';

import { WorkoutLayoutProps } from './WorkoutLayout.types';

import styles from './WorkoutLayout.module.scss';

const WorkoutLayout: FC<WorkoutLayoutProps> = ({ locale, data }) => {
  // TODO: image paths move to constants
  const { workoutHeadlines, hacksTitle } = longevityData[locale];
  function splitUlHtml(ulHtmlString: string) {
    const doc = new DOMParser().parseFromString(ulHtmlString, 'text/html');
    const ul = doc.querySelector('ul');
    if (!ul) return { firstUlHtml: '', restUlHtml: '' };

    const items = Array.from(ul.querySelectorAll(':scope > li'));
    const [first, ...rest] = items;

    const wrap = (lis: Element[]) => {
      if (!lis.length) return '';
      const newUl = doc.createElement('ul');
      lis.forEach(li => newUl.appendChild(li.cloneNode(true)));
      return newUl.outerHTML;
    };

    return { firstUlHtml: first ? wrap([first]) : '', restUlHtml: wrap(rest) };
  }
  const [parts, setParts] = useState({ firstUlHtml: '', restUlHtml: '' });

  useEffect(() => {
    if (!data.hacks) {
      setParts({ firstUlHtml: '', restUlHtml: '' });
      return;
    }
    setParts(splitUlHtml(data.hacks));
  }, [data.hacks]);

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
        title={workoutHeadlines.mandatoryWorkouts}
        description={data['mandatory workouts']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/mandatory-workouts.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        title={workoutHeadlines.optionalWorkouts}
        description={data['optional workouts']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/optional-workouts.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        title={workoutHeadlines.workoutSupplements}
        description={data['workout supplements']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/workout-supplements.png'
        }
      />
      <WeeklyWorkout locale={locale} />
      <BrainAgeActivity locale={locale} />
      <LongevitySubSection
        locale={locale}
        title={hacksTitle}
        isHacks
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/workout/hacks.png'
        }
      >
        {parts.firstUlHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: parts.firstUlHtml }}
            className={styles.list}
          />
        )}
        <StrengthAndTimeCompression locale={locale} />
        {parts.restUlHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: parts.restUlHtml }}
            className={styles.list}
          />
        )}
      </LongevitySubSection>
    </>
  );
};

export default WorkoutLayout;
