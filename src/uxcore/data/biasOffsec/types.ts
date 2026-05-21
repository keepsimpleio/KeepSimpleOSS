export interface OffsecBiasCard {
  tag: string;
  sender: string;
  timestamp?: string;
  subject: string;
  preview: string;
  attachment?: string;
  flagged?: boolean;
}

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
