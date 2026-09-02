import classNames from 'classnames';
import React, { JSX } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import type { TooltipProps } from './Tooltip.types';

import 'react-tooltip/dist/react-tooltip.css';
import styles from './Tooltip.module.scss';

export function Tooltip(props: TooltipProps): JSX.Element {
  const {
    place = 'bottom',
    children,
    className,
    tooltipContent,
    arrowClassName,
    wrapperClassName,
  } = props;
  const generatedId = `tooltip-${React.useId().replace(/:/g, '-')}`;
  // react-tooltip only takes a string through `content`; richer labels go in
  // as children.
  const isPlainContent = typeof tooltipContent === 'string';

  return (
    <div className={wrapperClassName}>
      <div data-tooltip-id={generatedId}>{children}</div>
      <ReactTooltip
        id={generatedId}
        place={place}
        content={isPlainContent ? tooltipContent : undefined}
        className={classNames(styles.wrapper, className)}
        classNameArrow={arrowClassName}
      >
        {isPlainContent ? null : tooltipContent}
      </ReactTooltip>
    </div>
  );
}
