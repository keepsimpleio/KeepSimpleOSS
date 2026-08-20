// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the processing
// difficulty effect: fluent, easy-to-read messages feel more true, and an
// effortful safe path gets skipped. Keep the attacker's route frictionless and
// make verifying feel like work, and ease alone decides which route you take.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When the fast path is one tap and the safe path is a chore, ease is picking for you. Attackers polish their route and bury yours on purpose.',
  scenario:
    'A prompt lets you approve something with a single tap. The alternative, actually verifying it, means finding a portal, logging in, digging through menus. Both options are on the screen, but only one is easy, and easy reads as true. The smooth path feels obviously fine while the effortful one feels like overkill for a routine notice. The attacker did not remove the safe route. They just made it tedious enough that you take the frictionless one, because fluency masquerades as legitimacy.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: make the safe path the hard path',
      steps: [
        {
          label: 'Polish our route to one tap',
          note: 'Clean copy, a single button, zero friction. Fluent reads as true.',
          active: true,
        },
        {
          label: 'Bury the real verify route',
          note: 'Point to a portal, a login, three menus deep. Make checking feel like work.',
        },
        {
          label: 'Let effort decide',
          note: 'Faced with easy versus tedious, most take easy. The choice is made on friction, not facts.',
        },
        {
          label: 'Frame it as routine',
          note: 'A minor, expected notice makes the extra effort of verifying feel like overkill.',
        },
      ],
      footer: 'Ease does the persuading. The one-tap path is the whole trap.',
    },
    after: {
      kind: 'notification',
      tag: 'The plan, as it lands on you',
      appName: 'Workspace Security',
      timestamp: 'now',
      title: 'New sign-in needs approval',
      body: 'A device is trying to sign in to your account. Tap Approve to continue. (To review the sign-in details instead, open the security portal, sign in, go to Devices, then Recent activity.)',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the processing difficulty effect, the flip side of processing fluency. Messages that are easy to read and act on feel more true and more legitimate than ones that make you work, and the mind quietly credits that ease to the content rather than to the design. An attacker exploits this twice over. First they make their own path effortless, a single clean tap, so it feels obviously fine. Then they make the safe path, the real verification, deliberately tedious: a portal, a login, menus deep. Both routes sit on the same screen, but effort decides which you take, and the easy one wins by feeling right rather than by being right. Fluency is not a fact-check. The attacker manufactured the ease you are reading as trust.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'The safe route being annoying is a design choice someone made, often the attacker. Do the tedious check anyway.',
    moves: [
      'When one option is one tap and the other is a chore, treat that gap as a signal to slow down, not to take the tap.',
      'Approve nothing from the prompt itself. Open the service the way you always do and check whether the sign-in or request is really there.',
      'A real sign-in you did not start is denied, never approved to "continue". If you did not just try to log in, the answer is no.',
      'Notice when you chose the easy path because it was easy. Ease is a feeling the sender can manufacture; it is not evidence.',
    ],
  },
};

export default content;
