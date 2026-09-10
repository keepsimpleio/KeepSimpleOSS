import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { adaptGuide, copy } from '@lib/aiAtlas/adapter';
import { securityPassage, securityRadii } from '@lib/aiAtlas/securityPassage';

import SeoGenerator from '@components/SeoGenerator';

const VIEW = 1500;
const HALF = VIEW / 2;
const TOP_PAD = 20;
const BOT_PAD = -20;
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
// The Atlas content, served from this site rather than the Terminal's frame.
const dataUrlFor = (_lang: Lang) => '/ai-atlas/guide.json';

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

const STRINGS = { en: copy };

type T = (typeof STRINGS)['en'];

/* ---------- diamond ---------- */
function Diamond({ kind = 'red' }: { kind?: string }) {
  const cls = [
    'dmd',
    kind === 'blue'
      ? 'blue'
      : kind === 'gold'
        ? 'gold'
        : kind === 'subagent'
          ? 'subagent'
          : '',
  ]
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
          role="button"
          tabIndex={0}
          aria-label={node.label}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(node.id);
            }
          }}
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

/* ---------- public internet globe ---------- */

function GlobeMark({ x, y, label, dim }: any) {
  const r = 21;
  const lat = r * 0.5;
  const latW = r * 0.866;
  return (
    <g className={'globe-mark' + (dim ? ' is-dim' : '')} aria-hidden="true">
      <circle cx={x} cy={y} r={r} fill="var(--paper)" />
      <ellipse cx={x} cy={y} rx={r * 0.45} ry={r} fill="none" />
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x - latW} y1={y - lat} x2={x + latW} y2={y - lat} />
      <line x1={x - latW} y1={y + lat} x2={x + latW} y2={y + lat} />
      <text
        x={x - r - 11}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        className="globe-mark__label"
      >
        {label}
      </text>
    </g>
  );
}

