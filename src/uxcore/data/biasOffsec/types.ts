// Each bias example renders two side-by-side cards: a baseline ("before")
// and the bias-exploiting variant ("after", marked `flagged`). The card
// surface is picked per-bias so the OffSec section never feels like
// "another email". When email is the natural attack surface, use it;
// otherwise pick the surface that matches the threat (push notification,
// chat thread, browser alert, etc.). Add new kinds here as new biases
// arrive.

interface OffsecBiasCardCommon {
  tag: string;
  flagged?: boolean;
  // Soft context note rendered above the card body — grounds the reader
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

// Faux browser tab — used for biases where the attack surface is a web
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
// the moment you pick up — rendered as a quoted line over a fake
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
// and drawn by the component — data never ships a scannable code.
export interface OffsecBiasPosterCard extends OffsecBiasCardCommon {
  kind: 'poster';
  heading: string;
  body: string;
  qrCaption?: string;
}

// Vertical sequence of small sightings across days — for biases where
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
