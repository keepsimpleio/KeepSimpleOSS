/* UXCG question → sibling-question bridge.
 *
 * Each UXCG question page (/uxcg/<slug>) has a "relatedQuestions" list
 * in Strapi — a JSON array of sibling question NUMBERs (1..63). This
 * module fetches the full 63-question catalog once per process, builds
 * a slug → siblings map, and lets the concierge inject those siblings
 * as nominated candidates on a SPATIAL turn so the visitor gets a real
 * "go deeper inside UXCG" path even when LightRAG retrieval is sparse.
 *
 * No bias mapping in this first pass — answer text uses ambiguous
 * `{{N}}` references that could be either question or bias numbers.
 * Adding bias→question inversion is Phase 2 once the safer signal
 * (relatedQuestions) is shipped.
 */

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI || 'https://strapi.keepsimple.io';
const FETCH_TIMEOUT_MS = 4500;
const PAGE_SIZE = 100;

export type UxcgSibling = {
  number: number;
  slug: string;
  title: string;
};

export type UxcgBridgeEntry = {
  siblings: UxcgSibling[];
};

type BridgeByLang = Map<string, UxcgBridgeEntry>;

const cached: Record<'en' | 'ru', BridgeByLang | null> = {
  en: null,
  ru: null,
};
let inFlight: Promise<void> | null = null;

async function fetchQuestionsForLang(
  lang: 'en' | 'ru',
): Promise<Array<{ attributes: Record<string, unknown> }>> {
  const url = `${STRAPI_BASE}/api/questions?locale=${lang}&sort=number&pagination%5BpageSize%5D=${PAGE_SIZE}&pagination%5Bpage%5D=1`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`strapi ${r.status}`);
    const j = (await r.json()) as { data?: unknown };
    return Array.isArray(j?.data)
      ? (j.data as Array<{ attributes: Record<string, unknown> }>)
      : [];
  } finally {
    clearTimeout(t);
  }
}

function buildLang(
  qs: Array<{ attributes: Record<string, unknown> }>,
): BridgeByLang {
  const byNumber = new Map<number, UxcgSibling>();
  for (const q of qs) {
    const a = q?.attributes;
    if (!a) continue;
    const slug = typeof a.slug === 'string' ? a.slug : '';
    const number = typeof a.number === 'number' ? a.number : null;
    if (!slug || number === null) continue;
    const title =
      (typeof a.title === 'string' && a.title) ||
      (typeof a.pageTitle === 'string' && a.pageTitle) ||
      slug;
    byNumber.set(number, { number, slug, title });
  }

  const map: BridgeByLang = new Map();
  for (const q of qs) {
    const a = q?.attributes;
    if (!a || typeof a.slug !== 'string') continue;
    const relatedRaw = a.relatedQuestions;
    let related: number[] = [];
    try {
      if (typeof relatedRaw === 'string') {
        const parsed = JSON.parse(relatedRaw);
        if (Array.isArray(parsed))
          related = parsed.filter(n => typeof n === 'number');
      } else if (Array.isArray(relatedRaw)) {
        related = relatedRaw.filter(n => typeof n === 'number') as number[];
      }
    } catch {
      related = [];
    }
    const siblings: UxcgSibling[] = [];
    for (const n of related) {
      const rec = byNumber.get(n);
      if (!rec) continue;
      if (rec.slug === a.slug) continue;
      if (siblings.some(s => s.slug === rec.slug)) continue;
      siblings.push(rec);
      if (siblings.length >= 2) break;
    }
    map.set(a.slug, { siblings });
  }
  return map;
}

async function buildAll(): Promise<void> {
  try {
    const [enQs, ruQs] = await Promise.all([
      fetchQuestionsForLang('en'),
      fetchQuestionsForLang('ru'),
    ]);
    cached.en = buildLang(enQs);
    cached.ru = buildLang(ruQs);
  } catch {
    /* Strapi unreachable / slow — leave cache empty; concierge falls
       back to organic LightRAG hits. Next call retries. */
    if (!cached.en) cached.en = new Map();
    if (!cached.ru) cached.ru = new Map();
  }
}

export async function getUxcgBridgeEntry(
  slug: string,
  lang: 'en' | 'ru',
): Promise<UxcgBridgeEntry | null> {
  if (!cached[lang]) {
    if (!inFlight) {
      inFlight = buildAll().finally(() => {
        inFlight = null;
      });
    }
    await inFlight;
  }
  return cached[lang]?.get(slug) ?? null;
}
