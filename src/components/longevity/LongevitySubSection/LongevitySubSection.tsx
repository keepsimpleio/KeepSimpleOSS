import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import WhyDoThisTooltip from '@components/longevity/WhyDoThisTooltip';
import Modal from '@components/Modal';
import Heading from '@components/Heading';
import BorderedPill from '@components/longevity/BorderedPill';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import longevityData from '@data/longevity';

import { LongevitySubSectionProps } from './LongevitySubSection.types';

import styles from './LongevitySubSection.module.scss';

const LongevitySubSection: FC<LongevitySubSectionProps> = ({
  title,
  description,
  headlineBackgroundImageUrl,
  locale,
  whatDamages,
  children,
  date,
  isHacks,
  damageTypeHeadline,
}) => {
  const { habitTooltipTitle } = longevityData[locale];
  const isMobile = useIsWidthLessThan(956);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  return (
    <>
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
          {whatDamages && (
            <span
              className={styles.habitTooltip}
              data-tooltip-id={title}
              onClick={() => {
                if (isMobile) {
                  setOpenMobileModal(true);
                }
              }}
            >
              {habitTooltipTitle}
            </span>
          )}
          {date && <div className={styles.dateTxt}>{date}</div>}
          {whatDamages && !isMobile && (
            <ReactTooltip
              opacity={1}
              id={title}
              place={'bottom'}
              className={cn(styles.tooltip, {})}
            >
              <WhyDoThisTooltip
                whatDamagesText={whatDamages}
                locale={locale}
                headline={damageTypeHeadline}
              />
            </ReactTooltip>
          )}
        </div>
        <div
          className={cn(styles.mainContent, {
            [styles.withDate]: date,
          })}
        >
          {date && <div className={styles.dateTxtMobile}>{date}</div>}

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
      {isMobile && openMobileModal && (
        <Modal
          size={'full'}
          backgroundImageUrl={
            '/keepsimple_/assets/longevity/habits/damage-type-mobile.bg.webp'
          }
          onClick={() => setOpenMobileModal(false)}
        >
          <div className={styles.whyDoThisMobileModal}>
            <WhyDoThisTooltip
              whatDamagesText={whatDamages}
              locale={locale}
              headline={damageTypeHeadline}
            />
            <BorderedPill
              text={'Close'}
              onClick={() => setOpenMobileModal(false)}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default LongevitySubSection;
