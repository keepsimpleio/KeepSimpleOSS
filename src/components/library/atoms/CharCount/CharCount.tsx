import classNames from 'classnames';
import React, { JSX } from 'react';

import styles from './CharCount.module.scss';

interface CharCountProps {
  current: number;
  max: number;
  className?: string;
}

export function CharCount({
  current,
  max,
  className,
}: CharCountProps): JSX.Element {
  return (
    <span
      className={classNames(styles.count, className, {
        [styles.over]: current > max,
      })}
      aria-hidden="true"
    >
      {current}/{max}
    </span>
  );
}
