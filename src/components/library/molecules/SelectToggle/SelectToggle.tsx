import classNames from 'classnames';
import React, { JSX } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { SelectToggleProps } from './SelectToggle.types';

import styles from './SelectToggle.module.scss';

export function SelectToggle({
  selected,
  onToggle,
  className,
}: SelectToggleProps): JSX.Element {
  // The toggle sits on top of a card that is itself a button, so keep the
  // click/press/drag from bubbling up and opening the object overview.
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      type="button"
      className={classNames(styles.toggle, className, {
        [styles.selected]: selected,
      })}
      onClick={handleClick}
      onPointerDown={stop}
      onKeyDown={stop}
      aria-pressed={selected}
      aria-label={selected ? 'Remove from selection' : 'Select'}
    >
      <Text variant={TypographyVariant.TextSmall}>
        {selected ? 'Remove' : 'Select'}
      </Text>
    </button>
  );
}
