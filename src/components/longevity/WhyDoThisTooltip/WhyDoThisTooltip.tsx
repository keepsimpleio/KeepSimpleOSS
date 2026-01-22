import { WhyDoThisTooltipProps } from './WhyDoThisTooltip.types';
import { FC } from 'react';
import styles from './WhyDoThisTooltip.module.scss';
import Heading from '@components/Heading';
import longevityData from '@data/longevity';

const WhyDoThisTooltip: FC<WhyDoThisTooltipProps> = ({
  whatDamagesText,
  howDamagesText,
  locale,
}) => {
  const { whatDamagesTitle, howDamagesTitle } = longevityData[locale];

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
      <div>
        <Heading
          text={howDamagesTitle}
          Tag={'h4'}
          showLeftIcon={false}
          showRightIcon={false}
          className={styles.heading}
        />
        <div
          dangerouslySetInnerHTML={{ __html: howDamagesText || '' }}
          className={styles.content}
        />
      </div>
    </div>
  );
};
export default WhyDoThisTooltip;
