import { StrapiBiasType } from '@uxcore/local-types/data';

export interface BiasLabelProps {
  category: string;
  biasName: string;
  biasNumber?: string | number;
  index?: number;
  biases: StrapiBiasType[];
  isLeftSection?: boolean;
  slug?: string;
  geometry: any;
  className?: string;
  sectionId?: number;
  setHovered?: any;
  searchResults?: number[];
  hovered?: any;
}
