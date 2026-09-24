import base from './copy.json';
import features from './features';

export const copy: any = {
  ...base,
  linesValue: (n: number) => String(n),
  introInhabitantsTpl: () => '',
};
/* Page words the Terminal may replace with a push, beyond copy.json. */
export const PAGE_TEXT_DEFAULTS: Record<string, string> = {
  brandTitle: 'Wolf’s Terminal',
  apexLabel: 'WOLF',
  apexSub: 'direction',
  orderLabel: 'The Order',
  resourceAgents: 'Colleagues',
  resourceMemory: 'Memory',
  resourceTools: 'Tools',
  resourceModels: 'Models',
  ringOrderLabel: 'I · Ownership',
  ringDevEnvLabel: 'II · Resources',
  ringProjectsLabel: 'III · Task lifecycle',
  ringTerritoriesLabel: 'IV · Mechanisms',
  ringOrderTitle: 'Ownership',
  ringDevEnvTitle: 'Resources',
  ringDevEnvDesc:
    'What every stage of a task draws on: colleagues, memory, tools, models.',
  ringProjectsTitle: 'Task lifecycle',
  ringProjectsDesc:
    'The rings are the stages of one task, clockwise from Project to Result.',
  ringTerritoriesTitle: 'Mechanisms',
  ringTerritoriesDesc: 'Every topic opens its own card.',
  metaLabel: 'TERMINAL DOCUMENTATION',
  topicsPlaceholder: 'The Atlas',
  stagesAria: 'Project to Result, clockwise',
};

/* Keys of copy.json a push may replace: the plain strings. */
export const PAGE_TEXT_KEYS = new Set([
  ...Object.keys(base).filter(key => typeof (base as any)[key] === 'string'),
  ...Object.keys(PAGE_TEXT_DEFAULTS),
]);

/* Labels drawn inside map nodes and rings: short, or they spill over the
   map. A push keeps them to SHORT_LABEL_MAX characters. */
export const SHORT_LABEL_KEYS = new Set([
  'brandTitle',
  'apexLabel',
  'apexSub',
  'orderLabel',
  'resourceAgents',
  'resourceMemory',
  'resourceTools',
  'resourceModels',
  'ringOrderLabel',
  'ringDevEnvLabel',
  'ringProjectsLabel',
  'ringTerritoriesLabel',
  'metaLabel',
  'topicsPlaceholder',
]);
export const SHORT_LABEL_MAX = 40;

/* How many tiles one stage can carry before its arc runs into the next. */
export const MAX_TILES_PER_STAGE = 3;

