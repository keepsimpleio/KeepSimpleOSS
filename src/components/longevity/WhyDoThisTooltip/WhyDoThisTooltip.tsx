import { FC } from 'react';

import Heading from '@components/Heading';

import { WhyDoThisTooltipProps } from './WhyDoThisTooltip.types';

import styles from './WhyDoThisTooltip.module.scss';

const WhyDoThisTooltip: FC<WhyDoThisTooltipProps> = ({
  whatDamagesText,
  headline,
  locale,
}) => {
  return (
    <div className={styles.whyDoThisTooltip}>
      <div>
        {headline && (
          <Heading
            text={headline ? headline : ''}
            Tag={'h4'}
            showLeftIcon={false}
            showRightIcon={false}
            className={styles.heading}
          />
        )}
        <div
          dangerouslySetInnerHTML={{ __html: whatDamagesText || '' }}
          className={styles.content}
        />
      </div>
    </div>
  );
};
export default WhyDoThisTooltip;
