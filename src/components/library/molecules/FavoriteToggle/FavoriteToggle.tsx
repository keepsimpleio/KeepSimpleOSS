import classNames from 'classnames';
import React, { JSX } from 'react';

import { StarIcon } from '@icons/library/svg';

import { Tooltip } from '@components/library/atoms/Tooltip';

import type { FavoriteToggleProps } from './FavoriteToggle.types';

import styles from './FavoriteToggle.module.scss';

/**
 * The star that puts a book on the Favorites shelf. For the owner it is a
 * button; for a visitor it is a mark that only shows when the book is a
 * favorite. It stands on surfaces that are themselves buttons (the card, the
 * overview header), so every press stays inside it.
 */
export function FavoriteToggle({
  favorite,
  onToggle,
  title,
  className,
  busy = false,
}: FavoriteToggleProps): JSX.Element | null {
  if (!onToggle) {
    if (!favorite) return null;
    return (
      <span
        className={classNames(styles.star, styles.on, styles.mark, className)}
        role="img"
        aria-label={`${title} is a favorite`}
      >
        <StarIcon />
      </span>
    );
  }

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    onToggle();
  };

  return (
    <Tooltip
      asChild
      tooltipContent={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <button
        type="button"
        className={classNames(styles.star, className, {
          [styles.on]: favorite,
          [styles.busy]: busy,
        })}
        onClick={handleClick}
        onPointerDown={stop}
        onKeyDown={stop}
        aria-pressed={favorite}
        aria-busy={busy || undefined}
        aria-label={
          favorite
            ? `Remove ${title} from favorites`
            : `Add ${title} to favorites`
        }
      >
        <StarIcon />
      </button>
    </Tooltip>
  );
}
