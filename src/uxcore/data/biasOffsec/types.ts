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
  // Soft pre-bubble note that grounds the reader in the prior history
  // for biases where context-building matters (e.g., illusory truth).
  priorContext?: string;
  body: string;
}

export type OffsecBiasCard =
  | OffsecBiasEmailCard
  | OffsecBiasNotificationCard
  | OffsecBiasChatCard;

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
