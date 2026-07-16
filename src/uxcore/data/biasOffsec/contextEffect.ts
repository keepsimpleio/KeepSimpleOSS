// No quoted figures by policy. Surface is a browser page on both sides,
// deliberately the SAME page, pixel for pixel. The lever is the moment
// around it: before = the login prompt appears cold on a random tab;
// after = the identical prompt appears mid-flow, seconds after you
// clicked "Join meeting" in a calendar invite. Only priorContext and
// the tag change. The artifact must not.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'The same sign-in page, twice. On a random Tuesday tab it looks fake immediately. Ten seconds after you clicked "Join meeting" in a calendar invite, the very same page reads as routine, because now it sits exactly where a sign-in was supposed to be.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Cold, out of nowhere',
      host: 'meeting-relogin-portal.com',
      path: '/sso/verify',
      pageHeading: 'Session expired. Sign in with your work account',
      pageBody:
        'For security reasons, please re-enter your corporate email and password to continue to the conference.',
      cta: 'Sign in to continue',
    },
    after: {
      kind: 'browser',
      tag: 'Mid-flow, right where you expected it',
      host: 'meeting-relogin-portal.com',
      path: '/sso/verify',
      priorContext:
        'Ten seconds ago you clicked "Join meeting" in a calendar invite. A tab opened, a spinner spun, and then this.',
      pageHeading: 'Session expired. Sign in with your work account',
      pageBody:
        'For security reasons, please re-enter your corporate email and password to continue to the conference.',
      cta: 'Sign in to continue',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Both cards show the identical page. Same address, same copy, same button. What changed is the situation around it. Your brain judges a request against the context it arrives in, not on its own merits. A password prompt with no story is suspicious by default. The same prompt inside a flow you started yourself borrows the trust of that flow: you expected a meeting, a sign-in feels like a normal step, so the page gets a pass it never earned. The attacker did not build a better fake. They built a better moment for it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Judge every credentials prompt as if it appeared out of nowhere. The question is not "does this fit the flow?" but "is this the real login page?". Only the address bar answers that.',
      'A meeting link that lands on a corporate password form is a red flag on its own. Meeting tools may ask for your name or a meeting code. Your work password belongs to your identity provider, not to a meeting page.',
      'Expected is not verified. Attackers manufacture expectation on purpose: a calendar invite, a shared file, a delivery notice. Each one exists to make the next page feel like a natural step.',
      'When a sign-in appears mid-flow, break the flow. Open a new tab and reach the service through the address you know. If the meeting is real, it will still be there.',
    ],
  },
};

export default content;
