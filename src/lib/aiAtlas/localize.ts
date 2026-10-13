/* The Atlas in another language. The guide keeps its structure (which
   stages, tiles and cards exist, pushed by the Terminal in English); a
   translation replaces only the words, matched by id. Anything the
   translation does not cover stays in English, so a card the Terminal adds
   later shows up at once instead of disappearing.

   Translations: ru.json (map words, stage and system cards, mechanisms,
   Wolf's card prose) and readings.ru.json (Thesis and Ladder). */

type Fields = Record<string, unknown>;
export type AtlasTranslation = {
  copy?: Fields & { stageLabels?: string[] };
  steps?: Record<string, Fields>;
  nodes?: Record<string, Fields>;
  entries?: Record<string, Fields>;
  cards?: Record<string, string[]>;
};

const overlay = (items: any[], words: Record<string, Fields> = {}) =>
  items.map(item => (words[item.id] ? { ...item, ...words[item.id] } : item));

export function localizeGuide(guide: any, words: AtlasTranslation) {
  if (!guide || !words) return guide;
  const { stageLabels, ...copy } = words.copy || {};
  return {
    ...guide,
    steps: overlay(guide.steps, words.steps),
    entries: overlay(guide.entries, words.entries),
    system: {
      ...guide.system,
      nodes: overlay(guide.system.nodes, words.nodes),
    },
    /* Translated words win over pushed English ones on this locale. */
    copy: { ...(guide.copy || {}), ...copy },
    cards: { ...(guide.cards || {}), ...(words.cards || {}) },
    stages: stageLabels
      ? stageLabels.map((label, i) => ({ ...(guide.stages?.[i] || {}), label }))
      : guide.stages,
  };
}
