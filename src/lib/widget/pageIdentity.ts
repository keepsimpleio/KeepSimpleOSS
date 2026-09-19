/* Spatial-awareness backbone for the global concierge widget.

   Single source of truth that turns any keepsimple.io URL the visitor
   could be on into a concrete identity — name, parent project, and a
   short blurb the LLM can lean on. Everything that needs to know
   "where the visitor is" should go through resolvePageIdentity(),
   never inspect the raw path itself.

   Covers two sibling repos that share the keepsimple.io domain:
   - KeepSimpleOSS (this repo) — home, AI Atlas, Articles, Pyramids,
     Tools / Longevity Protocol, Vibesuite, Contributors, Auth.
   - UXCoreOSS (sibling) — UX Core, UXCG, UXCP, UXCAT, UX Core API.
     The widget runs on those pages too via the host's nginx
     sub_filter injection.

   Locale prefixes (/ru, /hy) are stripped before matching, so the
   identity is independent of the visitor's UI language.

   Page descriptions come from `public/keepsimple_/llms.txt` whenever
   that file has an entry for the path — same source the site already
   ships for AI crawlers and the same wording the team curates. The
   hand-coded blurbs in this file are the fallback for paths the
   llms.txt sample doesn't cover (most UX Core biases, UXCG cases). */

import fs from 'fs';
import path from 'path';

export type PageProject = 'keepsimple' | 'uxcore-oss' | 'unknown';

export type PageKind =
  | 'home'
  | 'project-home'
  | 'project-sub'
  | 'bias-detail'
  | 'uxcg-case'
  | 'uxcat-sub'
  | 'article-list'
  | 'article-detail'
  | 'tool'
  | 'longevity-sub'
  | 'utility'
  | 'unknown';

export type PageIdentity = {
  canonicalPath: string;
  locale: 'en' | 'ru' | 'hy';
  nameEn: string;
  nameRu: string;
  project: PageProject;
  kind: PageKind;
  blurbEn: string;
  blurbRu: string;
  /** True when we authoritatively recognised the path. False = treat
      as "this page", never invent a project name. */
  known: boolean;
  /** Active UX Core use case, derived from the URL hash the layout keeps
      in sync (#hr, #offsec; no hash on /uxcore = product). Only set on
      UX Core pages, and only when the URL actually tells us. */
  useCase?: 'product' | 'hr' | 'offsec';
};

type ExactEntry = Omit<PageIdentity, 'canonicalPath' | 'locale' | 'known'>;

const LOCALE_PATTERN = /^\/(ru|hy)(\/.*)?$/;

