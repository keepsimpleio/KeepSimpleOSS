import hy from '@data/addQuestion/hy';

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
