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
        <Image src={url} width={48} height={48} alt="Picture of the author" />
      ) : (
        <AvatarIcon />
      )}
    </div>
  );
}
