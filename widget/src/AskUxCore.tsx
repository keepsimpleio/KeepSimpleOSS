import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { askConcierge, Citation, postCopilotEvent, trackEvent } from './api';

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
  /* Stamped on curated landings (PAGE_LANDINGS) — lets per-page UI
     (e.g. the UXCAT Begin-Test CTA) gate on the turn itself instead
     of "is this the most-recent spatial turn", so a follow-up nav
     turn doesn't strip the CTA off the still-on-page landing. */
  landingKey?: string;
};

const STORAGE_KEY = 'ks_aux_state_v2';
const IDLE_OPACITY_KEY = 'ks_aux_idle_opacity_v1'; // gitleaks:allow
const COLLAPSED_ONCE_KEY = 'ks_aux_collapsed_once_v1'; // gitleaks:allow
const THREAD_ID_KEY = 'ks_aux_thread_id_v1'; // gitleaks:allow

/* Thread id: persists across reloads in localStorage; survives the
   page lifecycle and follows the visitor across tabs. Bumped on every
   CLEAR so transcript analytics can group questions into the same
   conversation block while still seeing where the visitor wiped and
   started over. Lives client-side; server pairs it with the http-only
   sid cookie for the canonical visitor identity. */
const getOrMakeThreadId = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const existing = localStorage.getItem(THREAD_ID_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `th-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(THREAD_ID_KEY, fresh);
    return fresh;
  } catch {
    return `th-${Date.now()}`;
  }
};
const rotateThreadId = (): string => {
  const fresh =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `th-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    localStorage.setItem(THREAD_ID_KEY, fresh);
  } catch {
    /* localStorage disabled — keep the in-memory id */
  }
  return fresh;
};
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
    pillLabelReturning: 'Your Copilot',
    relevancePrompt: 'Was this relevant?',
    placeholder: 'Ask anything about career, UX, decisions, biases…',
    send: 'Ask',
    networkErr: "Couldn't reach the server. Try again.",
    rateErr: 'A bit too many requests. Wait a minute.',
    serverErr: 'Something broke. Try again.',
    empty: "We'll walk you through",
    retry: 'Retry',
    yourPick: 'Your pick',
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
    pillLabelReturning: 'Ваш Copilot',
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
      a: "keepsimple is an open-source movement at the intersection of cognitive science, product, and engineering — running since 2019. The flagship is **UX Core**, the world's largest free library of cognitive biases and nudging strategies (used at Duke, Harvard, MIT, Google, Amazon).",
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
      a: 'keepsimple — open-source движение на стыке когнитивной науки, продукта и инженерии, с 2019 года. Флагман — **UX Core**, крупнейшая в мире бесплатная библиотека когнитивных искажений и стратегий нуджинга (её используют в Duke, Harvard, MIT, Google, Amazon).',
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

type PageLanding = {
  message: string;
  cards: Citation[];
};

/* Curated per-page landings. When the visitor lands on one of these
   paths (organic nav OR following a card click) and we haven't already
   shown this page's curated landing this session, the widget renders
   a hand-crafted message + cards locally instead of asking the server
   landing endpoint. Server landing keeps running for everything else.

   Once-per-session is keyed off canonical pathname (locale-stripped)
   in sessionStorage — clears on tab close. Revisits within the same
   session get no landing turn at all (not curated, not server) so
   the visitor isn't nagged by repeated greetings. */
