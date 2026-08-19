// Surface is a prize email. The lever is neglect of probability: a huge
// enough outcome makes people stop weighing how likely it is, so the size
// of the jackpot does the persuading the odds never survive.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When the prize (or the disaster) is huge, you forget to ask how likely it is. Attackers pay you in outcomes so you never price the odds.',
  scenario:
    'An email says you have come into money. A modest, believable amount, and you calmly weigh whether it is real. A life-changing jackpot, and something else happens: you stop asking "how likely is this?" entirely and start planning what you would do with it. Same email, same request to "confirm your details to release the funds". The bigger the number, the quieter the part of you that checks the odds.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'A modest outcome',
      sender: 'claims@rewards-clearing.com',
      timestamp: '9:15 AM',
      subject: 'A small refund is available',
      preview:
        'You are eligible for a $12 credit. Confirm your details to receive it.',
    },
    after: {
      kind: 'email',
      tag: 'An enormous outcome',
      sender: 'claims@rewards-clearing.com',
      timestamp: '9:15 AM',
      subject: 'You have won $2,400,000 in the annual draw',
      preview:
        'Congratulations, your reference was selected for a $2.4 million prize. Confirm your identity and banking details to release the funds.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is neglect of probability. We are poor at holding likelihood and magnitude in mind at once, and a big enough outcome simply crowds the odds out. Two point four million dollars is so vivid that "but what are the chances this is real?" never gets asked. The attacker is paying you entirely in outcome, a jackpot to chase or a catastrophe to flee, precisely so you never price the probability, which is near zero. Small numbers keep your judgment on. Enormous ones switch it off, and that switch is the whole attack.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can flag the scam. Asking "how likely is this, really?" is the question only you can ask in the moment.',
    moves: [
      'When an outcome feels huge, that is your cue to force the probability question back in: what are the actual chances this is genuine?',
      'You cannot win a draw you never entered, and no real windfall needs your banking details to "release" it.',
      'Notice the trade the attacker is making: a giant outcome in exchange for you not thinking about the odds. Refuse the trade.',
      'Catastrophe framing works the same way. "Your data could be sold to criminals now" is an outcome hiding a near-zero probability.',
    ],
  },
};

export default content;
