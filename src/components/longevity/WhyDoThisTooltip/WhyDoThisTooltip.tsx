import { FC } from 'react';

import Heading from '@components/Heading';

import longevityData from '@data/longevity';

import { WhyDoThisTooltipProps } from './WhyDoThisTooltip.types';

import styles from './WhyDoThisTooltip.module.scss';

const WhyDoThisTooltip: FC<WhyDoThisTooltipProps> = ({
  whatDamagesText,
  locale,
}) => {
  const { whatDamagesTitle } = longevityData[locale];

  return (
    <div className={styles.whyDoThisTooltip}>
      <div>
        <Heading
          text={whatDamagesTitle}
          Tag={'h4'}
          showLeftIcon={false}
          showRightIcon={false}
          className={styles.heading}
        />
        <div
          dangerouslySetInnerHTML={{ __html: whatDamagesText || '' }}
          className={styles.content}
        />
      </div>
    </div>
  );
};
export default WhyDoThisTooltip;