const PAGE_LANDINGS: Record<Lang, Record<string, PageLanding>> = {
  en: {
    '/uxcore': {
      message:
        "You're in **UX Core** — our open library of cognitive biases, each mapped to real product and HR scenarios with debiasing strategies. If you're not sure where to start, the 10-minute Awareness Test gives you a personal pulse on which biases bend your decisions today.",
      cards: [
        {
          title: 'Awareness Test',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb:
            'The only science-backed awareness test. <7 minutes of your time needed',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: '1000+ nudging examples for your org/startup',
        },
        {
          title: 'Persona Map',
          url: '/uxcp',
          type: 'project',
          nominated: true,
          blurb: 'Find your nationality and learn more about your neighbours',
        },
      ],
    },
    '/uxcg': {
      message:
        "You're in **UXCG** — the UX Core Guide. Start from a real business problem and we hand you the exact biases bending it, plus concrete nudges to act on. 1000+ worked examples for product, growth, and HR teams — the applied half of UX Core.",
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'The library every case here is built on — 100+ biases',
        },
        {
          title: 'Awareness Test',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: 'See which biases bend your own calls first — under 7 minutes',
        },
        {
          title: 'Persona Map',
          url: '/uxcp',
          type: 'project',
          nominated: true,
          blurb: 'Build a persona out of the biases that actually drive people',
        },
      ],
    },
    '/tools/longevity-protocol': {
      message:
        "You're in the **Longevity Protocol** — our take on long-haul health, distilled into a small set of practices we actually run on ourselves. Same principle as the rest of keepsimple: smart defaults beat willpower.",
      cards: [
        {
          title: 'Tools',
          url: '/tools',
          type: 'project',
          nominated: true,
          blurb: 'Other small utilities we built and opened up',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Cognitive backbone behind the protocol',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Long-form on decisions and discipline',
        },
      ],
    },
    '/tools': {
      message:
        '**Tools** is the workshop — small utilities we built for ourselves and opened up. Each one solves a sharp, real problem we hit; nothing here for showroom reasons.',
      cards: [],
    },
    '/ai-atlas': {
      message:
        "You're in the **AI Atlas** — the orbital map of everything we run, who runs it, and how the agents talk to each other. Open transparency layer; nothing hidden, nothing aspirational.",
      cards: [
        {
          title: 'Terminal',
          url: '/ai-atlas#terminal',
          type: 'aiatlas',
          nominated: true,
          blurb: 'Plenty of tips and tricks are in hands of the Terminal',
        },
        {
          title: 'Tools',
          url: '/ai-atlas#tools',
          type: 'aiatlas',
          nominated: true,
          blurb: 'And a bunch of tweaks here',
        },
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'All humans behind the project',
        },
      ],
    },
    '/articles': {
      message:
        '**Articles** — the long-form ledger, mostly Wolf, public since 2014. Cognitive science, product, project management — written when we have something to say, not on a publishing schedule.',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'The bias library that grew out of these notes',
        },
        {
          title: 'Awareness Test',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: 'Find your own biases first',
        },
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Who chips in alongside Wolf',
        },
      ],
    },
  },
  ru: {
    '/uxcore': {
      message:
        'Ты в **UX Core** — открытой библиотеке когнитивных искажений, каждое привязано к реальным продуктовым и HR-сценариям и снабжено стратегиями дебайзинга. Если не знаешь с чего начать — 10-минутный тест осознанности даст персональный срез: какие искажения гнут твои решения сегодня.',
      cards: [
        {
          title: 'Тест осознанности',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb:
            'Единственный научно-обоснованный тест осознанности. Меньше 7 минут твоего времени',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: '1000+ примеров нуджинга для твоей компании или стартапа',
        },
        {
          title: 'Persona Map',
          url: '/uxcp',
          type: 'project',
          nominated: true,
          blurb: 'Найди свою национальность и узнай больше про своих соседей',
        },
      ],
    },
    '/uxcg': {
      message:
        'Ты в **UXCG** — это гайд UX Core. Начинаешь с реальной бизнес-проблемы, а мы отдаём тебе те самые искажения, что её гнут, плюс конкретные нуджи, чтобы действовать. 1000+ разобранных примеров для продукта, роста и HR — прикладная половина UX Core.',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb:
            'Библиотека, на которой стоит каждый кейс здесь — 100+ искажений',
        },
        {
          title: 'Тест осознанности',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb:
            'Сначала узнай, какие искажения гнут твои решения — меньше 7 минут',
        },
        {
          title: 'Persona Map',
          url: '/uxcp',
          type: 'project',
          nominated: true,
          blurb: 'Собери персону из искажений, которые реально движут людьми',
        },
      ],
    },
    '/tools/longevity-protocol': {
      message:
        'Ты в **Longevity Protocol** — это наш взгляд на долгое здоровье, упакованный в небольшой набор практик, которые мы сами на себе и используем. Тот же принцип что и в остальном keepsimple: умные дефолты бьют силу воли.',
      cards: [
        {
          title: 'Tools',
          url: '/tools',
          type: 'project',
          nominated: true,
          blurb: 'Другие маленькие утилиты которые мы собрали и открыли',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Когнитивный костяк за протоколом',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты про решения и дисциплину',
        },
      ],
    },
    '/tools': {
      message:
        '**Tools** — это мастерская: маленькие утилиты, которые мы собрали для себя и открыли наружу. Каждая решает реальную острую проблему; ничего здесь не лежит "для витрины".',
      cards: [],
    },
    '/ai-atlas': {
      message:
        'Ты в **AI Atlas** — это орбитальная карта всего, что мы запускаем: кто что делает и как наши агенты общаются друг с другом. Открытый слой прозрачности; ничего не спрятано, ничего вымышленного.',
      cards: [
        {
          title: 'Терминал',
          url: '/ai-atlas#terminal',
          type: 'aiatlas',
          nominated: true,
          blurb: 'Куча подсказок и фишек в руках Терминала',
        },
        {
          title: 'Tools',
          url: '/ai-atlas#tools',
          type: 'aiatlas',
          nominated: true,
          blurb: 'И целая куча твиков вот здесь',
        },
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Все люди за этим проектом',
        },
      ],
    },
    '/articles': {
      message:
        '**Статьи** — длинный публичный журнал, в основном Wolf, открыт с 2014. Когнитивная наука, продукт, проект-менеджмент — пишется когда есть что сказать, а не по расписанию.',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Библиотека искажений, выросшая из этих заметок',
        },
        {
          title: 'Тест осознанности',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: 'Сначала найди собственные искажения',
        },
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Кто пишет вместе с Wolf-ом',
        },
      ],
    },
  },
};

const CURATED_LANDING_FIRED_KEY = 'ks_aux_curated_landing_v1';
const OPEN_KEY = 'ks_aux_open_v1';
const GREETED_PAGES_KEY = 'ks_aux_greeted_pages_v1';

/* True when the widget root is CSS-hidden (e.g. the mobile rule that
   drops it while a bias modal is open). The open/closed flag follows the
   visitor across pages and can stay `open` while the widget is invisible,
   so it is NOT a safe gate for paid work on its own. Movement tracking
   (page_view, dwell — all free/internal) keeps running while hidden; only
   token-spending calls consult this so a hidden widget never burns money
   by accident. */
const isWidgetHidden = (): boolean => {
  if (typeof document === 'undefined') return false;
  const root = document.querySelector('.ks-aux-root');
  if (!root) return false;
  return window.getComputedStyle(root).display === 'none';
};
const curatedLandingPathKey = (rawUrl: string): string | null => {
  try {
    const u = new URL(rawUrl, window.location.origin);
    let p = u.pathname.replace(/^\/(ru|hy|en)(?=\/|$)/, '');
    p = p.replace(/\/+$/, '');
    return p || '/';
  } catch {
    return null;
  }
};
const getCuratedLandingFor = (
  rawUrl: string,
  lang: Lang,
): { key: string; entry: PageLanding } | null => {
  const key = curatedLandingPathKey(rawUrl);
  if (!key) return null;
  const entry = PAGE_LANDINGS[lang][key];
  return entry ? { key, entry } : null;
};
const hasCuratedLandingFired = (key: string): boolean => {
  try {
    const raw = sessionStorage.getItem(CURATED_LANDING_FIRED_KEY) || '{}';
    return !!JSON.parse(raw)[key];
  } catch {
    return false;
  }
};
const markCuratedLandingFired = (key: string) => {
  try {
    const raw = sessionStorage.getItem(CURATED_LANDING_FIRED_KEY) || '{}';
    const obj = JSON.parse(raw);
    obj[key] = Date.now();
    sessionStorage.setItem(CURATED_LANDING_FIRED_KEY, JSON.stringify(obj));
  } catch {
    /* sessionStorage disabled — fall through; landing will fire each visit */
  }
};

