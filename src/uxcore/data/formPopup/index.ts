import hy from '@data/decisionTable/hy';

import en from './en';
import ru from './ru';

const locales = {
  en,
  ru,
  hy,
} as const satisfies {
  en: typeof en;
  ru: typeof ru;
  hy: typeof hy;
};

export default locales;
