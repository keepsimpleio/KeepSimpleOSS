import React, { JSX, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import type { TagProps } from './Tag.types';
import { Text } from '@/components/atoms/Text';
import { Tooltip } from '@/components/atoms/Tooltip';

import { getContrastTextColor } from '@/utils/color';

import { CloseIcon } from '@/assets/svg';

import styles from './Tag.module.scss';

const DEFAULT_TAG_COLOR = '#0268ab';

export function Tag(props: TagProps): JSX.Element {
  const { className, label, color, onClick, onRemove } = props;
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

  const tagContent = (
    <div
      role={onClick ? 'button' : undefined}
      style={{ background, color: textColor }}
      className={classNames(className, styles.wrapper, { [styles.withRemove]: !!onRemove })}
      onClick={onClick}
    >
      <div ref={textRef} className={styles.textWrapper}>
        <Text className={styles.text}>{label}</Text>
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label ?? 'tag'}`}
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseIcon width={12} height={12} />
        </button>
      )}
    </div>
  );

  return isTruncated ? (
    <Tooltip place="bottom-start" arrowClassName={styles.arrow} tooltipContent={label ?? ''}>
      {tagContent}
    </Tooltip>
  ) : (
    tagContent
  );
}
