// Mode: interactive. The surface is attacker-controlled. A page hands you
// something you want this second the instant you approve, and pushes the
// security step to "later". The lever is hyperbolic discounting: the reward
// available now looms far larger than the cost sitting in the future, so you
// approve now and skip the check. Here approving now IS the attack: the
// sign-in you wave through is the attacker's, and the deferred verification is
// the exact step that would have shown the login came from a device that is
// not yours.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A page that gives you the reward the moment you approve and promises the security check "later" is betting that acting now grants the access before you ever run the check. Later is the attacker.',
  scenario:
    'You followed a link for something you want right now: early access, a shared workspace, a bonus already sitting in your name. The page says approve the pending sign-in to start immediately and it will run the security verification afterward. The access is in front of you and the check is postponed, so the future loses. The catch is that the sign-in waiting on your phone is the attacker trying to get in, and approving it now is what lets them.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'team-access-grant.io',
      path: '/activate',
      pageHeading: 'Your access is ready. Activate now.',
      pageBody:
        'Approve the pending sign-in to start using your workspace immediately. We will run the security verification on your next login.',
      cta: 'Approve and start now',
    },
    question: 'A sign-in is waiting for your approval. Do you approve it now?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Approve the pending sign-in now so I can start immediately',
        trap: true,
        outcome:
          'Trap. The reward in front of you outweighed a check due later, so you approved. The sign-in you just approved was the attacker logging in as you, and they are inside your account the moment you tap it. The verification you postponed was the one thing that would have shown the login came from a device you have never used. There is no breach weeks away. It happened when you approved.',
      },
      {
        label: 'Approve now and run the security verification right after',
        outcome:
          'The same trade with a promise attached. The approval already handed over the live session, so the "verification afterward" runs on an account the attacker is already in, if you get to it at all. Once you have approved, the later step protects nothing.',
      },
      {
        label:
          'Do not approve; check where this sign-in request came from first',
        safe: true,
        outcome:
          'Safe. You ran the sixty-second check before collecting the reward instead of after. The sign-in is from a device and location that are not yours, so you deny it and change your password. The access dangled in front of you was the bait, and the verification you refused to defer is what exposed the attacker before they got in.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is hyperbolic discounting, the way people steeply undervalue costs and rewards the further off they sit. A benefit available right now feels enormously larger than a cost due later, even when the later cost is far worse. The attacker builds the flow around that curve: the access is immediate and vivid while the verification is abstract and postponed, so the trade your gut runs comes out lopsided. What makes this version sharp is that approving now is not a shortcut you can walk back. The approval is the attack. Granting access first and verifying second means the attacker is already through the door by the time the deferred step would have run. The bias supplies the impatience; the attacker collects the live session.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Policy can require verification before any access is granted so the choice never reaches the tired individual. Refusing to approve first and check later is the personal half.',
    moves: [
      'Never approve a sign-in or grant to unlock a reward faster. If a step verifies who is logging in, it comes before the access, never after.',
      'Notice the shape: reward now, security check postponed. Approving now with the check deferred means the access is already granted before anything is verified.',
      'A sign-in prompt you did not personally start is a request from someone else. Deny it and check the device and location, do not clear it to move on.',
      'When a page makes you approve something to get to what you want this second, that hurry is the product. Slow down; the flow was built to profit from it.',
    ],
  },
};

export default content;
