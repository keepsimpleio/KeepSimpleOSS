import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX } from 'react';

import type { AudioCardProps } from './AudioCard.types';

import styles from './AudioCard.module.scss';

export function AudioCard({
  object,
  onClick,
  className,
}: AudioCardProps): JSX.Element {
  const { attributes } = object;
  const coverUrl = resolveStrapiUrl(
    attributes.coverImage?.data?.attributes.url,
  );
  const tags = attributes.tags?.data ?? [];
  const title = attributes.title;

  const handleActivate = () => onClick?.(object);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div className={classNames(styles.row, className)}>
      <div
        className={styles.card}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title}`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.cover}>
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="190px"
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.coverPlaceholder} />
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags} aria-label="Tags">
          {tags.map(tag => (
            <span
              key={tag.id}
              className={styles.tagDot}
              style={{ backgroundColor: tag.attributes.color }}
              title={tag.attributes.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
