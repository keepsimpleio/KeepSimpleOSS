import { useRouter } from 'next/router';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import SeoGenerator from '@components/SeoGenerator';

const VIEW = 1500;
const HALF = VIEW / 2;
const TOP_PAD = 20;
const BOT_PAD = -20;
const POLL_MS = 30000;
const RAD = (deg: number) => (deg * Math.PI) / 180;
const POL = (r: number, theta: number) => ({
  x: Math.cos(RAD(theta)) * r * HALF,
  y: Math.sin(RAD(theta)) * r * HALF,
});

/* On touch devices Mouse* events fire synthetically on tap but never
   get a leave — without this, hover state would lock on Android.
   Also: any touch capability disqualifies hover so a tap on iPad / a
   touch laptop doesn't accidentally pin-solo (which suppresses the
   related-entity highlight ring users expect from desktop hover). */
function useHasHover() {
  const [hasHover, setHasHover] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hasTouch =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
    const update = () => setHasHover(mq.matches && !hasTouch);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return hasHover;
}

type Lang = 'en' | 'ru';
const pickLang = (locale: string | undefined): Lang =>
  locale === 'ru' ? 'ru' : 'en';
const dataUrlFor = (lang: Lang) =>
  lang === 'ru' ? '/ai-atlas/data-ru.json' : '/ai-atlas/data.json';
const METRICS_URL = 'https://metrics.administration.ae/metrics.json';

/* ============================================================
   Locale strings — every user-facing piece of text in EN + RU.
   Both shapes are identical so consumers can index off `t`.
   ============================================================ */
type SecurityLayer = {
  n: number;
  side: 'left' | 'right';
  label: string;
  title: string;
  what: string;
  why: string;
};

