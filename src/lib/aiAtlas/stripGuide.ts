/* The Terminal's guide cut down to the fields /ai-atlas renders.
   The Terminal's export carries source references (file, line, sha256),
   its own placement notes, a tool inventory and cross-link sentences in
   its own voice. None of it is drawn on keepsimple.io/ai-atlas, so none
   of it is kept. The same cut as scripts/ai-atlas/strip-guide.mjs, which
   refreshes the bundled fallback; the two keep the same field lists. */

import { adaptGuide } from './adapter';

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

  const guide = {
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
