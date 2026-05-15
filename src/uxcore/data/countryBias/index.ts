import { en } from './en';
import { hy } from './hy';
import { ru } from './ru';

export const countryBiasByLocale = {
  en,
  ru,
  hy,
} as const;

export { REGION_COLORS } from './regionColors';
export type {
  Country,
  CountryBiasLocale,
  CountryUI,
  RegionKey,
  RegionLabels,
} from './types';
