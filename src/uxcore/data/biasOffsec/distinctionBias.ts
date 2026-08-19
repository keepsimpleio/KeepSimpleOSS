// Surface is a fake verification page. The lever is joint evaluation:
// the same "verify now" trap is suspicious alone, but placed beside a
// deliberately worse option it looks like the obviously smart choice.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A comparison someone else built is a funnel. Once you catch yourself picking between their two options, ask whether you would take the winning one if it stood there alone.',
  scenario:
    'A page claims your access is suspended and you must verify your identity. On its own, the "verify instantly" button reads as a trap. But present it as a choice, Option A: wait three to five business days locked out, or Option B: verify instantly and keep working, and Option B stops looking like a risk and starts looking like the obvious move. Same button, same harvested password.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'One option, on its own',
      host: 'account-verify-portal.com',
      path: '/restore',
      pageHeading: 'Your access is suspended',
      pageBody:
        'Verify your identity to restore access. Sign in with your work account to continue.',
      cta: 'Verify now',
    },
    after: {
      kind: 'browser',
      tag: 'Two options, side by side',
      host: 'account-verify-portal.com',
      path: '/restore',
      pageHeading: 'Your access is suspended, choose how to restore it',
      pageBody:
        'Option A: Standard review. 3 to 5 business days, your account stays locked while you wait. Option B: Instant verification. Sign in with your work account and keep working right now, no waiting.',
      cta: 'Choose Option B, verify instantly',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is distinction bias. Options judged side by side get compared on their differences, and small gaps get magnified into decisive ones. Alone, "verify instantly" invites the question "should I be doing this at all?". Beside a slow, painful Option A, your mind quietly swaps that question for a smaller one: "which of these two is better?". You were never meant to choose Option A. It exists to be the loser, so the trap can win a race you would never have entered on its own.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team owns the real login flow. Spotting a fake fork in the road is on you.',
    moves: [
      'A comparison someone else built is a funnel, not a favour. The "obviously better" option is the one they need you to pick.',
      'Judge the risky choice as if it stood alone. Would you enter your password here with no Option A next to it? That is your real answer.',
      'The slow, boring, "standard" option is usually the safe one. Attackers make it painful precisely so you flee it.',
      'There is no legitimate "instant bypass" of a security review. If speed is the whole pitch, treat the page as hostile and leave.',
    ],
  },
};

export default content;
