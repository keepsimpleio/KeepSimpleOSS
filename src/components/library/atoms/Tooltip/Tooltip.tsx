import React, { JSX } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import classNames from 'classnames';

import 'react-tooltip/dist/react-tooltip.css';

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
  } = props;
  const generatedId = `tooltip-${React.useId().replace(/:/g, '-')}`;

  return (
    <div className={wrapperClassName}>
      <div data-tooltip-id={generatedId}>{children}</div>
      <ReactTooltip
        id={generatedId}
        place={place}
        content={tooltipContent}
        className={classNames(styles.wrapper, className)}
        classNameArrow={arrowClassName}
      />
    </div>
  );
}