const STRINGS = {
  en: {
    seoTitle: 'AI Atlas — KeepSimple',
    seoDescription:
      "An orbital map of KeepSimple's people, AI agents, and products — founders, dev environment, core projects and territories — visualized live.",
    seoKeywords:
      'AI Atlas, KeepSimple, AI agents, dev environment, organizational map, orbital diagram, knowledge map, Wolf Alexanyan',
    ogImageAlt: 'AI Atlas — orbital map of KeepSimple operations',
    loading: 'Loading…',
    failedToLoad: 'Failed to load data — ',
    welcomeBanner: "The heart of KeepSimple Team's operations",
    day: 'DAY',
    daySinceTail: 'since the beginning of our movement',
    apexFounderFallback: 'founder',
    redactedPlaceholder: 'REDACTED',
    engLeadLabel: 'Eng. Lead',
    claudeMdLabel: 'claude.md',
    linesValue: (n: number) => `${n.toLocaleString()} lines`,
    canvasStats: {
      humans: 'humans',
      agents: 'ai agents',
      products: 'products',
    },
    introDossierTitle: 'THIS ATLAS',
    introDossierCjk: '此地図',
    introQuestionsBefore: 'Got questions? Drop those to our',
    introQuestionsLink: 'Telegram',
    introQuestionsAfter: '.',
    introDepthLabel: 'depth',
    introDepthValue: '5 rings · 3 actor types',
    introInhabitantsLabel: 'inhabitants',
    introInhabitantsTpl: (h: number, a: number, p: number) =>
      `${h} humans · ${a} ai agents · ${p} products`,
    introPrincipleLabel: 'principle',
    principles: [
      'single host · single source · single owner',
      'ship daily · fail loud · fix faster',
      'discipline before tools',
      'the atlas earns trust by being literally true',
      'strengthen self · co-exist · co-prosper',
    ],
    legendTitle: 'Legend',
    legendCjk: '凡例',
    legendHumanLabel: 'human',
    legendHumanDesc: 'direction · final judgment',
    legendAgentLabel: 'ai agent',
    legendAgentDesc: 'dedicated AI · custom memory · CLAUDE.md persona',
    legendProductLabel: 'product',
    legendProductDesc: 'products we build',
    legendSolidLabel: '— solid',
    legendSolidDesc: 'authority',
    legendFilledLabel: 'filled tile',
    legendFilledDesc: 'subsystem · scoped to a parent product',
    legendArticleCta: 'Read why do you need this',
    legendArticleUrl:
      'https://keepsimple.io/articles/agent-orchestration-for-career',
    toggleEnvironment: 'Environment',
    toggleSecurity: 'Security',
    doctrineTitle: 'Doctrine',
    doctrineCjk: '守則',
    doctrineImageAlt: 'Doctrine — six-fold defense',
    securityIntroTitle: 'THIS STACK',
    securityIntroCjk: '此守り',
    securityIntroDesc:
      'A request reaches the data only after passing through six independent layers — each cheap on its own, expensive in combination.',
    securityIntroRows: [
      { k: 'depth', v: '6 layers · outside-in' },
      { k: 'open ports', v: '0' },
      { k: 'credentials', v: 'one process holds them all' },
      { k: 'principle', v: 'defense in depth · rehearsed, not prayed about' },
    ],
    securityLayers: [
      {
        n: 1,
        side: 'left',
        label: 'cloudflare edge',
        title: 'Cloudflare Edge',
        what: 'TLS, DDoS, WAF, bot-management at every CDN POP.',
        why: 'handled in someone else’s NIC, not ours.',
      },
      {
        n: 2,
        side: 'right',
        label: 'cloudflare access',
        title: 'Cloudflare Access',
        what: 'Identity gate per app: email OTP for humans, service tokens for agents, allowlists per surface.',
        why: 'SSO without running an SSO.',
      },
      {
        n: 3,
        side: 'left',
        label: 'cloudflare tunnel',
        title: 'Cloudflare Tunnel',
        what: 'An outbound-only daemon dials home to Cloudflare. The tunnel carries every request inward.',
        why: 'there is no inbound port. The host is unreachable from the internet at the IP layer.',
      },
      {
        n: 4,
        side: 'right',
        label: 'network isolation',
        title: 'Network isolation',
        what: 'Host firewall denies all incoming except SSH; every web service binds the loopback interface.',
        why: 'two redundant mechanisms hold the same line.',
      },
      {
        n: 5,
        side: 'left',
        label: 'passkey gate',
        title: 'Passkey Gate',
        what: 'Each app re-prompts for a synced WebAuthn passkey — the iCloud-synced kind, used with Face ID.',
        why: 'phishable creds simply do not exist in this stack.',
      },
      {
        n: 6,
        side: 'right',
        label: 'authority gate',
        title: 'Authority Gate',
        what: 'Write actions route through a forced-command SSH gate with a six-verb allowlist.',
        why: 'compromise the UI — you get six verbs, not root.',
      },
    ] as SecurityLayer[],
    securityWhyWeLikeIt: 'Why we like it:',
    securityCenterCore: 'CORE',
    securityCenterKanji: '守',
    statsHeading: 'By the numbers',
    statsCjk: '数',
    securityStats: [
      { v: '0', k: 'open web ports' },
      { v: '6', k: 'allowlisted write verbs' },
      { v: '2', k: 'off-machine backup destinations' },
      { v: '100%', k: 'services bound to loopback' },
    ],
    agentsHeading: 'Agents share the box',
    agentsCjk: '共棲',
    agentsSubtitle:
      'Several AI workers run on this server. One holds every credential; the rest hold none and request access through The Order.',
    authorityAgentRole: 'Authority Agent',
    orderName: 'The Order',
    orderCjk: '序',
    orderCreds: [
      'Source-host PAT',
      'CDN + ingress token',
      'Host SSH',
      'Backup repository keys',
    ],
    securityAgents: [
      {
        name: 'Voice',
        badge: '0 creds',
        desc: 'Hands-free command surface. Cannot reach the host; speaks only through The Order.',
      },
      {
        name: 'QA',
        badge: 'service token',
        desc: 'Probes deploys, fingerprints routes, files reports. One scoped token; nothing else.',
      },
      {
        name: 'Researcher',
        badge: '0 creds',
        desc: 'Reads the field, drafts digests, posts results. Session cookies only, never tokens.',
      },
      {
        name: 'DevOps',
        badge: '0 creds',
        desc: 'Container hygiene: builds, restarts, healthchecks. Touches images, never secrets.',
      },
    ],
    agentsPunchline:
      'Compromise a sibling — no privilege escalation. Add a sibling — no new credential ceremony. The blast radius for secrets is exactly one process, and we know which one.',
    patternsHeading: 'Patterns we like',
    patternsCjk: '型',
    patternsSubtitle:
      'Defense in depth gets the headline. These are the quieter ideas behind it.',
    securityPatterns: [
      {
        title: 'Nested backups, rehearsed',
        desc: 'Encrypted offsite repo at one provider, plus a daily mirror of the source-of-truth Git account. The mirror runs thirty minutes before the offsite snapshot — so the mirror lands inside the backup. We rehearse it; we don’t pray about it.',
      },
      {
        title: 'CVE alerts that don’t cry wolf',
        desc: 'Vulnerability scans run nightly across every running image, but the inbox only sees deltas above an accepted baseline. Yesterday’s known set stays silent. Tomorrow’s new entries page out.',
      },
      {
        title: 'Local agent memory',
        desc: 'Long-lived agent context lives on disk, file-backed, project-segmented, exposed over MCP. No cloud round-trip to remember what we decided last Tuesday.',
      },
      {
        title: 'Three-call ingress',
        desc: 'Adding a public hostname is exactly three idempotent API calls: DNS, tunnel route, access policy. No console clicks, no hand-edited config, replayable from a script.',
      },
      {
        title: 'Source-of-truth on the box',
        desc: 'Source lives on the server, bind-mounted into containers; the laptop is a sync target, not a deploy trigger. Edits go live on refresh. Rebuilds only when dependencies change.',
      },
      {
        title: 'Read-only Docker socket',
        desc: 'The dashboard reads container state through a tightly scoped read-only proxy. Anything mutating routes through the Authority Gate’s verb list. Two paths in. One of them can change the world.',
      },
      {
        title: 'Per-container egress',
        desc: 'Workloads that need a controlled exit point share one isolated tunnel sidecar — a single WireGuard hop into a different jurisdiction. Members opt in via registry; no host-network changes, no leakage between projects.',
      },
      {
        title: 'Self-modification, handled',
        desc: 'The dashboard can’t escalate to host root. The terminal can’t auto-restart while you’re still typing in it. The passkey gate mounts before the auth gate, not after.',
      },
    ],
    footerEnd: 'END · ATLAS',
    hankoSelfTitle: 'self-strengthening without rest',
    hankoCoTitle: 'co-exist, co-prosper',
  },
  ru: {
    seoTitle: 'ИИ Атлас — KeepSimple',
    seoDescription:
      'Орбитальная карта людей, ИИ-агентов и продуктов KeepSimple — основатели, среда разработки, ключевые проекты и территории — в реальном времени.',
    seoKeywords:
      'ИИ Атлас, KeepSimple, ИИ-агенты, среда разработки, организационная карта, орбитальная диаграмма, карта знаний, Wolf Alexanyan',
    ogImageAlt: 'ИИ Атлас — орбитальная карта операций KeepSimple',
    loading: 'Загрузка…',
    failedToLoad: 'Ошибка загрузки данных — ',
    welcomeBanner: 'Сердце операций команды KeepSimple',
    day: 'ДЕНЬ',
    daySinceTail: 'с начала нашего движения',
    apexFounderFallback: 'основатель',
    redactedPlaceholder: 'СКРЫТО',
    engLeadLabel: 'Тех. Лид',
    claudeMdLabel: 'claude.md',
    linesValue: (n: number) => {
      const m10 = n % 10;
      const m100 = n % 100;
      let unit = 'строк';
      if (m10 === 1 && m100 !== 11) unit = 'строка';
      else if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14))
        unit = 'строки';
      return `${n.toLocaleString('ru-RU')} ${unit}`;
    },
    canvasStats: {
      humans: 'людей',
      agents: 'ИИ-агентов',
      products: 'продуктов',
    },
    introDossierTitle: 'ЭТОТ АТЛАС',
    introDossierCjk: '此地図',
    introQuestionsBefore: 'Есть вопросы? Пишите нам в',
    introQuestionsLink: 'Telegram',
    introQuestionsAfter: '.',
    introDepthLabel: 'глубина',
    introDepthValue: '5 колец · 3 типа сущностей',
    introInhabitantsLabel: 'обитатели',
    introInhabitantsTpl: (h: number, a: number, p: number) =>
      `${h} людей · ${a} ИИ-агентов · ${p} продуктов`,
    introPrincipleLabel: 'принцип',
    principles: [
      'один хост · один источник · один владелец',
      'релизы каждый день · фейлим громко · чиним быстрее',
      'дисциплина важнее инструментов',
      'атлас заслуживает доверия, потому что он буквально правдив',
      'усиливай себя · сосуществуй · процветай вместе',
    ],
    legendTitle: 'Легенда',
    legendCjk: '凡例',
    legendHumanLabel: 'человек',
    legendHumanDesc: 'направление · финальное решение',
    legendAgentLabel: 'ИИ-агент',
    legendAgentDesc: 'выделенный ИИ · своя память · персона CLAUDE.md',
    legendProductLabel: 'продукт',
    legendProductDesc: 'продукты, которые мы строим',
    legendSolidLabel: '— сплошная',
    legendSolidDesc: 'полномочия',
    legendFilledLabel: 'залитый блок',
    legendFilledDesc: 'подсистема · в рамках родительского продукта',
    legendArticleCta: 'Прочитайте, зачем это нужно',
    legendArticleUrl:
      'https://keepsimple.io/ru/articles/agent-orchestration-for-career',
    toggleEnvironment: 'Среда',
    toggleSecurity: 'Защита',
    doctrineTitle: 'Доктрина',
    doctrineCjk: '守則',
    doctrineImageAlt: 'Доктрина — шестислойная защита',
    securityIntroTitle: 'ЭТОТ СТЕК',
    securityIntroCjk: '此守り',
    securityIntroDesc:
      'Запрос достигает ядра, только пройдя шесть независимых слоёв — каждый дёшев по отдельности, дорог в комбинации.',
    securityIntroRows: [
      { k: 'глубина', v: '6 слоёв · снаружи внутрь' },
      { k: 'открытых портов', v: '0' },
      { k: 'учётки', v: 'хранит один процесс' },
      {
        k: 'принцип',
        v: 'эшелонированная защита · отрепетирована, не выпрошена',
      },
    ],
    securityLayers: [
      {
        n: 1,
        side: 'left',
        label: 'cloudflare edge',
        title: 'Cloudflare Edge',
        what: 'TLS, DDoS, WAF и bot-management на каждой CDN POP.',
        why: 'обрабатывается на чужой сетевой карте, не на нашей.',
      },
      {
        n: 2,
        side: 'right',
        label: 'cloudflare access',
        title: 'Cloudflare Access',
        what: 'Гейт идентификации на каждое приложение: email OTP для людей, сервис-токены для агентов, allow-листы по поверхности.',
        why: 'SSO без поднятия собственного SSO.',
      },
      {
        n: 3,
        side: 'left',
        label: 'cloudflare tunnel',
        title: 'Cloudflare Tunnel',
        what: 'Демон с исходящим соединением сам звонит в Cloudflare. Туннель несёт каждый запрос внутрь.',
        why: 'входящего порта нет. Хост недоступен из интернета на IP-уровне.',
      },
      {
        n: 4,
        side: 'right',
        label: 'network isolation',
        title: 'Сетевая изоляция',
        what: 'Хост-фаервол блокирует всё входящее, кроме SSH; каждый веб-сервис слушает только loopback.',
        why: 'два независимых механизма держат одну и ту же линию.',
      },
      {
        n: 5,
        side: 'left',
        label: 'passkey gate',
        title: 'Passkey Gate',
        what: 'Каждое приложение требует синхронизированный WebAuthn passkey — iCloud-вариант, через Face ID.',
        why: 'уязвимых для фишинга креденшалов в этом стеке просто нет.',
      },
      {
        n: 6,
        side: 'right',
        label: 'authority gate',
        title: 'Гейт полномочий',
        what: 'Записи проходят через forced-command SSH-гейт с allow-листом из шести команд.',
        why: 'скомпрометировал UI — получил шесть команд, не root.',
      },
    ] as SecurityLayer[],
    securityWhyWeLikeIt: 'Почему нам нравится:',
    securityCenterCore: 'ЯДРО',
    securityCenterKanji: '守',
    statsHeading: 'В цифрах',
    statsCjk: '数',
    securityStats: [
      { v: '0', k: 'открытых портов' },
      { v: '6', k: 'разрешённых команд записи' },
      { v: '2', k: 'внешних точек резервного копирования' },
      { v: '100%', k: 'сервисов слушают только loopback' },
    ],
    agentsHeading: 'Агенты делят коробку',
    agentsCjk: '共棲',
    agentsSubtitle:
      'На этом сервере живут несколько ИИ-работников. Один держит все учётки; остальные не держат ничего и запрашивают доступ через Орден.',
    authorityAgentRole: 'Агент полномочий',
    orderName: 'Орден',
    orderCjk: '序',
    orderCreds: [
      'Source-host PAT',
      'CDN + ingress токен',
      'SSH к хосту',
      'Ключи репозиториев бэкапов',
    ],
    securityAgents: [
      {
        name: 'Голос',
        badge: '0 учёток',
        desc: 'Голосовая поверхность управления. До хоста не дотягивается; говорит только через Орден.',
      },
      {
        name: 'QA',
        badge: 'сервис-токен',
        desc: 'Прощупывает деплои, снимает фингерпринты с маршрутов, шлёт отчёты. Один scoped-токен и больше ничего.',
      },
      {
        name: 'Исследователь',
        badge: '0 учёток',
        desc: 'Читает поле, готовит сводки, постит результаты. Только сессионные куки, никаких токенов.',
      },
      {
        name: 'DevOps',
        badge: '0 учёток',
        desc: 'Гигиена контейнеров: сборки, рестарты, healthcheck. Трогает образы, не секреты.',
      },
    ],
    agentsPunchline:
      'Скомпрометируй одного из них — никаких эскалаций привилегий. Добавь нового — никакой церемонии с креденшалами. Радиус поражения секретов — ровно один процесс, и мы знаем какой.',
    patternsHeading: 'Паттерны, которые нам нравятся',
    patternsCjk: '型',
    patternsSubtitle:
      'Эшелонированная защита берёт заголовок. А вот тихие идеи, на которых держится всё остальное.',
    securityPatterns: [
      {
        title: 'Вложенные бэкапы, отрепетированные',
        desc: 'Зашифрованный оффсайт-репозиторий у одного провайдера плюс ежедневное зеркало source-of-truth Git-аккаунта. Зеркало срабатывает за тридцать минут до оффсайт-снапшота — так что зеркало попадает внутрь бэкапа. Мы это репетируем; мы не молимся об этом.',
      },
      {
        title: 'CVE-алерты, которые не кричат «волки»',
        desc: 'Сканы уязвимостей бегут ночью по каждому запущенному образу, но в инбокс попадают только дельты выше принятого baseline. Вчерашний известный набор молчит. Завтрашние новые записи будят оперативку.',
      },
      {
        title: 'Локальная память агентов',
        desc: 'Долгоживущий контекст агентов лежит на диске, по файлам, по проектам, доступ через MCP. Никаких облачных round-trip’ов, чтобы вспомнить, что мы решили в прошлый вторник.',
      },
      {
        title: 'Ingress в три вызова',
        desc: 'Добавление публичного хостнейма — ровно три идемпотентных API-вызова: DNS, маршрут туннеля, политика доступа. Никаких кликов в консоли, никаких правок конфигов руками, всё повторяемо из скрипта.',
      },
      {
        title: 'Source-of-truth на самой машине',
        desc: 'Исходники живут на сервере, монтируются в контейнеры; ноутбук — точка синхронизации, не триггер деплоя. Правки идут в продакшен по обновлению. Пересборка — только когда меняются зависимости.',
      },
      {
        title: 'Read-only Docker-сокет',
        desc: 'Дашборд читает состояние контейнеров через жёстко ограниченный read-only прокси. Всё, что меняет — идёт через allow-лист команд Гейта полномочий. Два пути внутрь. Только один из них может изменить мир.',
      },
      {
        title: 'Egress на контейнер',
        desc: 'Воркоуды, которым нужна управляемая точка выхода, делят один изолированный туннельный сайдкар — один WireGuard-хоп в другую юрисдикцию. Подключение — opt-in через реестр; никаких изменений host-сети, никаких утечек между проектами.',
      },
      {
        title: 'Самомодификация, под контролем',
        desc: 'Дашборд не может эскалироваться до root на хосте. Терминал не может авто-рестартануться, пока ты в нём ещё печатаешь. Passkey-гейт встаёт перед auth-гейтом, не после.',
      },
    ],
    footerEnd: 'КОНЕЦ · АТЛАС',
    hankoSelfTitle: 'непрерывное самоусиление',
    hankoCoTitle: 'сосуществование и совместное процветание',
  },
};