/* Widget open/closed — remembered per tab so the panel follows the
   visitor across page loads (incl. hard reloads into UX Core / other
   route groups). Opening the pill is a deliberate human gesture, so an
   open panel is what gates the paid organic greeting. Clears on tab
   close; a brand-new visit always starts closed. */
const readOpenFlag = (): boolean => {
  try {
    return sessionStorage.getItem(OPEN_KEY) === '1';
  } catch {
    return false;
  }
};
const writeOpenFlag = (isOpen: boolean) => {
  try {
    sessionStorage.setItem(OPEN_KEY, isOpen ? '1' : '0');
  } catch {
    /* sessionStorage disabled — open state not remembered across nav */
  }
};

/* Per-page greeting cache — once the organic greeting has fired for a
   page in this tab session, never pay for it again on that page (revisits
   and back/forth are free). Keyed by canonical path. */
const hasGreetedPage = (key: string): boolean => {
  try {
    const raw = sessionStorage.getItem(GREETED_PAGES_KEY) || '{}';
    return !!JSON.parse(raw)[key];
  } catch {
    return false;
  }
};
const markGreetedPage = (key: string) => {
  try {
    const raw = sessionStorage.getItem(GREETED_PAGES_KEY) || '{}';
    const obj = JSON.parse(raw);
    obj[key] = Date.now();
    sessionStorage.setItem(GREETED_PAGES_KEY, JSON.stringify(obj));
  } catch {
    /* sessionStorage disabled — greeting may re-fire on revisit */
  }
};

/* ──────────────────────────────────────────────────────────────────
   Identity query triggers — works on any page.
   ──────────────────────────────────────────────────────────────────
   When the visitor's free-text question matches one of the canonical
   "about us" clusters (what is keepsimple / is it free / who made
   this / why open-source / how do you make money / etc.), we render
   a hand-crafted answer locally instead of asking the LLM. Reason:
   identity questions are brand-critical, the answer should never
   drift, and the LLM round-trip is wasted tokens for a question
   whose answer is fixed. Pipeline still runs for everything else.
   ────────────────────────────────────────────────────────────────── */
type IdentityTrigger = {
  key: string;
  patterns: RegExp[];
  answer: string;
  cards: Citation[];
};

