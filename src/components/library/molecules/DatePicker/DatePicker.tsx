import classNames from 'classnames';
import React, { JSX, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { createPortal } from 'react-dom';

import { useAnchoredPosition } from '@hooks/library/useAnchoredPosition';
import { useClickOutside } from '@hooks/library/useClickOutside';
import { usePresence } from '@hooks/library/usePresence';

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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  // The calendar is portaled: inside the modal's scroll box it was clipped at
  // the bottom edge, while every sibling menu already floats above it. Its
  // position is tracked against the trigger and flips upward when the
  // viewport runs out below.
  const menuPos = useAnchoredPosition(triggerRef, isOpen, popoverRef);
  // The popover stays mounted for its fade-out.
  const { mounted: popoverMounted, shown: popoverShown } = usePresence(
    isOpen,
    120,
  );

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ?? null);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={classNames(className, styles.wrapper)}>
      <button
        ref={triggerRef}
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
      {popoverMounted &&
        menuPos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="library">
            <div
              ref={popoverRef}
              className={classNames(styles.popover, {
                [styles.popoverClosing]: !popoverShown,
              })}
              style={{
                top: menuPos.top,
                left: menuPos.left,
                transform:
                  menuPos.placement === 'top' ? 'translateY(-100%)' : undefined,
              }}
              // Portaled, so the document-level click-outside listener would
              // close the picker on the very click that picks a day.
              onPointerDown={e => e.stopPropagation()}
            >
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
          </div>,
          document.body,
        )}
    </div>
  );
}
