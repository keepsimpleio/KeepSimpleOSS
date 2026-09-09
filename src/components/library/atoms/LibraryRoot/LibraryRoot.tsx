import classNames from 'classnames';
import React, { JSX, ReactNode } from 'react';

import { useGlobalState } from '@components/Context/library/GlobalStateContext';

interface LibraryRootProps {
  /** `div` for the dashboard pages, `main` on the home page. */
  as?: 'div' | 'main';
  className?: string;
  children: ReactNode;
}

/**
 * The `.library` wrapper every Library page stands in, carrying the theme the
 * viewer chose so the server already paints the page in it. The tokens are
 * keyed on this attribute (styles/library/themes.scss).
 */
export function LibraryRoot({
  as: Tag = 'div',
  className,
  children,
}: LibraryRootProps): JSX.Element {
  const { theme } = useGlobalState();
  return (
    <Tag className={classNames('library', className)} data-theme={theme}>
      {children}
    </Tag>
  );
}