type T = (typeof STRINGS)['en'];

/* ---------- diamond ---------- */
function Diamond({ kind = 'red' }: { kind?: string }) {
  const cls = ['dmd', kind === 'blue' ? 'blue' : kind === 'gold' ? 'gold' : '']
    .filter(Boolean)
    .join(' ');
  return <span className={cls} aria-hidden="true" />;
}

/* ---------- ring guide + name ---------- */
function Ring({
  r,
  label,
  theta = 270,
  offset,
  ringId,
  onSelect,
  hovered,
  dimmed,
}: any) {
  const radius = r * HALF;
  const circleCls = [
    'ring__circle',
    hovered ? 'is-glow' : '',
    dimmed ? 'is-dim' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <g className="ring">
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="none"
        className={circleCls}
        stroke="var(--rule)"
        strokeWidth="1"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const t = i * 30;
        const a = POL(r, t);
        const b = POL(r + 0.011, t);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--rule-soft)"
            strokeWidth="0.6"
          />
        );
      })}
      {label && (
        <RingLabel
          r={r}
          theta={theta}
          label={label}
          offset={offset}
          ringId={ringId}
          onSelect={onSelect}
          hovered={hovered}
          dimmed={dimmed}
        />
      )}
    </g>
  );
}

function arcPath(r: number, startTheta: number, endTheta: number) {
  const radius = r * HALF;
  const a0 = POL(r, startTheta);
  const a1 = POL(r, endTheta);
  const midSin = Math.sin(RAD((startTheta + endTheta) / 2));
  if (midSin > 0) {
    return `M ${a1.x} ${a1.y} A ${radius} ${radius} 0 0 0 ${a0.x} ${a0.y}`;
  }
  return `M ${a0.x} ${a0.y} A ${radius} ${radius} 0 0 1 ${a1.x} ${a1.y}`;
}

function RingLabel({
  r,
  theta,
  label,
  offset,
  ringId,
  onSelect,
  hovered,
  dimmed,
}: any) {
  const off = typeof offset === 'number' ? offset : 0.045;
  const labelR = (r + off) * HALF;
  const charPx = 15;
  const textPx = (label.length + 1) * charPx;
  const arc = Math.max(36, (textPx / labelR) * (180 / Math.PI));
  const start = theta - arc / 2;
  const end = theta + arc / 2;
  const id = `ring-lbl-${theta}-${Math.round(r * 100)}-${Math.round(off * 100)}`;
  const path = arcPath(r + off, start, end);
  const cls = ['ring__label', hovered ? 'is-glow' : '', dimmed ? 'is-dim' : '']
    .filter(Boolean)
    .join(' ');
  const handleEnter =
    ringId && onSelect ? () => onSelect(`ring:${ringId}`, 'hover') : undefined;
  const handleLeave =
    ringId && onSelect ? () => onSelect(null, 'hover') : undefined;
  const handleClick =
    ringId && onSelect ? () => onSelect(`ring:${ringId}`) : undefined;
  return (
    <>
      <defs>
        <path id={id} d={path} />
      </defs>
      <text
        className={cls}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    </>
  );
}

function NodeBody({
  node,
  x,
  y,
  active,
  dimmed,
  highlighted,
  hovered,
  onSelect,
  w = 150,
  h = 50,
  showStatus = false,
  redactedPlaceholder,
}: any) {
  const klass = [
    'node',
    node.kind === 'filled' && 'node--filled',
    node.redacted && 'node--redacted',
    node.diamond && `node--dmd-${node.diamond}`,
    active && 'is-active',
    highlighted && 'is-glow',
    dimmed && 'is-dim',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <foreignObject
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      style={{ overflow: 'visible' }}
    >
      <div className="node-wrap">
        <div
          className={klass}
          onClick={() => onSelect(node.id)}
          onMouseEnter={() => onSelect(node.id, 'hover')}
          onMouseLeave={() => onSelect(null, 'hover')}
        >
          {node.diamond && <Diamond kind={node.diamond} />}
          <span className="node__label">
            <span>
              {node.redacted ? (
                <TypewriterReveal
                  hovered={!!hovered}
                  placeholder={redactedPlaceholder}
                />
              ) : (
                node.label
              )}
            </span>
            {node.sub && <small>{node.sub}</small>}
          </span>
          {showStatus && node.status && <StatusDot status={node.status} />}
        </div>
      </div>
    </foreignObject>
  );
}

