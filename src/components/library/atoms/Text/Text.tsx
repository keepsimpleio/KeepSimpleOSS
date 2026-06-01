'use client';

import React, { JSX } from 'react';
import classNames from 'classnames';

import { TextProps, TagType, TypographyVariant } from './Text.types';

import styles from './Text.module.scss';

export function Text(props: TextProps): JSX.Element {
  const { children, tag = TagType.P, className, variant = TypographyVariant.TextBase, id } = props;
  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={classNames(className, styles[`${variant}`])}>
      {children}
    </Tag>
  );
}
