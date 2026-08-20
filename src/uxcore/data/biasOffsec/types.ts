// Each bias example renders two side-by-side cards: a baseline ("before")
// and the bias-exploiting variant ("after", marked `flagged`). The card
// surface is picked per-bias so the OffSec section never feels like
// "another email". When email is the natural attack surface, use it;
// otherwise pick the surface that matches the threat (push notification,
// chat thread, browser alert, etc.). Add new kinds here as new biases
// arrive.
//
// PLAUSIBILITY BAR (Wolf, 2026-08-19; violated once by the old lottery
// case for neglect-of-probability, never again). Every flagged card must
// pass the "competent target" test: a busy, intelligent adult could
// plausibly act on it on a bad day. Banned in flagged cards: folklore
// scams the world is already vaccinated against (lottery wins, unclaimed
// inheritance, foreign princes, free devices, "you have been selected").
// The lure must be something the target could genuinely expect in that
// channel (an invoice, a sync alert, an IT prompt, a meeting invite, a
// delivery, a settlement claim), with stakes sized to ordinary life, and
// the bias lever must be the ONLY thing doing the persuading. Shipping
// test: would a security-aware colleague admit "on a bad day this could
// get me"? If the honest answer is "only an idiot falls for this", the
// case is not done. A deliberately implausible BEFORE card is fine when
// the bias itself is about what makes the same ask believable.

interface OffsecBiasCardCommon {
  // Caption above the card in the before/after pair. Optional because an
  // interactive `surface` card stands alone and carries no before/after label.
  tag?: string;
  flagged?: boolean;
  // Soft context note rendered above the card body: grounds the reader
  // in prior history when the lever needs it (repetition, a live
  // incident, an earlier seeding message).
  priorContext?: string;
}

export interface OffsecBiasEmailCard extends OffsecBiasCardCommon {
  kind: 'email';
  sender: string;
  timestamp?: string;
  subject: string;
  preview: string;
  attachment?: string;
}

export interface OffsecBiasNotificationCard extends OffsecBiasCardCommon {
  kind: 'notification';
  appName: string;
  timestamp?: string;
  title: string;
  body: string;
}

export interface OffsecBiasChatCard extends OffsecBiasCardCommon {
  kind: 'chat';
  senderName: string;
  senderHandle?: string;
  timestamp?: string;
  body: string;
  // Attached media shown under the bubble (e.g. a meme the payload
  // rides on for humor-effect).
  attachment?: string;
}

// Faux browser tab: used for biases where the attack surface is a web
// page (lookalike domain, sponsored result, fake breach-checker landing).
// The `host` field is split out so we can highlight the deceptive part
// (e.g., the second-level domain) without forcing the data file to ship
// inline markup.
export interface OffsecBiasBrowserCard extends OffsecBiasCardCommon {
  kind: 'browser';
  protocol?: 'https' | 'http';
  host: string;
  path?: string;
  pageHeading: string;
  pageBody: string;
  cta?: string;
}

// Incoming phone call (vishing). `transcript` is what the voice says
// the moment you pick up: rendered as a quoted line over a fake
// accept/decline row.
export interface OffsecBiasCallCard extends OffsecBiasCardCommon {
  kind: 'call';
  callerName: string;
  callerLabel?: string;
  timestamp?: string;
  transcript: string;
}

// Paper-like document surface: an invoice, a signed procedure, a policy
// memo. Generic enough to be the "before" (the rule you signed) or the
// "after" (the invoice that shouldn't be paid).
export interface OffsecBiasDocumentCard extends OffsecBiasCardCommon {
  kind: 'document';
  docLabel: string;
  // Small letterhead glyph (e.g. the llama mascot for bizarreness-effect).
  logo?: string;
  title: string;
  meta?: string;
  body: string;
  footer?: string;
}

// Physical printed poster with a QR code. The QR pattern is decorative
// and drawn by the component: data never ships a scannable code.
export interface OffsecBiasPosterCard extends OffsecBiasCardCommon {
  kind: 'poster';
  heading: string;
  body: string;
  qrCaption?: string;
}

// Vertical sequence of small sightings across days: for biases where
// the lever is the pattern itself (frequency illusion), not any single
// artifact.
export interface OffsecBiasTimelineCard extends OffsecBiasCardCommon {
  kind: 'timeline';
  items: {
    label: string;
    source: string;
    text: string;
    flagged?: boolean;
  }[];
}

