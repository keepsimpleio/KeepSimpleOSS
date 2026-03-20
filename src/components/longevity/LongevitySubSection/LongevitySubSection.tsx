import cn from 'classnames';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import longevityData from '@data/longevity';

import Heading from '@components/Heading';
import BorderedPill from '@components/longevity/BorderedPill';
import WhyDoThisTooltip from '@components/longevity/WhyDoThisTooltip';
import Modal from '@components/Modal';

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
  isFoodChoices,
}) => {
  const { habitTooltipTitle } = longevityData[locale];
  const isMobile = useIsWidthLessThan(956);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  return (
    <>
      <section
        className={cn(styles.subSection, {
          [styles.subSectionRu]: locale === 'ru',
        })}
      >
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
              data-cy="why-do-this-trigger"
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
              className={styles.tooltip}
              clickable
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
              className={cn(styles.content, {
                [styles.foodChoicesContent]: isFoodChoices,
              })}
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
          dataCy="why-do-this-modal"
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
              dataCy="why-do-this-modal-close"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default LongevitySubSection;
