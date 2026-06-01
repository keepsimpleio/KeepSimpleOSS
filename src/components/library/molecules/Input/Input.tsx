import classNames from 'classnames';
import React from 'react';

import { CloseIcon, SearchIcon } from '@icons/library/svg';

import type { InputProps } from './Input.types';

import styles from './Input.module.scss';

export function Input(props: InputProps) {
  const {
    type,
    value,
    placeholder,
    wrapperClassName,
    placeholderColor,
    className,
    disabled,
    ariaLabel,
    onChange,
    onClear,
    ...rest
  } = props;

  const isSearch = type === 'search';
  const isEmptyText = !value?.trim();
  const Icon = isEmptyText ? SearchIcon : CloseIcon;

  return (
    <div className={classNames(styles.container, wrapperClassName)}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={classNames(styles.input, className, {
          [styles.search]: isSearch,
        })}
        disabled={disabled}
        aria-label={ariaLabel}
        style={{ '--placeholder-color': placeholderColor }}
        {...rest}
      />
      {isSearch && (
        <Icon
          className={styles.icon}
          width={24}
          height={24}
          {...(!isEmptyText && { onClick: onClear })}
        />
      )}
    </div>
  );
}