/* Telegram paper-plane relay marker, sits on the globe → receptionist wire. */
function TelegramMark({ x, y, label, dim }: any) {
  return (
    <g className={'telegram-mark' + (dim ? ' is-dim' : '')} aria-hidden="true">
      <title>Telegram</title>
      <circle cx={x} cy={y} r={16} fill="var(--paper)" />
      <path
        className="telegram-mark__plane"
        d={`M ${x + 8} ${y - 6}
            L ${x - 8.5} ${y + 1}
            L ${x - 3} ${y + 3.2}
            L ${x - 1.6} ${y + 7.4}
            L ${x + 0.8} ${y + 4.6}
            L ${x + 4.6} ${y + 6.4}
            Z`}
      />
      <text
        x={x - 16 - 9}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        className="telegram-mark__label telegram-mark__label--sm"
      >
        {label}
      </text>
    </g>
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

/* A card's prose is one or more paragraphs separated by a blank line. */
function DossierDesc({ desc }: { desc: string }) {
  if (!desc) return null;
  const paragraphs = String(desc)
    .split(/\n{2,}/)
    .filter(Boolean);
  return (
    <div className="dossier__desc">
      {paragraphs.map((para, i) => (
        <p key={i}>{renderDossierValue(para)}</p>
      ))}
    </div>
  );
}

function DossierRows({ rows, onSelect, dossiers }: any) {
  const validIds = useMemo(
    () => new Set(Object.keys(dossiers || {})),
    [dossiers],
  );
  return (
    <ul className="kv">
      {rows.map((r: any, i: number) => {
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
              role={refId ? 'button' : undefined}
              tabIndex={refId ? 0 : undefined}
              onKeyDown={e => {
                if (refId && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelect(refId);
                }
              }}
            >
              {r.cls === 'red' && <Diamond kind="red" />}
              {r.cls === 'blue' && <Diamond kind="blue" />}
              {r.cls === 'gold' && <Diamond kind="gold" />}
              {r.cls === 'subagent' && <Diamond kind="subagent" />}
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
  );
}

/* The card that opens on click. It stays mounted through its exit so the
   fade out plays; the id it holds survives a focus change so the content
   crossfades in place when a topic inside it is chosen. */
const MODAL_EXIT_MS = 240;
function FeatureModal({ id, dossiers, onSelect, onClose, t }: any) {
  const [held, setHeld] = useState<string | null>(id);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (id && dossiers && dossiers[id]) {
      setHeld(id);
      setClosing(false);
      return;
    }
    if (!held) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setHeld(null);
      setClosing(false);
    }, MODAL_EXIT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dossiers]);
  useEffect(() => {
    if (!held || closing) return;
    cardRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [held, closing, onClose]);
  if (!held || !dossiers || !dossiers[held]) return null;
  const data = dossiers[held];
  return (
    <div
      className={'feature-modal' + (closing ? ' is-closing' : '')}
      role="presentation"
    >
      <div className="feature-modal__scrim" onClick={onClose} />
      <div
        className="feature-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-modal-title"
        tabIndex={-1}
        ref={cardRef}
      >
        <span className="panel__title" id="feature-modal-title" key={held}>
          {data.title} {data.cjk && <span className="cjk">{data.cjk}</span>}
        </span>
        <button
          type="button"
          className="feature-modal__close"
          aria-label={t.modalCloseLabel}
          onClick={onClose}
        >
          ×
        </button>
        <div className="feature-modal__body" key={'b-' + held}>
          <DossierDesc desc={data.desc} />
          <DossierRows
            rows={data.rows || []}
            onSelect={onSelect}
            dossiers={dossiers}
          />
        </div>
        <div className="feature-modal__hint">{t.modalHint}</div>
      </div>
    </div>
  );
}

function Dossier({ data, onSelect, dossiers }: any) {
  return (
    <div className="panel panel--dossier">
      <span className="panel__corner-mark">印</span>
      <span className="panel__title" key={'t-' + data.title}>
        {data.title} <span className="cjk">{data.cjk}</span>
      </span>
      <div className="dossier__body" key={data.title}>
        <DossierDesc desc={data.desc} />
        {data.link && (
          <div className="dossier__desc">
            <a
              className="dossier__link"
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.linkLabel || data.link}
            </a>
          </div>
        )}
        <DossierRows rows={data.rows} onSelect={onSelect} dossiers={dossiers} />
      </div>
    </div>
  );
}

function buildIntroDossier(data: any, _now: Date, t: T) {
  return {
    title: t.introDossierTitle,
    cjk: t.introDossierCjk,
    desc: t.introStoryBody,
    rows: [
      {
        k: 'reading',
        v: 'START at Project. Arrows run clockwise to Result. Selecting a stage reveals its supporting mechanisms.',
      },
      { k: 'evidence', v: t.principles[0] },
    ],
  };
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
            <Diamond kind="subagent" />
            {t.legendSubAgentLabel}
          </span>
          <span className="v">{t.legendSubAgentDesc}</span>
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
      <div className="terminal-doctrine" aria-hidden="true">
        <span>守</span>
        <small>AUTHORITY &amp; EVIDENCE</small>
      </div>
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
  const pending = useRef(false);
  const change = (next: ViewMode) => {
    if (next === mode || pending.current) return;
    pending.current = true;
    const stage = document.querySelector('.view-stage');
    stage?.classList.add('is-leaving');
    setTimeout(
      () => {
        setMode(next);
        stage?.classList.remove('is-leaving');
        pending.current = false;
      },
      matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 240,
    );
  };
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
        onClick={() => change('environment')}
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
        onClick={() => change('security')}
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
  const ringRs = securityRadii;
  const passageRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = passageRef.current;
    if (!svg) return;
    const dot = svg.querySelector('.security-pulse');
    const rings = svg.querySelectorAll<SVGCircleElement>('.ring__circle');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      start = 0;
    const paint = (now: number) => {
      const state = securityPassage(now - start);
      dot?.setAttribute('cy', String(state.cy));
      dot?.setAttribute('opacity', String(state.opacity));
      rings.forEach((ring, i) =>
        ring.style.setProperty('--security-passage', String(state.rings[i])),
      );
      frame = requestAnimationFrame(paint);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      rings.forEach(ring => ring.style.setProperty('--security-passage', '0'));
      dot?.setAttribute('opacity', '0');
      if (!media.matches) {
        start = performance.now();
        frame = requestAnimationFrame(paint);
      }
    };
    reset();
    media.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener('change', reset);
    };
  }, []);
  const radius = (r: number) => (r * VS) / 2;
  const layers = t.securityLayers;
  return (
    <svg
      ref={passageRef}
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

      {/* Dot and ring illumination share one trajectory clock. */}
      <circle
        r="6"
        cy="-712.5"
        opacity="0"
        fill="var(--red)"
        className="security-pulse"
      />
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
      data-layer={layer.n}
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

export function AiAtlasApp({
  initialGuide = null,
  initialView = 'environment',
  initialFocus = null,
}: any = {}) {
  const lang: Lang = 'en';
  const [data, setData] = useState<any>(() =>
    initialGuide ? adaptGuide(initialGuide) : null,
  );
  const t = data?.copy || copy;
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [now] = useState<Date>(() => new Date());
  const [focusedNode, setFocusedNode] = useState<string | null>(initialFocus);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [linkHoverNode, setLinkHoverNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
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
            setData(adaptGuide(d));
            setFetchError(null);
          }
        })
        .catch(e => {
          if (!cancelled) setFetchError(String(e.message || e));
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const metrics = null;
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
    if (data.reception) {
      const n = data.reception.member;
      const p = POL(data.reception.r, n.theta);
      m[n.id] = { ...p, ring: 'outside', node: n };
      // Globe sits further out on the same radial, so globe → reception →
      // wolf reads as a single straight line from the public internet inward.
      m['globe'] = { ...POL(data.reception.globeR, n.theta), ring: 'outside' };
      m['tg-relay'] = {
        ...POL((data.reception.r + data.reception.globeR) / 2, n.theta),
        ring: 'outside',
      };
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

  const closeModal = () => {
    setLinkHoverNode(null);
    setFocusedNode(null);
  };

  const selectedStage = data.projects.members.find(
    (p: any) =>
      p.id === highlightId || p.id === data.topicToStage[highlightId || ''],
  );
  const highlight = new Set<string>(highlightId ? [highlightId] : []);
  if (selectedStage) {
    highlight.add(selectedStage.id);
    for (const node of selectedStage.children) highlight.add(node.id);
    for (const id of selectedStage.support) highlight.add(id);
    highlight.add('ring:projects');
    highlight.add('ring:territories');
  }

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
          <span className="meta-label">TERMINAL DOCUMENTATION</span>
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
                  return ringMeta
                    .filter(rm => rm.key !== 'projects')
                    .map(rm => {
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

                {data.reception && (
                  <>
                    <Spoke
                      from={points['globe']}
                      to={points['reception']}
                      kind="advisory"
                      dim={isDim('reception')}
                      glow={spokeGlow('reception', 'wolf')}
                    />
                    <Spoke
                      from={points['reception']}
                      to={points['wolf']}
                      kind="auth"
                      dim={isDim('reception') || isDim('wolf')}
                      glow={spokeGlow('reception', 'wolf')}
                    />
                  </>
                )}

                <defs>
                  <marker
                    id="task-arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--red)" />
                  </marker>
                </defs>
                <g
                  className="task-route"
                  aria-label="Project to Result, clockwise"
                >
                  {data.projects.members
                    .slice(0, -1)
                    .map((p: any, i: number) => {
                      const r = data.projects.r * HALF,
                        start = p.theta + 16,
                        end = p.theta + 44;
                      const a = POL(data.projects.r, start),
                        b = POL(data.projects.r, end);
                      const active =
                        selectedStage?.id === p.id ||
                        (i === 4 &&
                          selectedStage?.id === data.projects.members[5].id);
                      return (
                        <path
                          key={p.id}
                          data-route-from={p.id}
                          data-route-to={data.projects.members[i + 1].id}
                          className={
                            'task-route-segment' + (active ? ' is-current' : '')
                          }
                          d={`M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`}
                          markerEnd="url(#task-arrow)"
                        />
                      );
                    })}
                </g>
                {data.projects.members.map((p: any) => (
                  <g
                    key={'support-' + p.id}
                    className={
                      'stage-support' +
                      (selectedStage?.id === p.id ? ' is-current' : '')
                    }
                    aria-hidden="true"
                  >
                    {p.support.map((id: string) => (
                      <Spoke
                        key={id}
                        from={points[id]}
                        to={points[p.id]}
                        kind="advisory"
                        glow={true}
                        dim={false}
                      />
                    ))}
                  </g>
                ))}

                {data.projects.members
                  .filter((p: any) => p.leadDiamond)
                  .map((p: any) => (
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
                        dim={!selectedStage || selectedStage.id !== p.id}
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

                {data.reception && (
                  <>
                    <GlobeMark
                      x={points['globe'].x}
                      y={points['globe'].y}
                      label={t.publicInternetLabel}
                      dim={isDim('reception')}
                    />
                    <TelegramMark
                      x={points['tg-relay'].x}
                      y={points['tg-relay'].y}
                      label={t.telegramLabel}
                      dim={isDim('reception')}
                    />
                    <NodeBody
                      node={data.reception.member}
                      x={points['reception'].x}
                      y={points['reception'].y}
                      active={focusId === 'reception'}
                      dimmed={isDim('reception')}
                      highlighted={!!highlightId && highlight.has('reception')}
                      hovered={hoverNode === 'reception'}
                      onSelect={onSelect}
                      w={165}
                      h={42}
                    />
                  </>
                )}

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

                {data.projects.members
                  .filter((p: any) => p.id !== 'terminal')
                  .map((p: any) => (
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

                {data.projects.members
                  .filter((p: any) => p.leadDiamond)
                  .map((p: any) => {
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
                  .filter((p: any) => p.id === 'terminal')
                  .map((p: any) => (
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
          <label className="topic-picker">
            Topics
            <select
              value={focusedNode || ''}
              onChange={e => {
                setViewMode('environment');
                setFocusedNode(e.target.value || null);
              }}
            >
              <option value="">The Atlas</option>
              {Object.entries(data.dossiers).map(([id, d]: any) => (
                <option key={id} value={id}>
                  {d.title}
                </option>
              ))}
            </select>
          </label>
          <Dossier
            data={dossier}
            onSelect={onSelect}
            dossiers={data.dossiers}
          />
        </aside>
      </div>

      <FeatureModal
        id={viewMode === 'environment' ? focusedNode : null}
        dossiers={data.dossiers}
        onSelect={onSelect}
        onClose={closeModal}
        t={t}
      />

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
  return (
    <>
      <SeoGenerator
        strapiSEO={{
          title: copy.seoTitle,
          pageTitle: copy.seoTitle,
          seoTitle: copy.seoTitle,
          description: copy.seoDescription,
          keywords: copy.seoKeywords,
        }}
        type="WebPage"
        ogTags={{
          ogTitle: copy.seoTitle,
          ogDescription: copy.seoDescription,
          ogType: 'website',
          ogImageAlt: copy.ogImageAlt,
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
