'use client';

import React, { JSX, useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useAnchoredPosition } from '@/hooks/useAnchoredPosition';

import { Text, TypographyVariant } from '@/components/atoms/Text';

import type { DropdownProps } from './Dropdown.types';

import { ArrowIcon, CheckIcon } from '@/assets/svg';

import styles from './Dropdown.module.scss';

export function Dropdown(props: DropdownProps): JSX.Element {
  const {
    value,
    options,
    onChange,
    className,
    customHeader,
    menuClassName,
    triggerClassName,
    placeholder = 'Select...',
    disabled = false,
    portal = false,
    ariaLabel = 'Select option',
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveSubMenu(null);
  }, []);

  const dropdownRef = useClickOutside(handleClose);
  const triggerRef = useRef<HTMLElement | null>(null);

  // When portaled the menu is detached from the trigger's box, so its position
  // is tracked against the trigger and recomputed on scroll/resize.
  const menuPos = useAnchoredPosition(triggerRef, portal && isOpen);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string, hasSubOptions: boolean) => {
    if (hasSubOptions) {
      setActiveSubMenu((prev) => (prev === optionValue ? null : optionValue));
      return;
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setActiveSubMenu(null);
  };

  const handleSubSelect = (subValue: string) => {
    onChange?.(subValue);
    setIsOpen(false);
    setActiveSubMenu(null);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setActiveSubMenu(null);
  };

  const menuContent = (
    <div
      className={classNames(styles.menu, menuClassName)}
      style={
        portal && menuPos
          ? {
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              zIndex: 1500,
            }
          : undefined
      }
      // Portaled menu sits outside dropdownRef, so useClickOutside would close
      // the dropdown on the click that's about to select an option. Stop the
      // pointerdown from reaching the document-level listener.
      onPointerDown={portal ? (e) => e.stopPropagation() : undefined}
    >
      {options.map((option) => {
        const hasSubOptions = Boolean(option.subOptions?.length);
        const isSubOpen = activeSubMenu === option.value;
        const isSelectedParent =
          value === option.value ||
          (hasSubOptions && option.subOptions!.some((s) => s.value === value));
        return (
          <div key={option.value} className={styles.optionWrapper}>
            <div
              role="button"
              className={classNames(styles.option, {
                [styles.selected]: isSelectedParent,
                [styles.hasSubMenu]: hasSubOptions,
              })}
              onClick={() => handleSelect(option.value, hasSubOptions)}
              aria-label={`Select ${option.label}`}
              aria-expanded={hasSubOptions ? isSubOpen : undefined}
            >
              <Text variant={TypographyVariant.TextBase}>{option.label}</Text>
              {hasSubOptions ? (
                <ArrowIcon
                  width={14}
                  height={14}
                  className={classNames(styles.subArrow, { [styles.rotated]: isSubOpen })}
                />
              ) : (
                value === option.value && (
                  <CheckIcon width={14} height={14} className={styles.check} />
                )
              )}
            </div>
            {hasSubOptions && isSubOpen && (
              <div className={styles.subMenu}>
                {option.subOptions!.map((sub) => (
                  <div
                    key={sub.value}
                    role="button"
                    className={classNames(styles.option, {
                      [styles.selected]: value === sub.value,
                    })}
                    onClick={() => handleSubSelect(sub.value)}
                    aria-label={`Select ${sub.label}`}
                  >
                    <Text variant={TypographyVariant.TextBase}>{sub.label}</Text>
                    {value === sub.value && (
                      <CheckIcon width={14} height={14} className={styles.check} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={dropdownRef} className={classNames(className, styles.dropdown)}>
      {customHeader ? (
        <div
          ref={(el) => {
            triggerRef.current = el;
          }}
          className={classNames(styles.trigger, triggerClassName, {
            [styles.open]: isOpen,
            [styles.disabled]: disabled,
          })}
          onClick={toggleDropdown}
          role="button"
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-disabled={disabled || undefined}
        >
          {customHeader}
        </div>
      ) : (
        <button
          ref={(el) => {
            triggerRef.current = el;
          }}
          type="button"
          className={classNames(styles.trigger, triggerClassName, {
            [styles.open]: isOpen,
            [styles.disabled]: disabled,
          })}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
        >
          <Text className={styles.text} variant={TypographyVariant.TextBase}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <div className={styles.iconWrapper}>
            <ArrowIcon
              width={16}
              height={16}
              className={classNames(styles.icon, { [styles.rotated]: isOpen })}
            />
          </div>
        </button>
      )}
      {isOpen &&
        (portal && typeof document !== 'undefined' && menuPos
          ? createPortal(menuContent, document.body)
          : menuContent)}
    </div>
  );
}
