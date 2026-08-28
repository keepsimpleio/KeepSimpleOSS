import classNames from 'classnames';
import type { JSX } from 'react';
import { useEffect } from 'react';

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

// The `v` query is a cache key: the sprite is a public static file the browser
// caches hard, so a redrawn icon set never shows without a new URL. Bump it
// whenever all.svg changes.
const SPRITE_URL = '/library/images/icons/all.svg?v=2';
const SPRITE_DOM_ID = 'library-icon-sprite';

let spritePromise: Promise<void> | null = null;

// Safari (and some WebViews) ignore external `<use href="file.svg#id">`, so the
// sprite never resolves and every icon renders blank there. Fetch the sprite
// once and inline it into the document, then reference symbols same-document via
// `<use href="#id">`, which every browser supports.
function ensureSprite() {
  if (typeof document === 'undefined' || spritePromise) {
    return;
  }
  if (document.getElementById(SPRITE_DOM_ID)) {
    return;
  }
  spritePromise = fetch(SPRITE_URL)
    .then(res => res.text())
    .then(markup => {
      if (document.getElementById(SPRITE_DOM_ID)) {
        return;
      }
      const container = document.createElement('div');
      container.id = SPRITE_DOM_ID;
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText =
        'position:absolute;width:0;height:0;overflow:hidden';
      container.innerHTML = markup;
      document.body.prepend(container);
    })
    .catch(() => {
      spritePromise = null;
    });
}

export function Icon(props: IconProps): JSX.Element {
  const {
    width = 40,
    height = 40,
    color = 'currentColor',
    className,
    name,
  } = props;

  useEffect(() => {
    ensureSprite();
  }, []);

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
      <use href={`#${name}`} />
    </svg>
  );
}
