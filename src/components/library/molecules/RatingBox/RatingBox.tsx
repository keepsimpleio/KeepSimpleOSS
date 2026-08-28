import classNames from 'classnames';
import React, { JSX, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Difficulty, OverallRating } from '@local-types/library/object';

import { useAnchoredPosition } from '@hooks/library/useAnchoredPosition';
import { useClickOutside } from '@hooks/library/useClickOutside';

import { ArrowIcon } from '@icons/library/svg';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { WashStroke } from '@components/library/atoms/WashStroke';

import type { RatingBoxProps } from './RatingBox.types';

import styles from './RatingBox.module.scss';

const OVERALL_COLORS: Record<OverallRating, string> = {
  1: '#c45222',
  2: '#ff9a00',
  3: '#d9b800',
  4: '#2db675',
  5: '#228858',
};

interface DifficultyMeta {
  label: string;
  color: string;
}

const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
  very_hard: { label: 'Very Hard', color: '#c45222' },
  hard: { label: 'Hard', color: '#ff9a00' },
  moderate: { label: 'Moderate', color: '#d9b800' },
  easy: { label: 'Easy', color: '#2db675' },
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
  valueSuffix?: string;
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
    valueSuffix,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const ref = useClickOutside(close);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Keep the portaled menu glued to the trigger as the modal/page scrolls.
  // Placement is decided by viewport width, not measured space: open upward at
  // 1920px and below, downward only on wider screens. Width-based placement is
  // settled before the menu paints, so it never opens one way then jumps.
  const menuPos = useAnchoredPosition(triggerRef, isOpen, menuRef, {
    openUpMaxWidth: 1920,
  });

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
          <div className="library">
            <div
              ref={menuRef}
              role="listbox"
              className={styles.menu}
              style={{
                position: 'fixed',
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
                zIndex: 1500,
                transform:
                  menuPos.placement === 'top' ? 'translateY(-100%)' : undefined,
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
            </div>
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
          {hasValue && valueSuffix && (
            <span className={styles.suffix}>{valueSuffix}</span>
          )}
        </Text>
        {!readOnly && (
          <ArrowIcon
            width={12}
            height={12}
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
      {/* The rating sits on a brush wash instead of a boxed 1px border —
          the same stroke language as the shelf titles. */}
      <WashStroke accent={3} alpha={0.16} className={styles.wash} />
      <Text variant={TypographyVariant.TextSmall} className={styles.header}>
        {username} rated this book:
      </Text>
      <div className={styles.row}>
        <ColoredSelect<OverallRating>
          label="Overall:"
          value={overallRating}
          options={OVERALL_VALUES}
          renderLabel={v => String(v)}
          getColor={v => OVERALL_COLORS[v]}
          onChange={onOverallChange}
          readOnly={readOnly}
          placeholder="—"
          valueSuffix="/5"
        />
        <ColoredSelect<Difficulty>
          label="Difficulty:"
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
