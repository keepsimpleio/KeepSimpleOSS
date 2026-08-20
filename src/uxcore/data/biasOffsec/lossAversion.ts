// Mode: interactive. The surface is a notification with a countdown: act in
// ten minutes or permanently lose access to your files or funds. The lever
// is loss aversion, where a threatened loss weighs far more than an equal
// gain. The fear of losing what you already have overrides the check you
// would normally run, and the clock exists only to stop you from thinking.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Real services do not delete your account or your money through a countdown link. A clock attached to a threat exists to stop you thinking, not to help you.',
  scenario:
    'A notification says you have ten minutes to confirm or you will permanently lose access to your files or funds. The threat is a loss, and losing something you already hold hurts far more than an equivalent gain would please, so your gut screams to act before the clock runs out. That scream is the product. The countdown is there to spend your caution before you can ask whether the threat is even real.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'notification',
      appName: 'Cloud Storage',
      title: 'Action required: 10 minutes left',
      body: 'Unusual activity means your account will be permanently deleted and your files lost in 10:00. Confirm now to keep your access.',
    },
    question: 'How do you react?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Click the link and confirm immediately to avoid losing your files',
        trap: true,
        outcome:
          'Trap. The threat of losing what you already have overpowered the pause you would normally take, and the countdown made sure you never took it. The link goes to a page that harvests your login the moment the fear peaks. Nothing was ever going to be deleted. The only real loss is the one you just handed them.',
      },
      {
        label: 'Click through just to read the page and see how serious it is',
        outcome:
          'The clock is winning. "I will just look" under a ten-minute deletion threat is how the page gets you onto it, where the same countdown keeps pushing you to log in. Opening the link is the step the threat was designed to rush you into.',
      },
      {
        label:
          'Ignore the timer and check the account from its official app or site',
        outcome:
          'Safe. You refused to let a countdown set the pace. Opening the service the normal way shows the account is fine, because no real provider destroys your data or funds through a timed link in a notification. The threatened loss was fiction, and the clock only had power if you looked at it instead of at the truth.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is loss aversion, the finding that losses loom roughly twice as large as equivalent gains in how they feel. A message promising you something new is easy to ignore, but a message threatening to take away what you already have grabs you by the throat, because the pain of losing your files or funds is disproportionate to their neutral value. The attacker pairs that threat with a countdown so the fear cannot cool into analysis. Under a deadline, the brain narrows to preventing the loss and drops the step where you would ask whether the threat is legitimate. The shorter the timer, the less thinking survives, which is the entire point. You are not being greedy or gullible, you are protecting something that matters to you, and the attack simply hijacks that protective instinct and aims it at their link.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Filtering and clear internal policy on how account warnings actually arrive help your team. Refusing to be paced by a countdown is the move only you can make when one lands.',
    moves: [
      'A deadline attached to a threat is a manipulation tactic. Real providers do not permanently delete accounts, files, or funds through a timed link you must click now.',
      'When you feel the urge to act before a clock runs out, that urge is the attack. Slowing down costs you nothing real, because the threatened loss is almost always fiction.',
      'Never resolve an account threat through the notification itself. Open the service independently, through its official app or your saved address, and check.',
      'The fear of losing what you have is stronger than it should be. Name that feeling when it spikes, then verify before you act on it.',
    ],
  },
};

export default content;
