import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type OwnProps<T extends ElementType> = {
  as?: T;
  text?: string;
  leftIcon?: ReactNode;
  className?: string;
  isWhite?: boolean;
  children?: ReactNode;
  contentClassName?: string;
  dataCy?: string;
};

export type BorderedPillProps<T extends ElementType = 'button'> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>;
