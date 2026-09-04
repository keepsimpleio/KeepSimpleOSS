import classNames from 'classnames';
import React, { JSX } from 'react';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { SelectToggleProps } from './SelectToggle.types';

import styles from './SelectToggle.module.scss';

export function SelectToggle({
  selected,
  onToggle,
  className,
  disabled = false,
  reason,
}: SelectToggleProps): JSX.Element {
  // The toggle sits on top of a card that is itself a button, so keep the
  // click/press/drag from bubbling up and opening the object overview.
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  // A chip that cannot be used says what is in the way instead of offering an
  // action that does nothing. The strip is a fixed width over the artwork, so
  // the longer wording costs no layout. It is a label, not a tooltip: a tooltip
  // rendered here would be cut off by the shelf's own scroll clipping.
  const label = disabled && reason ? reason : selected ? 'Remove' : 'Select';

  return (
    <button
      type="button"
      className={classNames(styles.toggle, className, {
        [styles.selected]: selected,
        [styles.disabled]: disabled,
      })}
      onClick={handleClick}
      onPointerDown={stop}
      onKeyDown={stop}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={selected ? 'Remove from selection' : label}
    >
      <Text variant={TypographyVariant.TextSmall}>{label}</Text>
    </button>
  );
}
