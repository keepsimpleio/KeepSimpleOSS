import classNames from 'classnames';
import React, { JSX, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Difficulty, OverallRating } from '@local-types/library/object';

import { useAnchoredPosition } from '@hooks/library/useAnchoredPosition';
import { useClickOutside } from '@hooks/library/useClickOutside';

import { ArrowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { RatingBoxProps } from './RatingBox.types';

import styles from './RatingBox.module.scss';

const OVERALL_COLORS: Record<OverallRating, string> = {
  1: '#e4002d',
  2: '#ff9a00',
  3: '#f5b800',
  4: '#88eebe',
  5: '#228858',
};

interface DifficultyMeta {
  label: string;
  color: string;
}

const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
  very_hard: { label: 'Very Hard', color: '#e4002d' },
  hard: { label: 'Hard', color: '#ff9a00' },
  moderate: { label: 'Moderate', color: '#f5b800' },
  easy: { label: 'Easy', color: '#228858' },
};

const OVERALL_VALUES: OverallRating[] = [1, 2, 3, 4, 5];
const DIFFICULTY_VALUES: Difficulty[] = [
  'very_hard',
  'hard',
  'moderate',
  'easy',
];

interface ColoredSelectProps<T extends string | number> {
  label: string;
  value?: T;
  options: T[];
  renderLabel: (value: T) => string;
  getColor: (value: T) => string;
  onChange?: (value: T) => void;
  readOnly: boolean;
  placeholder: string;
}

function ColoredSelect<T extends string | number>(
  props: ColoredSelectProps<T>,
): JSX.Element {
  const {
    label,
    value,
    options,
    renderLabel,
    getColor,
    onChange,
    readOnly,
    placeholder,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const ref = useClickOutside(close);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Keep the portaled menu glued to the trigger as the modal/page scrolls.
  const menuPos = useAnchoredPosition(triggerRef, isOpen);

  const handleToggle = () => {
    if (readOnly) return;
    setIsOpen(prev => !prev);
  };

  const handleSelect = (next: T) => {
    onChange?.(next);
    setIsOpen(false);
  };

  const hasValue = value !== undefined && value !== null;
  const displayLabel = hasValue ? renderLabel(value as T) : placeholder;
  const displayColor = hasValue ? getColor(value as T) : undefined;

  const menu =
    isOpen && !readOnly && menuPos && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="listbox"
            className={styles.menu}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              zIndex: 1500,
            }}
            // Keep clicks inside the portaled menu from triggering useClickOutside.
            onPointerDown={e => e.stopPropagation()}
          >
            {options.map(opt => (
              <button
                key={String(opt)}
                type="button"
                role="option"
                aria-selected={opt === value}
                className={classNames(styles.option, {
                  [styles.selected]: opt === value,
                })}
                onClick={() => handleSelect(opt)}
                style={{ color: getColor(opt) }}
              >
                {renderLabel(opt)}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={ref} className={styles.field}>
      <Text variant={TypographyVariant.TextSmall} className={styles.label}>
        {label}
      </Text>

      <button
        ref={triggerRef}
        type="button"
        className={classNames(styles.trigger, {
          [styles.open]: isOpen,
          [styles.readOnly]: readOnly,
        })}
        onClick={handleToggle}
        aria-haspopup={readOnly ? undefined : 'listbox'}
        aria-expanded={readOnly ? undefined : isOpen}
        aria-label={label}
        disabled={readOnly && !hasValue}
      >
        <Text
          variant={TypographyVariant.TextBase}
          className={classNames(styles.value, {
            [styles.placeholder]: !hasValue,
          })}
        >
          <span style={displayColor ? { color: displayColor } : undefined}>
            {displayLabel}
          </span>
        </Text>
        {!readOnly && (
          <ArrowIcon
            width={16}
            height={16}
            className={classNames(styles.chevron, { [styles.rotated]: isOpen })}
          />
        )}
      </button>

      {menu}
    </div>
  );
}

export function RatingBox(props: RatingBoxProps): JSX.Element {
  const {
    username,
    overallRating,
    difficulty,
    onOverallChange,
    onDifficultyChange,
    readOnly = false,
    className,
  } = props;

  return (
    <div className={classNames(styles.wrapper, className)}>
      <Text variant={TypographyVariant.TextSmall} className={styles.header}>
        {username} rated this book:
      </Text>
      <div className={styles.row}>
        <ColoredSelect<OverallRating>
          label="Overall"
          value={overallRating}
          options={OVERALL_VALUES}
          renderLabel={v => String(v)}
          getColor={v => OVERALL_COLORS[v]}
          onChange={onOverallChange}
          readOnly={readOnly}
          placeholder="—"
        />
        <ColoredSelect<Difficulty>
          label="Difficulty"
          value={difficulty}
          options={DIFFICULTY_VALUES}
          renderLabel={v => DIFFICULTY_META[v].label}
          getColor={v => DIFFICULTY_META[v].color}
          onChange={onDifficultyChange}
          readOnly={readOnly}
          placeholder="—"
        />
      </div>
    </div>
  );
}
