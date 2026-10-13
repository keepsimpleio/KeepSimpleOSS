/* The Article and Ladder tabs of the Atlas. Their words come from
   readings.json, which scripts/ai-atlas/strip-readings.mjs writes from the
   source pages; this file only draws them. The board under the article and
   the climb on the ladder keep the behaviour of the source pages: the board
   builds up in nine steps, the climb reveals row by row as it scrolls in,
   and a rung opens its detail in a modal. */
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type Run = { t: string; m?: 'key' | 'see' };
type Rung = {
  n: number;
  stage: string;
  title: string;
  sub: string;
  was?: string;
  think?: string;
  skill?: string;
  text?: string[];
  tools?: string[];
};
export type Readings = {
  article: {
    lead: Run[];
    paras: Run[][];
    board: { steps: string[]; tips: Record<string, string> };
  };
  ladder: {
    stages: { id: string; label: string }[];
    tracks: { think: string; skill: string };
    perspective?: { was: string; think: string };
    toolsLabel: string;
    closing: string;
    rungs: Rung[];
  };
};

const still = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const runs = (list: Run[]) =>
  list.map((r, i) =>
    r.m ? (
      <mark key={i} className={r.m}>
        {r.t}
      </mark>
    ) : (
      <React.Fragment key={i}>{r.t}</React.Fragment>
    ),
  );

export function ArticleView({ article }: { article: Readings['article'] }) {
  return (
    <section className="rd-thesis">
      <p className="lead">{runs(article.lead)}</p>
      {article.paras.map((p, i) => (
        <p className="para" key={i}>
          {runs(p)}
        </p>
      ))}
      <DecompBoard board={article.board} />
    </section>
  );
}

/* Decomposition board: nine steps in the order of the article. Every
   element has one fixed place on a 1000x470 stage and fades in or out with
   the step, so the stage never resizes and only what the paragraph adds
   appears. Drawn into the SVG once on mount. */
function DecompBoard({ board }: { board: Readings['article']['board'] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    const stepsBar = stepsRef.current;
    const stage = stageRef.current;
    if (!scroller || !stepsBar || !stage) return;
    return drawBoard(scroller, stepsBar, stage, board);
  }, [board]);

  return (
    <figure className="decomp">
      <div className="d-scroll" ref={scrollRef}>
        <div className="d-steps" ref={stepsRef} />
        <svg className="d-stage" ref={stageRef} viewBox="0 0 1000 470" />
      </div>
    </figure>
  );
}

