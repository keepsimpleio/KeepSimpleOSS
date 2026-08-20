// Mode: interactive. The surface is an onboarding page offering instant
// access now with the security step postponed: "start using it now, finish
// verification later" or "skip 2FA for now, set it up whenever". The lever
// is hyperbolic discounting: the immediate reward looms far larger than the
// later cost, so you take the shortcut and the "later" step never comes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Any flow that lets you have the reward now and pay the security cost "later" is betting that later never arrives. It usually does not.',
  scenario:
    'A tool offers you the whole thing immediately if you skip the security setup for now. Use it today, add two-factor whenever. The unprotected access is right in front of you and the risk is somewhere in the future, so the future loses. You take the fast path, the reminder gets dismissed, and the account you "meant to secure later" stays open.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'workspace-app.io',
      path: '/get-started',
      pageHeading: 'Start now, secure later',
      pageBody:
        'Get instant access to your workspace. You can skip two-factor setup for now and finish the security review anytime from settings.',
    },
    question: 'Which path do you take?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Skip 2FA for now and start using the workspace immediately',
        trap: true,
        outcome:
          'Trap. The instant access was worth more to you right now than a risk sitting in the future, so you deferred the one step that protects the account. "Later" arrives as a breach, not a reminder. Weeks pass, 2FA never gets added, and a reused password walks straight into an account nothing was guarding.',
      },
      {
        label: 'Start now and set a reminder to add 2FA next week',
        outcome:
          "This is the same trade wearing a calendar. The reminder competes with next week's urgent things and loses the same way today's security step lost to today's convenience. An account left open on the promise of a future you is an account left open.",
      },
      {
        label: 'Set up two-factor now, before you start using it',
        outcome:
          'Safe. You paid the small cost while it was cheap, in the sixty seconds before the reward pulled your attention elsewhere. The account is protected from its first minute, and there is no dangling "later" for the attacker to live inside. Present-you spent one minute so future-you never has to explain a breach.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is hyperbolic discounting, the way people steeply undervalue costs and rewards the further off they sit. A benefit available right now feels enormously larger than a cost due later, even when the later cost is far worse. "Start now, secure later" is engineered around that curve: the access is immediate and vivid while the risk is abstract and postponed, so the math your gut runs comes out lopsided. The security step is easy, its only flaw is being due later, and "later" is where good intentions quietly die. Attackers love the deferred-security path because they know the reminder rarely wins against the next urgent thing, leaving a window that stays open for weeks. The bias does the work: choosing to be safe later feels different from choosing to be unsafe, and it lands in the same place.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Policy can require security setup before first use so the choice never reaches the tired individual. Refusing the "later" option when it is offered is the personal half.',
    moves: [
      'Treat "secure it later" as "never secure it". If a step protects an account, do it before you start using the account, not after.',
      'Notice the shape of the offer: reward now, cost postponed. That structure is designed to exploit how you discount the future.',
      'The security step is almost always small and quick. Its cost feels big only because it stands between you and something you want this second.',
      'When a flow lets you skip protection to move faster, that is the moment to slow down, because the flow was built to profit from your hurry.',
    ],
  },
};

export default content;
