import classNames from 'classnames';
import React, { JSX, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import type { TooltipProps } from './Tooltip.types';

import styles from './Tooltip.module.scss';

export function Tooltip(props: TooltipProps): JSX.Element {
  const {
    place = 'bottom',
    children,
    className,
    tooltipContent,
    arrowClassName,
    wrapperClassName,
    asChild = false,
  } = props;
  const generatedId = `tooltip-${React.useId().replace(/:/g, '-')}`;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isPlainContent = typeof tooltipContent === 'string';
  const anchor =
    asChild && React.isValidElement(children) ? (
      React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          'data-tooltip-id': generatedId,
        },
      )
    ) : (
      <div className={wrapperClassName}>
        <div data-tooltip-id={generatedId}>{children}</div>
      </div>
    );

  return (
    <>
      {anchor}
      {mounted &&
        tooltipContent &&
        createPortal(
          <div className={classNames('library', styles.layer)}>
            <ReactTooltip
              id={generatedId}
              place={place}
              positionStrategy="fixed"
              content={isPlainContent ? tooltipContent : undefined}
              className={classNames(styles.wrapper, className)}
              classNameArrow={arrowClassName}
            >
              {isPlainContent ? null : tooltipContent}
            </ReactTooltip>
          </div>,
          document.body,
        )}
    </>
  );
}
