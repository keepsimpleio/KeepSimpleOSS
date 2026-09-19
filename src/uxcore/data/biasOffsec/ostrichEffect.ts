// Surface is a security alert. The lever is discomfort avoidance: the same
// malicious "confirm to clear these alerts" ask is refused when it forces
// you to face the problem, but taken when it is framed as a way to make
// the uncomfortable warnings simply disappear.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The button that clears the scary warning in one tap is usually the one authorizing the thing the warning was about.',
  scenario:
    'Your phone shows unsettling sign-in alerts. A rogue prompt from "SecurityCenter" wants you to confirm an action. Framed as "review and verify each of these three warnings", you avoid it, because looking closely feels bad. Framed as "clear all alerts in one tap and put this behind you", you take it gladly. Same confirmation, and it is the attacker you are approving.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Makes you face it',
      appName: 'SecurityCenter',
      timestamp: 'now',
      title: 'Review 3 suspicious sign-in attempts',
      body: 'Open each alert, check the device and location, and verify whether it was you. This will take a few minutes and may need a password reset.',
    },
    after: {
      kind: 'notification',
      tag: 'Makes it disappear',
      appName: 'SecurityCenter',
      timestamp: 'now',
      priorContext:
        'The alerts have been nagging you all afternoon and you would rather not think about them.',
      title: 'Clear all 3 alerts in one tap',
      body: 'Nothing to worry about. Tap Confirm to dismiss these warnings and restore your account to normal. No further action needed.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the ostrich effect. When information is uncomfortable, people would rather not look at it, and the wish for the discomfort to end can outweigh the wish to actually be safe. The confront-it version asks you to sit with a scary possibility and do effortful work, so you avoid it. The make-it-disappear version offers exactly what the ostrich in you wants: one tap, and the bad feeling is gone. That relief is the bait. The tap that "clears the alerts" is the tap that approves the intruder, and the warnings vanish because you just told the system everything is fine.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can act on a real alert. It cannot act on the one you made disappear.',
    moves: [
      'A one-tap "make this warning go away" is the shape of the trap. Relief is being sold to you, and the price is your approval.',
      'Security warnings are meant to be uncomfortable. The urge to clear them fast is the exact feeling an attacker is counting on.',
      'Never resolve a security alert from inside the alert. Open the account yourself and check the sign-in activity directly.',
      'If a prompt promises the scary thing is "nothing to worry about", worry. Real reviews ask you to look closer, not to look away.',
    ],
  },
};

export default content;
