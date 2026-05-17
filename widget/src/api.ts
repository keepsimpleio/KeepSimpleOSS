export type Citation = {
  title: string;
  url: string;
  slug?: string;
  type?: string;
  score?: number;
  chunkCount?: number;
  nominated?: boolean;
  picked?: boolean;
  blurb?: string;
  why?: string;
};

export type ConciergeResponse = {
  answer: string;
  citations: Citation[];
  suggestions: string[];
  mode: 'answer' | 'clarify';
};

const DEBT_URLS = new Set<string>(['/company-management']);

const TITLE_BLOCKLIST =
  /^\s*(\[?REDACTED\]?|null|undefined|n\/a|none|tbd)\s*$/i;

const cleanTitle = (raw: string): string =>
  raw
    .replace(/^\s*#\s*\d+\.?\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();

export type HistoryTurn = { q: string; a: string; nav?: string };

/* Snapshot the page's own metadata + visible chrome so the server has
   something more grounded than a static blurb. Cheap, runs on every
   ask. Capped per field so the payload stays small. */
function collectPageMeta(): {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  h1?: string;
  visibleText?: string;
  links?: Array<{ title: string; href: string }>;
} {
  if (typeof document === 'undefined') return {};
  const trim = (s: string | null | undefined, n: number) =>
    typeof s === 'string'
      ? s.replace(/\s+/g, ' ').trim().slice(0, n) || undefined
      : undefined;
  const meta = (selector: string): string | undefined => {
    const el = document.querySelector(selector) as HTMLMetaElement | null;
    return el?.content ? trim(el.content, 400) : undefined;
  };
  const h1El = document.querySelector('h1');
  const h1 = trim(h1El?.textContent, 200);
  const main = document.querySelector('main') ?? document.body;
  /* Take the first ~1.5k visible characters of the main column. Skip
     script/style nodes, collapse whitespace. Good enough to ground the
     bot in actual on-page copy without bloating the request. */
  const visibleText = main
    ? trim(
        (main.innerText || main.textContent || '').replace(/\s+/g, ' '),
        1500,
      )
    : undefined;
  /* Visible internal links inside <main>. Same-origin OR keepsimple.io
     only — we don't want footer share-buttons or external news bleeding
     in. Each entry carries its anchor text so the bot can read "what
     does this page actually link to". Deduped by canonical pathname,
     capped at 40 to stay token-light. */
  const links: Array<{ title: string; href: string }> = [];
  if (main) {
    const seen = new Set<string>();
    const HOST_OK = (h: string): boolean => {
      if (!h) return true;
      if (h === window.location.host) return true;
      return h === 'keepsimple.io' || h === 'www.keepsimple.io';
    };
    main.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
      if (links.length >= 40) return;
      const href = a.getAttribute('href') ?? '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:'))
        return;
      let parsed: URL;
      try {
        parsed = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;
      if (!HOST_OK(parsed.host)) return;
      let path = parsed.pathname.replace(/\/+$/, '').toLowerCase();
      if (!path) path = '/';
      if (seen.has(path)) return;
      seen.add(path);
      const title = trim(a.textContent || a.getAttribute('aria-label'), 120);
      if (!title) return;
      links.push({ title, href: parsed.pathname + parsed.search });
    });
  }
  return {
    title: trim(document.title, 300),
    description: meta('meta[name="description"]'),
    ogTitle: meta('meta[property="og:title"]'),
    ogDescription: meta('meta[property="og:description"]'),
    h1,
    visibleText,
    links: links.length > 0 ? links : undefined,
  };
}

export type LastPick = {
  url: string;
  title: string;
  /* 'high' = 3/3 dots (nominated or score ≥ 0.50),
     'mid'  = 2/3 dots (score ≥ 0.30),
     'low'  = 1/3 dots (score ≥ 0.15). */
  tier: 'high' | 'mid' | 'low';
};

