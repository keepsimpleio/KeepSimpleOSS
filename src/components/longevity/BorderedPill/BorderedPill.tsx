import React, { ElementType } from 'react';
import cn from 'classnames';

import type { BorderedPillProps } from './BorderedPill.types';

import Borders from '@icons/longevity/Borders';

import styles from './BorderedPill.module.scss';

export function BorderedPill<T extends ElementType = 'button'>({
  as,
  text,
  leftIcon,
  children,
  className,
  isWhite,
  ...rest
}: BorderedPillProps<T>) {
  const Component = (as ?? 'button') as ElementType;

  return (
    <Component
      className={cn(styles.root, className, {
        [styles.white]: isWhite,
      })}
      {...(rest as any)}
    >
      <Borders className={styles.border} aria-hidden />
      <span className={styles.content}>
        {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
        {text ? <span className={styles.label}>{text} </span> : children}
      </span>
    </Component>
  );
}
