// Surface is an OAuth consent screen: an app header plus a list of
// permission scopes you tick through before granting access. The lever is
// Miller's Law: working memory holds only a handful of items at once, so a
// dangerous scope parked in the middle of a long list falls out of the
// window you are tracking. The risky scope is identical across both cards.
// Only the number of mundane scopes padding around it changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A long permission list looks thorough and reads as forgettable. The scope that matters is rarely first or last. It sits in the middle, where your memory quietly drops it.',
  scenario:
    'A scheduling app asks to connect to your work account. In a short list, "send payments on your behalf" jumps out and you stop. Pad the same request with eight ordinary-sounding scopes and put the payment one seventh down, and it lands in the exact slot your working memory cannot hold. You read the top, you glance at the bottom, and the middle blurs into "the usual stuff" as you press allow.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'permission',
      tag: 'A scope you can actually hold',
      appName: 'Sprintly Scheduler',
      appGlyph: '📅',
      subtitle: 'wants access to your work account',
      scopes: [
        { label: 'View your profile' },
        { label: 'Read your calendar' },
        { label: 'Send payments on your behalf', risky: true },
      ],
      cta: 'Allow access',
    },
    after: {
      kind: 'permission',
      flagged: true,
      tag: 'The same scope, past what you can track',
      appName: 'Sprintly Scheduler',
      appGlyph: '📅',
      subtitle: 'wants access to your work account',
      priorContext:
        'The list scrolls past the few items your working memory can actually hold at once. By the fourth scope you are skimming, not reading.',
      scopes: [
        { label: 'View your profile' },
        { label: 'Read your calendar' },
        { label: 'See your team member list' },
        { label: 'Read your contact names' },
        { label: 'View your time zone' },
        { label: 'Access your out-of-office status' },
        { label: 'Send payments on your behalf' },
        { label: 'Read event locations' },
        { label: 'View your working hours' },
      ],
      cta: 'Allow access',
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    "This is Miller's Law. Working memory holds only a handful of items at once, somewhere near seven, before older items get pushed out to make room for new ones. A three-item list fits inside that window, so the payment scope stays lit the whole time you read. A nine-item list overflows it: by the time you reach the seventh scope, the first few have already dropped, and the danger sits in the gap between what you have forgotten and what you have not yet reached. The grant is identical in risk across both cards. The only thing that changed is the padding, and the padding is enough, because it moves the one scope that matters into the slot your memory cannot keep.",
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your platform decides which scopes an app can even request. Reading the long ones instead of skimming them is your part.',
    moves: [
      'Read a permission list to its end before granting, slowest through the middle where attention naturally sags. Length is a hiding place, not a reassurance.',
      'Any scope that moves money, sends on your behalf, or writes data deserves a full stop, whatever position it sits in.',
      'When a simple tool asks for a long list, the length itself is the signal. A scheduler does not need to pay anyone.',
      'Grant scopes one purpose at a time where the platform allows it, so no single item can ride in on the crowd around it.',
    ],
  },
};

export default content;
