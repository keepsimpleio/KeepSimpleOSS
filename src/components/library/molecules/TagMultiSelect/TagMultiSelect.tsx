import classNames from 'classnames';
import React, { JSX, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAnchoredPosition } from '@hooks/library/useAnchoredPosition';
import { useClickOutside } from '@hooks/library/useClickOutside';

import { ArrowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tag } from '@components/library/molecules/Tag';

import type { TagMultiSelectProps, TagOption } from './TagMultiSelect.types';

import styles from './TagMultiSelect.module.scss';

export function TagMultiSelect(props: TagMultiSelectProps): JSX.Element {
  const {
    options,
    value,
    onChange,
    placeholder = 'Select tags',
    emptyState = 'No tags available',
    maxItems,
    disabled,
    className,
    ariaLabel = 'Select tags',
    portal = false,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useClickOutside(() => setIsOpen(false));
  const triggerRef = useRef<HTMLButtonElement>(null);

  // When portaled the menu is detached from the trigger's box, so its position
  // is tracked against the trigger and recomputed on scroll/resize.
  const menuPos = useAnchoredPosition(triggerRef, portal && isOpen);

  const isSelected = (option: TagOption) => value.some(t => t.id === option.id);

  const toggle = (option: TagOption) => {
    if (isSelected(option)) {
      onChange(value.filter(t => t.id !== option.id));
      return;
    }
    if (maxItems && value.length >= maxItems) return;
    onChange([...value, option]);
  };

  const remove = (id: number) => onChange(value.filter(t => t.id !== id));

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
        <Text
          variant={TypographyVariant.TextBase}
          className={styles.placeholder}
        >
          {value.length > 0 ? `${value.length} selected` : placeholder}
        </Text>
        <ArrowIcon
          width={16}
          height={16}
          className={classNames(styles.icon, { [styles.rotated]: isOpen })}
        />
      </button>
      {isOpen &&
        (!portal || menuPos) &&
        (() => {
          const menuContent = (
            <div
              className={styles.menu}
              role="listbox"
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
              // Portaled menu sits outside rootRef, so useClickOutside would close
              // it on the click that's about to toggle an option. Stop the
              // pointerdown from reaching the document-level listener.
              onPointerDown={portal ? e => e.stopPropagation() : undefined}
            >
              {options.length === 0 ? (
                <div className={styles.empty}>
                  <Text variant={TypographyVariant.TextSmall}>
                    {emptyState}
                  </Text>
                </div>
              ) : (
                options.map(option => {
                  const selected = isSelected(option);
                  return (
                    <div
                      key={option.id}
                      role="option"
                      aria-selected={selected}
                      className={classNames(styles.option, {
                        [styles.selected]: selected,
                      })}
                      onClick={() => toggle(option)}
                    >
                      <Tag label={option.name} color={option.color} />
                      {selected && (
                        <Text
                          variant={TypographyVariant.TextSmall}
                          className={styles.checkmark}
                        >
                          ✓
                        </Text>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );

          return portal && typeof document !== 'undefined'
            ? createPortal(menuContent, document.body)
            : menuContent;
        })()}

      {value.length > 0 && (
        <div className={styles.chips}>
          {value.map(tag => (
            <Tag
              key={tag.id}
              label={tag.name}
              color={tag.color}
              onRemove={() => remove(tag.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
