// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern — that topical, news-anchored lures outperform generic ones —
// is well documented; the specific lift is not the point of the page.
//
// Surface is a browser tab (lookalike-domain landing page), NOT email,
// so the three OffSec bias cards don't all read as "another inbox".
// Post-breach phishing increasingly arrives via sponsored search
// results and headline-anchored URLs — fits availability heuristic
// better than a generic vendor email anyway.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A major company just got breached and the news is everywhere. You go looking for answers — and the page you land on is anchored to the headline you just read.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Generic',
      host: 'vendor-portal.acme.com',
      path: '/billing',
      pageHeading: 'Q3 invoice summary',
      pageBody:
        'Your invoice for the previous billing period is ready. Routine summary — no action required this cycle.',
    },
    after: {
      kind: 'browser',
      tag: 'News-anchored',
      host: 'northbank-breach-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading: 'Confirm SSO to scope your NorthBank exposure',
      pageBody:
        'Our team flagged your domain in the NorthBank dataset. Sign in with your work account so we can scope the exposure before EOD.',
      cta: 'Sign in with SSO',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Availability heuristic colliding with base-rate neglect. After a breach saturates the news, your brain stops asking “how likely is this real?” and starts asking “how easy is it to recall?” — and right now, the answer is everywhere. You substitute “I just read about this” for “I should verify this URL,” and pattern-match the landing page to the news cycle, not to phishing. Identical payload; the news desk is doing the social engineering.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'When a page leans on today’s news to get you moving, that’s exactly when to slow down — not speed up. The urgency you feel is the attack working.',
      'Read the full hostname left-to-right before you type anything. Attackers stack the brand you trust as a subdomain of a domain they own — the rightmost label is the one that actually counts.',
      'Let your password manager be the judge. If it doesn’t autofill on a login page, that page isn’t the one you think it is — don’t override it, close the tab.',
      'Treat any breach reference on a landing page as a claim, not a fact. Check the company’s own status page or Have I Been Pwned before you sign in anywhere else.',
    ],
  },
};

export default content;
