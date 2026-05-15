import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { askConcierge, Citation, trackEvent } from './api';

type Lang = 'en' | 'ru';

type Turn = {
  id: string;
  query: string;
  answer: string;
  citations: Citation[];
  suggestions: string[];
  mode: 'answer' | 'clarify';
  isStreaming: boolean;
  error?: string;
  /* Landing turns are auto-generated when the user clicks a card and
     lands on a new page. They render distinctly (small "on this page"
     tag + left rule) so the visitor reads them as the team chiming in
     about where they just arrived, not a regular Q&A.

     Nav turns are slimmer system breadcrumbs ("→ Now viewing: …") that
     fire on any other navigation — back/forward, in-site links, modal
     route changes inside UXCoreOSS — so the transcript stays in sync
     with where the visitor actually stands. Distinct from landing
     because they're cheap (no LLM call) and visually thinner. */
  kind?: 'landing' | 'nav';
  navTitle?: string;
};

const STORAGE_KEY = 'ks_aux_state_v2';
const IDLE_OPACITY_KEY = 'ks_aux_idle_opacity_v1'; // gitleaks:allow
const COLLAPSED_ONCE_KEY = 'ks_aux_collapsed_once_v1'; // gitleaks:allow
const loadCollapsedOnce = (): boolean => {
  try {
    return localStorage.getItem(COLLAPSED_ONCE_KEY) === '1';
  } catch {
    return false;
  }
};

/* Per-page example-question chips. Generated as a free side-effect of
   the landing LLM call (no extra LLM cost) and cached by canonical
   pathname so a returning visitor sees them instantly on re-open. */
const SUGG_KEY_PREFIX = 'ks_aux_sugg:';
const canonicalPathKey = (raw: string): string => {
  try {
    const u = new URL(raw, window.location.origin);
    let p = u.pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, '');
    p = p.replace(/\/+$/, '');
    return p.toLowerCase() || '/';
  } catch {
    return '/';
  }
};
const loadSuggestions = (url: string): string[] => {
  try {
    const raw = localStorage.getItem(SUGG_KEY_PREFIX + canonicalPathKey(url));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr)
      ? (arr as unknown[]).filter(
          (s): s is string => typeof s === 'string' && s.trim().length > 0,
        )
      : [];
  } catch {
    return [];
  }
};
const saveSuggestions = (url: string, suggestions: string[]) => {
  try {
    localStorage.setItem(
      SUGG_KEY_PREFIX + canonicalPathKey(url),
      JSON.stringify(suggestions.slice(0, 4)),
    );
  } catch {
    /* ignore */
  }
};
const IDLE_OPACITY_STEPS = [0.3, 0.55, 0.85] as const;
const DEFAULT_IDLE_OPACITY = 0.55;
const loadIdleOpacity = (): number => {
  try {
    const raw = localStorage.getItem(IDLE_OPACITY_KEY);
    const n = raw ? parseFloat(raw) : NaN;
    if (IDLE_OPACITY_STEPS.includes(n as 0.3 | 0.55 | 0.85)) return n;
  } catch {
    /* ignore */
  }
  return DEFAULT_IDLE_OPACITY;
};
const LAST_PAGE_KEY = 'ks_aux_last_page_v1';

const TITLE_SPLIT_RE = /\s+[—–|·]\s+/;
/* Strip trailing brand suffix ("X — Keep It Simple", "X | UX Core") and
   leading parenthetical counts ("(3) X") so transcript breadcrumbs read
   as the bias/page name alone. */
const cleanPageTitle = (raw: string): string => {
  if (!raw) return '';
  const s = raw.replace(/^\(\d+\)\s*/, '').trim();
  return s.split(TITLE_SPLIT_RE)[0].trim();
};

/* Scan the host page for a "recommended questions" section (UX Core
   bias cards ship one) and return a random question from it. Pure DOM
   read, runs on the visitor's browser, no server call. Returns null
   when nothing plausible is on the page so the chip stays hidden.

   The heuristic looks for any heading (h1-h4) whose text matches
   "recommended questions" / "рекомендуемые вопросы" / "recommended
   question", then collects li / a / p siblings up to the next heading
   and picks one at random. Falls back silently on any DOM oddity. */
const RECQ_HEADING_RE =
  /(recommended|suggested|related|further)\s+(questions?|reading|topics?)|(?:рекомендуемы[ея]|похожи[ея]|связанны[ея])\s+вопрос/i;
const harvestRecommendedQuestion = (): string | null => {
  if (typeof document === 'undefined') return null;
  try {
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4'),
    ) as HTMLElement[];
    const match = headings.find(h => RECQ_HEADING_RE.test(h.textContent || ''));
    if (!match) return null;
    const items: string[] = [];
    const blockTag = (el: Element) =>
      /^(H1|H2|H3|H4)$/.test(el.tagName) && el !== match;
    let cur: Element | null = match.nextElementSibling;
    let hops = 0;
    while (cur && hops < 12 && !blockTag(cur)) {
      cur.querySelectorAll('li, a, p').forEach(node => {
        const txt = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (!txt) return;
        if (txt.length < 12 || txt.length > 180) return;
        if (!/\?\s*$/.test(txt)) return;
        items.push(txt);
      });
      cur = cur.nextElementSibling;
      hops += 1;
    }
    const uniq = Array.from(new Set(items));
    if (uniq.length === 0) return null;
    return uniq[Math.floor(Math.random() * uniq.length)];
  } catch {
    return null;
  }
};

