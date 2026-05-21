// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern — that topical, news-anchored lures outperform generic ones —
// is well documented; the specific lift is not the point of the page.

const content = {
  scenarioLabel: 'Scenario',
  scenario:
    'Vendor-impersonation phish, finance team — in the days after a competitor’s breach hits the front page.',
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
      subject: 'Action required: exposure check after the NorthBank incident',
      preview:
        'Our team flagged your domain in the NorthBank dataset. Confirm SSO so we can scope your exposure before EOD.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Availability heuristic colliding with base-rate neglect. After a breach saturates the news, the brain stops asking “how likely?” and starts asking “how easy to recall?” — and right now, the answer is everywhere. The target substitutes “I just read about this” for “I should verify this sender,” and a finance employee in that window pattern-matches the email to the news cycle, not to phishing. Identical payload; the news desk is doing the social engineering.',
  blueTeamLabel: 'Blue-team countermeasure',
  blueTeam: {
    lede: 'Invert the heuristic in the org’s head: topical is a phishing signal, not a credibility one.',
    moves: [
      'Tune detection so subjects echoing the current news cycle get extra scrutiny — same nouns as the front page is a feature of the attack, not a coincidence.',
      'Pre-publish a breach-week runbook that assumes vendor-impersonation attempts will follow every public incident in the days after.',
      'Drop a one-line prime into the org channel the day a major breach lands: “expect lures naming this company by tomorrow — verify in band before clicking.”',
      'Strip implicit trust from neighboring sender domains; attackers register lookalikes the same week the news breaks.',
    ],
  },
};

export default content;
export type OffsecBiasContent = typeof content;
