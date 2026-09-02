import { ReactNode } from 'react';
import { PlacesType } from 'react-tooltip';

export interface TooltipProps {
  className?: string;
  children: ReactNode;
  place?: PlacesType;
  arrowClassName?: string;
  wrapperClassName?: string;
  // A node, not just a string: a tooltip whose label swaps mid-hover (copy →
  // copied) has to hold its own width, or the box and its arrow drift.
  tooltipContent: ReactNode;
}
