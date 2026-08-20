// Mode: interactive. The reader clicks, and the itch to push back against a
// restriction does the work. Surface: a chat framing security controls as
// someone stealing your freedom ("IT is blocking you unfairly, here is how to
// get around it"). The lever is reactance: told you cannot do something, you
// want to do the opposite, so you disable the protection to reclaim control.
// The bypass is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Anyone who frames your security controls as unfair restrictions and offers a way around them is the attacker; the restriction was the protection.',
  scenario:
    'A message, posing as a helpful insider, tells you IT is throttling you on purpose and treating you like a child. It offers a workaround: turn off a protection or run their script to get your freedom back. The framing stings, and the fix promises to put you back in control, so you reach to disable the block.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'Marco (workspace)',
      senderHandle: '@marco.helps',
      timestamp: '10:02',
      body: 'IT is blocking you unfairly again, they never ask us. Take back control: turn off the endpoint protection for five minutes and run this, then you can install what you actually need. Your machine, your call.',
    },
    question:
      'The message urges you to disable the protection to reclaim your freedom. Do you?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Turn off the protection and run their script to get my access back',
        trap: true,
        outcome:
          'Trap. The moment protection is off, the script installs cleanly and the attacker owns the machine. You did not decide the block was wrong on the merits; you resented being told no and wanted the opposite. The "unfair restriction" story was built to convert your irritation into the exact click that removes your last defense.',
      },
      {
        label:
          'Leave the protection on and check the restriction with IT directly',
        outcome:
          'Safe. The "restriction" is the protection, and the person telling you to bypass it is the attacker. You kept the control on and asked the real IT channel why the block exists. Reactance wanted you to prove your autonomy by disarming yourself; refusing the bait is the actual exercise of control.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is reactance: when a freedom feels threatened or a restriction feels imposed, we feel a pull to reassert control by doing the forbidden thing, often without weighing whether the restriction was reasonable. An attacker reframes a security control as an insult to your autonomy, and suddenly disabling it feels like standing up for yourself rather than disarming your defenses. The anger at being restricted overrides the calm question of who benefits when the protection comes off. Framing the fix as "your machine, your call" flatters the very independence the bias inflames. You end up defending your freedom by handing control to the person who provoked you.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets the controls and can explain them. Not turning a protection off out of spite is the part only you can do.',
    moves: [
      'When a message frames a security control as an insult and offers a bypass, the framing is the attack. Verify the block with IT, do not disable it.',
      'Notice the flash of "who are they to restrict me" and treat it as a cue to slow down, not as a reason to act.',
      'The person urging you to turn off protection "just for a moment" is the one who benefits when it is off.',
      'Reclaiming control means keeping your defenses and questioning the messenger, not disarming yourself to prove a point.',
    ],
  },
};

export default content;
