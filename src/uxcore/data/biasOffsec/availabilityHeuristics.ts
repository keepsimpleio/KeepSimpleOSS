// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern — that topical, news-anchored lures outperform generic ones —
// is well documented; the specific lift is not the point of the page.

const content = {
  scenario:
    'Vendor-impersonation phish aimed at finance — in the days after a competitor’s breach hits the front page.',
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
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your security team is handling the perimeter. Here’s how you handle your inbox.',
    moves: [
      'When an email leans on today’s news to get you moving, that’s exactly when to slow down — not speed up. The urgency you feel is the attack working.',
      'Verify through a channel you already trust — the vendor’s portal from a bookmark, or the phone number already in your contacts. Never the link or number in the email itself.',
      'Let your password manager be the judge. If it doesn’t autofill on a login page, that page isn’t the one you think it is — don’t override it, close the tab.',
      'Treat any breach reference in the email as a claim, not a fact. Check the company’s own status page or Have I Been Pwned before you click anything else in the message.',
    ],
  },
};

export default content;
export type OffsecBiasContent = typeof content;