function normalisePath(input?: string | null): string {
  if (!input) return '/';
  let s = input;
  try {
    if (/^https?:\/\//i.test(s)) s = new URL(s).pathname || '/';
  } catch {
    /* keep as-is */
  }
  /* drop query and hash if a bare path with them slipped through */
  const qIdx = s.indexOf('?');
  if (qIdx >= 0) s = s.slice(0, qIdx);
  const hIdx = s.indexOf('#');
  if (hIdx >= 0) s = s.slice(0, hIdx);
  if (!s.startsWith('/')) s = '/' + s;
  s = s.replace(/\/{2,}/g, '/');
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s.toLowerCase();
}

function stripLocale(path: string): {
  path: string;
  locale: 'en' | 'ru' | 'hy';
} {
  const m = path.match(LOCALE_PATTERN);
  if (!m) return { path, locale: 'en' };
  const rest = m[2] || '/';
  return { path: rest, locale: m[1] as 'ru' | 'hy' };
}

const EXACT_DEFS: Array<[string, ExactEntry]> = [
  [
    '/',
    {
      nameEn: 'keepsimple home',
      nameRu: 'главная keepsimple',
      project: 'keepsimple',
      kind: 'home',
      blurbEn:
        'The keepsimple.io home page — overview of UX Core, Pyramids, AI Atlas, Articles, and Longevity Protocol. First-time landing for many visitors.',
      blurbRu:
        'Главная keepsimple.io — обзор UX Core, Pyramids, AI Atlas, статей и Longevity Protocol. Часто первая точка входа.',
    },
  ],
  [
    '/ai-atlas',
    {
      nameEn: 'AI Atlas',
      nameRu: 'AI Atlas',
      project: 'keepsimple',
      kind: 'project-home',
      blurbEn:
        'Orbital map of the AI products, agents, and sibling projects in the keepsimple ecosystem. Hash-routed sections (Environment, Security, etc.).',
      blurbRu:
        'Орбитальная карта AI-продуктов, агентов и соседних проектов экосистемы keepsimple. Интерактивные разделы по якорю.',
    },
  ],
  [
    '/articles',
    {
      nameEn: 'Articles index',
      nameRu: 'список статей',
      project: 'keepsimple',
      kind: 'article-list',
      blurbEn:
        'Index of long-form articles on cognitive science, product, and project management. About 25 pieces.',
      blurbRu:
        'Список длинных материалов про когнитивную науку, продукт и менеджмент. Около 25 текстов.',
    },
  ],
  [
    '/company-management',
    {
      nameEn: 'Pyramids',
      nameRu: 'Pyramids',
      project: 'keepsimple',
      kind: 'project-home',
      blurbEn:
        'Pyramids — our modular management framework for remote-first software teams. Less Scrum theatre, more decisions and ownership.',
      blurbRu:
        'Pyramids — наш модульный фреймворк менеджмента для удалённых софтверных команд. Меньше скрам-театра, больше решений и владения.',
    },
  ],
  [
    '/contributors',
    {
      nameEn: 'Contributors',
      nameRu: 'контрибьюторы',
      project: 'keepsimple',
      kind: 'utility',
      blurbEn:
        'The people who built keepsimple.io and its open-source surfaces.',
      blurbRu: 'Люди, которые делают keepsimple.io и его открытые проекты.',
    },
  ],
  [
    '/auth',
    {
      nameEn: 'Sign-in',
      nameRu: 'вход',
      project: 'keepsimple',
      kind: 'utility',
      blurbEn: 'Sign-in page (Google / Discord OAuth) for keepsimple accounts.',
      blurbRu:
        'Страница входа (Google / Discord OAuth) для аккаунтов keepsimple.',
    },
  ],
  [
    '/tools',
    {
      nameEn: 'Tools',
      nameRu: 'инструменты',
      project: 'keepsimple',
      kind: 'project-home',
      blurbEn:
        'Index of small utilities we publish — currently Longevity Protocol and Vibesuite.',
      blurbRu:
        'Список небольших инструментов — сейчас Longevity Protocol и Vibesuite.',
    },
  ],
  [
    '/tools/longevity-protocol/about-project',
    {
      nameEn: 'Longevity Protocol — about',
      nameRu: 'Longevity Protocol — о проекте',
      project: 'keepsimple',
      kind: 'tool',
      blurbEn:
        'Longevity Protocol — a personal tracker across diet, sleep, lifestyle, supplements, workout, study. This is the project intro page.',
      blurbRu:
        'Longevity Protocol — персональный трекер по питанию, сну, образу жизни, добавкам, тренировкам, обучению. Это вводная страница проекта.',
    },
  ],
  [
    '/tools/longevity-protocol/environment',
    {
      nameEn: 'Longevity Protocol — environment',
      nameRu: 'Longevity Protocol — окружение',
      project: 'keepsimple',
      kind: 'longevity-sub',
      blurbEn:
        'The environment tab of Longevity Protocol — how the world around you (light, air, noise, ergonomics) affects longevity outcomes.',
      blurbRu:
        'Вкладка окружения в Longevity Protocol — как мир вокруг (свет, воздух, шум, эргономика) влияет на долголетие.',
    },
  ],
  [
    '/tools/longevity-protocol/results',
    {
      nameEn: 'Longevity Protocol — results',
      nameRu: 'Longevity Protocol — результаты',
      project: 'keepsimple',
      kind: 'longevity-sub',
      blurbEn:
        'Results dashboard inside Longevity Protocol — how the visitor scores across the tracked habits.',
      blurbRu:
        'Дашборд результатов внутри Longevity Protocol — оценка посетителя по отслеживаемым привычкам.',
    },
  ],
  [
    '/tools/vibesuite',
    {
      nameEn: 'Vibesuite',
      nameRu: 'Vibesuite',
      project: 'keepsimple',
      kind: 'tool',
      blurbEn:
        'Vibesuite — small developer tool published under keepsimple Tools.',
      blurbRu:
        'Vibesuite — небольшой инструмент для разработчиков в наборе Tools.',
    },
  ],
  [
    '/uxcore',
    {
      nameEn: 'UX Core',
      nameRu: 'UX Core',
      project: 'uxcore-oss',
      kind: 'project-home',
      blurbEn:
        "UX Core — the world's largest open library of cognitive biases (100+ entries), each with practical product/HR examples, debiasing strategies, and references. The actual core of keepsimple, not Articles.",
      blurbRu:
        'UX Core — крупнейшая в мире открытая библиотека когнитивных искажений (100+), у каждого — продуктовые/HR-примеры, стратегии дебайзинга и источники. Сердце keepsimple, не «статьи».',
    },
  ],
  [
    '/uxcg',
    {
      nameEn: 'UXCG',
      nameRu: 'UXCG',
      project: 'uxcore-oss',
      kind: 'project-home',
      blurbEn:
        'UXCG — UX Core Guide cases. Maps a business problem to a curated set of biases from UX Core. MIT-licensed deck.',
      blurbRu:
        'UXCG — кейсы-гайды UX Core. Каждый кейс — бизнес-проблема и подобранная под неё подборка искажений из UX Core. Под MIT.',
    },
  ],
  [
    '/uxcp',
    {
      nameEn: 'UXCP',
      nameRu: 'UXCP',
      project: 'uxcore-oss',
      kind: 'project-home',
      blurbEn:
        'UXCP — Cognitive Persona. Our tool that builds a user persona out of the cognitive biases that drive them. A different angle on personas than the standard demographic kind. NOT the same as UXCG.',
      blurbRu:
        'UXCP — Cognitive Persona. Наш инструмент, который строит пользовательскую персону через когнитивные искажения. Иной взгляд, чем классические демографические персоны. НЕ путать с UXCG.',
    },
  ],
  [
    '/uxcat',
    {
      nameEn: 'UXCAT',
      nameRu: 'UXCAT',
      project: 'uxcore-oss',
      kind: 'project-home',
      blurbEn:
        "UXCAT — self-awareness test that walks people through which cognitive biases they're most prone to. Multi-step: start → ongoing → result.",
      blurbRu:
        'UXCAT — тест самоосознанности, проводящий человека через искажения, которым он наиболее подвержен. Этапы: start → ongoing → result.',
    },
  ],
  [
    '/uxcore-api',
    {
      nameEn: 'UX Core API',
      nameRu: 'UX Core API',
      project: 'uxcore-oss',
      kind: 'project-home',
      blurbEn:
        'UX Core API — public JSON API over UX Core. Preferred entry point for any integration that needs structured cognitive-bias data.',
      blurbRu:
        'UX Core API — публичный JSON API поверх UX Core. Предпочтительная точка входа для интеграций, которым нужны структурированные данные об искажениях.',
    },
  ],
];

const EXACT = new Map<string, ExactEntry>(EXACT_DEFS);

/* Slug → readable title. "anchoring-effect" → "Anchoring effect".
   Used to derive the canonical name of bias-detail and uxcg-case
   pages from the URL itself; the slug IS the deterministic identifier
   of the entity on the site, so this is recognition, not a guess. */
function slugToTitle(slug: string): string {
  const words = slug.replace(/-/g, ' ').trim();
  if (!words) return '';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const UXCAT_SUB_NAMES: Record<string, [string, string]> = {
  'start-test': ['UXCAT — start test', 'UXCAT — начало теста'],
  ongoing: ['UXCAT — test in progress', 'UXCAT — тест в процессе'],
  'test-result': ['UXCAT — test result', 'UXCAT — результат теста'],
};

/* Lazy-loaded URL → canonical description map sourced from
   `public/keepsimple_/llms.txt`. Read once at first access, then
   served from memory. File missing or unreadable → empty map (hand-
   coded blurbs below stay as the fallback). */
let llmsDescriptions: Map<string, string> | null = null;

function loadLlmsDescriptions(): Map<string, string> {
  if (llmsDescriptions) return llmsDescriptions;
  const map = new Map<string, string>();
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'keepsimple_',
      'llms.txt',
    );
    const raw = fs.readFileSync(filePath, 'utf-8');
    /* Each entry looks like:
         - [Title](https://keepsimple.io/path/here): one-line description
       Entries with no colon-trailed description are skipped. Template
       paths (containing literal "[" placeholders like /[page] or
       /user/[userId]) are skipped. */
    const lineRe = /^- \[[^\]]+\]\(([^)]+)\)(?::\s*(.+))?\s*$/;
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(lineRe);
      if (!m) continue;
      const url = m[1];
      const desc = (m[2] ?? '').trim();
      if (!desc) continue;
      if (url.includes('[')) continue;
      let pathname: string;
      try {
        pathname = new URL(url).pathname;
      } catch {
        continue;
      }
      const canonical = stripLocale(normalisePath(pathname)).path;
      /* First entry wins so generated duplicates don't shadow the
         hand-picked description for the same canonical path. */
      if (!map.has(canonical)) map.set(canonical, desc);
    }
  } catch {
    /* file missing — fall back silently to hand-coded blurbs */
  }
  llmsDescriptions = map;
  return map;
}

