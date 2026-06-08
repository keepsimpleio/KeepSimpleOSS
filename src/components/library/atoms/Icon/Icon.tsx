import classNames from 'classnames';
import type { JSX } from 'react';

import { IconName, IconProps } from './Icon.types';

import styles from './Icon.module.scss';

// Each sprite symbol declares its own coordinate space in all.svg. The
// consuming <svg> needs a matching viewBox, otherwise the symbol renders at
// native coordinates pinned to the top-left and clips/floats instead of
// scaling into the requested width/height. Keep in sync with all.svg.
const ICON_VIEWBOX: Record<IconName, string> = {
  [IconName.Edit]: '0 0 16 16',
  [IconName.Telegram]: '0 0 20 17',
  [IconName.Close]: '0 0 16 17',
  [IconName.Info]: '0 0 45 44',
  [IconName.Settings]: '0 0 16 17',
  [IconName.Book]: '0 0 18 18',
  [IconName.Audio]: '0 0 13 13',
  [IconName.Video]: '0 0 13 13',
  [IconName.Logo]: '0 0 23 12',
  [IconName.VerticalLine]: '0 0 2 22',
  [IconName.TextLogo]: '0 0 134 27',
  [IconName.Arrow]: '0 0 24 25',
  [IconName.Search]: '0 0 24 24',
  [IconName.Avatar]: '0 0 208 208',
  [IconName.Hamburger]: '0 0 16 12',
  [IconName.Plus]: '0 0 16 16',
  [IconName.Copy]: '0 0 16 16',
};

export function Icon(props: IconProps): JSX.Element {
  const {
    width = 40,
    height = 40,
    color = 'currentColor',
    className,
    name,
  } = props;

  return (
    <svg
      className={classNames(styles.icon, className)}
      style={{ color: color }}
      fill={color !== 'currentColor' ? undefined : color}
      width={width}
      height={height}
      viewBox={ICON_VIEWBOX[name]}
      role="graphics-document"
    >
      <use href={`/library/images/icons/all.svg#${name}`} />
    </svg>
  );
}