export function adaptGuide(guide: any) {
  /* Words pushed with the guide as `copy` win over the built-in ones. */
  const text = (key: string) =>
    guide.copy?.[key] ?? PAGE_TEXT_DEFAULTS[key] ?? (copy as any)[key];
  /* Wolf's prose for a card: pushed with the guide as `cards` when the
     Terminal sends it, else the copy in features.ts, else the guide's own
     text. */
  const describe = (id: string, fallback: string[]) =>
    guide.cards?.[id] || features[id] || fallback.filter(Boolean);
  const dossiers: any = {};
  const entries = new Map(guide.entries.map((entry: any) => [entry.id, entry]));
  for (const entry of [...guide.entries, ...guide.system.nodes]) {
    const id =
      guide.entries.some((e: any) => e.id === entry.id) &&
      guide.system.nodes.includes(entry)
        ? 'system-' + entry.id
        : entry.id;
    dossiers[id] = {
      title: entry.title,
      desc: describe(id, entry.detail || [entry.text]).join('\n\n'),
      rows: [
        ...(entry.children || []).map((child: string) => ({
          k: 'inside',
          v: (entries.get(child) as any)?.title || child,
          ref: child,
        })),
      ],
    };
  }
  /* The rows under a card are its own contents only. The Terminal's
     cross-links and system edges carried its own explanations in another
     voice; they are not drawn. */
  const systemRef = (id: string) =>
    dossiers['system-' + id] ? 'system-' + id : id;
  /* A push may set each stage's label and the tiles drawn on it as
     `stages`; otherwise the map keeps the selection below. */
  const labels = [
    'Project',
    'Task',
    'Dispatch',
    'Prepare',
    'Work',
    'Result',
  ].map((label, i) => guide.stages?.[i]?.label ?? label);
  const angles = [210, 270, 330, 30, 90, 150];
  const chosen = [
    ['keys', 'backlog'],
    ['message', 'queue'],
    ['engine-switch', 'steering'],
    ['global', 'local', 'session-resume'],
    ['work-checks', 'sendto', 'human-collab'],
    ['history', 'decisions', 'discipline'],
  ].map((tiles, i) => guide.stages?.[i]?.tiles ?? tiles);
  const topicToStage: any = {};
  const support = [
    ['order'],
    ['wolf'],
    ['models'],
    ['memory'],
    ['agents', 'tools', 'models', 'memory'],
    ['wolf', 'memory'],
  ];
  const projects = guide.steps.map((step: any, index: number) => {
    const id = 'stage-' + step.id;
    const register = (topic: string) => {
      topicToStage[topic] = id;
      for (const child of (entries.get(topic) as any)?.children || [])
        register(child);
    };
    step.children.forEach(register);
    dossiers[id] = {
      title: step.title,
      desc: describe(id, [step.text]).join('\n\n'),
      rows: step.children.map((child: string) => ({
        k: 'mechanism',
        v: (entries.get(child) as any)?.title || child,
        ref: child,
      })),
    };
    return {
      id,
      label: labels[index],
      sub:
        String(index + 1).padStart(2, '0') +
        (index === 0 ? ' · START' : index === 5 ? ' · END' : ''),
      support: support[index].map(systemRef),
      diamond: 'red',
      theta: angles[index],
      // A stage carrying three tiles needs a wider arc, or the tiles
      // would sit on top of each other at this radius.
      territoryArc: chosen[index].length > 2 ? 54 : 36,
      childrenArc: chosen[index].length > 2 ? 46 : 22,
      territoryLabel: '',
      /* A tile the Terminal has since removed is left off the map. */
      children: chosen[index]
        .filter(child => entries.has(child))
        .map(child => ({
          id: child,
          label: (entries.get(child) as any).title,
          kind: 'filled',
        })),
    };
  });
  /* What lights up together on hover, beyond a stage and its own tiles.
     Wolf directs The Order; The Order stands behind every resource; a
     resource is used by the tiles named here. A stage's support lines are
     declared on the stage itself. */
  const resourceUses: Record<string, string[]> = {
    [systemRef('agents')]: ['sendto', 'human-collab'],
    [systemRef('memory')]: [
      'session-resume',
      'history',
      'decisions',
      'discipline',
    ],
    [systemRef('tools')]: ['work-checks', 'keys'],
    [systemRef('models')]: ['engine-switch', 'queue'],
  };
  const relations: string[][] = [
    ['wolf', 'order'],
    ...['agents', 'memory', 'tools', 'models'].map(id => [
      'order',
      systemRef(id),
    ]),
    ...Object.entries(resourceUses).flatMap(([res, tiles]) =>
      tiles.map(tile => [res, tile]),
    ),
  ];
  const node = (id: string) => guide.system.nodes.find((n: any) => n.id === id);
  /* The Security view shows a node in one paragraph; the resource cards
     on the map carry the full text. */
  const nodeParagraph = (id: string, index: number) => {
    const paragraphs = describe(systemRef(id), node(id).detail);
    return paragraphs[Math.min(index, paragraphs.length - 1)];
  };
  const nodeDesc = (id: string) => nodeParagraph(id, 0);
  const layerIds = [
    'access',
    'secrets',
    'deploy',
    'tools',
    'records',
    'recovery',
  ];
  const t: any = {
    ...copy,
    ...PAGE_TEXT_DEFAULTS,
    ...(guide.copy || {}),
    securityLayers: layerIds.map((id, index) => ({
      n: index + 1,
      side: index % 2 ? 'right' : 'left',
      label: node(id).title.toLowerCase(),
      title: node(id).title,
      what: nodeDesc(id),
      why: node(id).basis,
    })),
    /* Ownership across the system: the paragraph about limits, where a
       card has one, so a layer and an agent never repeat each other. */
    securityAgents: ['agents', 'deploy', 'models', 'telegram'].map(id => ({
      name: node(id).title,
      badge: node(id).role,
      desc: nodeParagraph(id, id === 'agents' || id === 'deploy' ? 1 : 0),
    })),
    /* Continuity and evidence, from the cards themselves; none of these
       repeats a layer above. */
    securityPatterns: ['memory', 'history', 'discipline', 'watchers'].map(
      id => ({
        title: dossiers[systemRef(id)].title,
        desc: dossiers[systemRef(id)].desc.split('\n\n')[0],
      }),
    ),
  };
  dossiers['ring:order'] = {
    title: text('ringOrderTitle'),
    desc: nodeDesc('order'),
    rows: [],
  };
  dossiers['ring:devEnv'] = {
    title: text('ringDevEnvTitle'),
    desc: text('ringDevEnvDesc'),
    rows: ['agents', 'memory', 'tools', 'models'].map(id => ({
      k: 'resource',
      v: node(id).title,
      ref: dossiers['system-' + id] ? 'system-' + id : id,
    })),
  };
  dossiers['ring:projects'] = {
    title: text('ringProjectsTitle'),
    desc: text('ringProjectsDesc'),
    rows: projects.map((p: any) => ({ k: 'stage', v: p.label, ref: p.id })),
  };
  dossiers['ring:territories'] = {
    title: text('ringTerritoriesTitle'),
    desc: text('ringTerritoriesDesc'),
    rows: guide.entries.map((e: any) => ({
      k: 'mechanism',
      v: e.title,
      ref: e.id,
    })),
  };
  return {
    topicToStage,
    relations,
    copy: t,
    brand: { title: text('brandTitle'), kanji: '天' },
    ringLabels: {
      order: { label: text('ringOrderLabel'), theta: 270, offset: 0.09 },
      devEnv: { label: text('ringDevEnvLabel'), theta: 270 },
      projects: {
        label: text('ringProjectsLabel'),
        theta: 270,
        offset: 0.08,
      },
      territories: { label: text('ringTerritoriesLabel'), theta: 270 },
    },
    apex: {
      id: 'wolf',
      label: text('apexLabel'),
      cjk: '天',
      sub: text('apexSub'),
      diamond: 'gold',
    },
    order: {
      r: 0.2,
      member: {
        id: 'order',
        label: text('orderLabel'),
        diamond: 'blue',
        theta: 270,
      },
    },
    devEnv: {
      r: 0.39,
      members: [
        ['agents', text('resourceAgents')],
        ['memory', text('resourceMemory')],
        ['tools', text('resourceTools')],
        ['models', text('resourceModels')],
      ].map(([id, label], i) => ({
        id: dossiers['system-' + id] ? 'system-' + id : id,
        label,
        diamond: id === 'agents' ? 'blue' : 'red',
        // Colleagues are the one node covering both kinds the legend
        // names: the people I granted access and the project agents.
        diamonds: id === 'agents' ? ['gold', 'blue'] : undefined,
        theta: [0, 90, 180, 270][i],
      })),
    },
    projects: { r: 0.64, leadDeg: 0, members: projects },
    territoryR: 0.88,
    dossiers,
  };
}
