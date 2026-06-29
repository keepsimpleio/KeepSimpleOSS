import classNames from 'classnames';
import React from 'react';

import { Icon, IconName } from '@components/library/atoms/Icon';
import {
  TagType,
  Text,
  TypographyVariant,
} from '@components/library/atoms/Text';

import type { LibraryInfoCardProps } from './LibraryInfoCard.types';

import styles from './LibraryInfoCard.module.scss';

export function LibraryInfoCard({
  libraryName,
  about,
  bookCount,
  videoCount,
  songCount,
  isActive,
  className,
}: LibraryInfoCardProps) {
  const objects: { name: IconName; count: number; label: string }[] = [
    { name: IconName.Book, count: bookCount, label: 'Books' },
    { name: IconName.Video, count: videoCount, label: 'Videos' },
    { name: IconName.Audio, count: songCount, label: 'Music' },
  ];

  return (
    <div
      className={classNames(
        styles.card,
        { [styles.active]: isActive },
        className,
      )}
    >
      <Text tag={TagType.H3} className={styles.heading}>
        {libraryName}
      </Text>

      <span className={styles.divider} />

      <div className={styles.section}>
        <Text variant={TypographyVariant.TextBaseBold} className={styles.label}>
          About
        </Text>
        <Text variant={TypographyVariant.TextBase} className={styles.about}>
          {about}
        </Text>
      </div>

      <div className={styles.section}>
        <Text variant={TypographyVariant.TextBaseBold} className={styles.label}>
          Objects
        </Text>
        <div className={styles.objects}>
          {objects.map(({ name, count, label }) => (
            <span key={name} className={styles.object}>
              <Icon name={name} width={19} height={19} color="#FFFFFF" />
              <Text
                variant={TypographyVariant.TextBase}
                className={styles.count}
              >
                {count} {label}
              </Text>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
