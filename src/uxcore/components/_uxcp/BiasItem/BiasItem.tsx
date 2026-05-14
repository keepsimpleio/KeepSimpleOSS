import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo } from 'react';

import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import uxcpLocalization from '@uxcore/data/uxcp';

import BiasPopupContent from '@uxcore/components/AnswerBiasLink/BiasPopupContent';
import Tooltip from '@uxcore/components/Tooltip';

import styles from './BiasItem.module.scss';

type TBiasItem = {
  bias: StrapiBiasType;
  visible: boolean;
  onRemove: (bias: StrapiBiasType) => void;
  setRemovableBiasId?: (biasNumber: number) => void;
  biasWillBeRemoved?: string;
  setBiasWillBeRemoved?: (biasWillBeRemoved: string) => void;
  removableBiasId?: number;
};

const BiasItem: FC<TBiasItem> = ({
  bias,
  visible,
  setRemovableBiasId,
  removableBiasId,
  biasWillBeRemoved,
  setBiasWillBeRemoved,
  onRemove,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { biasPopupCustomTip } = uxcpLocalization[locale];
  const { number, title, description, slug } = useMemo(() => {
    const { number, title, description, slug } = bias;

    return {
      number,
      title,
      description,
      slug,
    };
  }, [locale, bias]);

  const handleRemove = useCallback(() => {
    onRemove(bias);
  }, [onRemove, bias]);

  const getRemovableBiasId = useCallback(() => {
    setRemovableBiasId(bias.number);
  }, [bias.number, biasWillBeRemoved]);

  useEffect(() => {
    if (removableBiasId === bias.number) {
      if (biasWillBeRemoved === 'AwaitingConfirmation') {
        const isConfirmed = window.confirm('Do you want to proceed?');
        if (isConfirmed) {
          handleRemove();
          setBiasWillBeRemoved(null);
          setRemovableBiasId(null);
        } else {
          setBiasWillBeRemoved(null);
          setRemovableBiasId(null);
        }
      } else if (biasWillBeRemoved === 'DirectRemove') {
        handleRemove();
        setBiasWillBeRemoved(null);
        setRemovableBiasId(null);
      }
    }
  }, [biasWillBeRemoved]);

  return (
    <div
      className={cn(styles.BiasItem, {
        [styles.Hidden]: !visible,
      })}
      data-cy="added-bias-item"
    >
      <div className={styles.BiasItemWrapper}>
        <div className={styles.Title}>
          <Link href={`/uxcore/${slug}`} legacyBehavior>
            <a target="_blank" className={styles.Number}>
              #{number}
            </a>
          </Link>
          <Tooltip
            isOnBottom
            className={styles.Text}
            isUnique
            content={
              <BiasPopupContent
                locale={locale}
                description={description?.toString()}
                customTip={biasPopupCustomTip}
                slug={slug.toString()}
              />
            }
          >
            {title}
          </Tooltip>
        </div>
        <div className={styles.Action}>
          <div className={styles.RemoveButton} onClick={getRemovableBiasId}>
            <img src="/assets/biases/cross.svg" alt="bias remove button" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiasItem;
