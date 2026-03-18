import type { ElementType, ReactNode } from 'react';

type CommonProps<T extends ElementType> = {
  as?: T;
  text?: string;
  leftIcon?: ReactNode;
  className?: string;
  isWhite?: boolean;
  children?: ReactNode;
  contentClassName?: string;
  dataCy?: string;
};

type ButtonOnlyProps = {
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

type NonButtonProps = {
  onClick?: never;
  type?: never;
  disabled?: never;
};

export type BorderedPillProps<T extends ElementType = 'button'> =
  CommonProps<T> & (T extends 'button' ? ButtonOnlyProps : NonButtonProps);