// ===========================================================================
// Second-wave surfaces (biases 51-75). These lean structural, not textual:
// the deception lives in a highlighted diff row, a risky permission scope, a
// glowing profile badge, a metric tile, a bar that isn't drawn, a green
// checkmark, a stalled progress step, or a confidence meter. Prose is kept to
// short labels so the *shape* carries the attack, not a paragraph. Reuse the
// original eight surfaces when email/chat/etc. is genuinely the natural
// channel; reach for these when the lever is visual.
// ===========================================================================

// Field-level diff / ledger: labelled rows, one quietly changed. The eye is
// meant to catch (or miss) a single altered value among plausible ones.
export interface OffsecBiasDiffCard extends OffsecBiasCardCommon {
  kind: 'diff';
  label: string;
  rows: {
    field: string;
    value: string;
    // When set, the row reads as "was → value" with the change marked.
    was?: string;
    changed?: boolean;
  }[];
  note?: string;
}

// App / OAuth consent screen: an app header plus a list of permission scopes,
// each a small row. `risky` scopes read crimson; the lever is a dangerous
// scope hiding among mundane ones, or a whole grant waved through.
export interface OffsecBiasPermissionCard extends OffsecBiasCardCommon {
  kind: 'permission';
  appName: string;
  appGlyph?: string;
  subtitle?: string;
  scopes: {
    label: string;
    risky?: boolean;
  }[];
  cta?: string;
}

// Identity card: a single profile (avatar, name, verified tick, title, badge
// chips) OR a grid of near-identical avatars via `group` (out-group
// homogeneity). The trust rides on the badges, not on any verified fact.
export interface OffsecBiasProfileCard extends OffsecBiasCardCommon {
  kind: 'profile';
  name?: string;
  handle?: string;
  initial?: string;
  verified?: boolean;
  title?: string;
  badges?: string[];
  group?: {
    initial: string;
    label?: string;
  }[];
  note?: string;
}

// Metric tiles: a small grid of label + big value, optional trend arrow. A
// tile can be `muted` (downplayed) or `flagged` (the one that matters).
export interface OffsecBiasStatsCard extends OffsecBiasCardCommon {
  kind: 'stats';
  title?: string;
  tiles: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'flat';
    muted?: boolean;
    flagged?: boolean;
  }[];
  note?: string;
}

// Horizontal bar chart. `value` sets bar width (relative to the max). A
// `ghost` bar is drawn faded/dashed to represent data that was excluded
// (survivorship): the bars you see all point one way because the others were
// never plotted.
export interface OffsecBiasChartCard extends OffsecBiasCardCommon {
  kind: 'chart';
  title?: string;
  bars: {
    label: string;
    value: number;
    display?: string;
    flagged?: boolean;
    ghost?: boolean;
  }[];
  caption?: string;
}

// Verification checklist: rows with an ok / warn / off status glyph. Used for
// "all systems normal" boards and "protection active" theatre.
export interface OffsecBiasChecklistCard extends OffsecBiasCardCommon {
  kind: 'checklist';
  title?: string;
  items: {
    label: string;
    state: 'ok' | 'warn' | 'off';
    flagged?: boolean;
  }[];
  footer?: string;
}

// Progress / stepper: a sequence of steps (done / active / pending) with an
// optional progress bar and caption. For biases about time and expectation
// (planning fallacy) or a process that quietly keeps you engaged.
export interface OffsecBiasProgressCard extends OffsecBiasCardCommon {
  kind: 'progress';
  title?: string;
  steps: {
    label: string;
    state: 'done' | 'active' | 'pending';
  }[];
  percent?: number;
  caption?: string;
}

// Self-assessment / quiz: a prompt, optional chosen option chips, a
// confidence meter (0-100), and an optional verdict line. For metacognitive
// biases (overconfidence, Dunning-Kruger, hard-easy) where the gap between
// felt confidence and actual correctness IS the attack surface.
export interface OffsecBiasQuizCard extends OffsecBiasCardCommon {
  kind: 'quiz';
  prompt: string;
  options?: {
    label: string;
    chosen?: boolean;
  }[];
  answerLabel?: string;
  confidence?: number;
  confidenceLabel?: string;
  verdict?: string;
}