export async function askConcierge(
  text: string,
  lang: 'en' | 'ru',
  history: HistoryTurn[] = [],
  recentCardUrls: string[] = [],
  endpoint = '/api/concierge',
  onChunk?: (currentText: string) => void,
  lastPick?: LastPick | null,
  threadId?: string,
): Promise<ConciergeResponse> {
  let r: Response;
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : undefined;
  const pageMeta = collectPageMeta();
  const wantStream = typeof onChunk === 'function';
  try {
    r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        lang,
        history,
        pageUrl,
        pageMeta,
        recentCardUrls,
        lastPick: lastPick ?? undefined,
        stream: wantStream || undefined,
        threadId: threadId || undefined,
      }),
      credentials: 'same-origin',
    });
  } catch {
    throw new Error('network');
  }

  if (r.status === 429) throw new Error('rate');
  if (!r.ok) throw new Error('server');

  /* Streaming branch: parse SSE events. `event: chunk` carries the
     current partial answer text; `event: done` carries the final
     structured payload (same shape as the non-streaming response).
     If the server didn't actually stream (content-type mismatch),
     fall through to plain JSON parsing. */
  const ct = r.headers.get('content-type') || '';
  let data: {
    answer?: string;
    citations?: Citation[];
    suggestions?: string[];
    mode?: string;
  };
  if (wantStream && ct.includes('text/event-stream') && r.body) {
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let lastChunk = '';
    let finalPayload: typeof data | null = null;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf('\n\n')) !== -1) {
        const block = buf.slice(0, nl);
        buf = buf.slice(nl + 2);
        const lines = block.split('\n');
        let event = 'message';
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          else if (line.startsWith('data:'))
            dataLines.push(line.slice(5).trim());
        }
        if (dataLines.length === 0) continue;
        const payload = dataLines.join('\n');
        try {
          const parsed = JSON.parse(payload);
          if (event === 'chunk' && typeof parsed.text === 'string') {
            if (parsed.text !== lastChunk) {
              lastChunk = parsed.text;
              onChunk!(parsed.text);
            }
          } else if (event === 'done') {
            finalPayload = parsed;
          }
        } catch {
          /* malformed event — skip */
        }
      }
    }
    data = finalPayload ?? {};
  } else {
    data = (await r.json().catch(() => ({}))) as typeof data;
  }

  const answer = typeof data.answer === 'string' ? data.answer : '';
  const allCitations = Array.isArray(data.citations) ? data.citations : [];

  const normalizeSlug = (u: string): string => {
    try {
      const url = new URL(u, 'https://keepsimple.io');
      let path = url.pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, '');
      path = path.replace(/^\/+|\/+$/g, '');
      const parts = path.split('/');
      const last = parts[parts.length - 1] || '';
      const numericLess = last.replace(/^\d+-/, '');
      return numericLess.toLowerCase();
    } catch {
      return u.toLowerCase();
    }
  };

  const matchesLocale = (u: string, l: 'en' | 'ru'): 'preferred' | 'other' => {
    try {
      const url = new URL(u, 'https://keepsimple.io');
      const seg = url.pathname.split('/')[1];
      if (seg === 'ru') return l === 'ru' ? 'preferred' : 'other';
      if (seg === 'hy') return 'other';
      return l === 'en' ? 'preferred' : 'other';
    } catch {
      return 'preferred';
    }
  };

  const buckets = new Map<string, Citation[]>();
  const nominatedCards: Citation[] = [];
  for (const c of allCitations) {
    if (!c || typeof c.url !== 'string' || typeof c.title !== 'string')
      continue;
    const title = cleanTitle(c.title);
    if (!title) continue;
    if (c.nominated) {
      /* Server-curated cards (project-meta intents) bypass URL/title
         filters — they're hand-picked and trusted. */
      nominatedCards.push({ ...c, title });
      continue;
    }
    if (DEBT_URLS.has(c.url)) continue;
    if (TITLE_BLOCKLIST.test(title)) continue;
    const slug = normalizeSlug(c.url);
    const list = buckets.get(slug) ?? [];
    list.push({ ...c, title });
    buckets.set(slug, list);
  }

  const hasCyrillic = (s: string): boolean => /[а-яА-ЯёЁ]/.test(s);
  const titleLocaleMismatch = (title: string, l: 'en' | 'ru'): boolean => {
    const cyr = hasCyrillic(title);
    return l === 'en' ? cyr : !cyr;
  };

  /* Locale filter applies to nominated cards too — server may surface
     RU citations into an EN thread (LightRAG returns mixed-locale hits
     and the LLM picks both). Curated project-meta cards already carry
     the correct /ru-prefixed URL so they pass cleanly. */
  const citations: Citation[] = [];
  for (const pick of nominatedCards) {
    if (matchesLocale(pick.url, lang) === 'other') continue;
    if (titleLocaleMismatch(pick.title, lang)) continue;
    citations.push(pick);
  }
  for (const variants of buckets.values()) {
    const preferred = variants.find(
      v => matchesLocale(v.url, lang) === 'preferred',
    );
    const pick = preferred ?? variants[0];
    if (matchesLocale(pick.url, lang) === 'other') continue;
    if (titleLocaleMismatch(pick.title, lang)) continue;
    citations.push(pick);
  }
  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions.filter(
        (s): s is string => typeof s === 'string' && s.trim().length > 0,
      )
    : [];
  const mode: 'answer' | 'clarify' =
    data.mode === 'clarify' ? 'clarify' : 'answer';

  return { answer, citations, suggestions, mode };
}

export function trackEvent(
  name: string,
  props: Record<string, unknown> = {},
): void {
  try {
    const w = window as unknown as {
      mixpanel?: { track: (n: string, p?: Record<string, unknown>) => void };
    };
    if (w.mixpanel?.track) {
      w.mixpanel.track(`ask_ux_core.${name}`, props);
    }
  } catch {
    // analytics is best-effort
  }
}

/* Server-side transcript logger. Posts non-Q&A events (clears, card
   clicks, nav, explicit auth pings) to /api/copilot/event, which
   forwards to Strapi. Q&A events are logged server-side from inside
   /api/concierge so the widget doesn't fire them twice. Fire-and-
   forget — failures never affect the visitor. */
export type CopilotEventKind = 'clear' | 'card_click' | 'nav' | 'auth_probe';

export function postCopilotEvent(payload: {
  kind: CopilotEventKind;
  threadId: string;
  oldThreadId?: string;
  lang: 'en' | 'ru';
  cardClicked?: { title: string; url: string; tier?: string };
  meta?: Record<string, unknown>;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({
      ...payload,
      pageUrl: window.location.href,
      pageTitle: document.title,
    });
    const url = '/api/copilot/event';
    /* sendBeacon survives page unload (esp. for card_click that
       precedes a navigation away); falls back to fetch when unavailable
       or returns false. */
    const beacon = (
      navigator as Navigator & {
        sendBeacon?: (u: string, b: Blob | string) => boolean;
      }
    ).sendBeacon;
    if (beacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (beacon.call(navigator, url, blob)) return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {
      /* best-effort */
    });
  } catch {
    /* never block on analytics */
  }
}
