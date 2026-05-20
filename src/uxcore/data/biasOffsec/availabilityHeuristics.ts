// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern — that topical, news-anchored lures outperform generic ones —
// is well documented; the specific lift is not the point of the page.

const content = {
  intro:
    'Brains shortcut "how likely" with "how easy to recall." After a breach hits the news, every employee has the threat one neuron away — engineer to receptionist. Attackers ride that recency: an email naming the breach feels like an inevitable follow-up, not a probe. The same lure a few weeks earlier would die in spam.',
  scenarioLabel: 'Scenario',
  scenario:
    'Spear-phish targeting a finance team in the days after a competitor’s breach hits the front page.',
  visualLabel: 'Same payload, different framing',
  visual: {
    before: {
      tag: 'Generic lure',
      sender: 'billing@acme-vendor.com',
      subject: 'Q3 invoice attached',
      preview: 'Hi team — please find the attached invoice for Q3.',
    },
    after: {
      tag: 'Breach-themed lure',
      sender: 'security@acme-vendor.com',
      subject: 'Action required: NorthBank exposure check',
      preview:
        'Our security team flagged your domain in the NorthBank dataset…',
      flagged: true,
    },
  },
  outcome: {
    withoutLabel: 'Without the bias',
    withoutText:
      'Generic invoice lure reads like every other vendor email. Brushed off, lost in the inbox.',
    withLabel: 'With the bias',
    withText:
      'Breach-themed lure rides the news cycle — it feels like an expected follow-up, not a probe.',
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Recent media coverage warps base-rate judgment. The brain treats vivid and recent as common and imminent, even when actual incidence hasn’t moved. Identical bytes; the news cycle is doing the persuasion.',
  blueTeamLabel: 'Blue-team countermeasure',
  blueTeam:
    'Treat topical urgency as a phishing signal, not a credibility one. Tune detection so subjects echoing the current breach news cycle get extra scrutiny, and write crisis runbooks that assume impersonation attempts will follow every public incident.',
};

export default content;
export type OffsecBiasContent = typeof content;