const IDENTITY_TRIGGERS: Record<Lang, IdentityTrigger[]> = {
  en: [
    {
      key: 'what-is-keepsimple',
      patterns: [
        /\bwhat\s+(is|are)\s+keepsimple\b/i,
        /\bwhat'?s\s+keepsimple\b/i,
        /\btell\s+me\s+about\s+keepsimple\b/i,
        /\bwhat\s+is\s+this\s+(site|project|place)\b/i,
        /\bwhat\s+do\s+you\s+(do|make|build)\b/i,
      ],
      answer:
        "keepsimple is an open-source movement at the intersection of cognitive science, product, and engineering — running since 2019. The flagship is **UX Core**, the world's largest free library of cognitive biases and nudging strategies (used at Duke, Harvard, MIT, Google, Amazon).",
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'The flagship bias library',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: "Full transparency: our AI agents' orchestration",
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Long-form on cog sci, product, decisions',
        },
      ],
    },
    {
      key: 'is-it-free',
      patterns: [
        /\bis\s+(it|this|keepsimple)\s+(really\s+|actually\s+)?free\b/i,
        /\bhow\s+(is|can)\s+(it|this)\s+(be\s+)?free\b/i,
        /\bpaywall/i,
        /\bpricing\b/i,
        /\bhow\s+much\s+(does\s+it\s+cost|to\s+use)/i,
        /\bsubscription\b/i,
        /\bpremium\s+(tier|plan)/i,
        /\bcost\s+(of|to)\s+(use|access)/i,
      ],
      answer:
        'Free since day one in 2019. No paywalls, no ads, no investors, no premium tier. The code is open-source, content under Creative Commons. Wolf funds the project from his own pocket; supporters chip in if they want to.',
      cards: [
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'The people who keep this open',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: "Full transparency: our AI agents' orchestration",
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Our take on the bigger questions',
        },
      ],
    },
    {
      key: 'where-do-i-start',
      patterns: [
        /\bwhere\s+(do|should)\s+i\s+start\b/i,
        /\b(i'?m|i\s+am)\s+new\b/i,
        /\bwhere\s+to\s+begin\b/i,
        /\bhow\s+do\s+i\s+(use|start|begin)\b/i,
        /\bfirst\s+time\s+here\b/i,
        /\bnew\s+(here|to\s+this)\b/i,
      ],
      answer:
        "The lowest-friction entry is the **UX Awareness Test** — about 10 minutes, you'll spot a surprising number of biases at play around you. From there: **UX Core** is the bias library. **UXCG** lets you audit your own organisation. If you'd rather read first, **Articles** holds the long-form thinking.",
      cards: [
        {
          title: 'Awareness Test',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: 'Take the 10-min Awareness Test',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Browse the bias library',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: 'Audit your organisation',
        },
      ],
    },
    {
      key: 'who-made-this',
      patterns: [
        /\bwho\s+(made|built|created|runs|owns|started|founded)\s+(this|keepsimple|it)\b/i,
        /\bwho(?:'?s|\s+is)\s+wolf\b/i,
        /\bwho(?:'?s|\s+is)\s+behind\s+keepsimple\b/i,
        /\b(the\s+)?(team|founder|creator|author)\s+(of|behind)\s+keepsimple\b/i,
        /\bwho\s+(writes|maintains)\s+(this|keepsimple)\b/i,
      ],
      answer:
        '**Wolf Alexanyan** founded keepsimple in 2019 and runs it as the lead. A small core team plus a wider community of contributors keep the work going. Day-to-day faces are on the Contributors page.',
      cards: [
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Everyone behind the project',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'The orbital map of what we run',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: "Wolf's long-form thinking",
        },
      ],
    },
    {
      key: 'why-open-source',
      patterns: [
        /\bwhy\s+(open[-\s]?source|free|give\s+(it|this)\s+away|gratis)\b/i,
        /\bwhat'?s?\s+the\s+catch\b/i,
        /\bwhy\s+(no\s+ads|do\s+you\s+do\s+this)\b/i,
        /\b(open[-\s]?source)\s+(reasoning|philosophy|why)\b/i,
      ],
      answer:
        "No catch. keepsimple is open-source because that's how the knowledge stays trustworthy and usable — anyone can read the source, fork it, contribute, or run their own copy. The deal is simple: if it helps you, pass it on.",
      cards: [
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: "Full transparency: our AI agents' orchestration",
        },
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'The people who keep this open',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Long-form on the philosophy behind the project',
        },
      ],
    },
    {
      key: 'credibility',
      patterns: [
        /\bhow\s+many\s+(users|readers|people)\b/i,
        /\b\d+[k,]?\s*(thousand|million)?\s+(users|readers)\b/i,
        /\bcredib(le|ility)\b/i,
        /\b(reputation|reputable)\b/i,
        /\bwho\s+(uses|reads)\s+(this|keepsimple|you)\b/i,
        /\bis\s+this\s+(real|legit)\b/i,
        /\b(reference|cited)\s+(at|by)\b/i,
      ],
      answer:
        "300,000+ readers worldwide. **UX Core** is referenced at Duke, Harvard Business School, MIT, Google, Yandex, Amazon. Open-source movement since 2019; everything on the site is the same one team's work, no licensing tricks.",
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'The library referenced at Duke, Harvard, MIT, Google',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Full transparency on what we run',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Long-form, public since 2014',
        },
      ],
    },
    {
      key: 'how-to-contribute',
      patterns: [
        /\bhow\s+(can|do)\s+i\s+(help|contribute|donate|support)\b/i,
        /\bdonat(e|ion|ions)\b/i,
        /\bsupport\s+keepsimple\b/i,
        /\b(contribute|contribut(or|ion))\b/i,
        /\bsponsor\b/i,
        /\bcan\s+i\s+(help|join)\b/i,
      ],
      answer:
        'Three ways. (1) Spread the word — link any page, cite UX Core, write about us. (2) Fork on GitHub or open a PR. (3) Support financially through the Contributors page. All optional, none required.',
      cards: [
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'How to chip in, financial or otherwise',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'What we run — pick a piece to help with',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Read the work, cite the pieces that helped you',
        },
      ],
    },
    {
      key: 'business-model',
      patterns: [
        /\bhow\s+do\s+(you|they)\s+make\s+money\b/i,
        /\b(business|revenue|monetiz(e|ation))\s+model\b/i,
        /\bare\s+you\s+(profitable|funded)\b/i,
        /\bwho\s+(funds|pays\s+for)\s+(this|keepsimple)\b/i,
        /\bhow\s+is\s+(this|keepsimple)\s+funded\b/i,
        /\bwhere\s+does\s+the\s+money\s+come\s+from\b/i,
      ],
      answer:
        "Short answer: we don't make money on keepsimple. Wolf funds the project from his own pocket, solely. No ads, no paid tier, no investor pressure on what we build.",
      cards: [
        {
          title: 'Contributors',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Where supporters can chip in if they want',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Full transparency on the work and the people',
        },
        {
          title: 'Articles',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Long-form on why we build it this way',
        },
      ],
    },
  ],
  ru: [
    {
      key: 'what-is-keepsimple',
      patterns: [
        /\bчто\s+(такое|за)\s+keepsimple\b/i,
        /\bрасскажи\s+(про|о)\s+keepsimple\b/i,
        /\bчто\s+это\s+за\s+(проект|сайт|штука|место)\b/i,
        /\bчем\s+(вы\s+)?занимаетесь\b/i,
      ],
      answer:
        'keepsimple — open-source движение на стыке когнитивной науки, продукта и инженерии, с 2019 года. Флагман — **UX Core**, крупнейшая в мире бесплатная библиотека когнитивных искажений и стратегий нуджинга (её используют в Duke, Harvard, MIT, Google, Amazon).',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Флагманская библиотека искажений',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Полная прозрачность: оркестрация наших AI-агентов',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты про когнитивную науку, продукт, решения',
        },
      ],
    },
    {
      key: 'is-it-free',
      patterns: [
        /\b(это|оно|keepsimple)\s+(правда\s+|реально\s+|действительно\s+)?бесплат/i,
        /\bкак\s+(оно|это)\s+(может\s+быть\s+)?бесплат/i,
        /\bплатно\b/i,
        /\bстоимост/i,
        /\bподписк/i,
        /\bпремиум/i,
        /\bсколько\s+стоит/i,
      ],
      answer:
        'Бесплатно с первого дня в 2019. Никаких пейволлов, рекламы, инвесторов, премиум-тарифа. Код открыт, контент под Creative Commons. Wolf финансирует проект из своего кармана; саппортеры подкидывают если хотят.',
      cards: [
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Люди, которые держат это открытым',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Полная прозрачность: оркестрация наших AI-агентов',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Наша позиция по большим вопросам',
        },
      ],
    },
    {
      key: 'where-do-i-start',
      patterns: [
        /\bс\s+чего\s+начать\b/i,
        /\bя\s+(тут|здесь)\s+(впервые|новый|нов)\b/i,
        /\bкак\s+(начать|пользоваться|использовать)\b/i,
        /\bпервый\s+раз\s+здесь\b/i,
        /\bкуда\s+(идти|нажать)\s+(сначала|сперва)\b/i,
      ],
      answer:
        'Самый простой вход — **тест осознанности** (UXCAT), минут 10, заметишь удивительно много искажений вокруг. Дальше: **UX Core** — библиотека искажений. **UXCG** — оцени собственную организацию. Если хочется сначала почитать — **Статьи**.',
      cards: [
        {
          title: 'Тест осознанности',
          url: '/uxcat',
          type: 'project',
          nominated: true,
          blurb: '10-минутный тест осознанности',
        },
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb: 'Библиотека искажений',
        },
        {
          title: 'UXCG',
          url: '/uxcg',
          type: 'project',
          nominated: true,
          blurb: 'Оцени свою организацию',
        },
      ],
    },
    {
      key: 'who-made-this',
      patterns: [
        /\bкто\s+(создал|сделал|ведёт|ведет|основал|руководит|стоит)\b/i,
        /\bкто\s+такой\s+wolf\b/i,
        /\bкто\s+за\s+(этим|keepsimple)\b/i,
        /\b(команд|основател|автор)/i,
        /\bкто\s+пишет\s+(это|keepsimple)\b/i,
      ],
      answer:
        '**Wolf Alexanyan** основал keepsimple в 2019 и ведёт его как лид. Небольшая core-команда плюс более широкое сообщество контрибьюторов держат работу на ходу. Кто что делает — на странице Contributors.',
      cards: [
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Все люди за проектом',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Орбитальная карта того, что мы запускаем',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты от Wolf-а',
        },
      ],
    },
    {
      key: 'why-open-source',
      patterns: [
        /\bпочему\s+(open[-\s]?source|открыт|бесплат|без\s+рекламы)/i,
        /\bзачем\s+(делать|открыт|бесплат)/i,
        /\bв\s+ч[её]м\s+подвох\b/i,
        /\bкакая\s+выгода\b/i,
      ],
      answer:
        'Никакого подвоха. keepsimple — open-source потому что только так знание остаётся честным и пригодным: каждый может прочитать исходник, форкнуть, поучаствовать, запустить свою копию. Договор простой: если помогло — расскажи дальше.',
      cards: [
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Полная прозрачность: оркестрация наших AI-агентов',
        },
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Люди, которые держат это открытым',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты про философию проекта',
        },
      ],
    },
    {
      key: 'credibility',
      patterns: [
        /\bсколько\s+(пользовател|читател|людей|у\s+вас)/i,
        /\b\d+[\s,]?(\d+)?\s*(тысяч|миллион|к|млн)\s+(пользоват|читател)/i,
        /\bкто\s+(пользуется|читает|использует)\s+(этим|keepsimple|вами)/i,
        /\bрепутац/i,
        /\bправда\s+ли/i,
        /\bкто\s+вас\s+знает/i,
        /\b(ссыла|цитиру)\s+(на|вас)/i,
      ],
      answer:
        '300 000+ читателей по миру. **UX Core** упоминают в Duke, Harvard Business School, MIT, Google, Яндексе, Amazon. Open-source движение с 2019; всё на сайте — работа одной команды, никаких лицензионных трюков.',
      cards: [
        {
          title: 'UX Core',
          url: '/uxcore',
          type: 'project',
          nominated: true,
          blurb:
            'Библиотека, на которую ссылаются в Duke, Harvard, MIT, Google',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Полная прозрачность того, что мы делаем',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты, публичны с 2014',
        },
      ],
    },
    {
      key: 'how-to-contribute',
      patterns: [
        /\bкак\s+(могу\s+)?(помочь|поучаств|поддерж|donat)/i,
        /\b(контрибь|задонат|пожертвовать)/i,
        /\bкак\s+(вписаться|включиться|присоединиться)/i,
        /\bподдержать\s+keepsimple/i,
      ],
      answer:
        'Три способа. (1) Расскажи дальше — поделись страницей, сошлись на UX Core, напиши про нас. (2) Форкни на GitHub или открой PR. (3) Поддержи финансово через Contributors. Всё опционально, ничего не обязательно.',
      cards: [
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Как помочь — финансово или иначе',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Что мы делаем — выбери кусок чтобы помочь',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Прочитай работу, сошлись на куски, которые помогли',
        },
      ],
    },
    {
      key: 'business-model',
      patterns: [
        /\bкак\s+(вы|они)\s+(зарабат|деньг|монетиз)/i,
        /\b(бизнес|финанс|монетиз)\s+(модел|схем)/i,
        /\bкто\s+(финансирует|оплачивает|спонсирует)/i,
        /\bза\s+чей\s+счёт\b/i,
        /\bоткуда\s+деньги\b/i,
      ],
      answer:
        'Коротко: мы не зарабатываем на keepsimple. Wolf финансирует проект из своего кармана, и только. Никакой рекламы, никаких платных тарифов, никакого давления инвесторов на то, что мы делаем.',
      cards: [
        {
          title: 'Контрибьюторы',
          url: '/contributors',
          type: 'project',
          nominated: true,
          blurb: 'Где саппортеры могут подкинуть если захотят',
        },
        {
          title: 'AI Atlas',
          url: '/ai-atlas',
          type: 'project',
          nominated: true,
          blurb: 'Полная прозрачность про работу и людей',
        },
        {
          title: 'Статьи',
          url: '/articles',
          type: 'project',
          nominated: true,
          blurb: 'Длинные тексты про то, почему мы делаем это так',
        },
      ],
    },
  ],
};

