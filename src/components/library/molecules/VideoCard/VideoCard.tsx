import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX } from 'react';

import { VideoShadowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { SelectToggle } from '@components/library/molecules/SelectToggle';

import type { VideoCardProps } from './VideoCard.types';

import styles from './VideoCard.module.scss';

export function VideoCard({
  object,
  onClick,
  className,
  selected = false,
  onSelectToggle,
  selectDisabled = false,
  compact = false,
}: VideoCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const title = attributes.title;

  const handleActivate = () => onClick?.(object);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      className={classNames(styles.card, className, {
        [styles.selected]: selected,
        [styles.compact]: compact,
      })}
      role="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      {onSelectToggle && (
        <div className={styles.select}>
          <SelectToggle
            selected={selected}
            onToggle={onSelectToggle}
            disabled={selectDisabled && !selected}
          />
        </div>
      )}
      <div className={styles.thumbWrap}>
        <div className={styles.thumb}>
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="231px"
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.coverPlaceholder} />
          )}
        </div>
        <VideoShadowIcon className={styles.shadow} aria-hidden />
      </div>

      <div className={styles.bar} aria-hidden />

      <Text
        variant={TypographyVariant.TextBaseSemibold}
        className={styles.title}
      >
        {title}
      </Text>
    </div>
  );
}
