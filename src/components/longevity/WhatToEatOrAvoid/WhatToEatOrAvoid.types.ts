export type WhatToEatOrAvoidProps = {
  className?: string;
  title?: string;
  damageIndex: number;
  info: string;
  examples: string;
  tooltipContent?: string;
  imageUrl?: string;
  setSelectedOptionIconUrl?: string;
  setSelectedHealthyOptionId?: (
    value: number | null | string | ((prev: number | null) => number | null),
  ) => void;
  selectedHealthyOptionId?: number;
  id?: string;
};
