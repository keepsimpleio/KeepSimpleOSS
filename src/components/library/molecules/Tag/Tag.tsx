import { getContrastTextColor } from '@utils/library/color';
import classNames from 'classnames';
import React, { JSX, useEffect, useRef, useState } from 'react';

import { CloseIcon } from '@icons/library/svg';

import { Text } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';

import type { TagProps } from './Tag.types';

import styles from './Tag.module.scss';

const DEFAULT_TAG_COLOR = '#0268ab';

export function Tag(props: TagProps): JSX.Element {
  const {
    className,
    label,
    color,
    active,
    description,
    hint,
    onClick,
    onRemove,
  } = props;
  const background = color && color.trim() ? color : DEFAULT_TAG_COLOR;
  const textColor = getContrastTextColor(background);
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;

    if (element) {
      const scrollWidth = element.scrollWidth;
      const offsetWidth = element.offsetWidth;
      setIsTruncated(scrollWidth > offsetWidth);
    }
  }, [label]);

  // A tag with a hint and no click is a control that is off, so it keeps its
  // tab stop and says why on focus as well as on hover. Dropping it out of the
  // tab order would leave a keyboard reader with a tag that simply ignores
  // them and no sentence to explain it.
  const explained = !onClick && !!hint;

  const tagContent = (
    <div
      role={onClick || explained ? 'button' : undefined}
      // A tag that filters the library is a control, so it takes a tab stop
      // and answers the keys a button answers. A plain label takes neither.
      tabIndex={onClick || explained ? 0 : undefined}
      aria-pressed={onClick ? !!active : undefined}
      aria-disabled={explained || undefined}
      style={{ background, color: textColor }}
      className={classNames(className, styles.wrapper, {
        [styles.withRemove]: !!onRemove,
        [styles.clickable]: !!onClick,
        [styles.explained]: explained,
        [styles.active]: !!active,
      })}
      onClick={onClick}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div ref={textRef} className={styles.textWrapper}>
        <Text className={styles.text}>{label}</Text>
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label ?? 'tag'}`}
          className={styles.removeButton}
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseIcon width={12} height={12} />
        </button>
      )}
    </div>
  );

  // What the pill says when the pointer rests on it: its own name when the
  // pill is too narrow to show the whole word, what the owner wrote about it,
  // and why it has no click to give. Each is only there when it has something
  // to say, and one line alone is handed over as plain text so a single hint
  // reads exactly as it always has.
  const lines = [
    isTruncated ? label : null,
    description?.trim() || null,
    hint ?? null,
  ].filter((line): line is string => !!line);

  const tooltipContent =
    lines.length === 0 ? (
      ''
    ) : lines.length === 1 ? (
      lines[0]
    ) : (
      <span className={styles.tip}>
        {lines.map(line => (
          <span key={line} className={styles.tipLine}>
            {line}
          </span>
        ))}
      </span>
    );

  return tooltipContent ? (
    <Tooltip
      place="bottom-start"
      arrowClassName={styles.arrow}
      tooltipContent={tooltipContent}
    >
      {tagContent}
    </Tooltip>
  ) : (
    tagContent
  );
}
