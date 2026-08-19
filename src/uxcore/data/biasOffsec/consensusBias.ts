// Surface is an approval prompt dressed up as a team adoption tracker: metric
// tiles that claim most of your colleagues have already done the thing being
// asked of you. The lever is consensus bias (false consensus): "everyone else
// already approved" makes a suspicious action feel safe and overdue. NOTE:
// the "94%" and "1 of 3 remaining" figures are the ATTACKER'S fabricated
// claim, shown inside the scenario as a lie the card displays. We assert no
// real-world statistic; the numbers exist only as the con's invented pressure.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A number that says most of your team already agreed is the easiest thing in the world to invent, and the hardest to argue with in the moment. "Everyone else did it" is a claim, not a fact, and an attacker can type it as freely as anyone.',
  scenario:
    'A prompt asks you to authorize a new device for a shared mailbox. On its own it reads as an odd, out-of-band request and you stop to question it. Wrapped in a tracker claiming "94% of your team already approved" and "you are 1 of 3 remaining", the same ask reframes as the last box holding everyone up. The percentages are the attacker\'s invention, printed on the screen to manufacture a crowd that never voted, and the pressure to stop being the outlier does the rest.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'stats',
      tag: 'The ask, standing alone',
      title: 'Authorize device access',
      tiles: [
        { label: 'Request', value: 'New device', trend: 'flat', flagged: true },
        { label: 'Mailbox', value: 'Shared / Finance', trend: 'flat' },
        { label: 'Requested by', value: 'IT provisioning', trend: 'flat' },
      ],
      note: 'A solo authorization request with no crowd behind it.',
    },
    after: {
      kind: 'stats',
      tag: 'The same ask, wrapped in a fabricated crowd',
      title: 'Authorize device access',
      priorContext:
        "The tracker frames you as the last holdout. The adoption figures below are the attacker's invention, printed to make a crowd that never existed.",
      tiles: [
        {
          label: 'Team already approved',
          value: '94%',
          trend: 'up',
          flagged: true,
        },
        { label: 'Remaining', value: 'You are 1 of 3', trend: 'down' },
        { label: 'Request', value: 'New device', trend: 'flat' },
      ],
      note: 'The identical device request, now topped with a fabricated adoption count and a "last to approve" line.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is consensus bias, the false-consensus effect turned into a weapon. We read the choices of people like us as evidence about what is safe and correct, so "most of your team already approved" quietly converts a decision into conformity. The request is identical in both cards: authorize a new device for a shared mailbox. What changes is the invented crowd. Alone, the ask has to justify itself and you make it. Framed as 94% done with you as one of three stragglers, the question shifts from "is this legitimate" to "why am I the one holding everyone up", and nobody likes being the outlier. The figures are pure fabrication, typed by the attacker with nothing behind them, but a number on a screen borrows the authority of a real tally. The con does not need the group to agree. It only needs you to believe the group already did.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets who can authorize what and how. Refusing to let a claimed crowd stand in for verification is your part.',
    moves: [
      'Treat "most of your team already approved" as unverified until you have confirmed it with a named colleague through a channel you trust, not the prompt in front of you.',
      'A number that pressures you to conform is a persuasion tactic, not a data point. Adoption stats inside a request exist to move you, and anyone can type them.',
      'Judge the action on its own merits: would you authorize this device if you were genuinely the only person asked? If not, the crowd changes nothing.',
      'Being the last holdout is a good place to be when the ask is wrong. Slowing down under social pressure is the whole defense.',
    ],
  },
};

export default content;
