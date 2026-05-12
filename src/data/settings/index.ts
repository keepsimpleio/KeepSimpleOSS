import en from './en';
import ru from './ru';

const locales = {
  en,
  ru,
} as const satisfies {
  en: typeof en;
  ru: typeof ru;
};

export default locales;
