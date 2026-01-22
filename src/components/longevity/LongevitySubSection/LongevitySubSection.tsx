import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import WhyDoThisTooltip from '@components/longevity/WhyDoThisTooltip';
import Heading from '@components/Heading';

import longevityData from '@data/longevity';

import { LongevitySubSectionProps } from './LongevitySubSection.types';

import styles from './LongevitySubSection.module.scss';

const LongevitySubSection: FC<LongevitySubSectionProps> = ({
  title,
  description,
  headlineBackgroundImageUrl,
  locale,
  whatDamages,
  howDamages,
  children,
  date,
  isHacks,
}) => {
  const { habitTooltipTitle } = longevityData[locale];

  return (
    <section className={styles.subSection}>
      <div className={styles.headline}>
        <Image
          src={headlineBackgroundImageUrl}
          alt={title}
          width={948}
          height={67}
          className={styles.backgroundImg}
        />
        <Heading
          isBold
          text={title}
          Tag="h3"
          showLeftIcon={false}
          showRightIcon={false}
          className={cn(styles.heading, {
            [styles.hacksHeading]: isHacks,
          })}
        />
        {whatDamages && howDamages && (
          <span className={styles.habitTooltip} data-tooltip-id={title}>
            {habitTooltipTitle}
          </span>
        )}
        {date && <div className={styles.dateTxt}>{date}</div>}
        {whatDamages && howDamages && (
          <ReactTooltip
            opacity={1}
            id={title}
            place={'bottom'}
            className={cn(styles.tooltip, {})}
          >
            <WhyDoThisTooltip
              whatDamagesText={whatDamages}
              howDamagesText={howDamages}
              locale={locale}
            />
          </ReactTooltip>
        )}
      </div>
      <div className={styles.mainContent}>
        {description ? (
          <div
            dangerouslySetInnerHTML={{ __html: description || '' }}
            className={styles.content}
          />
        ) : (
          <div>{children}</div>
        )}
      </div>
    </section>
  );
};

export default LongevitySubSection;
