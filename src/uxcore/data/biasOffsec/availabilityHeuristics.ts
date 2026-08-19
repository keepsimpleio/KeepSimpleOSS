// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern (topical, news-anchored lures outperform generic ones) is well
// documented; the specific lift is not the point of the page.
//
// Surface is a browser tab (lookalike-domain landing page), NOT email,
// so the OffSec bias cards don't all read as "another inbox".
// Post-breach phishing increasingly arrives via sponsored search
// results and headline-anchored URLs, which fits the availability
// heuristic better than a generic vendor email anyway.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A major company just got breached and the news is everywhere. Two phishing pages ask you for the exact same thing: your work login. The only difference between them is that one name-drops the breach you just read about.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'No news hook',
      host: 'account-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading: 'Verify your account to continue',
      pageBody:
        'Routine security check. Sign in with your work account to confirm your access is still valid.',
      cta: 'Sign in with SSO',
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
    'The first page earns instant suspicion: a login request out of nowhere. The second one asks for exactly the same thing, yet feels expected, because the breach is everywhere this week. That is the availability heuristic. Your brain stops asking "how likely is this real?" and starts asking "how easily can I recall it?", and right now recall is effortless. You substitute "I just read about this" for "I should verify this URL". Identical payload; the news is doing the social engineering.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'When a page leans on today’s news to get you moving, that is exactly when to slow down, not speed up. The urgency you feel is the attack working.',
      'Read the full hostname left to right before you type anything. Attackers stack the brand you trust as a subdomain of a domain they own. The rightmost label is the one that counts.',
      'Let your password manager be the judge. If it does not autofill on a login page, that page is not the one you think it is. Do not override it, close the tab.',
      'Treat any breach reference on a landing page as a claim, not a fact. Check the company’s own status page or Have I Been Pwned before you sign in anywhere else.',
    ],
  },
};

export default content;
