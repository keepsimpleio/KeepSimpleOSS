import base from './copy.json';
import features from './features';

export const copy: any = {
  ...base,
  linesValue: (n: number) => String(n),
  introInhabitantsTpl: () => '',
};
/* Wolf's prose for a card, or the guide's own text when he has none. */
const describe = (id: string, fallback: string[]) =>
  features[id] || fallback.filter(Boolean);

export function adaptGuide(guide: any) {
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
          k: 'topic',
          v: (entries.get(child) as any)?.title || child,
          ref: child,
        })),
      ],
    };
  }
  for (const [a, b, why] of guide.links) {
    if (dossiers[a] && dossiers[b])
      dossiers[a].rows.push({ k: dossiers[b].title, v: why, ref: b });
  }
  const systemRef = (id: string) =>
    dossiers['system-' + id] ? 'system-' + id : id;
  for (const edge of guide.system.edges) {
    const from = systemRef(edge.from),
      to = systemRef(edge.to);
    if (dossiers[from] && dossiers[to])
      dossiers[from].rows.push({
        k: dossiers[to].title,
        v: edge.why || edge.label,
        ref: to,
      });
  }
  const labels = ['Project', 'Task', 'Dispatch', 'Prepare', 'Work', 'Result'];
  const angles = [210, 270, 330, 30, 90, 150];
  const chosen = [
    ['keys', 'backlog'],
    ['message', 'queue'],
    ['engine-switch', 'steering'],
    ['global', 'local', 'session-resume'],
    ['work-checks', 'sendto', 'skills'],
    ['history', 'decisions'],
  ];
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
        k: 'topic',
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
      children: chosen[index].map(child => ({
        id: child,
        label: (entries.get(child) as any).title,
        kind: 'filled',
      })),
    };
  });
  const node = (id: string) => guide.system.nodes.find((n: any) => n.id === id);
  const nodeDesc = (id: string) =>
    describe(
      dossiers['system-' + id] ? 'system-' + id : id,
      node(id).detail,
    ).join(' ');
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
    securityLayers: layerIds.map((id, index) => ({
      n: index + 1,
      side: index % 2 ? 'right' : 'left',
      label: node(id).title.toLowerCase(),
      title: node(id).title,
      what: nodeDesc(id),
      why: node(id).basis,
    })),
    securityAgents: ['agents', 'deploy', 'models', 'telegram'].map(id => ({
      name: node(id).title,
      badge: node(id).role,
      desc: nodeDesc(id),
    })),
    securityPatterns: ['memory', 'records', 'watchers', 'recovery'].map(id => ({
      title: node(id).title,
      desc: nodeDesc(id),
    })),
  };
  dossiers['ring:order'] = {
    title: 'Ownership',
    desc: nodeDesc('order'),
    rows: [],
  };
  dossiers['ring:devEnv'] = {
    title: 'Working context',
    desc: 'What the agent works with: colleagues, memory, tools, models.',
    rows: ['agents', 'memory', 'tools', 'models'].map(id => ({
      k: 'topic',
      v: node(id).title,
      ref: dossiers['system-' + id] ? 'system-' + id : id,
    })),
  };
  dossiers['ring:projects'] = {
    title: 'Task lifecycle',
    desc: 'The rings are the stages of one task, clockwise from Project to Result.',
    rows: projects.map((p: any) => ({ k: 'stage', v: p.label, ref: p.id })),
  };
  dossiers['ring:territories'] = {
    title: 'Mechanisms',
    desc: 'Every topic opens its own card.',
    rows: guide.entries.map((e: any) => ({
      k: 'topic',
      v: e.title,
      ref: e.id,
    })),
  };
  return {
    topicToStage,
    copy: t,
    brand: { title: 'Terminal Atlas', kanji: '天' },
    ringLabels: {
      order: { label: 'I · Ownership', theta: 270, offset: 0.09 },
      devEnv: { label: 'II · Context', theta: 270 },
      projects: { label: 'III · Task lifecycle', theta: 270, offset: 0.08 },
      territories: { label: 'IV · Mechanisms', theta: 270 },
    },
    apex: {
      id: 'wolf',
      label: 'WOLF',
      cjk: '天',
      sub: 'direction',
      diamond: 'gold',
    },
    order: {
      r: 0.2,
      member: { id: 'order', label: 'The Order', diamond: 'blue', theta: 270 },
    },
    devEnv: {
      r: 0.39,
      members: [
        ['agents', 'Project agents'],
        ['memory', 'Memory'],
        ['tools', 'Tools'],
        ['models', 'Models'],
      ].map(([id, label], i) => ({
        id: dossiers['system-' + id] ? 'system-' + id : id,
        label,
        diamond: id === 'agents' ? 'blue' : 'red',
        theta: [0, 90, 180, 270][i],
      })),
    },
    projects: { r: 0.64, leadDeg: 0, members: projects },
    territoryR: 0.88,
    dossiers,
  };
}
