const content = {
  intro:
    'Brains shortcut "how likely" with "how easy to recall." After a breach hits the news, every employee has the threat one neuron away — engineer to receptionist. Attackers ride that recency: an email naming the breach feels like an inevitable follow-up, not a probe. The same lure two weeks earlier would die in spam.',
  scenarioLabel: 'Scenario',
  scenario:
    'Spear-phish targeting a 200-person fintech finance team, five days after a competitor’s breach hits the front page.',
  visualLabel: 'Same payload, different framing',
  visual: {
    before: {
      tag: 'Generic lure',
      sender: 'billing@acme-vendor.com',
      subject: 'Q3 invoice attached',
      preview: 'Hi team — please find the attached invoice for Q3.',
      stat: { value: '2.8%', label: 'opens' },
    },
    after: {
      tag: 'Breach-themed lure',
      sender: 'security@acme-vendor.com',
      subject: 'Action required: NorthBank exposure check',
      preview:
        'Our security team flagged your domain in the NorthBank dataset…',
      stat: { value: '21.4%', label: 'opens' },
      flagged: true,
    },
  },
  outcome: {
    withoutLabel: 'Without the bias',
    withoutText:
      'Generic invoice lure — ~3% click rate, lost in noise alongside two other promo emails.',
    withLabel: 'With the bias',
    withText:
      'Breach-themed lure — ~7× lift; the threat category is already top-of-mind across the org.',
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Recent media coverage warps base-rate judgment. The brain treats vivid and recent as common and imminent, even when actual incidence hasn’t moved. Identical bytes; the news cycle is doing the persuasion.',
  blueTeamLabel: 'Blue-team countermeasure',
  blueTeam:
    'Treat topical urgency as a phishing signal, not a credibility one. SOC adds a detection rule that flags subjects echoing the last 14 days of breach headlines. Crisis runbooks include "expect impersonation within 72 hours" as a default step after any public incident.',
};

export default content;
export type OffsecBiasContent = typeof content;
