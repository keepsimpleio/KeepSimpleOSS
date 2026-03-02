import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import { AboutProjectLayoutProps } from './AboutProjectLayout.types';

import basicStatsData from '@data/longevity/basicStats';

import styles from './AboutProjectLayout.module.scss';

const AboutProjectLayout: FC<AboutProjectLayoutProps> = ({ data, locale }) => {
  const imgPath = '/keepsimple_/assets/longevity/basic-stats/';
  const { ageTxt, genderTxt, gender, heightTxt, weightTxt, occupationTxt } =
    basicStatsData[locale];

  const basicStats = [
    {
      label: genderTxt,
      value: gender,
      icon: `${imgPath}gender.svg`,
    },
    {
      label: ageTxt,
      value: Number(data['basic stats age']),
      icon: `${imgPath}age.svg`,
    },
    {
      label: heightTxt,
      value: `${data['basic stats height']} cm`,
      icon: `${imgPath}height.svg`,
    },
    {
      label: weightTxt,
      value: `${data['basic stats weight']}`,
      icon: `${imgPath}weight.svg`,
    },
    {
      label: occupationTxt,
      value: data['basic stats occupation'],
      icon: `${imgPath}occupation.svg`,
    },
  ];

  return (
    <>
      <section className={styles.content}>
        <MainInfoSection
          isIntroPage
          hasBasicStats
          hasRedUnderline
          title={data?.title}
          description={data?.description}
          basicStats={basicStats}
          locale={locale}
          basicStatsTitle={data?.['basic stats section title']}
        />
      </section>
    </>
  );
};

export default AboutProjectLayout;
