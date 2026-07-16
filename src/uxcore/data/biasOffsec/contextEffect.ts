// No quoted figures by policy. Surface is a browser page on both sides —
// deliberately the SAME page, pixel for pixel. The lever is the moment
// around it: before = the login prompt appears cold on a random tab;
// after = the identical prompt appears mid-flow, ten seconds after you
// clicked "Join meeting" in a calendar invite. Only `priorContext` and
// the tag change — the artifact must not.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'The same sign-in page, twice. On a random Tuesday tab it screams fake. Ten seconds after you clicked “Join meeting” in a calendar invite, the very same page reads as routine — because now it appears exactly where a sign-in was supposed to be.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Cold — out of nowhere',
      host: 'meeting-relogin-portal.com',
      path: '/sso/verify',
      pageHeading: 'Session expired — sign in with your work account',
      pageBody:
        'For security reasons, please re-enter your corporate email and password to continue to the conference.',
      cta: 'Sign in to continue',
    },
    after: {
      kind: 'browser',
      tag: 'Mid-flow — right where you expected it',
      host: 'meeting-relogin-portal.com',
      path: '/sso/verify',
      priorContext:
        'Ten seconds ago you clicked “Join meeting” in a calendar invite. A tab opened, a spinner spun — and then this.',
      pageHeading: 'Session expired — sign in with your work account',
      pageBody:
        'For security reasons, please re-enter your corporate email and password to continue to the conference.',
      cta: 'Sign in to continue',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Both cards show the identical page — same address, same copy, same button. What changed is everything around it. Perception doesn’t judge a stimulus on its own; it judges it against the context it arrives in. A password prompt with no story is suspicious by default. The same prompt inside a flow you started yourself inherits the flow’s legitimacy: you expected a meeting, a sign-in feels like a normal step toward it, so the page borrows trust it never earned. The attacker didn’t build a better fake — they built a better moment for it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Judge every credentials prompt as if it appeared cold. The question is never “does this fit the flow?” — it’s “is this address the real login page?” The flow can’t authenticate a page; only the address bar can.',
      'A meeting link that lands on a corporate password form is a red flag by itself. Conference tools may ask for a name or a meeting code — your work password lives with your identity provider, not with a meeting page.',
      'Expected ≠ verified. Attackers engineer expectation on purpose: a calendar invite, a shared file, a delivery notice — each exists to make the next page feel like a natural step.',
      'When a sign-in appears mid-flow, break the flow: open a new tab and reach the service through the address you know. If the meeting is real, it will still be there.',
    ],
  },
};

export default content;
