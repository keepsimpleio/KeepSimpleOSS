import type { JSX } from 'react';
import classNames from 'classnames';

import { IconProps } from './Icon.types';

import styles from './Icon.module.scss';

export function Icon(props: IconProps): JSX.Element {
  const { width = 40, height = 40, color = 'currentColor', className, name } = props;

  return (
    <svg
      className={classNames(styles.icon, className)}
      style={{ color: color }}
      fill={color !== 'currentColor' ? undefined : color}
      width={width}
      height={height}
      role="graphics-document"
    >
      <use href={`/images/icons/all.svg#${name}`} />
    </svg>
  );
}
