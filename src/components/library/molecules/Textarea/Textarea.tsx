import React from 'react';
import classNames from 'classnames';

import type { TextareaProps } from './Textarea.types';

import styles from './Textarea.module.scss';

export function Textarea(props: TextareaProps) {
  const {
    value,
    placeholder,
    wrapperClassName,
    placeholderColor,
    className,
    disabled,
    ariaLabel,
    rows = 4,
    onChange,
    ...rest
  } = props;

  return (
    <div className={classNames(styles.container, wrapperClassName)}>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={classNames(styles.textarea, className)}
        disabled={disabled}
        aria-label={ariaLabel}
        rows={rows}
        style={{ '--placeholder-color': placeholderColor }}
        {...rest}
      />
    </div>
  );
}
