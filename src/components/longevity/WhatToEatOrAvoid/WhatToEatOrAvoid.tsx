import { FC } from 'react';
import Image from 'next/image';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import Heading from '@components/Heading';

import { WhatToEatOrAvoidProps } from './WhatToEatOrAvoid.types';

import styles from './WhatToEatOrAvoid.module.scss';

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
      <div>
        {selectedHealthyOptionId && (
          <>
            {selectedHealthyOptionId === Number(id) && (
              <span className={styles.label}> Your diet </span>
            )}
            <div
              onClick={() => {
                if (setSelectedHealthyOptionId && id) {
                  setSelectedHealthyOptionId(id);
                }
              }}
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
            className={styles.tooltip}
            opacity={1}
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
    </div>
  );
};

export default WhatToEatOrAvoid;