// ===========================================================================
// Third-wave surfaces (biases 76-105). Three new modes, each answering a
// weakness the static before/after pair could not carry:
//
//  - `playbook`: a page torn from the ATTACKER'S manual. Used as the `before`
//    card, paired with the victim's ordinary screen as `after`, so the reader
//    sees the plan and then the plan landing. For biases where the attacker
//    designs a SEQUENCE or a PERSONA (order, memory, stereotype).
//  - `live`: a card that animates on its own via CSS (a counter that ticks, a
//    stack that cascades in). For biases whose lever is TIME or ACCUMULATION,
//    which a frozen frame cannot show.
//  - `interactive` (on OffsecBiasContent, see below): the reader actually
//    CLICKS, and their own choice reveals the outcome. For decision biases
//    where the click IS the attack.
// ===========================================================================

// A page from the attacker's own playbook: a titled step list, one step
// marked `active` as the move being executed. Rendered with a distinct
// "manual" look so it never reads as one of the victim's own surfaces.
export interface OffsecBiasPlaybookCard extends OffsecBiasCardCommon {
  kind: 'playbook';
  docTitle: string;
  steps: {
    label: string;
    note?: string;
    active?: boolean;
  }[];
  footer?: string;
}

// A self-animating card. `cascade` streams `items` in one after another
// (accumulation: the dangerous line drowning in volume). `counter` runs a
// value while a second reading moves the opposite way (erosion over time:
// days-since climbing while caution decays). Animation is pure CSS and honors
// prefers-reduced-motion in the stylesheet.
export interface OffsecBiasLiveCard extends OffsecBiasCardCommon {
  kind: 'live';
  variant: 'cascade' | 'counter';
  // cascade
  items?: {
    title: string;
    body?: string;
    flaggedItem?: boolean;
  }[];
  // counter
  counterLabel?: string;
  counterValue?: string;
  meterLabel?: string;
  meterFrom?: number;
  meterTo?: number;
  caption?: string;
}

export type OffsecBiasCard =
  | OffsecBiasEmailCard
  | OffsecBiasNotificationCard
  | OffsecBiasChatCard
  | OffsecBiasBrowserCard
  | OffsecBiasCallCard
  | OffsecBiasDocumentCard
  | OffsecBiasPosterCard
  | OffsecBiasTimelineCard
  | OffsecBiasDiffCard
  | OffsecBiasPermissionCard
  | OffsecBiasProfileCard
  | OffsecBiasStatsCard
  | OffsecBiasChartCard
  | OffsecBiasChecklistCard
  | OffsecBiasProgressCard
  | OffsecBiasQuizCard
  | OffsecBiasPlaybookCard
  | OffsecBiasLiveCard;

// Interactive "play the victim" widget. Shown INSTEAD of the before/after
// pair when present on a case. The reader sees one artifact and real option
// buttons; clicking an option reveals that choice's outcome inline. The bias
// is experienced, not just described: the `trap` option is the one the lever
// pulls you toward, and its `outcome` shows the cost.
export interface OffsecInteractive {
  kind: 'choice';
  // The artifact the decision is made against (reuse any card kind, unflagged).
  surface: OffsecBiasCard;
  question: string;
  options: {
    label: string;
    // The bias-driven wrong choice. Exactly one option should set this.
    trap?: boolean;
    // Revealed after the reader clicks this option.
    outcome: string;
  }[];
  // Small caption above the revealed outcome (e.g. "What happens next").
  resolvedLabel?: string;
}

export interface OffsecBiasContent {
  // Optional one-line "tell": the single cue that gives this attack away.
  // Shown prominently above the scenario. Purely additive: cases without
  // it render exactly as before. Gives each page a distinct, useful
  // fingerprint and teaches the reader what to actually watch for.
  tell?: string;
  scenario: string;
  visualLabel: string;
  // A case carries EITHER a static before/after `visual` OR an `interactive`
  // widget. Exactly one is present; the view picks the renderer accordingly.
  visual?: {
    before: OffsecBiasCard;
    after: OffsecBiasCard;
  };
  interactive?: OffsecInteractive;
  whyItWorksLabel: string;
  whyItWorks: string;
  defenseLabel: string;
  defense: {
    lede: string;
    moves: string[];
  };
}
