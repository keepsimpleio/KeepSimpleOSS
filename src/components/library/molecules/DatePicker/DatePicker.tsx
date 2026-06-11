import classNames from 'classnames';
import React, { JSX, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import { useClickOutside } from '@hooks/library/useClickOutside';

import { ArrowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { DatePickerProps } from './DatePicker.types';

import 'react-day-picker/style.css';
import styles from './DatePicker.module.scss';

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function DatePicker(props: DatePickerProps): JSX.Element {
  const {
    value,
    onChange,
    placeholder = 'Select date',
    disabled,
    className,
    ariaLabel = 'Select date',
    minDate,
    maxDate,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useClickOutside(() => setIsOpen(false));

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ?? null);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={classNames(className, styles.wrapper)}>
      <button
        type="button"
        className={classNames(styles.trigger, { [styles.open]: isOpen })}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <Text variant={TypographyVariant.TextBase} className={styles.text}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <ArrowIcon
          width={16}
          height={16}
          className={classNames(styles.icon, { [styles.rotated]: isOpen })}
        />
      </button>
      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={value ?? undefined}
            onSelect={handleSelect}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            // Month + year dropdown caption — the bare prev/next chevrons make
            // jumping decades (publication dates can be old) painful.
            captionLayout="dropdown"
            startMonth={minDate ?? new Date(1500, 0)}
            endMonth={maxDate ?? new Date(new Date().getFullYear() + 5, 11)}
            defaultMonth={value ?? undefined}
            showOutsideDays
          />
        </div>
      )}
    </div>
  );
}
