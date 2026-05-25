import { biases as en } from './biases';
import { biases as hyOverrides } from './hy';
import { biases as ru } from './ru';

const hyById = new Map(hyOverrides.map(b => [b.id, b]));
const hy = en.map(b => hyById.get(b.id) ?? b);

export const biasesByLocale = {
  en,
  ru,
  hy,
} as const;

export type { BiasCategory, BiasEntry } from './biases';
export { biases } from './biases';
