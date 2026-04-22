import cn from 'classnames';
import React, { ElementType } from 'react';

import Borders from '@icons/longevity/Borders';

import type { BorderedPillProps } from './BorderedPill.types';

import styles from './BorderedPill.module.scss';

export function BorderedPill<T extends ElementType = 'button'>({
  as,
  text,
  leftIcon,
  children,
  className,
  contentClassName,
  isWhite,
  dataCy,
  ...rest
}: BorderedPillProps<T>) {
  const Component = (as ?? 'button') as ElementType;

  return (
    <Component
      className={cn(styles.root, className, {
        [styles.white]: isWhite,
      })}
      {...(rest as any)}
      data-cy={dataCy}
    >
      <Borders className={styles.border} />
      <span className={cn(styles.content, contentClassName)}>
        {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
        {text ? <span className={styles.label}>{text} </span> : children}
      </span>
    </Component>
  );
}
