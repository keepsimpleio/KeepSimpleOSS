/* The Terminal's guide cut down to the fields /ai-atlas renders.
   The Terminal's export carries source references (file, line, sha256),
   its own placement notes, a tool inventory and cross-link sentences in
   its own voice. None of it is drawn on keepsimple.io/ai-atlas, so none
   of it is kept. The same cut as scripts/ai-atlas/strip-guide.mjs, which
   refreshes the bundled fallback; the two keep the same field lists. */

import {
  adaptGuide,
  MAX_TILES_PER_STAGE,
  PAGE_TEXT_KEYS,
  SHORT_LABEL_KEYS,
  SHORT_LABEL_MAX,
} from './adapter';

const pick = (obj: any, keys: string[]) =>
  Object.fromEntries(
    keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]),
  );

const isRecordList = (value: unknown) =>
  Array.isArray(value) &&
  value.every(
    item =>
      item && typeof item === 'object' && typeof (item as any).id === 'string',
  );

/* Wolf's card texts, pushed by the Terminal: card id to paragraphs. Only
   plain strings pass; a card listed here replaces its copy in features.ts. */
const isCards = (value: unknown) =>
  value === undefined ||
  (!!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([id, paragraphs]) =>
        /^[a-z0-9-]+$/.test(id) &&
        Array.isArray(paragraphs) &&
        paragraphs.length > 0 &&
        paragraphs.every(
          p => typeof p === 'string' && p.length > 0 && p.length <= 4000,
        ),
    ));

/* Page words, pushed by the Terminal: a copy key to its new text. Only
   keys the page already has pass. */
const isCopy = (value: unknown) =>
  value === undefined ||
  (!!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([key, words]) =>
        PAGE_TEXT_KEYS.has(key) &&
        typeof words === 'string' &&
        words.length > 0 &&
        words.length <= (SHORT_LABEL_KEYS.has(key) ? SHORT_LABEL_MAX : 4000),
    ));

/* The map, pushed by the Terminal: per stage, in step order, an optional
   label and the tiles drawn on it. Every tile must be an entry. */
const stagesError = (value: unknown, steps: number, ids: Set<string>) => {
  if (value === undefined) return null;
  if (!Array.isArray(value) || value.length !== steps)
    return `stages must list all ${steps} stages in step order`;
  for (const stage of value) {
    if (!stage || typeof stage !== 'object') return 'a stage is not an object';
    if (
      stage.label !== undefined &&
      (typeof stage.label !== 'string' || stage.label.length > 40)
    )
      return 'a stage label must be text up to 40 characters';
    if (stage.tiles === undefined) continue;
    if (
      !Array.isArray(stage.tiles) ||
      stage.tiles.length === 0 ||
      stage.tiles.length > MAX_TILES_PER_STAGE
    )
      return `a stage draws 1 to ${MAX_TILES_PER_STAGE} tiles`;
    const missing = stage.tiles.find((id: unknown) => !ids.has(id as string));
    if (missing !== undefined) return `tile ${missing} is not an entry`;
  }
  return null;
};

export type StripResult = { guide: any } | { error: string };

export function stripGuide(input: any): StripResult {
  if (!input || typeof input !== 'object')
    return { error: 'body is not a JSON object' };
  if (typeof input.generatedAt !== 'string')
    return { error: 'generatedAt missing' };
  if (!isRecordList(input.steps) || input.steps.length === 0)
    return { error: 'steps missing or malformed' };
  if (!isRecordList(input.entries) || input.entries.length === 0)
    return { error: 'entries missing or malformed' };
  if (!isRecordList(input.system?.nodes) || input.system.nodes.length === 0)
    return { error: 'system.nodes missing or malformed' };
  if (input.steps.some((s: any) => !Array.isArray(s.children)))
    return { error: 'a step has no children list' };
  if (!isCards(input.cards))
    return { error: 'cards must map a card id to a list of paragraphs' };
  if (!isCopy(input.copy))
    return {
      error: `copy must map a known page text key to non-empty text, labels up to ${SHORT_LABEL_MAX} characters`,
    };
  const stages = stagesError(
    input.stages,
    input.steps.length,
    new Set(input.entries.map((e: any) => e.id)),
  );
  if (stages) return { error: stages };

  const guide: any = {
    generatedAt: input.generatedAt,
    steps: input.steps.map((s: any) =>
      pick(s, ['id', 'title', 'location', 'text', 'children']),
    ),
    entries: input.entries.map((e: any) =>
      pick(e, ['id', 'title', 'text', 'detail', 'children']),
    ),
    system: {
      nodes: input.system.nodes.map((n: any) =>
        pick(n, ['id', 'title', 'role', 'detail', 'basis']),
      ),
    },
  };
  if (input.cards) guide.cards = input.cards;
  if (input.copy) guide.copy = input.copy;
  if (input.stages)
    guide.stages = input.stages.map((s: any) => pick(s, ['label', 'tiles']));
  /* The page must be able to draw what is stored; a guide it cannot draw
     is refused and the page keeps the last one that worked. */
  try {
    adaptGuide(guide);
  } catch (e) {
    return {
      error: `the page cannot render this guide: ${(e as Error).message}`,
    };
  }
  return { guide };
}
