import { FC } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import { WhatIsThisLayoutProps } from '@layouts/LongevityLayouts/WhatIsThisLayout.types';

import basicStatsData from '@data/longevity/basicStats';

import styles from './WhatIsThisLayout.module.scss';

const WhatIsThisLayout: FC<WhatIsThisLayoutProps> = ({ data, locale }) => {
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
      value: `${data['basic stats weight']} kg`,
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
          hasBasicStats
          hasRedUnderline
          title={data?.title}
          description={data?.description}
          basicStats={basicStats}
          locale={locale}
        />
      </section>
    </>
  );
};

export default WhatIsThisLayout;
