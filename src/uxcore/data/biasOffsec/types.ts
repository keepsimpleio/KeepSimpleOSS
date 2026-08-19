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
  tag: string;
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

export type OffsecBiasCard =
  | OffsecBiasEmailCard
  | OffsecBiasNotificationCard
  | OffsecBiasChatCard
  | OffsecBiasBrowserCard
  | OffsecBiasCallCard
  | OffsecBiasDocumentCard
  | OffsecBiasPosterCard
  | OffsecBiasTimelineCard;

export interface OffsecBiasContent {
  // Optional one-line "tell": the single cue that gives this attack away.
  // Shown prominently above the scenario. Purely additive: cases without
  // it render exactly as before. Gives each page a distinct, useful
  // fingerprint and teaches the reader what to actually watch for.
  tell?: string;
  scenario: string;
  visualLabel: string;
  visual: {
    before: OffsecBiasCard;
    after: OffsecBiasCard;
  };
  whyItWorksLabel: string;
  whyItWorks: string;
  defenseLabel: string;
  defense: {
    lede: string;
    moves: string[];
  };
}
