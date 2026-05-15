// import Link from '@uxcore/components/NextLink';
import BiasPopupContent from '@uxcore/components/AnswerBiasLink/BiasPopupContent';
import Tooltip from '@uxcore/components/Tooltip';
import uxcpLocalization from '@uxcore/data/uxcp';
import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, SetStateAction, useCallback, useMemo } from 'react';

import styles from './BiasActionCell.module.scss';

type TBiasActionCell = {
  bias: StrapiBiasType;
  isSelected?: boolean;
  viewOnly?: boolean;
  onChange?: (action: SetStateAction<StrapiBiasType[]>) => void;
  setRemovableBiasId?: (removableBiasId: number) => void;
};

const BiasActionCell: FC<TBiasActionCell> = ({
  bias,
  onChange,
  isSelected,
  setRemovableBiasId,
  viewOnly,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const { addButtonText, biasPopupCustomTip } = uxcpLocalization[locale];

  const { number, title, description, slug } = useMemo(() => {
    const { number, title, description, slug } = bias;
    return {
      number,
      title,
      description,
      slug,
    };
  }, [locale, bias]);

  const handleChange = useCallback(() => {
    if (!isSelected) {
      onChange((prevState: StrapiBiasType[]) => {
        prevState.push(bias);
        return [...prevState].sort((a, b) => a.number - b.number);
      });
    }
  }, [bias, isSelected]);

  const getRemovableBiasId = useCallback(() => {
    if (isSelected) {
      setRemovableBiasId(bias.number);
    }
  }, [isSelected]);

  return (
    <div
      className={cn(styles.BiasActionCell, {
        [styles.Selected]: isSelected,
      })}
      data-cy={'uxcp-bias-action-cell'}
    >
      <div className={styles.Title}>
        <Link href={`/uxcore/${slug}`} legacyBehavior>
          <a target="_blank" className={styles.Number}>
            #{number}
          </a>
        </Link>
        <Tooltip
          isOnBottom
          parentClassName={cn(styles.Tooltip, {
            [styles.TooltipHy]: locale === 'hy',
          })}
          isUnique
          content={
            <BiasPopupContent
              locale={locale}
              description={description?.toString()}
              number={number}
              customTip={biasPopupCustomTip}
            />
          }
        >
          {title}
        </Tooltip>
      </div>
      {!viewOnly && (
        <div className={styles.Actions}>
          <div
            className={styles.AddButton}
            onClick={handleChange}
            data-cy={'add-bias'}
          >
            {addButtonText}
          </div>
          <div
            className={styles.RemoveButton}
            onClick={getRemovableBiasId}
            data-cy={'remove-bias'}
          >
            <img src="/assets/biases/cross.svg" alt="bias remove button" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BiasActionCell;
