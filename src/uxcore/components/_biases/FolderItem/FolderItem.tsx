import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { StrapiBiasType } from '@uxcore/local-types/data';
import { TRouter } from '@uxcore/local-types/global';

import biasesFolderViewIntl from '@data/biasesFolderView';

import ContentParser from '@uxcore/components/ContentParser';

import styles from './FolderItem.module.scss';

type FolderItemProps = {
  margin: number;
  zIndex: number;
  index: number;
  hover?: (index: number, action: 'over' | 'leave') => void;
  id: number;
  title: string;
  description: string;
  usage: string;
  hideBottom?: boolean;
  category: number;
  biases: StrapiBiasType[];
};

const FolderItem = ({
  margin,
  zIndex,
  index,
  hover,
  id,
  title,
  description,
  usage,
  hideBottom,
  category,
  biases,
}: FolderItemProps) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const { descriptionText, usageText, clickText } =
    biasesFolderViewIntl[locale];

  const openBisPage = useCallback(() => {
    const matchedBias = biases.find(
      bias => String(bias.attributes.number) === String(id),
    );
    if (matchedBias) {
      const slug = matchedBias.attributes.slug;
      router.push(`/uxcore/${slug}`, undefined, { scroll: false });
    }
  }, [id, router, biases]);

  return (
    <div
      data-cy={`uxcore-folder-item`}
      id={`#${id}`}
      className={cn(styles.FolderItem, {
        [styles[`Type-${category}`]]: true,
      })}
      onClick={openBisPage}
      style={{
        marginTop: `${margin}px`,
        zIndex: zIndex,
      }}
      onMouseOver={() => (hover ? hover(index, 'over') : null)}
      onMouseOut={() => (hover ? hover(index, 'leave') : null)}
      data-id={id}
    >
      <div className={styles.FolderItemTitle}>
        <div>
          <span>#{id}</span>
          <span className={styles.BiasTitle}>{title}</span>
        </div>
      </div>
      <div className={styles.Content}>
        <div className={styles.TextContainer}>
          <span>
            <p>{descriptionText}</p>
          </span>
          {description && <ContentParser data={description} />}
          <span>
            <p>{usageText}</p>
          </span>
          {usage && <ContentParser data={usage} />}
        </div>
        {hideBottom && (
          <div
            className={styles.Bottom}
            onClick={openBisPage}
            data-cy="uxcore-folder-item-bottom"
          >
            <a className={styles.ClickText}>{clickText}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderItem;