/* The UX Core use-case mode travels in the URL hash, which the layout keeps
   in sync with the active view (#hr, #offsec; product carries no hash).
   normalisePath strips hashes, so the mode is read off the raw input here.
   The bare /uxcore list page authoritatively means product; on deeper
   UX Core paths a missing hash means the mode is simply unknown. */
function resolveUxCoreUseCase(
  input: string | null | undefined,
  canonicalPath: string,
): PageIdentity['useCase'] {
  if (!canonicalPath.startsWith('/uxcore')) return undefined;
  const hash =
    typeof input === 'string' ? input.match(/#(offsec|hr)(?:\?.*)?$/i) : null;
  if (hash) return hash[1].toLowerCase() as 'hr' | 'offsec';
  return canonicalPath === '/uxcore' ? 'product' : undefined;
}

export function resolvePageIdentity(input?: string | null): PageIdentity {
  const normalised = normalisePath(input);
  const stripped = stripLocale(normalised);
  const canonicalPath = stripped.path;
  const locale = stripped.locale;
  const llmsDesc = loadLlmsDescriptions().get(canonicalPath);
  const useCase = resolveUxCoreUseCase(input, canonicalPath);

  const exact = EXACT.get(canonicalPath);
  if (exact) {
    return {
      ...exact,
      blurbEn: llmsDesc ?? exact.blurbEn,
      canonicalPath,
      locale,
      known: true,
      useCase,
    };
  }

  /* Offensive Cybersecurity pages: the hub /uxcore/cybersecurity and one
     page per case, /uxcore/cybersecurity/<slug>. These are the crawlable
     twin of the in-modal #offsec view, so the use case is implicit in the
     path — no hash needed. */
  if (canonicalPath === '/uxcore/cybersecurity') {
    return {
      canonicalPath,
      locale,
      useCase: 'offsec',
      nameEn: 'Offensive Cybersecurity in UX Core',
      nameRu: 'Наступательная кибербезопасность в UX Core',
      project: 'uxcore-oss',
      kind: 'project-sub',
      blurbEn:
        llmsDesc ??
        'The hub of the UX Core Offensive Cybersecurity use case: every cognitive bias shown as a realistic social-engineering attack and its defense, one page per bias.',
      blurbRu:
        'Раздел UX Core про наступательную кибербезопасность: каждое когнитивное искажение как реалистичная атака социальной инженерии и защита от неё, по странице на искажение.',
      known: true,
    };
  }

  if (/^\/uxcore\/cybersecurity\/[^/]+/.test(canonicalPath)) {
    const slug = canonicalPath.split('/').pop() ?? '';
    const biasName = slugToTitle(slug);
    return {
      canonicalPath,
      locale,
      useCase: 'offsec',
      nameEn: `${biasName} — Offensive Cybersecurity case`,
      nameRu: `«${biasName}» — кейс по кибербезопасности`,
      project: 'uxcore-oss',
      kind: 'project-sub',
      blurbEn:
        llmsDesc ??
        `The Offensive Cybersecurity case for "${biasName}": the tell, a realistic attack scenario built on that bias, why it works, and the defender moves that stop it. Refer to it by the bias name.`,
      blurbRu: `Кейс по наступательной кибербезопасности для искажения «${biasName}»: примета, реалистичный сценарий атаки на этом искажении, почему это работает и что его останавливает. Можете обращаться к нему по названию искажения.`,
      known: true,
    };
  }

  /* Bias detail page: /uxcore/<n>-<slug>. The slug is the canonical
     identifier of the bias in UX Core's URL scheme, so we derive the
     bias name from it deterministically. llms.txt provides a richer
     SEO blurb for the first ten biases; for the rest we fall back to
     a generic blurb that still names the bias. */
  if (/^\/uxcore\/\d+-/.test(canonicalPath)) {
    const slug = canonicalPath.split('/').pop() ?? '';
    const biasName = slugToTitle(slug.replace(/^\d+-/, ''));
    return {
      canonicalPath,
      locale,
      useCase,
      nameEn: biasName || 'Bias detail page inside UX Core',
      nameRu: biasName || 'Страница искажения внутри UX Core',
      project: 'uxcore-oss',
      kind: 'bias-detail',
      blurbEn:
        useCase === 'offsec'
          ? `"${biasName}" — a specific cognitive-bias entry inside UX Core, open on its Offensive Cybersecurity examples: a realistic social-engineering attack built on this bias and the defense against it. Do NOT describe product/HR examples as what is on screen.`
          : (llmsDesc ??
            `"${biasName}" — a specific cognitive-bias entry inside UX Core. The visitor is reading its definition, real product/HR examples, debiasing strategies, and references. Refer to it by name when relevant.`),
      blurbRu:
        useCase === 'offsec'
          ? `«${biasName}» — конкретное когнитивное искажение в UX Core, открытое на примерах по наступательной кибербезопасности: реалистичная атака социальной инженерии на этом искажении и защита от неё. НЕ описывайте продуктовые или HR-примеры как то, что на экране.`
          : `«${biasName}» — конкретное когнитивное искажение в UX Core. Посетитель читает его определение, продуктовые/HR-примеры, стратегии дебайзинга и источники. Можете обращаться к нему по имени.`,
      known: true,
    };
  }

  /* UXCG case: /uxcg/<slug>. Slug → titlecase gives us the case name;
     llms.txt provides a richer blurb when authored. */
  if (/^\/uxcg\/[^/]+/.test(canonicalPath)) {
    const slug = canonicalPath.split('/').pop() ?? '';
    const caseName = slugToTitle(slug);
    return {
      canonicalPath,
      locale,
      nameEn: caseName || 'UXCG case',
      nameRu: caseName || 'кейс UXCG',
      project: 'uxcore-oss',
      kind: 'uxcg-case',
      blurbEn:
        llmsDesc ??
        `"${caseName}" — a business-problem case inside UXCG that maps the problem to a curated set of biases from UX Core. Refer to it by name when relevant.`,
      blurbRu: `«${caseName}» — бизнес-кейс в UXCG, связывающий проблему с подборкой искажений из UX Core. Можете обращаться к нему по названию.`,
      known: true,
    };
  }

  /* UXCAT sub-routes: /uxcat/start-test, /uxcat/ongoing, /uxcat/test-result */
  if (canonicalPath.startsWith('/uxcat/')) {
    const sub = canonicalPath.slice('/uxcat/'.length).split('/')[0] ?? '';
    const matched = UXCAT_SUB_NAMES[sub];
    return {
      canonicalPath,
      locale,
      nameEn: matched?.[0] ?? `UXCAT — ${sub}`,
      nameRu: matched?.[1] ?? `UXCAT — ${sub}`,
      project: 'uxcore-oss',
      kind: 'uxcat-sub',
      blurbEn:
        llmsDesc ??
        "A step inside UXCAT, our self-awareness test that walks people through which biases they're most prone to. The visitor is mid-flow.",
      blurbRu:
        'Шаг внутри UXCAT — нашего теста самоосознанности. Посетитель в середине прохождения.',
      known: true,
    };
  }

  /* Article detail: /articles/<slug>. llms.txt carries every
     authored article's SEO description — use it as the blurb so the
     bot knows which article the visitor is reading. */
  if (/^\/articles\/[^/]+/.test(canonicalPath)) {
    return {
      canonicalPath,
      locale,
      nameEn: 'Article',
      nameRu: 'статья',
      project: 'keepsimple',
      kind: 'article-detail',
      blurbEn:
        llmsDesc ??
        "A long-form keepsimple article on cognitive science, product, or project management. You do NOT know which article; refer to it as 'this article'.",
      blurbRu:
        "Длинный текст keepsimple про когнитивную науку, продукт или менеджмент. Какая именно статья — НЕИЗВЕСТНО; называйте 'эта статья'.",
      known: true,
    };
  }

  /* Longevity habits sub-pages: /tools/longevity-protocol/habits/<topic> */
  if (canonicalPath.startsWith('/tools/longevity-protocol/habits/')) {
    const topic = canonicalPath.split('/').pop() ?? '';
    return {
      canonicalPath,
      locale,
      nameEn: `Longevity Protocol — ${topic}`,
      nameRu: `Longevity Protocol — ${topic}`,
      project: 'keepsimple',
      kind: 'longevity-sub',
      blurbEn:
        llmsDesc ??
        'A habit sub-page inside Longevity Protocol (diet / sleep / lifestyle / supplements / workout / study). The visitor is exploring a specific habit area.',
      blurbRu:
        'Подстраница привычки внутри Longevity Protocol (питание / сон / образ жизни / добавки / тренировки / обучение). Посетитель изучает конкретную область.',
      known: true,
    };
  }

  /* Any other longevity-protocol sub-page */
  if (canonicalPath.startsWith('/tools/longevity-protocol/')) {
    return {
      canonicalPath,
      locale,
      nameEn: 'Longevity Protocol sub-page',
      nameRu: 'раздел Longevity Protocol',
      project: 'keepsimple',
      kind: 'longevity-sub',
      blurbEn:
        llmsDesc ??
        'A sub-page inside Longevity Protocol — our personal tracker for diet, sleep, lifestyle, supplements, workout, study.',
      blurbRu:
        'Подстраница внутри Longevity Protocol — нашего персонального трекера по питанию, сну, образу жизни, добавкам, тренировкам, обучению.',
      known: true,
    };
  }

  /* llms.txt sometimes covers paths our structural patterns don't —
     e.g. user/certificate templates, top-level oddballs. If we have a
     canonical description but no structural match, treat the path as
     known and lean entirely on the site's own copy. */
  if (llmsDesc) {
    return {
      canonicalPath,
      locale,
      nameEn: 'this page',
      nameRu: 'эта страница',
      project: 'keepsimple',
      kind: 'utility',
      blurbEn: llmsDesc,
      blurbRu:
        'Эта страница на keepsimple.io — описание из официального источника keepsimple (см. английский блок выше).',
      known: true,
    };
  }

  /* Unknown fallback — explicit identity that tells the LLM to stay
     humble and never invent a project name. */
  return {
    canonicalPath,
    locale,
    nameEn: 'this page',
    nameRu: 'эта страница',
    project: 'unknown',
    kind: 'unknown',
    blurbEn:
      "An unknown page on keepsimple.io — we don't have a recognised identity for this path. Refer to it as 'this page' only. NEVER invent a project name, NEVER guess it is UX Core / UXCG / UXCP / UXCAT / Pyramids / AI Atlas / Longevity Protocol based on the URL.",
    blurbRu:
      'Неизвестная страница на keepsimple.io — распознанного названия у этого пути нет. Называйте только «эта страница». НЕ выдумывайте название проекта, НЕ угадывайте, что это UX Core / UXCG / UXCP / UXCAT / Pyramids / AI Atlas / Longevity Protocol по URL.',
    known: false,
  };
}

/** Build the locale-appropriate page-identity block that the LLM
    receives as part of the user message. Always present, always
    canonical, never optional. */
export function formatPageIdentity(
  identity: PageIdentity,
  lang: 'en' | 'ru',
  rawUrl: string | undefined,
): string {
  const name = lang === 'ru' ? identity.nameRu : identity.nameEn;
  const blurb = lang === 'ru' ? identity.blurbRu : identity.blurbEn;
  const projectLabel =
    identity.project === 'uxcore-oss'
      ? lang === 'ru'
        ? 'UXCoreOSS (соседний репо)'
        : 'UXCoreOSS (sibling repo)'
      : identity.project === 'keepsimple'
        ? lang === 'ru'
          ? 'KeepSimpleOSS'
          : 'KeepSimpleOSS'
        : lang === 'ru'
          ? 'неизвестно'
          : 'unknown';
  const displayedUrl = rawUrl || identity.canonicalPath;
  const useCaseLabel = identity.useCase
    ? {
        product: [
          'Product Management (the examples on screen are product/UX cases)',
          'Разработка продуктов (на экране продуктовые примеры)',
        ],
        hr: [
          'People Management / HR (the examples on screen are HR cases)',
          'Управление персоналом (на экране HR-примеры)',
        ],
        offsec: [
          'Offensive Cybersecurity (the examples on screen are social-engineering attack/defense cases)',
          'Наступательная кибербезопасность (на экране кейсы атак и защиты)',
        ],
      }[identity.useCase]
    : null;
  if (lang === 'ru') {
    return [
      `URL: ${displayedUrl}`,
      `Каноническое имя: ${name}`,
      `Проект: ${projectLabel}`,
      ...(useCaseLabel ? [`Активный режим UX Core: ${useCaseLabel[1]}`] : []),
      `Что это: ${blurb}`,
    ].join('\n');
  }
  return [
    `URL: ${displayedUrl}`,
    `Canonical name: ${name}`,
    `Project: ${projectLabel}`,
    ...(useCaseLabel ? [`Active UX Core use case: ${useCaseLabel[0]}`] : []),
    `What it is: ${blurb}`,
  ].join('\n');
}
