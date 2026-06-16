import { ReactNode } from 'react';

export enum TagType {
  Span = 'span',
  P = 'p',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum TypographyVariant {
  TitlePrimary = 'title-primary',
  TitleSecondaryBold = 'title-secondary-bold',
  SubtitleSecondarySemi = 'subtitle-secondary-semi',
  SubtitleSecondaryBold = 'subtitle-secondary-bold',
  SubtitleSecondaryAlt = 'subtitle-secondary-alt',
  TextBaseBold = 'text-base-bold',
  TextBase = 'text-base',
  TextBaseSemibold = 'text-base-semibold',
  TextRegular = 'text-regular',
  TextQuaternary = 'text-quaternary',
  TextSmall = 'text-small',
  TextTiny = 'text-tiny',
}

export interface TextProps {
  children: ReactNode;
  variant?: TypographyVariant;
  tag?: TagType;
  className?: string;
  id?: string;
}
