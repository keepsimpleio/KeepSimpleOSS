import en from './en';
import hy from './hy';
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
