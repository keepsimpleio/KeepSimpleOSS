import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX } from 'react';

import { AvatarIcon } from '@icons/library/svg';

import type { AvatarProps } from './Avatar.types';

import styles from './Avatar.module.scss';

// The home-grid card renders a 208px square (100px under 590px) and crops the
// source with `object-fit: cover`. Declaring the bare box width made the
// browser pick a candidate that only had 208px across its LONG side, so a
// landscape avatar was upscaled to fill the square: a 1456x816 upload arrived
// as 480x269 and had its 269px short side stretched over a 416px retina box.
// 1.78x headroom covers a 16:9 source, and the browser's own DPR multiplier
// rides on top of it.
const DEFAULT_SIZES = '(max-width: 590px) 180px, 370px';

// Uploads are already lossy, and next/image re-encodes them; the default
// quality of 75 stacks a second generation of artifacts on a face shown at
// small size. Avatars are a few tens of KB, so buy the fidelity back.
const AVATAR_QUALITY = 90;

export function Avatar(props: AvatarProps): JSX.Element {
  const { className, url, sizes = DEFAULT_SIZES } = props;

  return (
    <div className={classNames(className, styles.avatar)}>
      {url ? (
        <Image
          src={url}
          fill
          sizes={sizes}
          quality={AVATAR_QUALITY}
          alt="Picture of the author"
        />
      ) : (
        <AvatarIcon />
      )}
    </div>
  );
}
