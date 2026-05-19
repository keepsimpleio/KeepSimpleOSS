/* Pure helpers used by /api/concierge. Extracted from concierge.ts to
   keep that handler readable and make these units independently
   testable. No I/O, no env reads — only string/regex logic over a
   visitor query and a canonical path. */

import { resolvePageIdentity } from '@lib/widget/pageIdentity';

/* Meta-turn detector. Orthogonal to detectIntent: catches turns where
   the visitor is engaging with the chat itself (how-to-use, "just
   type?", "what can you do") or making a pure conversational move
   ("ok", "got it", "thanks"). On these turns cards are noise — the
   visitor isn't asking for navigation, and surfacing link-cards
   pushes them sideways out of whatever they were focused on. Used
   as a hard gate: when this fires, displayCitations is forced empty
   regardless of what the LLM nominated. Patterns are deliberately
   conservative — broader interpretation (e.g. "how does the test
   work" on /uxcat) is left to the LLM-side ZERO-CARDS rule. */
const META_PATTERNS: RegExp[] = [
  /\b(just|simply)\s+(type|ask|write|enter|input)\b/i,
  /\bi\s+(just\s+)?(type|ask|write|enter|input)\s+(my|the|here|it)\b/i,
  /\b(so|then)\s+i\s+(just|should|need|have\s+to)\s+(type|ask|write|enter|input)\b/i,
  /\bhow\s+do\s+i\s+use\s+(this|you|it|the\s+chat|copilot)\b/i,
  /\bwhat\s+(can|do)\s+you\s+(do|help\s+with)\b/i,
  /^\s*(ok(ay)?|k|got\s+it|gotcha|i\s+see|cool|thanks?|thank\s+you|alright|right|sure|nice|good|fine|fair)[\s.!?]*$/i,
  /\b(просто|только)\s+(написать|спросить|задать|ввести|напечатать|вписать)\b/i,
  /\b(так|тогда)\s+(я|мне)\s+(просто|должн|надо|нужно)\s*(написать|спросить|задать|ввести|напечатать)/i,
  /\bчто\s+(ты|вы)\s+(умеешь|умеете|можешь|можете|делаешь|делаете)\b/i,
  /\bкак\s+(этим|тобой|вами|чатом)\s+пользоваться\b/i,
  /\bпрямо\s+(тут|здесь|сюда)\s+(писать|спрашивать|задавать)/i,
  /^\s*(ок|окей|ясно|понял|поняла|спасибо|спс|круто|ага|угу|ладно|хорошо|норм|ок\.?)[\s.!?]*$/i,
];

export function isMetaTurn(query: string): boolean {
  const q = (query || '').trim();
  if (q.length < 2) return false;
  return META_PATTERNS.some(re => re.test(q));
}

/* Project-family grouping. UX Core is the parent of UXCG / UXCP /
   UXCAT / UX Core main / UX Core API — they all live under the
   UXCoreOSS umbrella and pivoting between them on a SPATIAL turn
   reads as "going deeper sideways", not as yanking the visitor out.
   Standalone surfaces (AI Atlas, Articles, Tools, Pyramids) each get
   their own family of one. Sub-pages inherit their top segment, so
   `/uxcg/why-our-company...` → `uxcg` → UX Core family. */
export const PROJECT_FAMILIES: Record<string, string> = {
  uxcore: 'uxcore-family',
  uxcg: 'uxcore-family',
  uxcp: 'uxcore-family',
  uxcat: 'uxcore-family',
  'uxcore-api': 'uxcore-family',
};

export const topSegment = (canonicalPath: string): string => {
  const p = canonicalPath.toLowerCase().replace(/^\/+/, '');
  if (!p) return '';
  if (p.startsWith('tools/longevity-protocol'))
    return 'tools/longevity-protocol';
  return p.split('/')[0] || '';
};

export const familyOf = (canonicalPath: string): string => {
  const top = topSegment(canonicalPath);
  return PROJECT_FAMILIES[top] || top;
};

export const inSameFamily = (
  cardUrl: string,
  visitorCanonical: string,
): boolean => {
  try {
    const cardId = resolvePageIdentity(cardUrl);
    return familyOf(cardId.canonicalPath) === familyOf(visitorCanonical);
  } catch {
    return false;
  }
};
