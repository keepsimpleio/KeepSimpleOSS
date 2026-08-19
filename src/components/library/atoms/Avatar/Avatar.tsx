import classNames from 'classnames';
import Image from 'next/image';
import React, { JSX } from 'react';

import { AvatarIcon } from '@icons/library/svg';

import type { AvatarProps } from './Avatar.types';

import styles from './Avatar.module.scss';

export function Avatar(props: AvatarProps): JSX.Element {
  const { className, url } = props;

  return (
    <div className={classNames(className, styles.avatar)}>
      {url ? (
        <Image
          src={url}
          fill
          sizes="(max-width: 590px) 100px, 208px"
          alt="Picture of the author"
        />
      ) : (
        <AvatarIcon />
      )}
    </div>
  );
}