function drawBoard(
  scroller: HTMLDivElement,
  stepsBar: HTMLDivElement,
  stage: SVGSVGElement,
  board: Readings['article']['board'],
) {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (name: string, attrs: Record<string, any>, parent?: Element) => {
    const n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(k => n.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(n);
    return n as SVGElement;
  };
  const STEPS = board.steps;
  const TIPS = board.tips;
  const LAST = STEPS.length;
  const TH = 44,
    Y = 236,
    CY = 258;
  const RUN_W = 112,
    EV_W = 64;
  const RX: Record<string, number> = { a: 140, b: 348, c: 556 };
  const EX: Record<string, number> = { a: 260, b: 468, c: 676 };
  const CH_X = 764,
    CH_W = 104,
    OUT_X = 892,
    OUT_W = 108;
  /* The whole context inventory across the top, and what each run's own
     window receives from it. */
  const INV = [
    { id: 'brief', label: 'Task brief' },
    { id: 'raw', label: 'Raw source' },
    { id: 'files', label: 'Files' },
    { id: 'tools', label: 'Tool output' },
    { id: 'logs', label: 'Logs' },
    { id: 'notes', label: 'Notes' },
  ];
  const INV_X: Record<string, number> = {};
  INV.forEach((s, i) => {
    INV_X[s.id] = 15 + i * 164;
  });
  const ROW_SRC: Record<string, string[]> = {
    a: ['brief', 'raw'],
    b: ['files'],
    c: ['brief', 'logs'],
  };
  const WIN: Record<string, string[]> = {
    a: ['Task brief', 'Raw source'],
    b: ['Output of A', 'Files'],
    c: ['Output of B', 'Task brief', 'Logs'],
  };
  const FX: Record<string, number> = {
    a: RX.a - 42,
    b: RX.b - 42,
    c: RX.c - 42,
  };
  const FY = 80,
    FW = 196,
    FH = 100;

  stage.textContent = '';
  stepsBar.textContent = '';
  const defs = el('defs', {}, stage);
  const pat = el(
    'pattern',
    { id: 'd-dots', width: 24, height: 24, patternUnits: 'userSpaceOnUse' },
    defs,
  );
  el('circle', { cx: 1, cy: 1, r: 1, fill: 'rgba(42, 42, 42, 0.16)' }, pat);
  el(
    'rect',
    { x: 0, y: 0, width: 1000, height: 470, fill: 'url(#d-dots)' },
    stage,
  );
  const gBack = el('g', {}, stage);
  const gLinks = el('g', {}, stage);
  const gDrops = el('g', {}, stage);
  const gTiles = el('g', {}, stage);

  const items: { node: SVGElement; from: number; until: number }[] = [];
  let current = 1,
    picked = 'a';
  const tipFor = (label: string, g: SVGElement) => {
    if (g.classList.contains('src')) {
      return g.classList.contains('is-off')
        ? 'The selected run never sees this. That is the point of routing.'
        : 'A piece of context. Routing decides which runs get it and which never see it.';
    }
    if (g.classList.contains('chip')) {
      return /^Output of/.test(label)
        ? label.replace('Output of ', 'The result of Run ') +
            ', routed in as this run’s input.'
        : 'Routed into this window. The run sees this and nothing else.';
    }
    if (label === 'Output')
      return current === 1
        ? 'The window is too full, so the result gets worse. That is context rot.'
        : 'The finished result of the whole chain.';
    if (label === 'You')
      return g.dataset.bottom
        ? 'You step in only for the real decisions.'
        : 'You decide which run goes next and what it sees.';
    return TIPS[label] || '';
  };
  /* One-line tips on hover, focus or tap, ordered for this board on
     2026-10-10. copy-gate: wolf-asked "on-hover oneliners explaining stuff" */
  const tipBox = document.createElement('div');
  tipBox.className = 'd-tip';
  tipBox.setAttribute('aria-hidden', 'true');
  scroller.appendChild(tipBox);
  const showTip = (node: SVGElement, label: string) => {
    const text = tipFor(label, node);
    if (!text) return;
    tipBox.textContent = text;
    const box = scroller.getBoundingClientRect(),
      r = node.getBoundingClientRect();
    const w = tipBox.offsetWidth,
      h = tipBox.offsetHeight;
    let left = r.left - box.left + scroller.scrollLeft + r.width / 2 - w / 2;
    left = Math.max(0, Math.min(left, scroller.scrollWidth - w));
    let top = r.top - box.top - h - 8;
    if (top < 0) top = r.bottom - box.top + 8;
    tipBox.style.left = Math.round(left) + 'px';
    tipBox.style.top = Math.round(top) + 'px';
    tipBox.classList.add('is-on');
  };
  const hideTip = () => tipBox.classList.remove('is-on');
  const withTip = (node: SVGElement, label: string) => {
    node.addEventListener('pointerenter', () => showTip(node, label));
    node.addEventListener('pointerleave', hideTip);
    node.addEventListener('focus', () => showTip(node, label));
    node.addEventListener('blur', hideTip);
    node.addEventListener('click', () => showTip(node, label));
    return node;
  };
  const span = (node: SVGElement, from: number, until?: number) => {
    node.classList.add('d-el');
    items.push({ node, from, until: until || LAST });
    return node;
  };
  const tile = (
    x: number,
    y: number,
    w: number,
    label: string,
    cls: string,
    from: number,
    until?: number,
    h?: number,
  ) => {
    const g = el('g', { class: 'd-tile ' + cls }, gTiles);
    /* Each kind has its own shape: pills for actors and checks, sharp code. */
    const rx = /\b(actor|eval)\b/.test(cls) ? 22 : /\bcode\b/.test(cls) ? 0 : 4;
    el('rect', { x, y, width: w, height: h || TH, rx }, g);
    const t = el(
      'text',
      {
        x: x + w / 2,
        y: y + (h || TH) / 2,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
      },
      g,
    );
    t.textContent = label;
    withTip(g, label);
    return span(g, from, until);
  };
  const link = (
    d: string,
    cls: string,
    from: number,
    until?: number,
    parent?: SVGElement,
  ) =>
    span(
      el('path', { d, class: 'd-link ' + (cls || '') }, parent || gLinks),
      from,
      until,
    );
  const label = (
    x: number,
    y: number,
    text: string,
    from: number,
    until?: number,
  ) => {
    const t = span(el('text', { x, y, class: 'd-label' }, gBack), from, until);
    t.textContent = text;
    return t;
  };
  const line = (x1: number, x2: number, from: number, until?: number) =>
    link('M' + x1 + ' ' + CY + ' L' + x2 + ' ' + CY, 'main', from, until);
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };
  const drop = (x1: number, y1: number, x2: number, y2: number) => {
    const my = (y1 + y2) / 2;
    return `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  };
  const arc = (x1: number, x2: number, top: number) =>
    `M${x1} ${Y} C${x1} ${top}, ${x2} ${top}, ${x2} ${Y}`;

  /* 1. Context window: one run, and everything the task touched piled into
     one window. */
  span(
    el(
      'rect',
      { x: 180, y: 72, width: 560, height: 338, rx: 4, class: 'd-frame' },
      gBack,
    ),
    1,
    1,
  );
  withTip(label(180, 60, 'Context window', 1, 1), 'Context window');
  (
    [
      [200, 92, 'Task brief'],
      [570, 92, 'Raw source'],
      [200, 152, 'Files'],
      [570, 152, 'Tool output'],
      [200, 300, 'Old answers'],
      [390, 300, 'Notes'],
      [580, 300, 'Logs'],
    ] as [number, number, string][]
  ).forEach(c => tile(c[0], c[1], 150, c[2], 'ctx', 1, 1, 40));
  (
    [
      [640, 392, 'More files'],
      [420, 426, 'More logs'],
    ] as [number, number, string][]
  ).forEach(c => tile(c[0], c[1], 150, c[2], 'ctx lost', 1, 1, 40));
  tile(404, Y, RUN_W, 'Run', 'run', 1, 1);
  line(124, 404, 1, 1);
  line(516, OUT_X, 1, 1);

  /* Who starts the work: you, until a program takes that role. */
  tile(0, Y, 124, 'You', 'actor', 1, 7);
  tile(0, Y, 124, 'Orchestrator', 'actor orch', 8);
  const out = tile(OUT_X, Y, OUT_W, 'Output', 'out', 1);

  /* 2. Runs: one run's output becomes the next run's input. */
  const picks: Record<string, SVGElement[]> = { a: [], b: [], c: [] };
  picks.a.push(tile(RX.a, Y, RUN_W, 'Run A', 'run pick', 2));
  picks.b.push(tile(RX.b, Y, RUN_W, 'Run B', 'run pick', 2, 4));
  picks.c.push(tile(RX.c, Y, RUN_W, 'Run C', 'run pick', 2, 5));
  line(124, RX.a, 2);
  line(RX.a + RUN_W, RX.b, 2, 3);
  line(RX.b + RUN_W, RX.c, 2, 3);
  line(RX.c + RUN_W, OUT_X, 2, 3);

  /* 3. Context routing: the whole inventory on top, and each run's own
     window holding only what was routed in. */
  const srcTiles: Record<string, SVGElement> = {};
  INV.forEach(s => {
    srcTiles[s.id] = tile(INV_X[s.id], 4, 150, s.label, 'src', 3, LAST, 40);
  });
  const frames: Record<string, SVGElement> = {};
  const drops: Record<string, SVGElement[]> = { a: [], b: [], c: [] };
  ['a', 'b', 'c'].forEach(r => {
    /* The windows appear empty on the Runs step, filled on Context routing. */
    frames[r] = span(
      el(
        'rect',
        { x: FX[r], y: FY, width: FW, height: FH, rx: 4, class: 'd-win' },
        gBack,
      ),
      2,
    );
    label(FX[r], FY - 8, 'Context of ' + r.toUpperCase(), 2);
    WIN[r].forEach((name, k) =>
      tile(FX[r] + 12, FY + 12 + k * 30, FW - 24, name, 'chip', 3, LAST, 24),
    );
    link(`M${RX[r] + 56} ${FY + FH} L${RX[r] + 56} ${Y}`, 'main', 2);
    ROW_SRC[r].forEach(sid => {
      drops[r].push(
        link(
          drop(INV_X[sid] + 75, 44, FX[r] + FW / 2, FY),
          'flow',
          3,
          LAST,
          gDrops,
        ),
      );
    });
  });
  /* A run's result arrives in the next window as its input. */
  link(drop(RX.a + RUN_W, Y, FX.b + 12, FY + 24), 'hand', 2);
  link(drop(RX.b + RUN_W, Y, FX.c + 12, FY + 24), 'hand', 2);

  /* 4. Evals: one per step and one on the whole chain. */
  tile(EX.a, Y, EV_W, 'Eval', 'eval', 4);
  tile(EX.b, Y, EV_W, 'Eval', 'eval', 4, 4);
  tile(EX.c, Y, EV_W, 'Eval', 'eval', 4);
  tile(CH_X, Y, CH_W, 'Chain eval', 'eval', 4);
  line(RX.a + RUN_W, EX.a, 4);
  line(EX.a + EV_W, RX.b, 4);
  line(RX.b + RUN_W, EX.b, 4);
  line(EX.b + EV_W, RX.c, 4);
  line(RX.c + RUN_W, EX.c, 4);
  line(EX.c + EV_W, CH_X, 4);
  line(CH_X + CH_W, OUT_X, 4);

  /* 5. Code: the step that turned routine is code now, checked by a test. */
  picks.b.push(tile(RX.b, Y, RUN_W, 'Code', 'code pick', 5));
  tile(EX.b, Y, EV_W, 'Test', 'eval', 5);

  /* 6. Benchmarks: a different vendor on step C, and a second model next
     to it. */
  picks.c.push(tile(RX.c, Y, RUN_W, 'Other vendor', 'run pick', 6));
  tile(RX.c, 292, RUN_W, 'Second model', 'run', 6);
  link(curve(EX.b + EV_W, CY, RX.c, 314), 'main', 6);
  link(curve(RX.c + RUN_W, 314, EX.c, CY), 'main', 6);

  /* 7. Memory: only what passed an eval is written; runs read it. */
  tile(140, 380, 600, 'Memory', 'mem', 7);
  [EX.a, EX.b, EX.c].forEach(x =>
    link(`M${x + EV_W / 2} ${Y + TH} L${x + EV_W / 2} 380`, 'mem', 7),
  );
  link(`M${RX.a + 30} 380 L${RX.a + 30} ${Y + TH}`, 'mem hand', 7);
  link(`M${RX.c + 30} 380 L${RX.c + 30} 336`, 'mem hand', 7);

  /* 8. Orchestrator: agents call each other, an eval pushes back, you step
     in for real decisions. */
  link(arc(EX.a + EV_W / 2, RX.a + 90, 192), 'hand back', 8);
  link(arc(EX.c + EV_W / 2, RX.c + 90, 192), 'hand back', 8);
  tile(0, 400, 124, 'You', 'actor', 8).dataset.bottom = '1';
  link(`M62 400 L62 ${Y + TH}`, 'hand you', 8);

  /* 9. Autonomy: the system runs on its own; its output comes back to you
     as the next batch of tasks. */
  link(
    `M${OUT_X + OUT_W / 2} ${Y + TH} C${OUT_X + OUT_W / 2} 470, 62 470, 62 444`,
    'hand loop',
    9,
  );

  const pick = (id: string) => {
    picked = id;
    Object.keys(picks).forEach(r => {
      const on = r === id && current >= 3;
      picks[r].forEach(g => {
        g.classList.toggle('is-on', on);
        g.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      drops[r].forEach(p => p.classList.toggle('is-on', on));
      frames[r].classList.toggle('is-on', on);
    });
    INV.forEach(s =>
      srcTiles[s.id].classList.toggle(
        'is-off',
        current >= 3 && ROW_SRC[id].indexOf(s.id) < 0,
      ),
    );
  };
  const stepButtons: HTMLButtonElement[] = [];
  const setStep = (n: number) => {
    current = n;
    hideTip();
    items.forEach(it => {
      const vis = n >= it.from && n <= it.until;
      it.node.classList.toggle('is-hidden', !vis);
      /* What this step adds stays marked while the step is shown. */
      it.node.classList.toggle('is-new', vis && n > 1 && it.from === n);
      if (it.node.classList.contains('pick'))
        it.node.setAttribute('tabindex', vis && n >= 3 ? '0' : '-1');
    });
    out.classList.toggle('is-rot', n === 1);
    stage.classList.toggle('no-pick', n < 3);
    stage.classList.toggle('is-auto', n === LAST);
    stepButtons.forEach((b, i) =>
      b.setAttribute('aria-pressed', i + 1 === n ? 'true' : 'false'),
    );
    pick(picked);
  };
  STEPS.forEach((text, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'd-step';
    b.textContent = text;
    b.addEventListener('click', () => setStep(i + 1));
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const j = Math.min(
        LAST,
        Math.max(1, current + (e.key === 'ArrowRight' ? 1 : -1)),
      );
      stepButtons[j - 1].focus();
      setStep(j);
    });
    stepsBar.appendChild(b);
    stepButtons.push(b);
  });
  Object.keys(picks).forEach(r => {
    picks[r].forEach(g => {
      g.setAttribute('role', 'button');
      g.addEventListener('click', () => {
        if (current >= 3) pick(r);
      });
      g.addEventListener('keydown', (e: Event) => {
        const k = (e as KeyboardEvent).key;
        if ((k === 'Enter' || k === ' ') && current >= 3) {
          e.preventDefault();
          pick(r);
        }
      });
    });
  });
  setStep(1);

  return () => {
    stage.textContent = '';
    stepsBar.textContent = '';
    tipBox.remove();
  };
}

/* Ladder: the climb, and a level's detail in a modal when its tile is
   clicked. The climb is rendered once and never re-rendered, so the reveal
   classes set on its rows stay where the observer put them. */
export function LadderView({ ladder }: { ladder: Readings['ladder'] }) {
  const modal = useRef<{ open: (n: number) => void }>(null);
  return (
    <section className="rd-ladder">
      <Climb ladder={ladder} onOpen={n => modal.current?.open(n)} />
      <p className="l-close">{ladder.closing}</p>
      <LevelModal ref={modal} ladder={ladder} />
    </section>
  );
}

const Climb = memo(function Climb({
  ladder,
  onOpen,
}: {
  ladder: Readings['ladder'];
  onOpen: (n: number) => void;
}) {
  const climbRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const stageOf: Record<number, string> = {};
  ladder.rungs.forEach(r => {
    stageOf[r.n] = r.stage;
  });

  useEffect(() => {
    const wrap = climbRef.current;
    const climb = listRef.current;
    if (!wrap || !climb) return;
    /* The rail runs from the first node centre to the last; the red route
       over it climbs to the newest rung shown. Offsets are summed up to the
       list and ignore transforms, so rows still rising measure where they
       will land. */
    const cNodes = Array.from(climb.querySelectorAll<HTMLElement>('.c-n'));
    const cRows = cNodes.map(n => n.closest('.c-rung') as HTMLElement);
    let cTop = -1;
    const mid = (el: HTMLElement) => {
      let y = el.offsetHeight / 2;
      for (
        let x: HTMLElement | null = el;
        x && x !== climb;
        x = x.offsetParent as HTMLElement | null
      )
        y += x.offsetTop;
      return y;
    };
    const placeRail = () => {
      if (!cNodes.length) return;
      const a = mid(cNodes[0]),
        z = mid(cNodes[cNodes.length - 1]);
      climb.style.setProperty('--rail-top', Math.round(a) + 'px');
      climb.style.setProperty(
        '--rail-h',
        Math.max(0, Math.round(z - a)) + 'px',
      );
      climb.style.setProperty(
        '--route',
        cTop < 0
          ? '0'
          : ((mid(cNodes[cTop]) - a) / Math.max(1, z - a)).toFixed(4),
      );
    };
    const showRow = (li: HTMLElement) => {
      li.classList.add('is-in');
      const k = cRows.indexOf(li);
      if (k <= cTop) return;
      if (cTop >= 0) cRows[cTop].classList.remove('is-top');
      cTop = k;
      li.classList.add('is-top');
      placeRail();
    };
    const reveal = (li: HTMLElement) =>
      li.classList.contains('c-rung') ? showRow(li) : li.classList.add('is-in');
    /* Rows reveal as they scroll into view; without motion or without an
       observer every row is shown at once. */
    const items = Array.from(climb.children) as HTMLElement[];
    let io: IntersectionObserver | null = null;
    if (still() || !('IntersectionObserver' in window)) {
      items.forEach(reveal);
    } else {
      wrap.classList.add('is-armed');
      io = new IntersectionObserver(
        entries => {
          entries.forEach(en => {
            if (!en.isIntersecting) return;
            io?.unobserve(en.target);
            reveal(en.target as HTMLElement);
          });
        },
        { rootMargin: '0px 0px -15% 0px' },
      );
      items.forEach(li => io!.observe(li));
    }
    const onClick = (e: MouseEvent) => {
      const go = (e.target as HTMLElement).closest<HTMLElement>('.c-go');
      if (go) onOpenRef.current(Number(go.dataset.n));
    };
    climb.addEventListener('click', onClick);
    window.addEventListener('resize', placeRail);
    placeRail();
    /* Webfonts change line heights once they land, so the rail is measured
       again. */
    let alive = true;
    document.fonts?.ready.then(() => alive && placeRail());
    return () => {
      alive = false;
      io?.disconnect();
      climb.removeEventListener('click', onClick);
      window.removeEventListener('resize', placeRail);
    };
  }, []);

  const wing = (side: 'think' | 'skill', r: Rung) => {
    if (!r[side]) return <div className={'c-w is-' + side} />;
    /* On the first row only, two labels say which belief is wrong and
       which is right. */
    const guide =
      side === 'think' && r.was && ladder.perspective && r === ladder.rungs[0];
    return (
      <div className={'c-w is-' + side}>
        <span className="c-lab">{ladder.tracks[side]}</span>
        {guide && <p className="c-pl">{ladder.perspective!.was}</p>}
        {side === 'think' && r.was && (
          <p className="c-was">
            <span>{r.was}</span>
          </p>
        )}
        {guide && <p className="c-pl is-right">{ladder.perspective!.think}</p>}
        <p className="c-x">{r[side]}</p>
        <span className="c-bar" aria-hidden="true">
          {ladder.rungs
            .filter(q => q.n <= r.n)
            .map(q => (
              <span
                key={q.n}
                className={
                  'c-b is-' + stageOf[q.n] + (q.n === r.n ? ' is-now' : '')
                }
                style={{ ['--k' as any]: q.n }}
              />
            ))}
        </span>
      </div>
    );
  };

  let ci = 0;
  return (
    <div className="climb" ref={climbRef}>
      <div className="c-heads">
        <p className="c-h is-think">{ladder.tracks.think}</p>
        <span />
        <p className="c-h is-skill">{ladder.tracks.skill}</p>
      </div>
      <ol className="c-list" ref={listRef}>
        {ladder.stages.map(st => (
          <React.Fragment key={st.id}>
            <li
              className={'c-head is-' + st.id}
              style={{ ['--i' as any]: ci++ }}
            >
              <span>{st.label}</span>
            </li>
            {ladder.rungs
              .filter(r => r.stage === st.id)
              .map(r => {
                const inner = (
                  <>
                    <span className="c-n">LVL {r.n}</span>
                    <span className="c-t">{r.title}</span>
                  </>
                );
                return (
                  <li
                    key={r.n}
                    className={'c-rung is-' + r.stage}
                    style={{ ['--i' as any]: ci++ }}
                  >
                    {wing('think', r)}
                    {r.text ? (
                      <button
                        type="button"
                        className="c-spine c-go"
                        data-n={r.n}
                      >
                        {inner}
                      </button>
                    ) : (
                      <div className="c-spine">{inner}</div>
                    )}
                    {wing('skill', r)}
                  </li>
                );
              })}
          </React.Fragment>
        ))}
      </ol>
    </div>
  );
});

/* The modal fades and rises in, fades out, and closes on Esc, the close
   button or a click outside. */
const LevelModal = forwardRef<
  { open: (n: number) => void },
  { ladder: Readings['ladder'] }
>(function LevelModal({ ladder }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [n, setN] = useState<number | null>(null);
  const [out, setOut] = useState(false);
  const r = n == null ? null : ladder.rungs.find(x => x.n === n) || null;

  useImperativeHandle(ref, () => ({
    open: (next: number) => {
      const d = dialog.current;
      if (!d || !d.showModal) return;
      setOut(false);
      setN(next);
      if (!d.open) d.showModal();
      d.scrollTop = 0;
      body.current?.focus({ preventScroll: true });
    },
  }));

  const close = () => {
    const d = dialog.current;
    if (!d || !d.open || out) return;
    if (still()) {
      d.close();
      return;
    }
    setOut(true);
  };

  return (
    <dialog
      className={
        'l-modal' +
        (r?.stage === 'orch' ? ' is-orch' : '') +
        (out ? ' is-out' : '')
      }
      ref={dialog}
      aria-labelledby="l-m-title"
      onCancel={e => {
        e.preventDefault();
        close();
      }}
      onClick={e => {
        if (e.target === dialog.current) close();
      }}
      onAnimationEnd={e => {
        if (e.target !== dialog.current || !out) return;
        setOut(false);
        dialog.current?.close();
      }}
    >
      <button
        type="button"
        className="l-m-close"
        aria-label="Close"
        onClick={close}
      />
      <div className="l-m-body" ref={body} tabIndex={-1}>
        {r && r.text && (
          <>
            <p className="l-num">LVL {r.n}</p>
            <h2 className="l-title" id="l-m-title">
              {r.title}
            </h2>
            <p className="l-sub">{r.sub}</p>
            <div className="l-text">
              {r.text.map((s, i) => (
                <p key={i}>{s}</p>
              ))}
            </div>
            {r.tools && (
              <div className="l-tools">
                <p className="l-tools-h">{ladder.toolsLabel}</p>
                <ul>
                  {r.tools.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </dialog>
  );
});