const matchIdentityTrigger = (
  query: string,
  lang: Lang,
): IdentityTrigger | null => {
  const q = (query || '').trim();
  if (q.length < 3) return null;
  for (const trig of IDENTITY_TRIGGERS[lang]) {
    for (const re of trig.patterns) {
      if (re.test(q)) return trig;
    }
  }
  return null;
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
/* True for any node living inside the widget's own DOM (panel, pill,
   cards, suggestions, …). Used to keep the host-page highlighter
   from glowing the widget's own card anchors — they all live under
   ancestors whose classes start with `ks-aux-`. */
const isInsideWidget = (el: Element | null): boolean => {
  let cur: Element | null = el;
  while (cur) {
    const cls = cur.className;
    if (typeof cls === 'string' && /(?:^|\s)ks-aux-/.test(cls)) return true;
    cur = cur.parentElement;
  }
  return false;
};

const findHostMatches = (cardUrl: string): HTMLElement[] => {
  if (typeof document === 'undefined') return [];
  const targetPath = canonicalPathOf(cardUrl);
  const targetHash = hashOf(cardUrl);
  if (targetHash) {
    const out: HTMLElement[] = [];
    const idMatch = document.getElementById(targetHash);
    if (idMatch instanceof HTMLElement && !isInsideWidget(idMatch))
      out.push(idMatch);
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
      if (isInsideWidget(a)) return;
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
    if (isInsideWidget(a)) return;
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
  // Restore the open/closed panel per tab so it follows the visitor
  // across page loads (incl. hard reloads into UX Core). A brand-new
  // visit (fresh tab) has no flag and boots closed.
  const [open, setOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? readOpenFlag() : false,
  );
  /* Fresh mirror of `open` for the once-mounted nav effect, whose
     closure would otherwise capture the initial render's value. */
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    writeOpenFlag(open);
  }, [open]);
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
  /* Per-conversation thread id. Survives reloads (localStorage),
     bumped on CLEAR. Passed up the chain so server-side analytics
     groups Q&A turns correctly. */
  const threadIdRef = useRef<string>(getOrMakeThreadId());
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
      // Host pages can lift the widget off the bottom edge (--ks-aux-lift).
      // That clearance eats into the room the panel has, so subtract it or
      // the panel overflows the top of short screens.
      const widget = document.querySelector('.ks-aux-root');
      const lift = widget
        ? parseFloat(getComputedStyle(widget).getPropertyValue('--ks-aux-lift'))
        : 0;
      root.style.setProperty('--ks-aux-vh', `${h}px`);
      root.style.setProperty('--ks-aux-bottom-offset', `${occluded}px`);
      root.style.setProperty(
        '--ks-aux-panel-h',
        `${Math.max(220, h - 96 - (lift || 0))}px`,
      );
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

      /* Curated-landing carve-out (PAGE_LANDINGS): on the listed
         pages we render a hand-crafted message + cards locally and
         skip the server landing entirely. Once-per-session — revisit
         within the same tab gets nothing (no curated, no server). */
      const curated = getCuratedLandingFor(rawUrl, lang);
      if (curated) {
        if (hasCuratedLandingFired(curated.key)) return;
        markCuratedLandingFired(curated.key);
        justNavigatedRef.current = true;
        const urlTitle = (() => {
          try {
            return deriveSpatialTitleFromUrl(new URL(rawUrl).pathname);
          } catch {
            return null;
          }
        })();
        const turnId = `land-${Date.now()}`;
        setTurns(cur => [
          ...cur,
          {
            id: turnId,
            query: '',
            answer: '',
            citations: [],
            suggestions: [],
            mode: 'answer',
            isStreaming: true,
            kind: 'landing',
            navTitle: urlTitle || cleanPageTitle(rawTitle),
            landingKey: curated.key,
          },
        ]);
        const { message, cards } = curated.entry;
        window.setTimeout(() => {
          const typer = createTypewriter(turnId);
          typer.push(message);
          typer.finish(() => {
            setTurns(prev =>
              prev.map(tt =>
                tt.id === turnId
                  ? {
                      ...tt,
                      answer: message,
                      citations: cards,
                      isStreaming: false,
                    }
                  : tt,
              ),
            );
          });
        }, 2200);
        return;
      }

      /* Cost gate: the organic greeting is a paid AI call. Spend it
         only when the panel is open AND actually visible. Opening the
         pill is a deliberate human gesture, and the open panel follows
         the visitor across pages — but it can stay `open` while the
         widget is CSS-hidden (mobile bias-modal rule), so we also bail
         when hidden: a widget the visitor can't see must never burn
         tokens. Passers-by and crawlers never open it; the server
         greeting route also drops known-bot user-agents as a backstop.
         Then never pay twice for the same page this session. Curated
         landings above are local (free) and ungated. */
      if (!openRef.current || isWidgetHidden()) return;
      const greetKey = canonicalPathKey(rawUrl);
      if (hasGreetedPage(greetKey)) return;
      markGreetedPage(greetKey);

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
          const turnId = `land-${Date.now()}`;
          setTurns(cur => [
            ...cur,
            {
              id: turnId,
              query: '',
              answer: '',
              citations: [],
              suggestions: [],
              mode: 'answer',
              isStreaming: true,
              kind: 'landing',
              navTitle: urlTitle || cleanPageTitle(rawTitle),
            },
          ]);
          const finalText = text;
          const typer = createTypewriter(turnId);
          typer.push(finalText);
          typer.finish(() => {
            setTurns(prev =>
              prev.map(tt =>
                tt.id === turnId
                  ? { ...tt, answer: finalText, isStreaming: false }
                  : tt,
              ),
            );
          });
        })
        .catch(() => {
          /* aborted or upstream fail — silent */
        });
    };

    const currentPage: LastPage = {
      url: window.location.href,
      title: document.title,
    };

    /* Page-movement analytics. Goals:
       - dwell = real visible-time on a page before the visitor moves
         within the site. Pure attention signal, no wall-clock idle.
       - tab_close = its own event, with the same activeMs payload, so
         the timeline can show "× closed tab after 32s active reading"
         instead of a misleading 2-hour dwell.
       Accumulation only ticks while document.visibilityState is
       'visible' — hidden tabs do not inflate the number. */
    const activeMsRef = { current: 0 };
    const lastVisibleAtRef = {
      current: document.visibilityState === 'visible' ? Date.now() : 0,
    };
    const sealedRef = { current: false };
    const flushActive = () => {
      if (lastVisibleAtRef.current > 0) {
        activeMsRef.current += Date.now() - lastVisibleAtRef.current;
        lastVisibleAtRef.current = 0;
      }
    };
    const resetPageTimers = () => {
      activeMsRef.current = 0;
      lastVisibleAtRef.current =
        document.visibilityState === 'visible' ? Date.now() : 0;
      sealedRef.current = false;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        lastVisibleAtRef.current = Date.now();
      } else {
        flushActive();
      }
    };
    const firePageView = () => {
      resetPageTimers();
      postCopilotEvent({
        kind: 'page_view',
        threadId: threadIdRef.current,
        lang,
      });
    };
    const fireDwell = () => {
      flushActive();
      const activeMs = activeMsRef.current;
      const lp = lastPageRef.current;
      if (!lp) return;
      /* Drop sub-half-second blips — those are router transitions or
         debounce-window false starts, not real attention. */
      if (activeMs < 500) return;
      postCopilotEvent({
        kind: 'dwell',
        threadId: threadIdRef.current,
        lang,
        meta: {
          activeMs,
          pageUrl: lp.url,
          pageTitle: lp.title,
        },
      });
    };
    const fireTabClose = () => {
      if (sealedRef.current) return;
      sealedRef.current = true;
      flushActive();
      const activeMs = activeMsRef.current;
      const lp = lastPageRef.current;
      if (!lp) return;
      postCopilotEvent({
        kind: 'tab_close',
        threadId: threadIdRef.current,
        lang,
        meta: {
          activeMs,
          pageUrl: lp.url,
          pageTitle: lp.title,
        },
      });
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
    firePageView();

    let timer: ReturnType<typeof setTimeout> | null = null;
    const check = () => {
      const url = window.location.href;
      const title = document.title;
      const cleaned = cleanPageTitle(title);
      const lastCleaned = cleanPageTitle(lastPageRef.current?.title || '');
      const lastUrl = lastPageRef.current?.url || '';
      /* Title-only changes (loading dots, async updates) are not a
         navigation — bail before we emit a dwell or swap state. */
      if (url === lastUrl) return;
      const next = { url, title };
      /* Seal dwell on the OUTGOING page before we swap the ref. */
      fireDwell();
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
      firePageView();
    };

    /* Outbound-link capture: when the visitor clicks an anchor whose
       href points to a different origin, log it so we can see where
       they go after KeepSimple. Same-origin clicks are covered by the
       page_view event that fires on the destination. */
    const onDocClick = (e: MouseEvent) => {
      try {
        const t = e.target;
        if (!(t instanceof Element)) return;
        const a = t.closest('a[href]') as HTMLAnchorElement | null;
        if (!a) return;
        const href = a.href;
        if (!href || href.startsWith('javascript:')) return;
        const u = new URL(href, window.location.href);
        if (u.origin === window.location.origin) return;
        const anchorText = (a.textContent || '').trim().slice(0, 200);
        postCopilotEvent({
          kind: 'outbound_click',
          threadId: threadIdRef.current,
          lang,
          meta: {
            href: u.href.slice(0, 500),
            anchorText,
            target: a.target || '_self',
          },
        });
      } catch {
        /* never block the click */
      }
    };
    document.addEventListener('click', onDocClick, true);
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
      /* Emit tab_close (sealedRef guards against beforeunload +
         pagehide both firing). sendBeacon path inside postCopilotEvent
         survives unload. */
      fireTabClose();
    };
    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('pagehide', onUnload);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('ks-aux-urlchange', onChange);
      window.removeEventListener('beforeunload', onUnload);
      window.removeEventListener('pagehide', onUnload);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('click', onDocClick, true);
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

    /* Curated-landing carve-out (PAGE_LANDINGS): same logic as
       organic landing — if the destination has a curated entry and
       it hasn't fired this session, replace the click-time placeholder
       with the curated message + cards locally and skip the server.
       If it already fired this session, drop the placeholder silently. */
    {
      const curated = getCuratedLandingFor(window.location.href, lang);
      if (curated) {
        const placeholderId = pending.placeholderId;
        if (hasCuratedLandingFired(curated.key)) {
          if (placeholderId !== undefined) {
            setTurns(cur => cur.filter(tt => tt.id !== placeholderId));
          }
          return;
        }
        markCuratedLandingFired(curated.key);
        justNavigatedRef.current = true;
        const resolvedTitle = (() => {
          if (/^\/(?:ru|hy|en)?\/?$/i.test(window.location.pathname)) {
            return 'Keep Simple';
          }
          const urlTitle = deriveSpatialTitleFromUrl(window.location.pathname);
          if (urlTitle) return urlTitle.slice(0, 200);
          const h1 = document
            .querySelector('h1')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim();
          if (h1) return h1.slice(0, 200);
          return cleanPageTitle(pending.title) || '';
        })();
        let landingTurnId = `land-${Date.now()}`;
        setTurns(cur => {
          const idx =
            placeholderId !== undefined
              ? cur.findIndex(tt => tt.id === placeholderId)
              : -1;
          if (idx >= 0) {
            landingTurnId = cur[idx].id;
            const next = cur.slice();
            next[idx] = {
              ...next[idx],
              isStreaming: true,
              answer: '',
              navTitle: resolvedTitle || next[idx].navTitle,
              landingKey: curated.key,
            };
            return next;
          }
          return [
            ...cur,
            {
              id: landingTurnId,
              query: '',
              answer: '',
              citations: [],
              suggestions: [],
              mode: 'answer',
              isStreaming: true,
              kind: 'landing',
              navTitle: resolvedTitle,
              landingKey: curated.key,
            },
          ];
        });
        const { message, cards } = curated.entry;
        const targetId = landingTurnId;
        window.setTimeout(() => {
          const typer = createTypewriter(targetId);
          typer.push(message);
          typer.finish(() => {
            setTurns(prev =>
              prev.map(tt =>
                tt.id === targetId
                  ? {
                      ...tt,
                      answer: message,
                      citations: cards,
                      isStreaming: false,
                    }
                  : tt,
              ),
            );
          });
        }, 2200);
        return;
      }
    }

    /* Same wallet guard as the organic greeting: a hidden widget never
       spends. The card-click landing is user-initiated, but if the
       destination renders the widget invisible (mobile bias-modal rule)
       the line would be paid for and never seen — skip it. */
    if (isWidgetHidden()) {
      if (pending.placeholderId !== undefined) {
        const pid = pending.placeholderId;
        setTurns(cur => cur.filter(tt => tt.id !== pid));
      }
      return;
    }

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
        let landingTurnId: string | null = null;
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
            landingTurnId = cur[idx].id;
            const next = cur.slice();
            next[idx] = {
              ...next[idx],
              /* Keep isStreaming true — the typewriter below fills
                 the text in and clears the flag on completion. */
              isStreaming: true,
              answer: '',
              navTitle: resolvedTitle || next[idx].navTitle,
            };
            return next;
          }
          if (!text) return cur;
          const freshId = `land-${Date.now()}`;
          landingTurnId = freshId;
          return [
            ...cur,
            {
              id: freshId,
              query: '',
              answer: '',
              citations: [],
              suggestions: [],
              mode: 'answer',
              isStreaming: true,
              kind: 'landing',
              navTitle: resolvedTitle,
            },
          ];
        });
        if (landingTurnId && text) {
          const finalText = text;
          const targetId = landingTurnId;
          const typer = createTypewriter(targetId);
          typer.push(finalText);
          typer.finish(() => {
            setTurns(prev =>
              prev.map(tt =>
                tt.id === targetId
                  ? { ...tt, answer: finalText, isStreaming: false }
                  : tt,
              ),
            );
          });
        }
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
     at these" in context, not just in the widget.
     Seed the ref with the last RESTORED turn id so the flash effect
     only ever fires for turns the visitor produced in *this* session
     — never for stale turns rehydrated from localStorage. Without this
     seed, a returning visitor sees host elements light up on page load
     with no obvious cause (the panel is closed). */
  const lastFlashedTurnIdRef = useRef<string | null>(
    initial?.turns && initial.turns.length > 0
      ? initial.turns[initial.turns.length - 1].id
      : null,
  );
  useEffect(() => {
    if (!isHighlightEnabledPage()) return;
    /* No host highlighting while a UX Core / UXCG bias modal is open.
       On desktop the widget now stays visible over the modal so the
       visitor can talk about the bias they're reading — but lighting up
       elements underneath the overlay is pointless (they're covered) and
       noisy. The visitor can still be guided OUT to other pages via the
       answer's cards; we just skip the in-page halo here. */
    if (
      typeof document !== 'undefined' &&
      document.querySelector('[class*="ModalOverlay"]')
    )
      return;
    /* Host highlighting is gated on the panel being open: the Copilot
       lights up page elements only while it is ACTIVE. Collapsed pill =
       not active = no host highlight. Re-arm the flash guard on collapse
       so re-opening re-applies the highlight for the current answer
       (open = highlighted, closed = not — a state, not a one-shot). The
       effect's own cleanup clears any live halo when `open` flips false. */
    if (!open) {
      lastFlashedTurnIdRef.current = null;
      return;
    }
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
  }, [turns, open]);

  /* Settle delay before cards/suggestions attach after the text lands. */
  const SETTLE_MS = 200;

  /* Bot-text reveal — every bit of bot-authored copy (concierge answer,
     homepage starters, landing turns) goes through this. We deliberately
     do NOT type char/word-by-char: progressive text re-parses the whole
     markdown tree and reflows the line box on every step, which reads as
     jittery. Instead the full message is committed once and the bubble
     fades in smoothly via the `.ks-aux-a` CSS animation — one clean,
     reflow-free reveal. push() keeps the latest target (server tokens
     arrive in bursts; we just keep the newest), finish() paints it and
     runs onDone after a short settle. */
  const createTypewriter = (turnId: string) => {
    let target = '';
    return {
      push: (next: string) => {
        target = next;
      },
      finish: (onDone: () => void) => {
        const finalText = target;
        setTurns(prev =>
          prev.map(tt =>
            tt.id === turnId ? { ...tt, answer: finalText } : tt,
          ),
        );
        window.setTimeout(onDone, SETTLE_MS);
      },
    };
  };

  /* Homepage carve-out: render a starter Q&A as a local Turn.
     Mimics the real concierge pipeline visually — a short "thinking"
     beat with the streaming caret, then the answer types in chunks
     through the shared typewriter, then the cards land. */
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

    /* Thinking pause tuned to the real concierge's average latency
       so the carve-out reads at the same tempo as a live round-trip. */
    const THINK_MS = 2200;

    window.setTimeout(() => {
      const typer = createTypewriter(id);
      typer.push(starter.a);
      typer.finish(() => {
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
      });
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

    /* Identity-trigger short-circuit: brand-critical "about us"
       questions (what is keepsimple / is it free / who's Wolf / etc.)
       get a hand-crafted answer rendered locally — no LLM call, no
       drift. Same think-pause + typewriter as homepage starters so it
       reads like a live response. Fires on any page. */
    const identityHit = matchIdentityTrigger(query, lang);
    if (identityHit) {
      trackEvent('identity_trigger_hit', {
        lang,
        key: identityHit.key,
      });
      window.setTimeout(() => {
        const typer = createTypewriter(id);
        typer.push(identityHit.answer);
        typer.finish(() => {
          setTurns(prev =>
            prev.map(tt =>
              tt.id === id
                ? {
                    ...tt,
                    answer: identityHit.answer,
                    citations: identityHit.cards,
                    isStreaming: false,
                  }
                : tt,
            ),
          );
          setLoading(false);
        });
      }, 2200);
      return;
    }

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
      /* Server tokens often arrive in bursts; route them through the
         shared typewriter so every answer types in at the same steady
         tempo as the homepage starters. Cards/suggestions attach in
         finish() once the displayed text catches up. */
      const typer = createTypewriter(id);
      const onChunk = (current: string) => {
        typer.push(stripMarkers(current));
      };
      const result = await askConcierge(
        query,
        lang,
        history,
        recentCardUrls,
        '/api/concierge',
        onChunk,
        lastPick,
        threadIdRef.current,
      );
      const cleaned = stripMarkers(result.answer);
      typer.push(cleaned);
      typer.finish(() => {
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
    const tier: 'high' | 'mid' | 'low' = citation.nominated
      ? 'high'
      : (citation.score ?? 0) >= 0.5
        ? 'high'
        : (citation.score ?? 0) >= 0.3
          ? 'mid'
          : 'low';
    postCopilotEvent({
      kind: 'card_click',
      threadId: threadIdRef.current,
      lang,
      cardClicked: {
        title: citation.title,
        url: citation.url,
        tier,
      },
    });
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
    const oldThreadId = threadIdRef.current;
    threadIdRef.current = rotateThreadId();
    postCopilotEvent({
      kind: 'clear',
      threadId: threadIdRef.current,
      oldThreadId,
      lang,
    });
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
          <span className="ks-aux-brand" aria-hidden="true">
            Copilot
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
                          turn.landingKey === '/uxcat' &&
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
                                    className={
                                      'ks-aux-card' +
                                      (c.picked ? ' ks-aux-card-picked' : '')
                                    }
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
                                    {c.picked && (
                                      <span className="ks-aux-card-pick-badge">
                                        {t.yourPick}
                                      </span>
                                    )}
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