type LastPage = { url: string; title: string };
const loadLastPage = (): LastPage | null => {
  try {
    const raw = localStorage.getItem(LAST_PAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as LastPage;
    if (typeof data?.url !== 'string' || typeof data?.title !== 'string')
      return null;
    return data;
  } catch {
    return null;
  }
};
const saveLastPage = (p: LastPage) => {
  try {
    localStorage.setItem(LAST_PAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
};

type PendingLanding = {
  url: string;
  title: string;
  prevQuery: string;
  prevAnswer: string;
  /* Id of the placeholder landing turn we appended optimistically on
     card click — the LLM response replaces this turn instead of
     appending a fresh one, so the visitor sees the new NOW VIEWING
     marker (and the greyed history) the instant they click, not
     after the round-trip. */
  placeholderId?: string;
  /* Tab that originated the card click. localStorage is shared across
     tabs, so without this another tab could consume the pending
     landing and fire a duplicate landing fetch. The originating tab
     reads its own id back after navigating (sessionStorage survives
     same-tab nav) and consumes; any other tab sees a mismatch and
     leaves it alone. */
  tabId?: string;
  /* ms-since-epoch when written. Pending landings older than 60s are
     stale (the originating tab probably closed) and get dropped on
     read so they don't haunt the next reload. */
  createdAt?: number;
};

const TAB_ID_KEY = 'ks-aux:tab-id';

/* Per-tab identity, kept in sessionStorage so it survives same-tab
   reloads but dies with the tab. Used to scope one-shot bridges
   (pendingLanding) to the tab that wrote them. */
const getTabId = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const existing = sessionStorage.getItem(TAB_ID_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `t-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(TAB_ID_KEY, fresh);
    return fresh;
  } catch {
    return '';
  }
};

const PENDING_LANDING_MAX_AGE_MS = 60_000;

type Persisted = {
  open: boolean;
  turns: Turn[];
  awaitingRelevance?: boolean;
  pendingLanding?: PendingLanding | null;
};

const loadState = (): Persisted | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Persisted;
    if (!Array.isArray(data?.turns)) return null;
    return {
      open: !!data.open,
      turns: data.turns.map(t => ({ ...t, isStreaming: false })),
      awaitingRelevance: !!data.awaitingRelevance,
      pendingLanding: data.pendingLanding ?? null,
    };
  } catch {
    return null;
  }
};

const saveState = (state: Persisted) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota / disabled — silently skip
  }
};

const TEXT: Record<Lang, Record<string, string>> = {
  en: {
    pillLabel: 'Ask anything',
    pillLabelReturning: "I'm always here",
    relevancePrompt: 'Was this relevant?',
    placeholder: 'Ask anything about career, UX, decisions, biases…',
    send: 'Ask',
    networkErr: "Couldn't reach the server. Try again.",
    rateErr: 'A bit too many requests. Wait a minute.',
    serverErr: 'Something broke. Try again.',
    empty: "We'll walk you through",
    retry: 'Retry',
    landingLabel: 'On this page',
    navLabel: 'Now viewing',
    viewedLabel: 'Viewed',
    relevancy: 'Relevancy',
    readingLabel: 'Learning',
    atHomeLabel: 'Learning',
    collapseLabel: 'Collapse',
    clearLabel: 'Clear',
    immersionLabel: 'Immersion',
    immersionHigh: 'High',
    immersionMedium: 'Medium',
    immersionLow: 'Low',
    uxcatNudge: 'Try it. Might be a gamechanger.',
    uxcatCta: 'Begin Test',
  },
  ru: {
    pillLabel: 'Спросите что угодно',
    pillLabelReturning: 'Я всегда тут',
    relevancePrompt: 'Это было полезно?',
    placeholder: 'Спросите про карьеру, UX, решения, искажения…',
    send: 'Спросить',
    networkErr: 'Не получилось дотянуться до сервера. Попробуйте ещё раз.',
    rateErr: 'Многовато за раз. Подождите минуту.',
    serverErr: 'Что-то сломалось. Попробуйте ещё раз.',
    empty: 'Проведём вас по сайту',
    retry: 'Повторить',
    yourPick: 'Ваш выбор',
    landingLabel: 'На этой странице',
    navLabel: 'Сейчас открыто',
    viewedLabel: 'Просмотрено',
    relevancy: 'Релевантность',
    readingLabel: 'Изучаем',
    atHomeLabel: 'Изучаем',
    collapseLabel: 'Свернуть',
    clearLabel: 'Очистить',
    immersionLabel: 'Погружение',
    immersionHigh: 'Высокое',
    immersionMedium: 'Среднее',
    immersionLow: 'Низкое',
    uxcatNudge: 'Попробуйте — может изменить всё.',
    uxcatCta: 'Начать тест',
  },
};

const stripMarkers = (raw: string): string =>
  raw
    .replace(/\[(KG|DC|no-context)\]/g, '')
    .replace(/\(Reference:\s*https?:\/\/[^\s)]+\)/gi, '')
    .trim();

type HomepageStarter = {
  q: string;
  a: string;
  cards: Citation[];
};

/* First-touch homepage starter Q&As. Carve-out from the normal
   server-driven concierge pipeline (see docs/widget-architecture.md):
   on the homepage, the empty-state chips are replaced with three
   hand-crafted questions whose answers + cards render locally — no
   LLM call, no retrieval. Pristine brand copy, zero latency, zero
   hallucination risk on the three questions where first-impression
   storytelling matters most. Pipeline resumes for free-form asks. */
const HOMEPAGE_STARTERS: Record<Lang, HomepageStarter[]> = {
  en: [
    {
      q: 'What does keepsimple actually make?',
      a: "keepsimple is an open-source movement at the intersection of cognitive science, product, and engineering — running since 2019. The flagship is **UX Core**, the world's largest free library of cognitive biases and nudging strategies (used at Duke, Harvard, MIT, Google, Amazon). Around it: a designer's guide, an awareness self-test, persona maps, articles, small tools, and an orbital map of the wider work.",
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'UX Core, the flagship bias library',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: "full transparency: our AI agents' orchestration",
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'long-form on cog sci, product, decisions',
        },
      ],
    },
    {
      q: 'How is this project completely free?',
      a: 'No paywalls, no ads, no investors — keepsimple has been free since day one in 2019. It runs on a small team plus a community of contributors and supporters. The code is open-source, the content is under Creative Commons. The deal is simple: if it helped you, pass it on, contribute, or chip in.',
      cards: [
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'the people who keep this open',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: "full transparency: our AI agents' orchestration",
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'our take on the bigger questions',
        },
      ],
    },
    {
      q: "Where do I start if I'm new here?",
      a: "The lowest-friction entry is the **UX Awareness Test** — about 10 minutes, you'll spot a surprising number of biases at play around you. From there: **UX Core** is the bias library, with text and visual examples of how each one shows up. **UXCG** lets you evaluate your own organization for the mistakes those biases drive. And **Articles** is where we lay out our take on the bigger questions.",
      cards: [
        {
          title: 'Awareness Test',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb:
            'take the 10-min Awareness Test and spot numerous biases around us',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'browse the bias library with text + visual examples',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: 'evaluate your organization for the mistakes biases drive',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'learn our take on critical matters',
        },
      ],
    },
  ],
  ru: [
    {
      q: 'Чем занимается keepsimple?',
      a: 'keepsimple — open-source движение на стыке когнитивной науки, продукта и инженерии, с 2019 года. Флагман — **UX Core**, крупнейшая в мире бесплатная библиотека когнитивных искажений и стратегий нуджинга (её используют в Duke, Harvard, MIT, Google, Amazon). Вокруг: гайд для дизайнеров, тест осознанности, персона-карты, статьи, утилиты и орбитальная карта всего проекта.',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'флагманская библиотека искажений',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'полная прозрачность: оркестрация наших AI-агентов',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'длинные тексты про когнитивную науку, продукт, решения',
        },
      ],
    },
    {
      q: 'Почему всё это бесплатно?',
      a: 'Никаких пейволлов, рекламы или инвесторов — keepsimple бесплатен с первого дня в 2019. Проект держится на небольшой команде и сообществе контрибьюторов и саппортеров. Код открыт, контент под Creative Commons. Договор простой: если помогло — расскажи дальше, поучаствуй или поддержи.',
      cards: [
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'люди, которые держат это открытым',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'полная прозрачность: оркестрация наших AI-агентов',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'наша позиция по большим вопросам',
        },
      ],
    },
    {
      q: 'С чего начать, если я тут впервые?',
      a: 'Самый простой вход — **тест осознанности** (UXCAT). Минут 10 — и заметишь удивительно много искажений вокруг себя. Дальше: **UX Core** — библиотека искажений с текстом и визуальными примерами того, как каждое проявляется. **UXCG** даёт оценить собственную организацию на ошибки, которые эти искажения порождают. А **Articles** — место, где мы раскладываем нашу позицию по большим вопросам.',
      cards: [
        {
          title: 'Тест осознанности',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: '10-минутный тест осознанности, заметь искажения вокруг',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'библиотека искажений: текст + визуальные примеры',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: 'оцени свою организацию на ошибки от искажений',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'наша позиция по критическим вопросам',
        },
      ],
    },
  ],
};

type TypeKey =
  | 'bias'
  | 'article'
  | 'persona'
  | 'case'
  | 'game'
  | 'uxcg'
  | 'pyramid'
  | 'aiatlas'
  | 'project';

/* Three-bucket trust signal. LightRAG scores are cosine sims, not
   probabilities — five buckets with precise thresholds implied a
   precision that wasn't there. Honest mapping:
   strong (≥0.50) → 3/3 green, fair (≥0.30) → 2/3 yellow,
   weak (≥0.15) → 1/3 red. Below 0.15 = server already filtered out. */
const TIER_DOTS = 3;
const SCORE_TIERS = [
  { min: 0.5, dots: 3, color: '#4ea83a' },
  { min: 0.3, dots: 2, color: '#d9b13a' },
  { min: 0.15, dots: 1, color: '#d04a3a' },
];
const NOMINATED_TIER = { min: 0.5, dots: 3, color: '#4ea83a' };
const tierFor = (score: number, nominated?: boolean) => {
  if (nominated) return NOMINATED_TIER;
  return (
    SCORE_TIERS.find(t => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1]
  );
};

const TYPE_INFO: Record<TypeKey, { en: string; ru: string; color: string }> = {
  bias: { en: 'Bias', ru: 'Искажение', color: '#c75d3e' },
  article: { en: 'Article', ru: 'Статья', color: '#3a6e8f' },
  persona: { en: 'Persona', ru: 'Персона', color: '#5b8c5a' },
  case: { en: 'Case', ru: 'Кейс', color: '#8a5a3b' },
  game: { en: 'Game', ru: 'Игра', color: '#b8902f' },
  uxcg: { en: 'UXCG', ru: 'UXCG', color: '#7a4ea8' },
  pyramid: { en: 'Pyramid', ru: 'Пирамида', color: '#5a5a5a' },
  aiatlas: { en: 'AI Atlas', ru: 'AI Atlas', color: '#1f3a5f' },
  project: { en: 'Project', ru: 'Проект', color: '#8a2f3a' },
};

const detectType = (
  type: string | undefined,
  url: string | undefined,
): TypeKey | null => {
  const t = (type || '').toLowerCase().trim();
  const u = (url || '').toLowerCase();
  /* URL-shape overrides for project-index destinations that look like
     their detail-page sibling. /articles is the list, not an article;
     /uxcore is the bias library, not a bias. Without this, an upstream
     mistag would label the surface card with the wrong color/word. */
  const path = (() => {
    try {
      return new URL(u, 'http://x').pathname.replace(/\/+$/, '');
    } catch {
      return u.replace(/\/+$/, '');
    }
  })();
  if (path === '/articles') return 'project';
  if (path === '/uxcore') return 'project';
  if (path === '/uxcg') return 'project';
  if (path === '/uxcp') return 'project';
  if (path === '/uxcat') return 'project';
  if (path === '/uxcore-api') return 'project';
  if (path === '/company-management') return 'project';
  if (path === '/ai-atlas') return 'project';
  if (t === 'bias') return 'bias';
  if (t === 'article') return 'article';
  if (t === 'persona') return 'persona';
  if (t === 'case') return 'case';
  if (t === 'game') return 'game';
  if (t === 'question' || t === 'uxcg') return 'uxcg';
  if (t === 'pyramid') return 'pyramid';
  if (t === 'aiatlas' || t === 'ai_atlas') return 'aiatlas';
  if (t === 'project') return 'project';
  if (u.includes('/ai-atlas')) return 'aiatlas';
  if (u.includes('/articles/')) return 'article';
  if (u.includes('/uxcg')) return 'uxcg';
  if (u.includes('/uxcore')) return 'bias';
  if (u.includes('/company-management')) return 'pyramid';
  return null;
};

const rewriteToCurrentHost = (raw: string): string => {
  if (!raw) return raw;
  try {
    const u = new URL(raw, window.location.origin);
    if (u.host === 'keepsimple.io' || u.host === 'www.keepsimple.io') {
      u.host = window.location.host;
      u.protocol = window.location.protocol;
    }
    return u.toString();
  } catch {
    return raw;
  }
};

const errCode = (e: unknown): 'network' | 'rate' | 'server' => {
  const msg = e instanceof Error ? e.message : '';
  if (msg === 'rate') return 'rate';
  if (msg === 'network') return 'network';
  return 'server';
};

/* Strip locale prefix + trailing slash so two anchors pointing at the
   same article ("/articles/foo", "/ru/articles/foo/") collapse. */
const canonicalPathOf = (raw: string): string => {
  try {
    const u = new URL(raw, window.location.origin);
    let p = u.pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, '');
    p = p.replace(/\/+$/, '');
    return p.toLowerCase();
  } catch {
    return '';
  }
};

/* Slug → readable title. "anchoring-effect" → "Anchoring effect".
   Used to derive a trustworthy spatial title from the URL when the
   host page's H1 is the project home heading instead of the entity
   the visitor is actually reading (UX Core bias modals, UXCG case
   modals). */
const slugToTitle = (slug: string): string => {
  const words = slug.replace(/-/g, ' ').trim();
  if (!words) return '';
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/* On UX Core bias pages and UXCG case pages, the bias/case is rendered
   as a modal overlay on top of the project home, so document H1 stays
   on the project name ("UX Core") and would mislabel NOW VIEWING.
   Derive the spatial title from the URL slug instead — it's the
   deterministic, hash-independent identity of the entity in view.
   Returns null for paths where the page H1 is correct. */
const deriveSpatialTitleFromUrl = (rawPathname: string): string | null => {
  const p = rawPathname
    .toLowerCase()
    .replace(/^\/(ru|hy|en)(?=\/|$)/, '')
    .replace(/\/+$/, '');
  const bias = p.match(/^\/uxcore\/\d+-(.+)$/);
  if (bias) return slugToTitle(bias[1]);
  const uxcg = p.match(/^\/uxcg\/([^/]+)$/);
  if (uxcg) return slugToTitle(uxcg[1]);
  return null;
};

/* Hash fragment without the leading "#", lowercased. Empty when the
   URL has no anchor. Used to prefer in-page entities (the AgentsForge
   diamond on /ai-atlas, etc.) over the navigation tab that just
   reloads the same page. */
const hashOf = (raw: string): string => {
  try {
    const u = new URL(raw, window.location.origin);
    return u.hash.replace(/^#/, '').toLowerCase();
  } catch {
    return '';
  }
};

/* Host-DOM highlight: active on every page. The matching helper
   returns nothing when there are no anchors to the card, so pages
   without matches degrade silently. Pure client-side, no extra
   server cost. */
const isHighlightEnabledPage = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/* Find elements on the host page that represent the card. Hash wins:
   /ai-atlas#agentsforge prefers the actual diamond entity (an element
   with id="agentsforge" OR an anchor whose href ends in #agentsforge)
   over the generic nav tab pointing at /ai-atlas. Falls back to plain
   pathname-matching anchors when no hash is present or no specific
   element is found. */
const findHostMatches = (cardUrl: string): HTMLElement[] => {
  if (typeof document === 'undefined') return [];
  const targetPath = canonicalPathOf(cardUrl);
  const targetHash = hashOf(cardUrl);
  if (targetHash) {
    const out: HTMLElement[] = [];
    const idMatch = document.getElementById(targetHash);
    if (idMatch instanceof HTMLElement) out.push(idMatch);
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
      if (hashOf(a.href) !== targetHash) return;
      if (
        targetPath &&
        canonicalPathOf(a.href) &&
        canonicalPathOf(a.href) !== targetPath
      )
        return;
      if (!out.includes(a)) out.push(a);
    });
    if (out.length > 0) return out;
  }
  if (!targetPath) return [];
  const out: HTMLAnchorElement[] = [];
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
    if (canonicalPathOf(a.href) === targetPath) out.push(a);
  });
  return out;
};
/* Back-compat alias. */
const findHostAnchors = findHostMatches;

const HIGHLIGHT_CLASS = 'ks-aux-host-highlight';
const FLASH_CLASS = 'ks-aux-host-highlight-flash';

/* Some host pages wrap clickable text in an anchor styled
   `display: contents` (e.g., UX Core's bias chips). Such an anchor has
   no box of its own, so the highlight needs a sibling/ancestor that
   does render a box.

   We walk UP rather than down because the visible inner element on
   UX Core uses clip-path: polygon(...) for its hexagonal shape, and
   clip-path clips ANY rendered effect on the same element (outline,
   box-shadow, even filters). Applying the highlight to the chip's
   wrapper instead lets `filter: drop-shadow()` render a glow around
   the children's actual polygon shape — clip-path on a descendant
   doesn't reach into the parent's filter pass. */
const isContents = (el: Element): boolean => {
  if (typeof window === 'undefined') return false;
  return window.getComputedStyle(el).display === 'contents';
};
const resolveRenderable = (el: HTMLElement): HTMLElement => {
  if (typeof window === 'undefined') return el;
  if (!isContents(el)) return el;
  let cur: HTMLElement | null = el.parentElement;
  for (let i = 0; i < 4 && cur; i += 1) {
    if (!isContents(cur)) return cur;
    cur = cur.parentElement;
  }
  return el;
};

type HighlightHandle = {
  targets: HTMLElement[];
  cleanup: () => void;
};

const GLOW_CLASS = 'ks-aux-host-highlight-glow';

/* Hover-prefetch: inject <link rel="prefetch"> for a card's destination
   so the navigation feels instant when the visitor clicks. Throttled
   ~80ms so a flicker-hover doesn't waste bandwidth, and de-duped per
   URL per session. Same-origin only (no point prefetching off-host). */
const prefetchedUrls = new Set<string>();
const ensurePrefetchHead = (): HTMLHeadElement | null => {
  if (typeof document === 'undefined') return null;
  return document.head;
};
const prefetchOnce = (url: string): void => {
  if (!url || prefetchedUrls.has(url)) return;
  const head = ensurePrefetchHead();
  if (!head) return;
  try {
    const u = new URL(url, window.location.origin);
    if (u.origin !== window.location.origin) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = u.toString();
    link.as = 'document';
    head.appendChild(link);
    prefetchedUrls.add(url);
  } catch {
    /* malformed url — skip */
  }
};

/* When we had to walk up from a `display: contents` anchor, the matched
   element wraps complex children — likely with clip-path or transforms
   (UX Core bias chips). Outline + box-shadow on the wrapper renders at
   the wrapper's own box, which is zero-sized. Drop-shadow renders
   around the rendered output of children, so it traces the polygon
   shape. For ordinary block anchors (Articles tiles etc.) we keep the
   crisp outline + halo — drop-shadow there would look soft and lose
   the "this one" pointer. */
const applyHostHighlight = (
  els: HTMLElement[],
  flash: boolean,
): HighlightHandle => {
  const resolved = els.map(el => {
    const target = resolveRenderable(el);
    return { target, glow: target !== el };
  });
  resolved.forEach(({ target, glow }) => {
    target.classList.add(HIGHLIGHT_CLASS);
    if (glow) target.classList.add(GLOW_CLASS);
    if (flash) {
      target.classList.remove(FLASH_CLASS);
      /* Force reflow so the same anchor can flash twice in a row. */
      void target.offsetWidth;
      target.classList.add(FLASH_CLASS);
    }
  });
  return {
    targets: resolved.map(r => r.target),
    cleanup: () => {
      resolved.forEach(({ target }) => {
        target.classList.remove(HIGHLIGHT_CLASS);
        target.classList.remove(GLOW_CLASS);
        target.classList.remove(FLASH_CLASS);
      });
    },
  };
};

export function AskUxCore({ lang }: { lang: Lang }) {
  const initial = typeof window !== 'undefined' ? loadState() : null;
  const [open, setOpen] = useState<boolean>(initial?.open ?? false);
  const [text, setText] = useState('');
  const [turns, setTurns] = useState<Turn[]>(initial?.turns ?? []);
  const [loading, setLoading] = useState(false);
  const [awaitingRelevance, setAwaitingRelevance] = useState<boolean>(
    initial?.awaitingRelevance ?? false,
  );

  const pendingLandingRef = useRef<PendingLanding | null>(
    initial?.pendingLanding ?? null,
  );

  const lastPageRef = useRef<LastPage | null>(null);

  useEffect(() => {
    saveState({
      open,
      turns,
      awaitingRelevance,
      pendingLanding: pendingLandingRef.current,
    });
  }, [open, turns, awaitingRelevance]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const justNavigatedRef = useRef(false);
  const organicAbortRef = useRef<AbortController | null>(null);
  const [idleOpacity, setIdleOpacity] = useState<number>(() =>
    loadIdleOpacity(),
  );
  const [immersionOpen, setImmersionOpen] = useState<boolean>(false);
  const immersionMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!immersionOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const root = immersionMenuRef.current;
      if (root && !root.contains(e.target as Node)) setImmersionOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImmersionOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [immersionOpen]);
  const [collapsedOnce, setCollapsedOnce] = useState<boolean>(() =>
    loadCollapsedOnce(),
  );
  const [pageSuggestions, setPageSuggestions] = useState<string[]>(() =>
    typeof window !== 'undefined' ? loadSuggestions(window.location.href) : [],
  );
  /* Random recommended question harvested from the host page's own
     "recommended questions" section (bias-card pages have one). Pure
     DOM read, refreshed on URL flips so it always matches the current
     page. null when no plausible section is on the page. */
  const [recommendedQ, setRecommendedQ] = useState<string | null>(() =>
    typeof window !== 'undefined' ? harvestRecommendedQuestion() : null,
  );
  useEffect(() => {
    try {
      localStorage.setItem(IDLE_OPACITY_KEY, String(idleOpacity));
    } catch {
      /* ignore */
    }
  }, [idleOpacity]);
  const t = TEXT[lang];

  /* Live "Reading: <h1>" header label. Prefers the page H1 (shorter,
     truer to what the visitor sees) and falls back to the cleaned
     document.title. Refreshes on URL/title flips so it always matches
     the page the widget is actually grounded on. */
  const readCurrentLabel = (): string => {
    if (typeof document === 'undefined') return '';
    const urlTitle = deriveSpatialTitleFromUrl(window.location.pathname);
    if (urlTitle) return urlTitle.slice(0, 80);
    const h1 = document.querySelector('h1');
    const txt = h1?.textContent?.replace(/\s+/g, ' ').trim();
    if (txt) return txt.slice(0, 80);
    return cleanPageTitle(document.title || '').slice(0, 80);
  };
  const isHomePath = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /^\/(?:ru|hy|en)?\/?$/i.test(window.location.pathname);
  };
  const isOnUxcatRoot = (): boolean => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname
      .toLowerCase()
      .replace(/^\/(ru|hy|en)(?=\/|$)/, '')
      .replace(/\/+$/, '');
    return p === '/uxcat';
  };
  const [readingLabel, setReadingLabel] = useState<string>(() =>
    readCurrentLabel(),
  );
  const [atHome, setAtHome] = useState<boolean>(() => isHomePath());
  const [onUxcatRoot, setOnUxcatRoot] = useState<boolean>(() =>
    isOnUxcatRoot(),
  );
  const onBeginUxcatTest = () => {
    trackEvent('uxcat_begin_test_click', {});
    let hasToken = false;
    try {
      hasToken = !!localStorage.getItem('accessToken');
    } catch {
      /* localStorage disabled — fall through to navigation; the
         server-side page guard will handle it. */
    }
    if (!hasToken) {
      /* Mirror the in-page /uxcat begin-test CTA: when anonymous,
         open the host page's LogInModal via custom event rather than
         bounce through /uxcat/start-test → /uxcat. UXCatLayout listens
         and opens its modal. */
      trackEvent('uxcat_begin_test_auth_gate', {});
      window.dispatchEvent(
        new CustomEvent('ks-aux-request-login', {
          detail: { source: 'widget-uxcat', next: '/uxcat/start-test' },
        }),
      );
      return;
    }
    const target = rewriteToCurrentHost('/uxcat/start-test');
    window.location.href = target;
  };
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const update = () => {
      setReadingLabel(readCurrentLabel());
      setAtHome(isHomePath());
      setOnUxcatRoot(isOnUxcatRoot());
    };
    update();
    const onUrl = () => setTimeout(update, 280);
    window.addEventListener('popstate', onUrl);
    window.addEventListener('ks-aux-urlchange', onUrl);
    const mo = new MutationObserver(() => {
      setReadingLabel(readCurrentLabel());
    });
    mo.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    const h1Watch = new MutationObserver(update);
    const h1 = document.querySelector('h1');
    if (h1)
      h1Watch.observe(h1, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    return () => {
      window.removeEventListener('popstate', onUrl);
      window.removeEventListener('ks-aux-urlchange', onUrl);
      mo.disconnect();
      h1Watch.disconnect();
    };
  }, []);

  /* Mirror the host site's light/dark theme. KeepSimpleOSS toggles
     `document.body.classList.toggle('darkTheme', ...)`. We watch for
     that flag and any equivalent (data-theme="dark", <html>.dark for
     other hosts the widget might land on later) so the widget never
     looks out of place. */
  const detectDark = (): boolean => {
    if (typeof document === 'undefined') return false;
    const b = document.body;
    const h = document.documentElement;
    return (
      b?.classList.contains('darkTheme') ||
      b?.classList.contains('dark') ||
      h?.classList.contains('darkTheme') ||
      h?.classList.contains('dark') ||
      b?.getAttribute('data-theme') === 'dark' ||
      h?.getAttribute('data-theme') === 'dark'
    );
  };
  const [isDark, setIsDark] = useState<boolean>(() => detectDark());
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const update = () => setIsDark(detectDark());
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    /* Only auto-focus the input on an empty panel. With history, focus
       would pop the mobile keyboard on top of the answer the user came
       back to read. */
    if (turns.length === 0) inputRef.current?.focus();
    /* Snap to bottom and KEEP snapping while content is still laying
       out. Initial render → snap. Font loads or image decodes that
       change feed height → ResizeObserver fires → snap again. After
       1.5s or once the user touches the scroll themselves, we stop
       fighting them. */
    const snap = () => {
      const el = feedRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
      stickToBottomRef.current = true;
    };
    requestAnimationFrame(() => requestAnimationFrame(snap));
    let stopped = false;
    let userScrolled = false;
    const onUserScroll = () => {
      userScrolled = true;
    };
    const el = feedRef.current;
    el?.addEventListener('wheel', onUserScroll, { passive: true });
    el?.addEventListener('touchmove', onUserScroll, { passive: true });
    const ro =
      el && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (stopped || userScrolled) return;
            snap();
          })
        : null;
    if (ro && el) {
      ro.observe(el);
      const inner = el.firstElementChild;
      if (inner instanceof Element) ro.observe(inner);
      /* Observe each direct child too so streamed text growth catches. */
      Array.from(el.children).forEach(c => ro.observe(c));
    }
    const fonts = (
      document as unknown as { fonts?: { ready?: Promise<unknown> } }
    ).fonts;
    fonts?.ready?.then(() => {
      if (!stopped && !userScrolled) requestAnimationFrame(snap);
    });
    const stopT = window.setTimeout(() => {
      stopped = true;
      ro?.disconnect();
    }, 1500);
    return () => {
      stopped = true;
      window.clearTimeout(stopT);
      ro?.disconnect();
      el?.removeEventListener('wheel', onUserScroll);
      el?.removeEventListener('touchmove', onUserScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* On mobile, lock the page behind the open panel so two-finger swipes
     inside the feed don't drag the host page. iOS Safari rubber-band
     bypasses overscroll-behavior, so we pin position:fixed on body and
     restore the original scroll offset on close. Also tracks the
     visualViewport so the panel resizes above the on-screen keyboard
     and the input never gets covered. */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    if (!open || !isMobile) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    const setVh = () => {
      const vv = window.visualViewport;
      const h = (vv && vv.height) || window.innerHeight;
      const occluded = vv
        ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
        : 0;
      root.style.setProperty('--ks-aux-vh', `${h}px`);
      root.style.setProperty('--ks-aux-bottom-offset', `${occluded}px`);
      root.style.setProperty('--ks-aux-panel-h', `${Math.max(220, h - 96)}px`);
    };
    setVh();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', setVh);
    vv?.addEventListener('scroll', setVh);

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      root.style.removeProperty('--ks-aux-vh');
      root.style.removeProperty('--ks-aux-bottom-offset');
      root.style.removeProperty('--ks-aux-panel-h');
      vv?.removeEventListener('resize', setVh);
      vv?.removeEventListener('scroll', setVh);
    };
  }, [open]);

  /* Watch the host page's URL and document.title and inject a "→ Now
     viewing: X" system breadcrumb into the transcript every time the
     visitor moves. Covers three flows:
       (a) Cross-page reload: compare persisted lastPage to current.
       (b) In-page route push/replace (SPA / hash modal).
       (c) Title-only swap (modal opens without URL change).
     Suppressed when a landing turn is about to fire for the same hop
     (widget-card click) — landing already explains the move, so a nav
     chip would be redundant. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    /* Spatial markers always speak in the page's own H1. Page title
       is intentionally ignored — too often it carries brand suffixes
       or templated junk that misrepresents the page. If no H1 is
       found, we return empty and skip the nav entirely.

       Homepage exception: the H1 there is "Wolf Alexanyan" which
       reads weird as a destination label. We hardcode "Keep Simple"
       for any homepage path (/, /ru, /hy, /en). */
    const HOME_LABEL = 'Keep Simple';
    const isHome = (): boolean =>
      /^\/(?:ru|hy|en)?\/?$/i.test(window.location.pathname);
    const currentDisplayTitle = (_rawTitleFallback: string): string => {
      if (isHome()) return HOME_LABEL;
      const urlTitle = deriveSpatialTitleFromUrl(window.location.pathname);
      if (urlTitle) return urlTitle.slice(0, 200);
      const h1 = document.querySelector('h1')?.textContent;
      const fromH1 = h1?.replace(/\s+/g, ' ').trim() ?? '';
      return fromH1.slice(0, 200);
    };

    const appendNav = (rawTitle: string) => {
      const cleaned = currentDisplayTitle(rawTitle);
      if (!cleaned) return;
      setTurns(cur => {
        const last = cur[cur.length - 1];
        if (last?.kind === 'nav' && last.navTitle === cleaned) return cur;
        justNavigatedRef.current = true;
        return [
          ...cur,
          {
            id: `nav-${Date.now()}`,
            query: '',
            answer: '',
            citations: [],
            suggestions: [],
            mode: 'answer',
            isStreaming: false,
            kind: 'nav',
            navTitle: cleaned,
          },
        ];
      });
    };

    /* Organic-nav explainer: every time the visitor arrives on a new
       page (back/forward, in-site link, modal route), fire a short
       team-voice line that orients them. Distinct from the card-click
       landing — it's an aside, not a "you came from our card" prompt.
       Aborts in flight if another nav happens before the response. */
    const fireOrganicLanding = (rawUrl: string, rawTitle: string) => {
      organicAbortRef.current?.abort();
      const ctrl = new AbortController();
      organicAbortRef.current = ctrl;
      fetch('/api/concierge-landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        signal: ctrl.signal,
        body: JSON.stringify({
          url: rawUrl,
          title: rawTitle,
          prevQuery: '',
          prevAnswer: '',
          lang,
          mode: 'organic',
        }),
      })
        .then(r => r.json())
        .then((data: { text?: string; suggestions?: unknown }) => {
          const sugs = Array.isArray(data?.suggestions)
            ? (data.suggestions as unknown[]).filter(
                (s): s is string =>
                  typeof s === 'string' && s.trim().length > 0,
              )
            : [];
          if (sugs.length > 0) {
            setPageSuggestions(sugs);
            saveSuggestions(rawUrl, sugs);
          }
          const text = (data?.text || '').trim();
          if (!text) return;
          justNavigatedRef.current = true;
          /* Prefer URL-slug-derived title (bias / UXCG case slug)
             over document.title — on UX Core modal-overlay pages the
             title can read as the project home. */
          const urlTitle = (() => {
            try {
              return deriveSpatialTitleFromUrl(new URL(rawUrl).pathname);
            } catch {
              return null;
            }
          })();
          setTurns(cur => [
            ...cur,
            {
              id: `land-${Date.now()}`,
              query: '',
              answer: text,
              citations: [],
              suggestions: [],
              mode: 'answer',
              isStreaming: false,
              kind: 'landing',
              navTitle: urlTitle || cleanPageTitle(rawTitle),
            },
          ]);
        })
        .catch(() => {
          /* aborted or upstream fail — silent */
        });
    };

    const currentPage: LastPage = {
      url: window.location.href,
      title: document.title,
    };

    /* Mount-time cross-page diff. Skip when pendingLanding is set —
       landing effect handles that hop. */
    const prior = loadLastPage();
    const hasPendingLanding = !!pendingLandingRef.current;
    if (
      !hasPendingLanding &&
      prior &&
      cleanPageTitle(prior.title) &&
      cleanPageTitle(prior.title) !== cleanPageTitle(currentPage.title)
    ) {
      appendNav(currentPage.title);
      fireOrganicLanding(currentPage.url, currentPage.title);
    }
    lastPageRef.current = currentPage;
    saveLastPage(currentPage);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const check = () => {
      const url = window.location.href;
      const title = document.title;
      const cleaned = cleanPageTitle(title);
      const lastCleaned = cleanPageTitle(lastPageRef.current?.title || '');
      const next = { url, title };
      lastPageRef.current = next;
      saveLastPage(next);
      if (!cleaned || cleaned === lastCleaned) return;
      /* Swap suggestions to whatever we cached for the new URL so the
         empty-feed pills feel instant; the landing fetch refreshes
         them when it returns. */
      setPageSuggestions(loadSuggestions(url));
      setRecommendedQ(harvestRecommendedQuestion());
      appendNav(title);
      fireOrganicLanding(url, title);
    };
    const onChange = () => {
      if (timer) clearTimeout(timer);
      /* Debounce — title often lags URL by a frame in client-side
         routers, and rapid title swaps (loading dots) shouldn't each
         emit a nav turn. */
      timer = setTimeout(check, 220);
    };

    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args as Parameters<typeof origPush>);
      window.dispatchEvent(new Event('ks-aux-urlchange'));
      return r;
    };
    window.history.replaceState = function (...args) {
      const r = origReplace.apply(this, args as Parameters<typeof origReplace>);
      window.dispatchEvent(new Event('ks-aux-urlchange'));
      return r;
    };
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    window.addEventListener('ks-aux-urlchange', onChange);

    let titleObs: MutationObserver | null = null;
    const titleEl = document.querySelector('title');
    if (titleEl && typeof MutationObserver !== 'undefined') {
      titleObs = new MutationObserver(onChange);
      titleObs.observe(titleEl, { childList: true, subtree: true });
    }

    const onUnload = () => {
      if (lastPageRef.current) saveLastPage(lastPageRef.current);
    };
    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('pagehide', onUnload);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('ks-aux-urlchange', onChange);
      window.removeEventListener('beforeunload', onUnload);
      window.removeEventListener('pagehide', onUnload);
      titleObs?.disconnect();
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, []);

  /* On mount: if the previous page tucked away a pending-landing (user
     clicked a card and we navigated here), fetch a short team line about
     this page and append it as a fresh turn — no nav chip, just the
     team chiming in. */
  useEffect(() => {
    const pending = pendingLandingRef.current;
    if (!pending) return;
    /* Only the tab that wrote the pending landing consumes it. Other
       tabs see a foreign tab-id and leave it alone — prevents a
       middle-clicked card in tab A from triggering a duplicate
       landing fetch in tab B. */
    const myTab = getTabId();
    const sameTab = !pending.tabId || pending.tabId === myTab;
    const fresh =
      !pending.createdAt ||
      Date.now() - pending.createdAt < PENDING_LANDING_MAX_AGE_MS;
    if (!sameTab) return;
    if (!fresh) {
      pendingLandingRef.current = null;
      return;
    }
    pendingLandingRef.current = null;
    let cancelled = false;
    fetch('/api/concierge-landing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        url: window.location.href,
        title: document.title,
        prevQuery: pending.prevQuery,
        prevAnswer: pending.prevAnswer,
        lang,
      }),
    })
      .then(r => r.json())
      .then((data: { text?: string; suggestions?: unknown }) => {
        if (cancelled) return;
        const sugs = Array.isArray(data?.suggestions)
          ? (data.suggestions as unknown[]).filter(
              (s): s is string => typeof s === 'string' && s.trim().length > 0,
            )
          : [];
        if (sugs.length > 0) {
          setPageSuggestions(sugs);
          saveSuggestions(window.location.href, sugs);
        }
        const text = (data?.text || '').trim();
        const resolvedTitle = (() => {
          /* Homepage exception: H1 there reads as a personal name,
             force "Keep Simple" so the marker reads as the brand
             destination. */
          if (/^\/(?:ru|hy|en)?\/?$/i.test(window.location.pathname)) {
            return 'Keep Simple';
          }
          /* Prefer URL-slug-derived title for UX Core biases and UXCG
             cases — those are modal overlays whose H1 is the project
             home heading. */
          const urlTitle = deriveSpatialTitleFromUrl(window.location.pathname);
          if (urlTitle) return urlTitle.slice(0, 200);
          const h1 = document
            .querySelector('h1')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim();
          if (h1) return h1.slice(0, 200);
          const fromCard = cleanPageTitle(pending.title);
          if (fromCard) return fromCard;
          return '';
        })();
        const placeholderId = pending.placeholderId;
        justNavigatedRef.current = true;
        setTurns(cur => {
          /* Replace the optimistic placeholder we dropped on click;
             back-compat fallback appends a fresh turn for old
             pending-landings that lack an id. */
          const idx =
            placeholderId !== undefined
              ? cur.findIndex(tt => tt.id === placeholderId)
              : -1;
          if (idx >= 0) {
            if (!text) {
              /* LLM returned nothing — drop the placeholder so we
                 don't leave a permanent skeleton. */
              return cur.filter((_, i) => i !== idx);
            }
            const next = cur.slice();
            next[idx] = {
              ...next[idx],
              answer: text,
              isStreaming: false,
              /* H1 wins over the optimistic card-title seed. */
              navTitle: resolvedTitle || next[idx].navTitle,
            };
            return next;
          }
          if (!text) return cur;
          return [
            ...cur,
            {
              id: `land-${Date.now()}`,
              query: '',
              answer: text,
              citations: [],
              suggestions: [],
              mode: 'answer',
              isStreaming: false,
              kind: 'landing',
              navTitle: resolvedTitle,
            },
          ];
        });
      })
      .catch(() => {
        /* landing line is best-effort — clear placeholder skeleton */
        const placeholderId = pending.placeholderId;
        if (placeholderId === undefined) return;
        setTurns(cur => cur.filter(tt => tt.id !== placeholderId));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFeedScroll = () => {
    const el = feedRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 40;
  };

  const justSubmittedRef = useRef(false);
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    if (justSubmittedRef.current || justNavigatedRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      justSubmittedRef.current = false;
      justNavigatedRef.current = false;
      stickToBottomRef.current = true;
    } else if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [turns]);

  /* Articles-page experiment: when fresh cards land, flash the
     matching tiles on the host page so the visitor sees "here, look
     at these" in context, not just in the widget. */
  const lastFlashedTurnIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isHighlightEnabledPage()) return;
    const last = turns[turns.length - 1];
    if (!last || last.kind === 'nav' || last.isStreaming) return;
    if (!last.citations || last.citations.length === 0) return;
    if (lastFlashedTurnIdRef.current === last.id) return;
    lastFlashedTurnIdRef.current = last.id;
    const matched: HTMLElement[] = [];
    for (const c of last.citations) {
      const hits = findHostAnchors(c.url);
      for (const h of hits) if (!matched.includes(h)) matched.push(h);
    }
    if (matched.length === 0) return;
    const handle = applyHostHighlight(matched, true);
    const t = window.setTimeout(() => {
      handle.targets.forEach(el => el.classList.remove(FLASH_CLASS));
    }, 1800);
    /* Highlight is persistent until the visitor mouses onto the
       highlighted host element — then THAT element's halo clears.
       Hovering or clicking inside the widget never affects host
       highlights; only direct host-side intent does. */
    const handlers = handle.targets.map(el => {
      const onEnter = () => {
        el.classList.remove(HIGHLIGHT_CLASS);
        el.classList.remove(FLASH_CLASS);
        el.removeEventListener('mouseenter', onEnter);
      };
      el.addEventListener('mouseenter', onEnter);
      return { el, onEnter };
    });
    return () => {
      window.clearTimeout(t);
      handlers.forEach(({ el, onEnter }) =>
        el.removeEventListener('mouseenter', onEnter),
      );
      handle.cleanup();
    };
  }, [turns]);

  /* Homepage carve-out: render a starter Q&A as a local Turn.
     Mimics the real concierge pipeline visually — a short "thinking"
     beat with the streaming caret, then the answer types in chunks,
     then the cards land. Without the beat + stream it reads as
     pre-canned junk, not a live agent. */
  const runStarter = (starter: HomepageStarter) => {
    trackEvent('homepage_starter_clicked', { lang, q: starter.q });
    const id = `${Date.now()}-starter`;
    const emptyTurn: Turn = {
      id,
      query: starter.q,
      answer: '',
      citations: [],
      suggestions: [],
      mode: 'answer',
      isStreaming: true,
    };
    justSubmittedRef.current = true;
    setTurns(prev => [...prev, emptyTurn]);

    /* Beat 1 — "thinking" pause with the caret on but no text yet. */
    const THINK_MS = 750;
    /* Beat 2 — type the answer in word-ish chunks. ~14ms per ~3
       chars lands in the same feel as a real LLM stream. */
    const STREAM_CHUNK = 3;
    const STREAM_TICK = 14;
    /* Beat 3 — short hold after the last char so the eye finishes,
       then attach cards and end the stream. */
    const SETTLE_MS = 160;

    window.setTimeout(() => {
      let cursor = 0;
      const tick = () => {
        cursor = Math.min(cursor + STREAM_CHUNK, starter.a.length);
        const partial = starter.a.slice(0, cursor);
        setTurns(prev =>
          prev.map(tt => (tt.id === id ? { ...tt, answer: partial } : tt)),
        );
        if (cursor < starter.a.length) {
          window.setTimeout(tick, STREAM_TICK);
        } else {
          window.setTimeout(() => {
            setTurns(prev =>
              prev.map(tt =>
                tt.id === id
                  ? {
                      ...tt,
                      answer: starter.a,
                      citations: starter.cards,
                      isStreaming: false,
                    }
                  : tt,
              ),
            );
          }, SETTLE_MS);
        }
      };
      tick();
    }, THINK_MS);
  };

  const runQuery = async (query: string, replaceTurnId?: string) => {
    setLoading(true);
    const id = replaceTurnId ?? `${Date.now()}`;
    const newTurn: Turn = {
      id,
      query,
      answer: '',
      citations: [],
      suggestions: [],
      mode: 'answer',
      isStreaming: true,
    };
    justSubmittedRef.current = true;
    setTurns(prev =>
      replaceTurnId
        ? prev.map(tt => (tt.id === replaceTurnId ? newTurn : tt))
        : [...prev, newTurn],
    );

    trackEvent('query_sent', { lang, retry: !!replaceTurnId });

    try {
      /* Send last 6 finished turns so follow-ups like "how do I do that?"
         have anchor context. Nav turns are interleaved so the LLM sees
         the journey (e.g., asked about anchors → moved to Mental
         Accounting → now asking again). Skip the in-flight turn. */
      const history = turns
        .filter(tt => tt.id !== id && !tt.isStreaming)
        .filter(tt =>
          tt.kind === 'nav' ? !!tt.navTitle : !!(tt.query && tt.answer),
        )
        .slice(-6)
        .map(tt =>
          tt.kind === 'nav'
            ? { q: '', a: '', nav: tt.navTitle ?? '' }
            : { q: tt.query, a: tt.answer.slice(0, 400) },
        );
      /* Collect URLs of cards we've shown in recent turns so the server
         can tell the LLM to prefer fresh recommendations and not loop
         the same surface cards each turn. */
      const recentCardUrls = Array.from(
        new Set(
          turns
            .filter(tt => tt.id !== id)
            .slice(-4)
            .flatMap(tt => tt.citations.map(c => c.url)),
        ),
      );
      /* The most recent card the visitor actually clicked, with its
         relevance tier. Lets the server's follow-up-question rule
         fire when we handed them a soft match (1/3 or 2/3 dots),
         since that's the right moment to re-orient. */
      const lastPick = (() => {
        for (let i = turns.length - 1; i >= 0; i -= 1) {
          const tt = turns[i];
          if (tt.id === id) continue;
          const picked = tt.citations.find(c => c.picked);
          if (!picked) continue;
          const tier = tierFor(picked.score ?? 0, picked.nominated);
          const tierName: 'high' | 'mid' | 'low' =
            tier.dots >= 3 ? 'high' : tier.dots === 2 ? 'mid' : 'low';
          return {
            url: picked.url,
            title: picked.title,
            tier: tierName,
          };
        }
        return null;
      })();
      const onChunk = (current: string) => {
        const cleanedPartial = stripMarkers(current);
        setTurns(prev =>
          prev.map(tt =>
            tt.id === id ? { ...tt, answer: cleanedPartial } : tt,
          ),
        );
      };
      const result = await askConcierge(
        query,
        lang,
        history,
        recentCardUrls,
        '/api/concierge',
        onChunk,
        lastPick,
      );
      const cleaned = stripMarkers(result.answer);

      setTurns(prev =>
        prev.map(tt =>
          tt.id === id
            ? {
                ...tt,
                answer: cleaned,
                citations: result.citations,
                suggestions: result.suggestions,
                mode: result.mode,
                isStreaming: false,
              }
            : tt,
        ),
      );
      trackEvent('answer_received', {
        lang,
        citations: result.citations.length,
        mode: result.mode,
      });
    } catch (e) {
      const code = errCode(e);
      const errText =
        code === 'rate'
          ? t.rateErr
          : code === 'network'
            ? t.networkErr
            : t.serverErr;
      setTurns(prev =>
        prev.map(tt =>
          tt.id === id ? { ...tt, isStreaming: false, error: errText } : tt,
        ),
      );
      trackEvent('answer_error', { lang, code });
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const query = text.trim();
    if (!query || loading) return;
    setText('');
    await runQuery(query);
  };

  const onCardClick = (citation: Citation) => {
    if (!citation.url) return;
    trackEvent('card_click', { url: citation.url, type: citation.type });
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 480px)').matches;
    const target = rewriteToCurrentHost(citation.url);
    /* Same-pathname + has hash → in-page jump. The host's own JS
       handlers (Atlas dossier opener, accordion expanders, etc.)
       fire on hashchange and the user stays where they are, no
       reload, no card-click landing fetch. */
    let parsed: URL | null = null;
    try {
      parsed = new URL(target, window.location.origin);
    } catch {
      parsed = null;
    }
    const samePath = parsed && parsed.pathname === window.location.pathname;
    const hasHash = !!parsed?.hash;
    const updatedTurns = turns.map(tt => ({
      ...tt,
      citations: tt.citations.map(c =>
        c.url === citation.url ? { ...c, picked: true } : c,
      ),
    }));
    if (samePath && hasHash) {
      setTurns(updatedTurns);
      saveState({
        open: !isMobile,
        turns: updatedTurns,
        awaitingRelevance: false,
        pendingLanding: null,
      });
      window.location.hash = parsed!.hash;
      return;
    }
    const lastAnswer = [...turns].reverse().find(tt => tt.query && tt.answer);
    /* Optimistic landing: append the new NOW VIEWING marker as a
       streaming-state landing turn BEFORE we navigate. Past content
       greys immediately, the visitor sees "we're moving you" instead
       of staring at the old answer until the LLM round-trip returns.
       On the destination mount, the landing fetch replaces this
       turn's content by id. */
    const placeholderId = `land-${Date.now()}`;
    const optimisticTurn: Turn = {
      id: placeholderId,
      query: '',
      answer: '',
      citations: [],
      suggestions: [],
      mode: 'answer',
      isStreaming: true,
      kind: 'landing',
      navTitle: cleanPageTitle(citation.title) || citation.title,
    };
    const turnsWithOptimistic = [...updatedTurns, optimisticTurn];
    const pendingLanding: PendingLanding = {
      url: citation.url,
      title: citation.title,
      prevQuery: lastAnswer?.query ?? '',
      prevAnswer: lastAnswer?.answer ?? '',
      placeholderId,
      tabId: getTabId(),
      createdAt: Date.now(),
    };
    saveState({
      open: !isMobile,
      turns: turnsWithOptimistic,
      awaitingRelevance: isMobile,
      pendingLanding,
    });
    window.location.href = target;
  };

  const onSuggestionClick = (suggestion: string) => {
    if (loading) return;
    trackEvent('suggestion_click', { lang });
    runQuery(suggestion);
  };

  const onClose = () => {
    trackEvent('panel_close', { turns: turns.length });
    setOpen(false);
    if (!collapsedOnce) {
      setCollapsedOnce(true);
      try {
        localStorage.setItem(COLLAPSED_ONCE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  };

  const [copied, setCopied] = useState(false);

  const onClearAll = () => {
    setTurns([]);
    setText('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    trackEvent('clear_all', {});
  };
  const onCopyTranscript = async () => {
    const lines: string[] = [];
    for (const turn of turns) {
      if (turn.kind === 'nav') {
        lines.push(`[NAV] → ${turn.navTitle ?? ''}`);
        lines.push('');
        continue;
      }
      if (turn.query) lines.push(`[USER] ${turn.query}`);
      if (turn.error) {
        lines.push(`[ERROR] ${turn.error}`);
      } else if (turn.answer) {
        lines.push(`[BOT · ${turn.mode}] ${turn.answer}`);
      }
      if (turn.mode === 'clarify' && turn.suggestions.length > 0) {
        lines.push(`[SUGGESTIONS] ${turn.suggestions.join(' | ')}`);
      }
      if (turn.mode === 'answer' && turn.citations.length > 0) {
        lines.push('[CARDS]');
        for (const c of turn.citations) {
          const tk = detectType(c.type, c.url);
          const label = tk ? TYPE_INFO[tk].en : 'Link';
          lines.push(`  - ${label}: ${c.title} → ${c.url}`);
        }
      }
      lines.push('');
    }
    lines.push(`[META] page: ${window.location.href} | lang: ${lang}`);
    const text = lines.join('\n').trim();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // give up silently
      }
      document.body.removeChild(ta);
    }
  };

  const onOpen = () => {
    trackEvent('pill_open', {
      hasHistory: turns.length > 0,
      relevancePrompt: awaitingRelevance,
    });
    setAwaitingRelevance(false);
    setOpen(true);
  };

  return (
    <div
      className={'ks-aux-root' + (isDark ? ' ks-aux-dark' : '')}
      style={{ '--ks-aux-idle-opacity': String(idleOpacity) } as CSSProperties}
    >
      <div
        className={'ks-aux-panel' + (open ? ' ks-aux-panel-open' : '')}
        role="dialog"
        aria-label="Ask anything"
        aria-hidden={!open}
      >
        <div className="ks-aux-header">
          <span className="ks-aux-reading" aria-label={t.readingLabel}>
            <span className="ks-aux-reading-dot" aria-hidden="true" />
          </span>
          {/* Immersion is the existing idle-opacity preference in a
              quieter shape: a small opacity-style icon next to CLEAR.
              The icon's inner fill reflects the current opacity, so the
              control hints at its own state at a glance. Click → small
              menu with Low / Medium / High. */}
          {(() => {
            const levels: Array<{
              key: 'low' | 'medium' | 'high';
              value: 0.85 | 0.55 | 0.3;
              label: string;
            }> = [
              { key: 'low', value: 0.85, label: t.immersionLow },
              { key: 'medium', value: 0.55, label: t.immersionMedium },
              { key: 'high', value: 0.3, label: t.immersionHigh },
            ];
            return (
              <div
                className="ks-aux-immersion"
                ref={immersionMenuRef}
                role="group"
                aria-label={t.immersionLabel}
              >
                <button
                  type="button"
                  className="ks-aux-immersion-icon-btn"
                  onClick={() => setImmersionOpen(o => !o)}
                  aria-haspopup="menu"
                  aria-expanded={immersionOpen}
                  aria-label={t.immersionLabel}
                  title={t.immersionLabel}
                  tabIndex={open ? 0 : -1}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {/* Half-moon style opacity glyph: the right half
                        always solid, the left half fills with current
                        opacity. Reads as "this much widget visibility". */}
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path d="M12 3 a9 9 0 0 1 0 18 Z" fill="currentColor" />
                    <path
                      d="M12 3 a9 9 0 0 0 0 18 Z"
                      fill="currentColor"
                      fillOpacity={idleOpacity}
                    />
                  </svg>
                </button>
                {immersionOpen && (
                  <div className="ks-aux-immersion-menu" role="menu">
                    {levels.map(l => (
                      <button
                        key={l.key}
                        type="button"
                        className={
                          'ks-aux-immersion-item' +
                          (l.value === idleOpacity
                            ? ' ks-aux-immersion-item-active'
                            : '')
                        }
                        role="menuitemradio"
                        aria-checked={l.value === idleOpacity}
                        onClick={() => {
                          setIdleOpacity(l.value);
                          setImmersionOpen(false);
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          <button
            type="button"
            className="ks-aux-action-btn ks-aux-clear-btn"
            onClick={onClearAll}
            disabled={turns.length === 0}
            aria-label={t.clearLabel}
            tabIndex={open ? 0 : -1}
          >
            {t.clearLabel}
          </button>
          <button
            type="button"
            className="ks-aux-action-btn ks-aux-collapse-btn ks-aux-collapse-btn-icon"
            onClick={onClose}
            aria-label={t.collapseLabel}
            title={t.collapseLabel}
            tabIndex={open ? 0 : -1}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {turns.length === 0 ? (
          <div className="ks-aux-feed-empty">
            <span className="ks-aux-feed-empty-text">{t.empty}</span>
            {(() => {
              /* Homepage carve-out: replace server-driven page
                 suggestions with hand-crafted first-touch starters
                 (HOMEPAGE_STARTERS). Click → runStarter renders a
                 local Q&A turn with pre-canned answer + cards. */
              if (atHome) {
                const starters = HOMEPAGE_STARTERS[lang];
                return (
                  <div className="ks-aux-empty-sugg">
                    {starters.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className="ks-aux-suggestion"
                        onClick={() => runStarter(s)}
                        tabIndex={open ? 0 : -1}
                      >
                        {s.q}
                      </button>
                    ))}
                  </div>
                );
              }
              /* Merge the page's own "recommended question" (harvested
                 from the host DOM — bias cards ship one) into the empty-
                 state chips. Leads the list when present so the visitor
                 sees a page-anchored prompt first. Deduped against the
                 cached suggestions. Caps at 3 total. */
              const merged: string[] = [];
              const seen = new Set<string>();
              const push = (s: string) => {
                const k = s.replace(/\s+/g, ' ').trim().toLowerCase();
                if (!k || seen.has(k)) return;
                seen.add(k);
                merged.push(s);
              };
              if (recommendedQ) push(recommendedQ);
              for (const s of pageSuggestions) push(s);
              const display = merged.slice(0, 3);
              if (display.length === 0) return null;
              return (
                <div className="ks-aux-empty-sugg">
                  {display.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="ks-aux-suggestion"
                      onClick={() => runQuery(s)}
                      tabIndex={open ? 0 : -1}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="ks-aux-feed" ref={feedRef} onScroll={onFeedScroll}>
            {(() => {
              let lastSpatialIdx = -1;
              turns.forEach((tt, i) => {
                if (tt.kind === 'nav' || tt.kind === 'landing')
                  lastSpatialIdx = i;
              });
              /* Nav chip + landing turn fire on the same hop and both
                 carry the same page title. The landing turn already
                 prints a "Viewed: X" header, so the nav chip becomes a
                 duplicate the moment a landing for the same page
                 arrives. Skip the nav whenever a same-page landing
                 follows it before the next nav. */
              const navTitleEq = (
                a: string | undefined,
                b: string | undefined,
              ) =>
                cleanPageTitle(a || '').toLowerCase() ===
                cleanPageTitle(b || '').toLowerCase();
              const skipNavIdx = new Set<number>();
              turns.forEach((tt, i) => {
                if (tt.kind !== 'nav') return;
                for (let j = i + 1; j < turns.length; j += 1) {
                  const nx = turns[j];
                  if (nx.kind === 'nav') break;
                  if (
                    nx.kind === 'landing' &&
                    navTitleEq(nx.navTitle, tt.navTitle)
                  ) {
                    skipNavIdx.add(i);
                    break;
                  }
                }
              });
              return turns.map((turn, idx) => {
                if (turn.kind === 'nav' && skipNavIdx.has(idx)) return null;
                const isCurrentSpatial =
                  (turn.kind === 'nav' || turn.kind === 'landing') &&
                  idx === lastSpatialIdx;
                const isBeforeCurrent =
                  lastSpatialIdx >= 0 && idx < lastSpatialIdx;
                const dimClass = isBeforeCurrent ? ' ks-aux-pre-current' : '';
                if (turn.kind === 'nav') {
                  return (
                    <div
                      key={turn.id}
                      className={
                        'ks-aux-nav ks-aux-spatial' +
                        (isCurrentSpatial ? ' ks-aux-spatial-current' : '') +
                        dimClass
                      }
                    >
                      {isCurrentSpatial && <span aria-hidden="true">→ </span>}
                      <span className="ks-aux-spatial-label">
                        {isCurrentSpatial ? t.navLabel : t.viewedLabel}
                      </span>
                      :{' '}
                      {isCurrentSpatial ? (
                        <strong>{turn.navTitle}</strong>
                      ) : (
                        <span>{turn.navTitle}</span>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={turn.id}
                    className={
                      (turn.kind === 'landing'
                        ? 'ks-aux-turn ks-aux-turn-landing ks-aux-spatial' +
                          (isCurrentSpatial ? ' ks-aux-spatial-current' : '')
                        : 'ks-aux-turn') + dimClass
                    }
                  >
                    {turn.kind === 'landing' && (
                      <div className="ks-aux-landing-tag">
                        {isCurrentSpatial && <span aria-hidden="true">→ </span>}
                        <span className="ks-aux-spatial-label">
                          {isCurrentSpatial ? t.navLabel : t.viewedLabel}
                        </span>
                        {turn.navTitle && (
                          <>
                            :{' '}
                            {isCurrentSpatial ? (
                              <strong>{turn.navTitle}</strong>
                            ) : (
                              <span>{turn.navTitle}</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {turn.query && <div className="ks-aux-q">{turn.query}</div>}
                    {turn.error ? (
                      <div className="ks-aux-a">
                        <span className="ks-aux-err">{turn.error}</span>
                        <button
                          type="button"
                          className="ks-aux-retry"
                          onClick={() => runQuery(turn.query, turn.id)}
                        >
                          {t.retry}
                        </button>
                      </div>
                    ) : turn.isStreaming && !turn.answer ? (
                      <div className="ks-aux-a ks-aux-a-stream" />
                    ) : (
                      <div
                        key={'a-' + turn.id}
                        className={
                          'ks-aux-a' +
                          (turn.isStreaming ? ' ks-aux-a-streaming' : '')
                        }
                      >
                        <ReactMarkdown>{turn.answer}</ReactMarkdown>
                        {turn.isStreaming && (
                          <span
                            className="ks-aux-stream-caret"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    )}
                    {!turn.isStreaming && !turn.error && (
                      <>
                        {turn.kind === 'landing' &&
                          isCurrentSpatial &&
                          onUxcatRoot && (
                            <div className="ks-aux-uxcat-cta">
                              <span className="ks-aux-uxcat-nudge">
                                {t.uxcatNudge}
                              </span>
                              <button
                                type="button"
                                className="ks-aux-uxcat-begin"
                                onClick={onBeginUxcatTest}
                              >
                                {t.uxcatCta}
                              </button>
                            </div>
                          )}
                        {turn.mode === 'clarify' &&
                          turn.suggestions.length > 0 && (
                            <div className="ks-aux-suggestions">
                              {turn.suggestions.map((s, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className="ks-aux-suggestion"
                                  onClick={() => onSuggestionClick(s)}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        {turn.mode === 'answer' &&
                          turn.citations.length > 0 && (
                            <div className="ks-aux-cards">
                              {(() => {
                                /* Sort by perceived strength: nominated (LLM
                               hand-pick or curated surface) outranks any
                               scored card, then library cards descend by
                               LightRAG score. Stable for equal keys so
                               server order acts as the tie-breaker. */
                                const rank = (c: Citation) =>
                                  c.nominated ? 1e6 : (c.score ?? 0);
                                return [...turn.citations]
                                  .map((c, idx) => ({ c, idx }))
                                  .sort((a, b) => {
                                    const d = rank(b.c) - rank(a.c);
                                    return d !== 0 ? d : a.idx - b.idx;
                                  })
                                  .map(x => x.c);
                              })().map((c, i) => {
                                const tk = detectType(c.type, c.url);
                                const info = tk ? TYPE_INFO[tk] : null;
                                const href = rewriteToCurrentHost(c.url);
                                let prefetchTimer: ReturnType<
                                  typeof setTimeout
                                > | null = null;
                                const onHoverIn = () => {
                                  if (prefetchTimer)
                                    clearTimeout(prefetchTimer);
                                  prefetchTimer = setTimeout(() => {
                                    prefetchOnce(href);
                                  }, 80);
                                };
                                const onHoverOut = () => {
                                  if (prefetchTimer) {
                                    clearTimeout(prefetchTimer);
                                    prefetchTimer = null;
                                  }
                                };
                                return (
                                  <a
                                    key={c.url || i}
                                    className="ks-aux-card"
                                    href={href}
                                    onMouseEnter={onHoverIn}
                                    onMouseLeave={onHoverOut}
                                    onFocus={onHoverIn}
                                    onBlur={onHoverOut}
                                    onClick={e => {
                                      e.preventDefault();
                                      onCardClick(c);
                                    }}
                                  >
                                    <span className="ks-aux-card-head">
                                      {info && (
                                        <span
                                          className="ks-aux-card-label"
                                          style={{ color: info.color }}
                                        >
                                          {info[lang]}:
                                        </span>
                                      )}
                                      <span className="ks-aux-card-title">
                                        {c.title}
                                      </span>
                                    </span>
                                    {c.blurb && (
                                      <span className="ks-aux-card-blurb">
                                        {c.blurb}
                                      </span>
                                    )}
                                    {c.why && (
                                      <span className="ks-aux-card-why">
                                        {c.why}
                                      </span>
                                    )}
                                    {(typeof c.score === 'number' ||
                                      c.nominated) &&
                                      (() => {
                                        const tier = tierFor(
                                          c.score ?? 0,
                                          c.nominated,
                                        );
                                        return (
                                          <span
                                            className="ks-aux-card-score"
                                            title={t.relevancy}
                                            aria-label={t.relevancy}
                                          >
                                            {Array.from(
                                              { length: TIER_DOTS },
                                              (_, d) => d,
                                            ).map(d => (
                                              <span
                                                key={d}
                                                className={
                                                  'ks-aux-card-dot' +
                                                  (d < tier.dots
                                                    ? ' ks-aux-card-dot-on'
                                                    : '')
                                                }
                                                style={
                                                  d < tier.dots
                                                    ? { background: tier.color }
                                                    : undefined
                                                }
                                              />
                                            ))}
                                          </span>
                                        );
                                      })()}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                      </>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}

        <form onSubmit={submit} className="ks-aux-form">
          <textarea
            ref={inputRef}
            className="ks-aux-input"
            placeholder={t.placeholder}
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => {
              /* Browsers that don't support visualViewport (rare now)
                 fall back to scrolling the input into view once the
                 keyboard has had a moment to animate in. */
              setTimeout(() => {
                inputRef.current?.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth',
                });
              }, 250);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            disabled={loading}
          />
          <button
            type="submit"
            className="ks-aux-submit"
            disabled={loading || !text.trim()}
            tabIndex={open ? 0 : -1}
          >
            {loading ? '…' : t.send}
          </button>
        </form>
      </div>

      <button
        type="button"
        className={
          'ks-aux-pill' +
          (open ? ' ks-aux-pill-open' : '') +
          (awaitingRelevance && !open ? ' ks-aux-pill-relevance' : '')
        }
        onClick={open ? onClose : onOpen}
        aria-label={
          open ? 'Close' : collapsedOnce ? t.pillLabelReturning : t.pillLabel
        }
      >
        <span className="ks-aux-pill-icon" aria-hidden>
          ✦
        </span>
        <span className="ks-aux-pill-text">
          {open
            ? '×'
            : awaitingRelevance
              ? t.relevancePrompt
              : collapsedOnce
                ? t.pillLabelReturning
                : t.pillLabel}
        </span>
      </button>
    </div>
  );
}
