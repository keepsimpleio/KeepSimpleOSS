/* Copilot safety layer — daily budget cap, abuse moderation, PII
   scrub, prompt-injection helpers. Runs server-side, in-process,
   on the long-running Contabo container so all maps persist across
   requests until the container restarts.
   Everything degrades to "allow" when a dependency is missing
   (no OpenAI key → moderation skipped; budget disabled → no cap).
*/

import type { NextApiRequest } from 'next';

/* ---------- Daily budget cap ----------------------------------- */

const DAILY_BUDGET_USD = Number(process.env.COPILOT_DAILY_BUDGET_USD || '5');
/* Conservative per-call cost estimate covering the Claude Sonnet
   answer + LightRAG retrieve. Tunable via env when the mix shifts.
   Real cost varies turn-to-turn; we round generously upward so the
   cap trips a little early rather than overshooting the budget. */
const AVG_CALL_USD = Number(process.env.COPILOT_AVG_CALL_USD || '0.04');

const dailyCalls: Map<string, number> = new Map();

function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function budgetExhausted(): boolean {
  if (!isFinite(DAILY_BUDGET_USD) || DAILY_BUDGET_USD <= 0) return false;
  const k = todayKey();
  const n = dailyCalls.get(k) ?? 0;
  return n * AVG_CALL_USD >= DAILY_BUDGET_USD;
}

export function recordCall(): void {
  const k = todayKey();
  dailyCalls.set(k, (dailyCalls.get(k) ?? 0) + 1);
  /* Trim old days so the map doesn't grow forever on a long-lived
     container. Keep yesterday in case we want to peek at it. */
  const yesterday = prevDayKey(k);
  const keys: string[] = [];
  dailyCalls.forEach((_, key) => keys.push(key));
  for (const key of keys) {
    if (key < k && key !== yesterday) dailyCalls.delete(key);
  }
}

function prevDayKey(today: string): string {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function budgetSummary(): {
  enabled: boolean;
  budgetUsd: number;
  callsToday: number;
  estUsdToday: number;
} {
  const k = todayKey();
  const n = dailyCalls.get(k) ?? 0;
  return {
    enabled: isFinite(DAILY_BUDGET_USD) && DAILY_BUDGET_USD > 0,
    budgetUsd: DAILY_BUDGET_USD,
    callsToday: n,
    estUsdToday: Math.round(n * AVG_CALL_USD * 100) / 100,
  };
}

export function atCapacityMessage(lang: string): string {
  return lang === 'ru'
    ? 'На сегодня лимит исчерпан — заглядывайте завтра. Пока что вся библиотека keepsimple.io открыта и без нас.'
    : "We're at capacity for today — try again tomorrow. The full keepsimple.io library stays open in the meantime.";
}

/* ---------- Abuse moderation (OpenAI moderation API) ----------- */

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const MODERATION_TIMEOUT_MS = 1500;

/* Returns true when the input is judged safe (or moderation is
   unavailable — we fail open so a moderation outage doesn't take
   the widget down). The OpenAI moderation API is free at the
   `omni-moderation-latest` tier and adds ~50–150ms. */
export async function isSafeInput(text: string): Promise<{
  safe: boolean;
  categories?: string[];
}> {
  if (!OPENAI_KEY) return { safe: true };
  if (!text || text.length < 2) return { safe: true };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), MODERATION_TIMEOUT_MS);
  try {
    const r = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: text.slice(0, 4000),
      }),
      signal: ctrl.signal,
    });
    if (!r.ok) return { safe: true };
    const j = (await r.json().catch(() => null)) as {
      results?: Array<{
        flagged?: boolean;
        categories?: Record<string, boolean>;
      }>;
    } | null;
    const result = j?.results?.[0];
    if (!result || result.flagged !== true) return { safe: true };
    const cats = result.categories
      ? Object.entries(result.categories)
          .filter(([, v]) => v === true)
          .map(([k]) => k)
      : [];
    return { safe: false, categories: cats };
  } catch {
    return { safe: true };
  } finally {
    clearTimeout(timer);
  }
}

export function moderationRefusal(lang: string): string {
  return lang === 'ru'
    ? 'Эту тему мы здесь не разбираем. Спросите что-то про продукт, решения, искажения, нашу библиотеку — поможем.'
    : "Not a topic we'll go into here. Ask anything about products, decisions, biases, or our library and we'll dig in.";
}

/* ---------- Prompt-injection helper --------------------------- */

/* Wraps user-supplied text in clearly-marked DATA fences so the
   model can't be talked out of treating it as content. Use for
   the visitor's question, the page content, and the link harvest.
   The system prompt's INJECTION rule references these fences by
   name — keep the tag literal stable when changing. */
export function fence(tag: string, body: string): string {
  return `<${tag}>\n${body}\n</${tag}>`;
}

/* ---------- PII scrub ----------------------------------------- */

/* Masks emails, phone numbers (loose international), and likely
   payment-card runs before we hand the value off to Strapi.
   Conservative on credit-cards (skip valid Luhn check — cost not
   worth it; mask all 13–19 digit runs near currency hints).
   Applied to query, answer, pageUrl, pageTitle, and JSON blobs.
   Leaves non-PII text untouched. */
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE =
  /(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4}/g;
const LONG_DIGIT_RE = /\b\d{13,19}\b/g;

export function scrubPii(input: string | undefined): string | undefined {
  if (input == null) return input;
  if (typeof input !== 'string') return input;
  let out = input.replace(EMAIL_RE, '[email]');
  out = out.replace(LONG_DIGIT_RE, '[cc]');
  out = out.replace(PHONE_RE, m => {
    /* Don't mistake short price/ID runs (≤7 digits in clean
       sequence) for phone numbers. Real phones have at least 8
       digits across delimiters. */
    const digits = m.replace(/\D/g, '');
    if (digits.length < 8) return m;
    return '[phone]';
  });
  return out;
}

/* Deep-scrubs anything we hand to Strapi: shallow JSON objects,
   strings, arrays of strings. Numbers/booleans pass through. */
export function scrubAny<T>(value: T): T {
  if (value == null) return value;
  if (typeof value === 'string') return scrubPii(value) as unknown as T;
  if (Array.isArray(value)) {
    return value.map(v => scrubAny(v)) as unknown as T;
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = scrubAny(v);
    }
    return out as T;
  }
  return value;
}

/* ---------- Client IP helper for log dedup -------------------- */

export function clientIp(req: NextApiRequest): string | undefined {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0]!.trim();
  if (Array.isArray(xf)) return xf[0];
  return req.socket?.remoteAddress;
}
