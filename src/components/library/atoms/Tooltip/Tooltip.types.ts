import { ReactNode } from 'react';
import { PlacesType } from 'react-tooltip';

export interface TooltipProps {
  className?: string;
  children: ReactNode;
  place?: PlacesType;
  arrowClassName?: string;
  wrapperClassName?: string;
  tooltipContent: string;
}
