import classNames from 'classnames';
import React, { JSX, useId } from 'react';

import type { ToggleProps } from './Toggle.types';

import styles from './Toggle.module.scss';

export function Toggle(props: ToggleProps): JSX.Element {
  const { className, checked, ariaLabel, disabled, onChange } = props;
  const uniqueId = `toggle-${useId()}`;

  return (
    <div className={classNames(styles.wrapper, className)}>
      <input
        type="checkbox"
        id={uniqueId}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
        aria-label={ariaLabel}
        aria-checked={checked}
        role="switch"
      />
      <label
        htmlFor={uniqueId}
        className={classNames(styles.label, { [styles.disabled]: disabled })}
      />
    </div>
  );
}
