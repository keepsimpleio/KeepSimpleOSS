import Tooltip from '@uxcore/components/Tooltip';
import uxcpLocalization from '@uxcore/data/uxcp';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';

import styles from './PriorityFilter.module.scss';

type PriorityFilterProps = {
  selectedPriority: 'all' | 'high' | 'medium' | 'low';
  onChange: (newSelectedPriority: 'all' | 'high' | 'medium' | 'low') => void;
};

const PriorityFilter: FC<PriorityFilterProps> = ({
  selectedPriority,
  onChange,
}) => {
  const { locale } = useRouter() as TRouter;
  const {
    relevancyLevel,
    relevancyLevelHint,
    all,
    highPriority,
    mediumPriority,
    lowPriority,
  } = uxcpLocalization[locale];

  const handleFilterChange = useCallback(e => {
    const { id } = e.currentTarget.dataset;

    onChange(id);
  }, []);

  return (
    <div
      className={cn(styles.PriorityFilter, {
        [styles.PriorityFilterHy]: locale === 'hy',
      })}
    >
      <div className={styles.TitleContainer}>
        <span className={styles.Title}>{relevancyLevel}</span>
        <span className={styles.TitleMarkContainer}>
          <Tooltip content={relevancyLevelHint}>
            <Image
              src="/assets/icons/q-mark.svg"
              width={13}
              height={17}
              alt={'question-mark'}
              unoptimized
            />
          </Tooltip>
        </span>
      </div>
      <div
        className={cn(styles.Buttons, {
          [styles[`Active-${selectedPriority}`]]: true,
        })}
      >
        <div
          className={styles.Button}
          data-id="all"
          onClick={handleFilterChange}
        >
          {all}
        </div>
        <div
          className={styles.Button}
          data-id="high"
          onClick={handleFilterChange}
        >
          <Image
            src="/assets/icons/priority-high.svg"
            alt="priority level"
            width={10}
            height={12}
            unoptimized
          />
          {highPriority}
        </div>
        <div
          className={styles.Button}
          data-id="medium"
          onClick={handleFilterChange}
        >
          <Image
            src="/assets/icons/priority-medium.svg"
            alt="priority level"
            width={10}
            height={9}
            unoptimized
          />
          {mediumPriority}
        </div>
        <div
          className={styles.Button}
          data-id="low"
          onClick={handleFilterChange}
        >
          <Image
            src="/assets/icons/priority-low.svg"
            alt="priority level"
            width={10}
            height={6}
            unoptimized
          />
          {lowPriority}
        </div>
      </div>
    </div>
  );
};

export default PriorityFilter;
