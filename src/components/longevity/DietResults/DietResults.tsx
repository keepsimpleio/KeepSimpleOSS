import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { DietResultsProps } from './DietResults.types';

import styles from './DietResults.module.scss';

const DietResults: FC<DietResultsProps> = ({
  id,
  scaleLevels,
  setSelectedHealthyOptionId,
  whatToEatItemNamesAndIds,
  setIsIconClicked,
  dietTxt,
  locale,
}) => {
  const getSelectedHealthOptionName = (id: number) => {
    const selectedOption = whatToEatItemNamesAndIds.find(
      (option: any) => option.id === id,
    );
    return selectedOption ? selectedOption.name : null;
  };

  return (
    <div
      className={cn(styles.results, {
        [styles.resultsRu]: locale === 'ru',
      })}
    >
      {scaleLevels.map((level, index) => (
        <div
          onClick={() => {
            setSelectedHealthyOptionId(level.id);
            setIsIconClicked(false);
            requestAnimationFrame(() => setIsIconClicked(true));
          }}
          key={level.id}
          className={cn(styles.item, {
            [styles.active]: id === level.id,
          })}
          data-tooltip-id={level.id.toString()}
        >
          <Image
            className={styles.img}
            src={level.imagePath}
            alt={`Diet level ${level.id}`}
            width={120}
            height={120}
            unoptimized
          />
          <span
            className={cn(styles.selected, {
              [styles.active]: id === level.id,
            })}
          >
            {dietTxt}
          </span>
          <ReactTooltip
            id={level.id.toString()}
            place={'bottom'}
            className={styles.tooltip}
            opacity={1}
          >
            <span className={styles.defaultLabel}>
              {getSelectedHealthOptionName(index + 1)}
            </span>
          </ReactTooltip>
        </div>
      ))}
    </div>
  );
};

export default DietResults;
