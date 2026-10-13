import { promises as fs } from 'fs';
import path from 'path';

import { localizeGuide } from './localize';

/**
 * TEMPORARY, DEV only: alternative Russian wordings for the Atlas, Thesis
 * and Ladder, shown side by side with a switch so Wolf can pick one. They
 * are read from the gitignored docs/ folder, so a build without those files
 * (every staging and production image) gets no variants and no switch.
 * Delete this file and the switch once a wording is chosen.
 */

export const RU_VARIANTS = ['fable', 'grok'] as const;

export async function readRuVariants(english: any) {
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') return null;
  const found: Record<string, { guide: any; readings: any }> = {};
  for (const name of RU_VARIANTS) {
    const dir = path.join(process.cwd(), 'docs', `atlas-ru-${name}`);
    try {
      const [ru, readings] = await Promise.all(
        ['ru.json', 'readings.ru.json'].map(async f =>
          JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')),
        ),
      );
      found[name] = { guide: localizeGuide(english, ru), readings };
    } catch {
      /* A missing or broken variant is left out. */
    }
  }
  return Object.keys(found).length ? found : null;
}
