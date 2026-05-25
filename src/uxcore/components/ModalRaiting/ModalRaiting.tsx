import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, MouseEvent, useEffect, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import useSpinner from '@uxcore/hooks/useSpinner';

import { getRatedItems, saveInLocalStorage, updateVH } from '@uxcore/lib/helpers';

import { rateRequest } from '@uxcore/api/rating';

import modalIntl from '@uxcore/data/modalRaiting';

import styles from './ModalRaiting.module.scss';

const rangeItems = Array(10)
  .fill(null)
  .map((_, i) => i + 1);

type ModalRaitingProps = {
  id: number;
  type: 'bias' | 'question';
};

const ModalRaiting: FC<ModalRaitingProps> = ({ id, type }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { setIsVisible } = useSpinner()[0];
  const [hoveredRangeItemId, setHoveredRangeItemId] = useState(null);
  const [isRateVisibile, setIsRateVisibile] = useState(true);

  const handleRangeItemMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    const { raiting } = e.currentTarget.dataset;
    setHoveredRangeItemId(Number(raiting));
  };

  const handleRangeItemMouseOut = () => {
    setHoveredRangeItemId(null);
  };

  const handleRate = async (e: MouseEvent<HTMLDivElement>) => {
    const { raiting } = e.currentTarget.dataset;
    setIsVisible(true);

    try {
      await rateRequest(id, Number(raiting), type);
      saveInLocalStorage(id, type);
    } catch (err) {
      console.error('Error while rating:', err);
    }

    setIsVisible(false);
    setIsRateVisibile(false);
  };

  useEffect(() => {
    const ratedItems = getRatedItems(type);
    setIsRateVisibile(!ratedItems.includes(id));
  }, [id, type]);

  useEffect(() => {
    updateVH();
    window.addEventListener('resize', updateVH);

    return () => {
      window.removeEventListener('resize', updateVH);
    };
  }, []);

  const { howUseful, notUseful, veryUseful, thanks } = modalIntl[locale];

  return (
    <div className={styles.ModalRaiting}>
      <div
        className={cn(styles.Rating, {
          [styles.Hidden]: !isRateVisibile,
        })}
      >
        <div className={styles.Question}>{howUseful}</div>
        <div className={styles.Table}>
          <div className={styles.Label}>{notUseful}</div>
          <div className={styles.Range}>
            {rangeItems.map(i => (
              <div
                key={i}
                data-raiting={i}
                className={cn(styles.RangeItem, {
                  [styles.Hovered]: hoveredRangeItemId >= i,
                })}
                onMouseOver={handleRangeItemMouseOver}
                onMouseOut={handleRangeItemMouseOut}
                onClick={handleRate}
              >
                <span className={styles.Number}>{i}</span>
              </div>
            ))}
          </div>
          <div className={cn(styles.Label, styles.Mobile)}>{notUseful}</div>
          <div className={styles.Label}>{veryUseful}</div>
        </div>
      </div>
      <div
        className={cn(styles.ThankYou, {
          [styles.Hidden]: isRateVisibile,
        })}
      >
        {thanks}
      </div>
    </div>
  );
};

export default ModalRaiting;