function TypewriterReveal({
  hovered,
  placeholder = 'REDACTED',
}: {
  hovered: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState(placeholder);
  useEffect(() => {
    if (!hovered) {
      setText(placeholder);
      return;
    }
    let cancelled = false;
    const len = placeholder.length;
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*[]/_';
    const frames = 8;
    const frameMs = 46;
    let f = 0;
    const tick = () => {
      if (cancelled) return;
      f += 1;
      if (f >= frames) {
        setText(placeholder);
        return;
      }
      const settled = Math.floor((f / frames) * len);
      let next = '';
      for (let i = 0; i < len; i++) {
        next +=
          i < settled
            ? placeholder[i]
            : pool[Math.floor(Math.random() * pool.length)];
      }
      setText(next);
      setTimeout(tick, frameMs);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [hovered, placeholder]);
  return <>{text}</>;
}

function StatusDot({ status }: { status: string }) {
  const known = status === 'ok' || status === 'warn' || status === 'down';
  const cls = 'node__dot node__dot--' + (known ? status : 'unknown');
  return <span className={cls} aria-label={`status: ${status}`} />;
}

function Spoke({ from, to, kind = 'auth', dim, glow }: any) {
  if (!from || !to) return null;
  const stroke = glow
    ? 'var(--red)'
    : kind === 'advisory'
      ? 'var(--red)'
      : kind === 'deploy'
        ? 'var(--rule-soft)'
        : kind === 'lead'
          ? 'var(--ink-3)'
          : 'var(--ink)';
  const dash = kind === 'advisory' ? '4 3' : '0';
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={stroke}
      strokeWidth={glow ? 1.4 : kind === 'auth' ? 0.9 : 0.7}
      strokeDasharray={dash}
      className={'wire ' + (dim ? 'is-dim' : '')}
    />
  );
}

function TerritoryArc({ project, R }: any) {
  if (!project.territoryArc) return null;
  const half = project.territoryArc / 2;
  const start = project.theta - half;
  const end = project.theta + half;
  const inner = R - 0.06;
  const outer = R + 0.08;
  const p1 = POL(inner, start);
  const p2 = POL(outer, start);
  const p3 = POL(outer, end);
  const p4 = POL(inner, end);
  const ri = inner * HALF;
  const ro = outer * HALF;
  const d = [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${ro} ${ro} 0 0 1 ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${ri} ${ri} 0 0 0 ${p1.x} ${p1.y}`,
    'Z',
  ].join(' ');
  return (
    <path
      d={d}
      fill="var(--rule-faint)"
      stroke="var(--rule-soft)"
      strokeWidth="0.5"
      strokeDasharray="2 3"
      opacity="0.55"
    />
  );
}

function TerritoryLabel({ project, R }: any) {
  if (!project.territoryLabel) return null;
  const half = project.territoryArc / 2 - 2;
  const start = project.theta - half;
  const end = project.theta + half;
  const id = `terr-${project.id}`;
  let path: string;
  if (project.territoryReverse) {
    const radius = (R + 0.1) * HALF;
    const a0 = POL(R + 0.1, start);
    const a1 = POL(R + 0.1, end);
    const midSin = Math.sin(RAD((start + end) / 2));
    path =
      midSin > 0
        ? `M ${a0.x} ${a0.y} A ${radius} ${radius} 0 0 1 ${a1.x} ${a1.y}`
        : `M ${a1.x} ${a1.y} A ${radius} ${radius} 0 0 0 ${a0.x} ${a0.y}`;
  } else {
    path = arcPath(R + 0.1, start, end);
  }
  return (
    <>
      <defs>
        <path id={id} d={path} />
      </defs>
      <text className="territory__label">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {project.territoryLabel}
        </textPath>
      </text>
    </>
  );
}

const DOSSIER_REF_KEYS = new Set([
  'reports',
  'owner',
  'pairs',
  'successor',
  'подчиняется',
  'владелец',
  'пара',
  'преемник',
]);
function resolveDossierRef(value: string, validIds: Set<string>) {
  if (!value || !validIds) return null;
  const lower = value.toLowerCase();
  if (validIds.has(lower)) return lower;
  const stripped = lower.replace(/^the\s+/, '');
  if (validIds.has(stripped)) return stripped;
  return null;
}
function renderDossierValue(v: string) {
  /* Parse inline tags inside row values:
       [text](https://...)        → external link
       [text](tip:description)    → underlined term with hover tooltip
     Everything else stays plain text. */
  if (typeof v !== 'string' || !v.includes('](')) return v;
  const re = /\[([^\]]+)\]\(((?:tip:[^)]+)|(?:https?:\/\/[^)]+))\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(v)) !== null) {
    if (m.index > lastIndex) parts.push(v.slice(lastIndex, m.index));
    const text = m[1];
    const url = m[2];
    if (url.startsWith('tip:')) {
      parts.push(
        <span key={m.index} className="dossier__tip" title={url.slice(4)}>
          {text}
        </span>,
      );
    } else {
      parts.push(
        <a
          key={m.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="dossier__link"
        >
          {text}
        </a>,
      );
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < v.length) parts.push(v.slice(lastIndex));
  return <>{parts}</>;
}

function Dossier({ data, onSelect, dossiers }: any) {
  const validIds = useMemo(
    () => new Set(Object.keys(dossiers || {})),
    [dossiers],
  );
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [titleH, setTitleH] = useState(20);
  useLayoutEffect(() => {
    if (titleRef.current) setTitleH(titleRef.current.offsetHeight);
  }, [data.title]);
  const padTop = Math.max(28, titleH + 14);
  return (
    <div className="panel panel--dossier" style={{ paddingTop: padTop + 'px' }}>
      <span className="panel__corner-mark">凸</span>
      <span ref={titleRef} className="panel__title" key={'t-' + data.title}>
        {data.title} <span className="cjk">{data.cjk}</span>
      </span>
      <div className="dossier__body" key={data.title}>
        {data.desc && (
          <div className="dossier__desc">{renderDossierValue(data.desc)}</div>
        )}
        <ul className="kv">
          {data.rows.map((r: any, i: number) => {
            const isUrl = r.k === 'url';
            const href = isUrl
              ? /^https?:\/\//i.test(r.v)
                ? r.v
                : 'https://' + r.v
              : null;
            const refId = (() => {
              if (isUrl || !onSelect) return null;
              if (r.ref && validIds.has(r.ref)) return r.ref;
              if (DOSSIER_REF_KEYS.has(r.k))
                return resolveDossierRef(r.v, validIds as Set<string>);
              return null;
            })();
            const refHandlers = refId
              ? {
                  onMouseEnter: () => onSelect(refId, 'link-hover'),
                  onMouseLeave: () => onSelect(null, 'link-hover'),
                  onClick: () => onSelect(refId),
                }
              : null;
            return (
              <li key={i}>
                <span className="k">{r.k}</span>
                <span
                  className={'v ' + (r.cls || '') + (refId ? ' v--ref' : '')}
                  {...(refHandlers || {})}
                >
                  {r.cls === 'red' && <Diamond kind="red" />}
                  {r.cls === 'blue' && <Diamond kind="blue" />}
                  {r.cls === 'gold' && <Diamond kind="gold" />}
                  {isUrl ? (
                    <a
                      href={href as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dossier__link"
                    >
                      {r.v}
                    </a>
                  ) : (
                    renderDossierValue(r.v)
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function buildIntroDossier(data: any, now: Date, t: T) {
  const { humans, agents, products } = tallyDiamonds(data);
  const idx = Math.floor(now.getTime() / 60000) % t.principles.length;
  return {
    title: t.introDossierTitle,
    cjk: t.introDossierCjk,
    desc: (
      <>
        {t.introQuestionsBefore}{' '}
        <a
          className="dossier__link"
          href="https://t.me/vibecodearmenia"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.introQuestionsLink}
        </a>
        {t.introQuestionsAfter}
      </>
    ),
    rows: [
      { k: t.introDepthLabel, v: t.introDepthValue },
      {
        k: t.introInhabitantsLabel,
        v: t.introInhabitantsTpl(humans, agents, products),
      },
      { k: t.introPrincipleLabel, v: t.principles[idx] },
    ],
  };
}

function tallyDiamonds(data: any) {
  let humans = 0,
    agents = 0,
    products = 0;
  const tally = (d: string | undefined) => {
    if (d === 'gold') humans++;
    else if (d === 'blue') agents++;
    else if (d === 'red') products++;
  };
  if (data.apex) tally(data.apex.diamond);
  if (data.order && data.order.member) tally(data.order.member.diamond);
  ((data.devEnv && data.devEnv.members) || []).forEach((n: any) =>
    tally(n.diamond),
  );
  ((data.projects && data.projects.members) || []).forEach((p: any) => {
    tally(p.diamond);
    if (p.leadDiamond) tally(p.leadDiamond);
    if (p.leadDiamond2) tally(p.leadDiamond2);
    (p.children || []).forEach((c: any) => tally(c.diamond));
  });
  return { humans, agents, products };
}

function CanvasStats({ data, t }: { data: any; t: T }) {
  const { humans, agents, products } = tallyDiamonds(data);
  return (
    <div className="canvas-stats" aria-hidden="true">
      <div className="canvas-stats__row">
        <span className="k">{t.canvasStats.humans}</span>
        <span className="v">{humans}</span>
      </div>
      <div className="canvas-stats__row">
        <span className="k">{t.canvasStats.agents}</span>
        <span className="v">{agents}</span>
      </div>
      <div className="canvas-stats__row">
        <span className="k">{t.canvasStats.products}</span>
        <span className="v">{products}+</span>
      </div>
    </div>
  );
}

function Legend({ t }: { t: T }) {
  return (
    <div className="panel">
      <span className="panel__title">
        {t.legendTitle} <span className="cjk">{t.legendCjk}</span>
      </span>
      <ul className="kv legend-kv">
        <li>
          <span className="k">
            <Diamond kind="gold" />
            {t.legendHumanLabel}
          </span>
          <span className="v">{t.legendHumanDesc}</span>
        </li>
        <li>
          <span className="k">
            <Diamond kind="blue" />
            {t.legendAgentLabel}
          </span>
          <span className="v">{t.legendAgentDesc}</span>
        </li>
        <li>
          <span className="k">
            <Diamond kind="red" />
            {t.legendProductLabel}
          </span>
          <span className="v">{t.legendProductDesc}</span>
        </li>
      </ul>
      <hr className="hr-dotted" />
      <ul className="kv">
        <li>
          <span className="k">{t.legendSolidLabel}</span>
          <span className="v">{t.legendSolidDesc}</span>
        </li>
        <li>
          <span className="k">
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 8,
                background: 'var(--ink-fill)',
                marginRight: 9,
                verticalAlign: 'middle',
              }}
            />
            {t.legendFilledLabel}
          </span>
          <span className="v">{t.legendFilledDesc}</span>
        </li>
      </ul>
      <a
        className="legend-cta"
        href={t.legendArticleUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.legendArticleCta}
      </a>
    </div>
  );
}

function InkConsume() {
  return <div className="ink-consume" aria-hidden="true" />;
}

type ViewMode = 'environment' | 'security';

function DoctrinePanel({ t }: { t: T }) {
  return (
    <div className="panel doctrine-panel">
      <span className="panel__title">
        {t.doctrineTitle} <span className="cjk">{t.doctrineCjk}</span>
      </span>
      <img
        className="doctrine-image"
        src="/ai-atlas/doctrine.webp"
        alt={t.doctrineImageAlt}
      />
    </div>
  );
}

function ViewToggle({
  mode,
  setMode,
  t,
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  t: T;
}) {
  return (
    <div
      className="view-toggle"
      data-mode={mode}
      role="tablist"
      aria-label="View mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'environment'}
        className={
          'view-toggle__btn ' + (mode === 'environment' ? 'is-active' : '')
        }
        onClick={() => setMode('environment')}
      >
        {t.toggleEnvironment}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'security'}
        className={
          'view-toggle__btn ' + (mode === 'security' ? 'is-active' : '')
        }
        onClick={() => setMode('security')}
      >
        {t.toggleSecurity}
      </button>
    </div>
  );
}

function buildSecurityIntroDossier(t: T) {
  return {
    title: t.securityIntroTitle,
    cjk: t.securityIntroCjk,
    desc: <>{t.securityIntroDesc}</>,
    rows: t.securityIntroRows,
  };
}

function SecurityRings({
  hoveredLayer,
  onHover,
  t,
}: {
  hoveredLayer: number | null;
  onHover: (n: number | null) => void;
  t: T;
}) {
  /* Six concentric rings + 12 tick marks per ring + arc labels.
     Mirrors the Atlas's Ring component aesthetic so the toggle feels
     like the same diagram morphing into a different one. */
  const VS = 1500;
  const CX = 0;
  const CY = 0;
  const ringRs = [0.95, 0.8, 0.65, 0.5, 0.36, 0.22];
  const radius = (r: number) => (r * VS) / 2;
  const layers = t.securityLayers;
  return (
    <svg
      viewBox={`${-VS / 2} ${-VS / 2 - TOP_PAD} ${VS} ${VS + TOP_PAD + BOT_PAD}`}
      className="orbital-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {ringRs.map((r, i) => {
        const isHovered = hoveredLayer === i + 1;
        return (
          <g key={i} className="ring">
            <circle
              cx={CX}
              cy={CY}
              r={radius(r)}
              fill="none"
              className={'ring__circle' + (isHovered ? ' is-glow' : '')}
              stroke={isHovered ? 'var(--red)' : 'var(--rule)'}
              strokeWidth={isHovered ? 1.6 : 1}
            />
            {Array.from({ length: 12 }, (_, j) => {
              const t = j * 30;
              const a = POL(r, t);
              const b = POL(r + 0.011, t);
              return (
                <line
                  key={j}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--rule-soft)"
                  strokeWidth="0.6"
                />
              );
            })}
          </g>
        );
      })}

      {/* arc labels just inside each ring, top arc */}
      {layers.map((layer, i) => {
        const r = ringRs[i] - 0.03;
        const id = `sec-ring-${i}`;
        const charPx = 14;
        const textPx = (layer.label.length + 1) * charPx;
        const arcDeg = Math.max(36, (textPx / radius(r)) * (180 / Math.PI));
        const start = 270 - arcDeg / 2;
        const end = 270 + arcDeg / 2;
        const a0 = POL(r, start);
        const a1 = POL(r, end);
        const path = `M ${a0.x} ${a0.y} A ${radius(r)} ${radius(r)} 0 0 1 ${a1.x} ${a1.y}`;
        const isHovered = hoveredLayer === layer.n;
        return (
          <g key={id}>
            <defs>
              <path id={id} d={path} />
            </defs>
            <text
              className={'ring__label' + (isHovered ? ' is-glow' : '')}
              onMouseEnter={() => onHover(layer.n)}
              onMouseLeave={() => onHover(null)}
            >
              <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
                {layer.label}
              </textPath>
            </text>
          </g>
        );
      })}

      {/* center mark — CORE */}
      <g className="center-mark">
        <circle
          cx={CX}
          cy={CY}
          r={radius(0.1)}
          fill="var(--ink-fill)"
          stroke="var(--red)"
          strokeWidth="1.4"
        />
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          fontFamily="var(--serif)"
          fontSize="40"
          fill="var(--red)"
        >
          {t.securityCenterKanji}
        </text>
        <text
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          className="center-mark__label"
          style={{ fill: 'var(--paper)' }}
        >
          {t.securityCenterCore}
        </text>
      </g>

      {/* traveling pulse: outside → center */}
      <circle r="6" fill="var(--red)" className="security-pulse">
        <animate
          attributeName="cy"
          values={`${-radius(0.95)}; 0`}
          dur="6.5s"
          repeatCount="indefinite"
          keyTimes="0; 1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1"
        />
        <animate
          attributeName="opacity"
          values="0; 1; 1; 0"
          dur="6.5s"
          repeatCount="indefinite"
          keyTimes="0; 0.08; 0.92; 1"
        />
      </circle>
    </svg>
  );
}

function SecurityCallout({
  layer,
  position,
  isHovered,
  onHover,
  whyLabel,
}: {
  layer: SecurityLayer;
  position: { left?: string; right?: string; top: string };
  isHovered: boolean;
  onHover: (n: number | null) => void;
  whyLabel: string;
}) {
  return (
    <div
      className={'sec-callout' + (isHovered ? ' is-glow' : '')}
      style={position}
      onMouseEnter={() => onHover(layer.n)}
      onMouseLeave={() => onHover(null)}
    >
      <span className="sec-callout__num">{layer.n}</span>
      <h4 className="sec-callout__title">{layer.title}</h4>
      <p className="sec-callout__what">{layer.what}</p>
      <p className="sec-callout__why">
        <b>{whyLabel}</b> {layer.why}
      </p>
    </div>
  );
}

function SecurityView({ t, hasHover }: { t: T; hasHover: boolean }) {
  const [hoveredLayer, setHoveredLayerRaw] = useState<number | null>(null);
  const setHoveredLayer = (n: number | null) => {
    if (hasHover) setHoveredLayerRaw(n);
  };
  const leftLayers = t.securityLayers.filter(l => l.side === 'left');
  const rightLayers = t.securityLayers.filter(l => l.side === 'right');
  const calloutTops = ['4%', '38%', '72%'];
  return (
    <div className="security-view">
      {/* layer 1: rings, mirrors the Atlas canvas */}
      <div className="canvas--orbital security-canvas">
        <SecurityRings
          hoveredLayer={hoveredLayer}
          onHover={setHoveredLayer}
          t={t}
        />
        {leftLayers.map((layer, i) => (
          <SecurityCallout
            key={layer.n}
            layer={layer}
            position={{ left: '2%', top: calloutTops[i] }}
            isHovered={hoveredLayer === layer.n}
            onHover={setHoveredLayer}
            whyLabel={t.securityWhyWeLikeIt}
          />
        ))}
        {rightLayers.map((layer, i) => (
          <SecurityCallout
            key={layer.n}
            layer={layer}
            position={{ right: '2%', top: calloutTops[i] }}
            isHovered={hoveredLayer === layer.n}
            onHover={setHoveredLayer}
            whyLabel={t.securityWhyWeLikeIt}
          />
        ))}
        <span className="corner corner--tl" />
        <span className="corner corner--tr" />
        <span className="corner corner--bl" />
        <span className="corner corner--br" />
      </div>

      {/* layer 2: stats */}
      <div className="security-section">
        <h2 className="security-h2">
          {t.statsHeading} <span className="cjk">{t.statsCjk}</span>
        </h2>
        <div className="sec-stat-grid">
          {t.securityStats.map(s => (
            <div key={s.k} className="sec-stat">
              <b>{s.v}</b>
              <span>{s.k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* layer 3: agents share the box */}
      <div className="security-section">
        <h2 className="security-h2">
          {t.agentsHeading} <span className="cjk">{t.agentsCjk}</span>
        </h2>
        <p className="security-sub">{t.agentsSubtitle}</p>
        <div className="sec-agent-stage">
          <div className="sec-apex">
            <div className="sec-apex__role">{t.authorityAgentRole}</div>
            <div className="sec-apex__name">
              {t.orderName} <span className="cjk">{t.orderCjk}</span>
            </div>
            <ul className="sec-apex__creds">
              {t.orderCreds.map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="sec-sib-grid">
            {t.securityAgents.map(a => (
              <div key={a.name} className="sec-sib">
                <h4>
                  {a.name}
                  <span className="sec-sib__badge">{a.badge}</span>
                </h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="security-punch">{t.agentsPunchline}</p>
      </div>

      {/* layer 4: patterns */}
      <div className="security-section">
        <h2 className="security-h2">
          {t.patternsHeading} <span className="cjk">{t.patternsCjk}</span>
        </h2>
        <p className="security-sub">{t.patternsSubtitle}</p>
        <div className="sec-pattern-grid">
          {t.securityPatterns.map(p => (
            <div key={p.title} className="sec-pattern">
              <span className="sec-pattern__marker" />
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiAtlasApp() {
  const router = useRouter();
  const lang: Lang = pickLang(router.locale);
  const t = STRINGS[lang];

  const [data, setData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [linkHoverNode, setLinkHoverNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('environment');
  const hasHover = useHasHover();

  /* mark <body> while AI Atlas is mounted so the global navbar can
     match the page's paper background (light mode only for now).
     Also mark <html> so the page-scoped scrollbar style takes effect
     (the existing scrollbar rules in globals.scss are html-scoped). */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.add('ai-atlas-page');
    document.documentElement.classList.add('scroll-style-atlas');
    return () => {
      document.body.classList.remove('ai-atlas-page');
      document.documentElement.classList.remove('scroll-style-atlas');
    };
  }, []);

  /* hash → state (initial load + back/forward).
     useLayoutEffect runs synchronously after hydration commit and
     before paint, so a deep-link to /ai-atlas#security shows the
     correct tab on first paint instead of flashing 'environment'
     for one frame and then snapping.

     Reserved hashes: 'security' (Security tab), '' / 'environment'
     (default tab, no focus). Anything else is treated as an entity
     id and focuses that entity. We set optimistically here; the
     validation effect below clears unknown ids once data loads. */
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (hash === 'security') {
        setViewMode('security');
        setFocusedNode(null);
        return;
      }
      setViewMode('environment');
      setFocusedNode(hash && hash !== 'environment' ? hash : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  /* Once data is loaded, drop any focusedNode whose id isn't a real
     entity — protects against typo'd or stale share links. */
  useEffect(() => {
    if (!data || !focusedNode) return;
    if (!data.dossiers || !data.dossiers[focusedNode]) setFocusedNode(null);
  }, [data, focusedNode]);

  /* state → hash (silent, no history clutter) */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let desired = '';
    if (viewMode === 'security') desired = '#security';
    else if (focusedNode) desired = '#' + focusedNode;
    const current = window.location.hash;
    if (current !== desired) {
      const url = window.location.pathname + window.location.search + desired;
      window.history.replaceState(null, '', url);
    }
  }, [viewMode, focusedNode]);

  useEffect(() => {
    let cancelled = false;
    const url = dataUrlFor(lang);
    setData(null);
    const load = () => {
      fetch(url, { cache: 'no-store' })
        .then(r => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(d => {
          if (!cancelled) {
            setData(d);
            setFetchError(null);
          }
        })
        .catch(e => {
          if (!cancelled) setFetchError(String(e.message || e));
        });
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [lang]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const [metrics, setMetrics] = useState<any>(null);
  useEffect(() => {
    const load = () =>
      fetch(METRICS_URL, { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
        .then(d => setMetrics(d))
        .catch(() => {});
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(
      '.node.is-glow, .center-mark.is-glow circle',
    );
    els.forEach((el: any) => {
      el.style.animation = 'none';
    });
    void document.body.offsetWidth;
    els.forEach((el: any) => {
      el.style.animation = '';
    });
  }, [focusedNode, hoverNode]);

  const [consuming, setConsuming] = useState(false);
  useEffect(() => {
    const PHRASE = 'the shadow take me';
    let buf = '';
    const onKey = (e: KeyboardEvent) => {
      if (!e.key || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-PHRASE.length);
      if (buf === PHRASE) {
        buf = '';
        setConsuming(true);
        setTimeout(() => setConsuming(false), 9500);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const points = useMemo(() => {
    if (!data) return {} as Record<string, any>;
    const m: Record<string, any> = {};
    m['wolf'] = { x: 0, y: 0, ring: 'apex' };
    {
      const n = data.order.member;
      const p = POL(data.order.r, n.theta);
      m[n.id] = { ...p, ring: 'order', node: n };
    }
    data.devEnv.members.forEach((n: any) => {
      const p = POL(data.devEnv.r, n.theta);
      m[n.id] = { ...p, ring: 'dev', node: n };
    });
    data.projects.members.forEach((p: any) => {
      const pos = POL(data.projects.r, p.theta);
      m[p.id] = { ...pos, ring: 'projects', node: p };
      const leadId = `lead-${p.id}`;
      const leadOffset =
        p.leadDeg !== undefined ? p.leadDeg : data.projects.leadDeg;
      const leadR = p.leadR !== undefined ? p.leadR : data.projects.r;
      const leadPos = POL(leadR, p.theta + leadOffset);
      m[leadId] = {
        ...leadPos,
        ring: 'projects',
        node: {
          id: leadId,
          label: t.engLeadLabel,
          diamond: p.leadDiamond,
          role: 'lead',
        },
      };
      // Optional second lead (e.g. when a project has both an AI and a human
      // engineering lead). Opt-in via `leadDiamond2`; `leadDeg2` / `leadR2`
      // control its placement relative to the project pin.
      if (p.leadDiamond2) {
        const lead2Id = `lead2-${p.id}`;
        const lead2Offset =
          p.leadDeg2 !== undefined ? p.leadDeg2 : -data.projects.leadDeg;
        const lead2R = p.leadR2 !== undefined ? p.leadR2 : data.projects.r;
        const lead2Pos = POL(lead2R, p.theta + lead2Offset);
        m[lead2Id] = {
          ...lead2Pos,
          ring: 'projects',
          node: {
            id: lead2Id,
            label: t.engLeadLabel,
            diamond: p.leadDiamond2,
            role: 'lead',
          },
        };
      }
    });
    data.projects.members.forEach((p: any) => {
      const n = p.children.length;
      if (!n) return;
      // childrenArc (if set) governs the angular spread of child entities
      // independently of territoryArc (which drives the territory band
      // backdrop). Lets the band stay wide while keeping satellites tight.
      const arc = p.childrenArc != null ? p.childrenArc : p.territoryArc;
      const half = arc / 2;
      p.children.forEach((c: any, i: number) => {
        const t = n === 1 ? p.theta : p.theta - half + i * (arc / (n - 1));
        const r = c.external ? data.territoryR + 0.1 : data.territoryR;
        const pos = POL(r, t);
        m[c.id] = { ...pos, ring: 'territories', node: c, parent: p.id };
      });
    });
    return m;
  }, [data, t.engLeadLabel]);

  if (!data) {
    return (
      <div className="sheet">
        <div className="atlas-loading">
          {fetchError ? (
            <>
              {t.failedToLoad}
              <code>{fetchError}</code>
            </>
          ) : (
            t.loading
          )}
        </div>
      </div>
    );
  }

  const focusId = hoverNode || focusedNode;
  const focusedDossier = focusId && data.dossiers[focusId];
  let dossier =
    viewMode === 'security'
      ? buildSecurityIntroDossier(t)
      : focusedDossier || buildIntroDossier(data, now, t);

  /* When a focused entity has a CLAUDE.md count from the metrics feed,
     append it as the last row of the dossier. Falls back to a static
     `claudeMdLines` on the dossier itself when the metrics endpoint
     doesn't (yet) know about the entity — keeps the row format uniform. */
  const metricsLines =
    focusId && metrics?.claudeMdLines?.[focusId] != null
      ? metrics.claudeMdLines[focusId]
      : null;
  const staticLines =
    focusedDossier && typeof (focusedDossier as any).claudeMdLines === 'number'
      ? (focusedDossier as any).claudeMdLines
      : null;
  const claudeLines = metricsLines != null ? metricsLines : staticLines;
  if (claudeLines != null) {
    dossier = {
      ...dossier,
      rows: [
        ...dossier.rows,
        { k: t.claudeMdLabel, v: t.linesValue(claudeLines) },
      ],
    };
  }
  const highlightId = linkHoverNode || focusId;
  /* On touch devices there is no hover, so a tap should reveal the same
     entity-plus-connections highlight that hovering shows on desktop.
     Solo-pin only applies when real hover is available. */
  const pinnedSolo = hasHover && !!focusedNode && !hoverNode && !linkHoverNode;

  const onSelect = (id: string | null, mode?: string) => {
    if (mode === 'hover') {
      if (hasHover) setHoverNode(id);
    } else if (mode === 'link-hover') {
      if (hasHover) setLinkHoverNode(id);
    } else {
      setLinkHoverNode(null);
      setFocusedNode(id === focusedNode ? null : id);
    }
  };

  const highlight = (() => {
    const set = new Set<string>();
    if (!highlightId) return set;
    set.add(highlightId);
    if (highlightId.startsWith('ring:')) {
      const ringKey = highlightId.slice(5);
      if (ringKey === 'order' && data.order && data.order.member)
        set.add(data.order.member.id);
      if (ringKey === 'devEnv')
        (data.devEnv.members || []).forEach((n: any) => set.add(n.id));
      if (ringKey === 'projects')
        data.projects.members.forEach((p: any) => {
          set.add(p.id);
          set.add(`lead-${p.id}`);
          if (p.leadDiamond2) set.add(`lead2-${p.id}`);
        });
      if (ringKey === 'territories')
        data.projects.members.forEach((p: any) =>
          (p.children || []).forEach((c: any) => set.add(c.id)),
        );
      return set;
    }
    if (pinnedSolo) return set;
    const fp = points[highlightId];
    if (!fp) return set;
    if (highlightId.startsWith('lead2-') || highlightId.startsWith('lead-')) {
      const projId = highlightId.startsWith('lead2-')
        ? highlightId.slice(6)
        : highlightId.slice(5);
      set.add(projId);
      const proj = data.projects.members.find((p: any) => p.id === projId);
      if (proj) proj.children.forEach((c: any) => set.add(c.id));
    } else {
      set.add(`lead-${highlightId}`);
      const focusProj = data.projects.members.find(
        (p: any) => p.id === highlightId,
      );
      if (focusProj && focusProj.leadDiamond2) set.add(`lead2-${highlightId}`);
    }
    if (highlightId === 'terminal') {
      if (data.order.member.diamond === 'blue') set.add(data.order.member.id);
      data.devEnv.members.forEach((n: any) => {
        if (n.diamond === 'blue') set.add(n.id);
      });
      data.projects.members.forEach((p: any) => {
        if (p.leadDiamond === 'blue') set.add(`lead-${p.id}`);
      });
    }
    const proj = data.projects.members.find((p: any) => p.id === highlightId);
    if (proj) proj.children.forEach((c: any) => set.add(c.id));
    if (fp.parent) {
      set.add(fp.parent);
      set.add(`lead-${fp.parent}`);
      const parent = data.projects.members.find((p: any) => p.id === fp.parent);
      if (parent) {
        if (parent.leadDiamond2) set.add(`lead2-${fp.parent}`);
        parent.children.forEach((c: any) => set.add(c.id));
      }
    }
    if (highlightId === 'wolf') {
      set.add('order');
      set.add('terminal');
      set.add('lead-terminal');
    }
    if (highlightId === 'order') {
      set.add('wolf');
      data.devEnv.members.forEach((n: any) => set.add(n.id));
      data.projects.members.forEach((p: any) => {
        set.add(p.id);
        set.add(`lead-${p.id}`);
        if (p.leadDiamond2) set.add(`lead2-${p.id}`);
      });
    }
    if (fp.ring === 'dev') set.add('order');
    return set;
  })();

  const isDim = (id: string) => !!highlightId && !highlight.has(id);
  const noSpokeGlow = highlightId === 'wolf' || highlightId === 'terminal';
  const spokeGlow = (a: string, b: string) =>
    !noSpokeGlow && !!highlightId && highlight.has(a) && highlight.has(b);

  const brand = data.brand || { title: 'AI Atlas', kanji: '天' };
  const ringLbls = data.ringLabels || {};
  const rL = (k: string) => ringLbls[k] || null;

  return (
    <div className="sheet">
      <header className="doc-header">
        <div className="header-left">
          <div className="cjk">
            {brand.title
              .split(' ')
              .map((w: string) => w.toUpperCase().split('').join(' '))
              .join(' · ')}
            {brand.kanji && (
              <>
                {' '}
                · <span className="cjk__kanji">{brand.kanji}</span>
              </>
            )}
          </div>
          <span className="meta-intro">{t.welcomeBanner}</span>
        </div>
        <div className="meta">
          <span className="meta-group">
            <span className="meta-label">{t.day}</span>
            <b>
              {(() => {
                const start = Date.UTC(2019, 5, 29);
                const today = Date.UTC(
                  now.getUTCFullYear(),
                  now.getUTCMonth(),
                  now.getUTCDate(),
                );
                return Math.max(
                  1,
                  Math.floor((today - start) / 86400000) + 1,
                ).toLocaleString();
              })()}
            </b>
            <span className="meta-tail">{t.daySinceTail}</span>
          </span>
        </div>
      </header>

      <div className="workspace--v4">
        <div className="view-stage" key={viewMode}>
          {viewMode === 'environment' && (
            <div
              className="canvas--orbital"
              onMouseLeave={() => setHoverNode(null)}
            >
              {consuming && <InkConsume />}
              <CanvasStats data={data} t={t} />
              <svg
                viewBox={`${-HALF} ${-HALF - TOP_PAD} ${VIEW} ${VIEW + TOP_PAD + BOT_PAD}`}
                xmlns="http://www.w3.org/2000/svg"
                className="orbital-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {data.projects.members.map((p: any) => (
                  <TerritoryArc
                    key={'arc-' + p.id}
                    project={p}
                    R={data.territoryR}
                  />
                ))}

                {(() => {
                  const ringMeta = [
                    { key: 'order', r: data.order.r, defaultTheta: 90 },
                    { key: 'devEnv', r: data.devEnv.r, defaultTheta: 270 },
                    { key: 'projects', r: data.projects.r, defaultTheta: 270 },
                    {
                      key: 'territories',
                      r: data.territoryR,
                      defaultTheta: 270,
                    },
                  ];
                  return ringMeta.map(rm => {
                    const cfg = rL(rm.key);
                    const ringHL = `ring:${rm.key}`;
                    return (
                      <Ring
                        key={rm.key}
                        r={rm.r}
                        label={cfg && cfg.label}
                        theta={(cfg && cfg.theta) || rm.defaultTheta}
                        offset={cfg && cfg.offset}
                        ringId={rm.key}
                        onSelect={onSelect}
                        hovered={highlightId === ringHL}
                        dimmed={
                          !!highlightId &&
                          highlightId !== ringHL &&
                          !highlight.has(ringHL)
                        }
                      />
                    );
                  });
                })()}

                {data.projects.members.map((p: any) => (
                  <TerritoryLabel
                    key={'tl-' + p.id}
                    project={p}
                    R={data.territoryR}
                  />
                ))}

                <Spoke
                  from={points['wolf']}
                  to={points['order']}
                  kind="auth"
                  dim={isDim('wolf') || isDim('order')}
                  glow={spokeGlow('wolf', 'order')}
                />

                {data.devEnv.members.map((n: any) => (
                  <Spoke
                    key={'o-' + n.id}
                    from={points['order']}
                    to={points[n.id]}
                    kind="auth"
                    dim={isDim('order') || isDim(n.id)}
                    glow={spokeGlow('order', n.id)}
                  />
                ))}

                {data.projects.members.map((p: any) => (
                  <Spoke
                    key={'op-' + p.id}
                    from={points['order']}
                    to={points[p.id]}
                    kind="auth"
                    dim={isDim('order') || isDim(p.id)}
                    glow={spokeGlow('order', p.id)}
                  />
                ))}

                {data.projects.members.map((p: any) => (
                  <Spoke
                    key={'lp-' + p.id}
                    from={points[p.id]}
                    to={points[`lead-${p.id}`]}
                    kind="lead"
                    dim={isDim(p.id) || isDim(`lead-${p.id}`)}
                    glow={spokeGlow(p.id, `lead-${p.id}`)}
                  />
                ))}

                {data.projects.members
                  .filter((p: any) => p.leadDiamond2)
                  .map((p: any) => (
                    <Spoke
                      key={'lp2-' + p.id}
                      from={points[p.id]}
                      to={points[`lead2-${p.id}`]}
                      kind="lead"
                      dim={isDim(p.id) || isDim(`lead2-${p.id}`)}
                      glow={spokeGlow(p.id, `lead2-${p.id}`)}
                    />
                  ))}

                {data.projects.members.flatMap((p: any) =>
                  p.children
                    .filter((c: any) => !c.noSpoke)
                    .map((c: any) => (
                      <Spoke
                        key={'sc-' + c.id}
                        from={points[p.id]}
                        to={points[c.id]}
                        kind={c.external ? 'advisory' : 'deploy'}
                        dim={isDim(p.id) || isDim(c.id)}
                        glow={spokeGlow(p.id, c.id)}
                      />
                    )),
                )}

                <g
                  className={
                    'center-mark ' +
                    (isDim('wolf') ? 'is-dim' : '') +
                    (focusId === 'wolf' ? ' is-active' : '') +
                    (!!highlightId && highlight.has('wolf') ? ' is-glow' : '')
                  }
                  onClick={() => onSelect('wolf')}
                  onMouseEnter={() => onSelect('wolf', 'hover')}
                  onMouseLeave={() => onSelect(null, 'hover')}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="86"
                    fill="var(--paper)"
                    stroke="var(--red)"
                    strokeWidth="1.4"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="76"
                    fill="none"
                    stroke="var(--rule-soft)"
                    strokeWidth="0.6"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="68"
                    fill="none"
                    stroke="var(--rule-faint)"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                  />
                  <text
                    x="0"
                    y="-12"
                    textAnchor="middle"
                    fontFamily="var(--serif)"
                    fontSize="40"
                    fill="var(--red)"
                  >
                    天
                  </text>
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    className="center-mark__label"
                  >
                    WOLF
                  </text>
                  <text
                    x="0"
                    y="42"
                    textAnchor="middle"
                    className="center-mark__sub"
                  >
                    {(data.apex && data.apex.sub) || t.apexFounderFallback}
                  </text>
                </g>

                <NodeBody
                  node={data.order.member}
                  x={points['order'].x}
                  y={points['order'].y}
                  active={focusId === 'order'}
                  dimmed={isDim('order')}
                  highlighted={!!highlightId && highlight.has('order')}
                  hovered={hoverNode === 'order'}
                  onSelect={onSelect}
                  w={170}
                  h={50}
                />

                {data.devEnv.members.map((n: any) => (
                  <NodeBody
                    key={n.id}
                    node={n}
                    x={points[n.id].x}
                    y={points[n.id].y}
                    active={focusId === n.id}
                    dimmed={isDim(n.id)}
                    highlighted={!!highlightId && highlight.has(n.id)}
                    hovered={hoverNode === n.id}
                    onSelect={onSelect}
                    w={n.id === 'tools' ? 200 : 170}
                    h={n.sub ? 66 : 48}
                  />
                ))}

                {data.projects.members.map((p: any) => (
                  <NodeBody
                    key={p.id}
                    node={p}
                    x={points[p.id].x}
                    y={points[p.id].y}
                    active={focusId === p.id}
                    dimmed={isDim(p.id)}
                    highlighted={!!highlightId && highlight.has(p.id)}
                    hovered={hoverNode === p.id}
                    onSelect={onSelect}
                    w={210}
                    h={p.sub ? 72 : 52}
                  />
                ))}

                {data.projects.members.map((p: any) => {
                  const id = `lead-${p.id}`;
                  return (
                    <NodeBody
                      key={id}
                      node={points[id].node}
                      x={points[id].x}
                      y={points[id].y}
                      active={focusId === id}
                      dimmed={isDim(id)}
                      highlighted={!!highlightId && highlight.has(id)}
                      hovered={hoverNode === id}
                      onSelect={onSelect}
                      w={140}
                      h={38}
                    />
                  );
                })}

                {data.projects.members
                  .filter((p: any) => p.leadDiamond2)
                  .map((p: any) => {
                    const id = `lead2-${p.id}`;
                    return (
                      <NodeBody
                        key={id}
                        node={points[id].node}
                        x={points[id].x}
                        y={points[id].y}
                        active={focusId === id}
                        dimmed={isDim(id)}
                        highlighted={!!highlightId && highlight.has(id)}
                        hovered={hoverNode === id}
                        onSelect={onSelect}
                        w={140}
                        h={38}
                      />
                    );
                  })}

                {data.projects.members.flatMap((p: any) =>
                  p.children.map((c: any) => {
                    const labelForWidth = c.redacted
                      ? t.redactedPlaceholder
                      : c.label;
                    return (
                      <NodeBody
                        key={c.id}
                        node={c}
                        x={points[c.id].x}
                        y={points[c.id].y}
                        active={focusId === c.id}
                        dimmed={isDim(c.id)}
                        highlighted={!!highlightId && highlight.has(c.id)}
                        hovered={hoverNode === c.id}
                        onSelect={onSelect}
                        w={labelForWidth.length > 12 ? 190 : 165}
                        h={42}
                        redactedPlaceholder={t.redactedPlaceholder}
                      />
                    );
                  }),
                )}

                {(() => {
                  if (
                    !focusId ||
                    focusId.startsWith('ring:') ||
                    !points[focusId]
                  )
                    return null;
                  const node = points[focusId].node;
                  if (!node) return null;
                  let w: number, h: number;
                  if (focusId === 'order') {
                    w = 170;
                    h = 50;
                  } else if (focusId.startsWith('lead-')) {
                    w = 140;
                    h = 38;
                  } else if (
                    data.devEnv.members.some((n: any) => n.id === focusId)
                  ) {
                    w = focusId === 'tools' ? 200 : 170;
                    h = node.sub ? 66 : 48;
                  } else if (
                    data.projects.members.some((p: any) => p.id === focusId)
                  ) {
                    w = 210;
                    h = node.sub ? 72 : 52;
                  } else {
                    const lw = node.redacted
                      ? t.redactedPlaceholder
                      : node.label;
                    w = lw.length > 12 ? 190 : 165;
                    h = 42;
                  }
                  return (
                    <NodeBody
                      node={node}
                      x={points[focusId].x}
                      y={points[focusId].y}
                      active={focusedNode === focusId}
                      dimmed={false}
                      highlighted={!!highlightId && highlight.has(focusId)}
                      hovered={hoverNode === focusId}
                      onSelect={onSelect}
                      w={w}
                      h={h}
                      redactedPlaceholder={t.redactedPlaceholder}
                    />
                  );
                })()}
              </svg>

              <span className="corner corner--tl" />
              <span className="corner corner--tr" />
              <span className="corner corner--bl" />
              <span className="corner corner--br" />
            </div>
          )}

          {viewMode === 'security' && (
            <SecurityView t={t} hasHover={hasHover} />
          )}
        </div>

        <aside className="rail">
          {viewMode === 'security' ? <DoctrinePanel t={t} /> : <Legend t={t} />}
          <ViewToggle mode={viewMode} setMode={setViewMode} t={t} />
          <Dossier
            data={dossier}
            onSelect={onSelect}
            dossiers={data.dossiers}
          />
        </aside>
      </div>

      <footer className="doc-footer">
        <span className="hanko-row">
          <span className="hanko" title={t.hankoSelfTitle}>
            自強不息
          </span>
          <span className="hanko" title={t.hankoCoTitle}>
            共存共栄
          </span>
        </span>
        <span>{t.footerEnd}</span>
      </footer>
    </div>
  );
}

export default function AiAtlasPage() {
  const router = useRouter();
  const lang: Lang = pickLang(router.locale);
  const t = STRINGS[lang];
  return (
    <>
      <SeoGenerator
        strapiSEO={{
          title: t.seoTitle,
          pageTitle: t.seoTitle,
          seoTitle: t.seoTitle,
          description: t.seoDescription,
          keywords: t.seoKeywords,
        }}
        type="WebPage"
        ogTags={{
          ogTitle: t.seoTitle,
          ogDescription: t.seoDescription,
          ogType: 'website',
          ogImageAlt: t.ogImageAlt,
          ogImage: {
            data: {
              attributes: {
                url: '',
                staticUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/ai-atlas/og.png`,
              },
            },
          },
        }}
      />
      <div className="ai-atlas-root">
        <AiAtlasApp />
      </div>
    </>
  );
}
