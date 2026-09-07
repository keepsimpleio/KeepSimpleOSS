import classNames from 'classnames';
import React, { JSX, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAnchoredPosition } from '@hooks/library/useAnchoredPosition';
import { useClickOutside } from '@hooks/library/useClickOutside';
import { usePresence } from '@hooks/library/usePresence';

import { ArrowIcon, CheckIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { DropdownProps } from './Dropdown.types';

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
  const menuRef = useRef<HTMLDivElement>(null);

  // When portaled the menu is detached from the trigger's box, so its position
  // is tracked against the trigger and recomputed on scroll/resize. It flips
  // above the trigger when it would overflow the bottom of the viewport.
  const menuPos = useAnchoredPosition(triggerRef, portal && isOpen, menuRef);
  // The menu stays mounted for its fade-out.
  const { mounted: menuMounted, shown: menuShown } = usePresence(isOpen, 120);

  const selectedOption = options.find(opt => opt.value === value);

  // The option rows are divs, so they get no keyboard behaviour for free.
  // Enter and Space are what a button would answer to, and Space must not also
  // scroll the menu underneath.
  const activateOnKey =
    (activate: () => void) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    };

  const handleSelect = (optionValue: string, hasSubOptions: boolean) => {
    if (hasSubOptions) {
      setActiveSubMenu(prev => (prev === optionValue ? null : optionValue));
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
      ref={menuRef}
      className={classNames(styles.menu, menuClassName, {
        [styles.menuPortal]: portal && menuPos,
        [styles.menuClosing]: !menuShown,
      })}
      style={
        portal && menuPos
          ? {
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              transform:
                menuPos.placement === 'top' ? 'translateY(-100%)' : undefined,
            }
          : undefined
      }
      // Portaled menu sits outside dropdownRef, so useClickOutside would close
      // the dropdown on the click that's about to select an option. Stop the
      // pointerdown from reaching the document-level listener.
      onPointerDown={portal ? e => e.stopPropagation() : undefined}
    >
      {options.map(option => {
        const hasSubOptions = Boolean(option.subOptions?.length);
        const isSubOpen = activeSubMenu === option.value;
        const isSelectedParent =
          value === option.value ||
          (hasSubOptions && option.subOptions!.some(s => s.value === value));
        return (
          <div key={option.value} className={styles.optionWrapper}>
            <div
              role="button"
              className={classNames(styles.option, {
                [styles.selected]: isSelectedParent,
                [styles.hasSubMenu]: hasSubOptions,
              })}
              tabIndex={0}
              onClick={() => handleSelect(option.value, hasSubOptions)}
              onKeyDown={activateOnKey(() =>
                handleSelect(option.value, hasSubOptions),
              )}
              aria-label={`Select ${option.label}`}
              aria-expanded={hasSubOptions ? isSubOpen : undefined}
            >
              <Text variant={TypographyVariant.TextBase}>{option.label}</Text>
              {hasSubOptions ? (
                <ArrowIcon
                  width={14}
                  height={14}
                  className={classNames(styles.subArrow, {
                    [styles.rotated]: isSubOpen,
                  })}
                />
              ) : (
                value === option.value && (
                  <CheckIcon width={14} height={14} className={styles.check} />
                )
              )}
            </div>
            {hasSubOptions && isSubOpen && (
              <div className={styles.subMenu}>
                {option.subOptions!.map(sub => (
                  <div
                    key={sub.value}
                    role="button"
                    className={classNames(styles.option, {
                      [styles.selected]: value === sub.value,
                    })}
                    tabIndex={0}
                    onClick={() => handleSubSelect(sub.value)}
                    onKeyDown={activateOnKey(() => handleSubSelect(sub.value))}
                    aria-label={`Select ${sub.label}`}
                  >
                    <Text variant={TypographyVariant.TextBase}>
                      {sub.label}
                    </Text>
                    {value === sub.value && (
                      <CheckIcon
                        width={14}
                        height={14}
                        className={styles.check}
                      />
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
          ref={el => {
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
          ref={el => {
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
      {menuMounted &&
        (portal && typeof document !== 'undefined' && menuPos
          ? createPortal(
              <div className="library">{menuContent}</div>,
              document.body,
            )
          : menuContent)}
    </div>
  );
}
