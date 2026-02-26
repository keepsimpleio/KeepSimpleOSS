import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import Heading from '@components/Heading';
import Modal from '@components/Modal';
import AboutTheProduct from '@components/longevity/WhatToEatOrAvoid/AboutTheProduct';
import ShinyStars from '@components/longevity/ShinyStars';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { WhatToEatOrAvoidProps } from './WhatToEatOrAvoid.types';

import Divider from '@icons/longevity/Divider';

import styles from './WhatToEatOrAvoid.module.scss';
import longevityData from '@data/longevity';

const WhatToEatOrAvoid: FC<WhatToEatOrAvoidProps> = ({
  damageIndex,
  info,
  examples,
  title,
  imageUrl,
  tooltipContent,
  setSelectedHealthyOptionId,
  selectedHealthyOptionId,
  id,
  tooltipSubText,
  locale,
}) => {
  const [exampleContent, setExampleContent] = useState('');
  const isMobile = useIsWidthLessThan(956);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const { whatTOEatOrAvoidContent } = longevityData[locale];
  const getPText = (html: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('p')?.textContent?.trim() ?? '';
  };

  useEffect(() => {
    getPText(examples);
    setExampleContent(getPText(examples));
  }, []);
  console.log(selectedHealthyOptionId, ', id');

  return (
    <div
      className={cn(styles.whatToEatOrAvoid, {
        [styles.selected]: selectedHealthyOptionId === Number(id),
        [styles.whatToEatSection]: selectedHealthyOptionId,
        [styles.whatToEatOrAvoidRu]: locale === 'ru',
      })}
      onClick={e => {
        const selectedText = window.getSelection?.()?.toString() ?? '';
        if (selectedText.trim().length > 0) return;

        if (setSelectedHealthyOptionId && id) {
          setSelectedHealthyOptionId(id);
          e.stopPropagation();
        }
      }}
    >
      <div>
        <Heading
          className={styles.heading}
          text={title}
          Tag={'h5'}
          showRightIcon={false}
          showLeftIcon={false}
        />
        <div className={styles.item}>
          <Image
            src={'/keepsimple_/assets/longevity/diet/damage-icon.svg'}
            alt={'damage index'}
            width={16}
            height={16}
            className={styles.img}
          />
          <span>
            {whatTOEatOrAvoidContent.damageIndexTxt} {damageIndex}
          </span>
        </div>
        <div className={styles.item}>
          <Image
            src={'/keepsimple_/assets/longevity/diet/info-icon.svg'}
            alt={'info'}
            width={16}
            height={16}
          />
          <div
            dangerouslySetInnerHTML={{ __html: info }}
            className={styles.content}
          />
        </div>
        <div className={cn(styles.item, styles.examplesItem)}>
          <Image
            src={'/keepsimple_/assets/longevity/diet/examples-icon.svg'}
            alt={'info'}
            width={16}
            height={16}
            className={styles.icon}
          />
          <div className={styles.examples}>
            <p className={styles.exampleContent}> {exampleContent}</p>
          </div>
        </div>
      </div>

      <div>
        {selectedHealthyOptionId && (
          <>
            {selectedHealthyOptionId === Number(id) && (
              <span className={styles.label}>
                {' '}
                {whatTOEatOrAvoidContent.yourDietTxt}{' '}
              </span>
            )}
            <div
              role="checkbox"
              aria-checked={selectedHealthyOptionId === Number(1)}
              tabIndex={0}
              onKeyDown={e =>
                e.key === 'Enter' &&
                setSelectedHealthyOptionId(prev => (prev === 3 ? null : 3))
              }
              className={styles.checkbox}
            >
              {selectedHealthyOptionId === Number(id) && (
                <span className={styles.checkmark} />
              )}
            </div>
          </>
        )}
      </div>

      {tooltipContent && (
        <div className={styles.heartWrapper}>
          <div data-tooltip-id={title}>
            {!isMobile && <ShinyStars />}
            <Image
              src={imageUrl}
              alt={title}
              width={59}
              height={59}
              className={styles.heart}
              onClick={() => isMobile && setOpenMobileModal(true)}
            />
          </div>

          {!isMobile && (
            <ReactTooltip
              id={title}
              place={'top'}
              className={styles.tooltip}
              opacity={1}
              clickable
            >
              <AboutTheProduct
                content={tooltipContent}
                title={title}
                subTitle={tooltipSubText}
                locale={locale}
              />
            </ReactTooltip>
          )}
          {isMobile && openMobileModal && (
            <Modal
              onClick={() => setOpenMobileModal(false)}
              size={'full'}
              isLongevityProtocolModal
            >
              <AboutTheProduct
                content={tooltipContent}
                subTitle={tooltipSubText}
                title={title}
                locale={locale}
              />
            </Modal>
          )}
        </div>
      )}
      <Divider className={styles.divider} />
    </div>
  );
};

export default WhatToEatOrAvoid;
