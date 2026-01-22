import { WhatToEatOrAvoidProps } from './WhatToEatOrAvoid.types';
import styles from './WhatToEatOrAvoid.module.scss';
import { FC } from 'react';
import Image from 'next/image';
import Heading from '@components/Heading';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import cn from 'classnames';

const WhatToEatOrAvoid: FC<WhatToEatOrAvoidProps> = ({
  damageIndex,
  info,
  examples,
  title,
  imageUrl,
  tooltipContent,
  // setSelectedHealthyOptionId,
  // id,
}) => {
  return (
    <div className={styles.whatToEatOrAvoid}>
      <div>
        <Heading
          className={styles.heading}
          text={title}
          Tag={'h5'}
          showRightIcon={false}
          showLeftIcon={false}
          // onClick={() => {
          //   if (setSelectedHealthyOptionId && id) {
          //     setSelectedHealthyOptionId(id);
          //   }
          // }}
        />
        <div className={styles.item}>
          <Image
            src={'/keepsimple_/assets/longevity/diet/damage-icon.svg'}
            alt={'damage index'}
            width={16}
            height={16}
            className={styles.img}
          />
          <span> Damage index: {damageIndex}</span>
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
        <div className={styles.item}>
          <Image
            src={'/keepsimple_/assets/longevity/diet/examples-icon.svg'}
            alt={'info'}
            width={16}
            height={16}
          />
          <div className={styles.examples}>
            <span> Examples:</span>
            <div
              dangerouslySetInnerHTML={{ __html: examples }}
              className={styles.content}
            />
          </div>
        </div>
      </div>
      {tooltipContent && (
        <div>
          <Image
            src={imageUrl}
            alt={title}
            data-tooltip-id={title}
            width={59}
            height={59}
            className={styles.heart}
          />
          <ReactTooltip
            id={title}
            place={'top'}
            className={cn(styles.tooltip, {
              // [styles.darkThemeTooltip]: darkTheme,
            })}
            opacity={1}
            // isOpen
          >
            <Heading
              className={styles.tooltipHeading}
              text={title}
              Tag={'h5'}
              showRightIcon={false}
              showLeftIcon={false}
            />
            <span className={styles.subText}> CONSUMPTION CONSEQUENCES </span>
            <Image
              src={'/keepsimple_/assets/longevity/diet/tooltip-line.png'}
              alt={'info'}
              width={459}
              height={2}
            />
            <div
              dangerouslySetInnerHTML={{ __html: tooltipContent }}
              className={styles.content}
            />
          </ReactTooltip>
        </div>
      )}
      {
        // id &&
      }
    </div>
  );
};

export default WhatToEatOrAvoid;
