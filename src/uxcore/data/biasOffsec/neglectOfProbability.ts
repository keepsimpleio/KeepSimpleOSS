// Surface is a data-breach settlement email, a real and documented scam
// wave: fake claim forms riding publicized class-action settlements. The
// lever is neglect of probability: a big enough payout makes people stop
// weighing how likely it is that the claim is real and about them, so
// the size of the number does the persuading the odds never survive.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When the prize (or the disaster) is huge, you forget to ask how likely it is. Attackers pay you in outcomes so you never price the odds.',
  scenario:
    'An email says a data-breach settlement owes you money. At $18, the typical payout, you weigh it calmly: is this real, was I even affected, is it worth the form? At the "maximum compensation tier", $4,850, something else happens: you stop asking how likely any of this is and start deciding what the money is for. Same email, same ask for your identity and bank details. The bigger the number, the quieter the part of you that checks the odds.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'A modest outcome',
      sender: 'claims@breach-settlement-center.com',
      timestamp: '9:15 AM',
      subject: 'You may be owed money from the Meridian data-breach settlement',
      preview:
        'Records indicate you may be part of the affected class. Most verified claims receive $18. Submit your details to file a claim before the deadline.',
    },
    after: {
      kind: 'email',
      tag: 'An enormous outcome',
      sender: 'claims@breach-settlement-center.com',
      timestamp: '9:15 AM',
      subject: 'Your records qualify for the maximum settlement tier: $4,850',
      preview:
        'Our review shows your exposure in the Meridian breach qualifies you for the maximum compensation tier of $4,850. Confirm your identity and banking details before the deadline to receive payment in full.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is neglect of probability. We are poor at holding likelihood and magnitude in mind at once, and a big enough outcome simply crowds the odds out. At $18 your judgment stays on: you ask whether the settlement is real and whether you are actually in the class. At $4,850 the number is vivid enough to start spending in your head, and the question "how likely is it that I qualify for the top tier of a claim I never filed?" never gets asked. The attacker is paying you entirely in outcome, a windfall to chase or a catastrophe to flee, precisely so you never price the probability. Small numbers keep your judgment on. Big ones switch it off, and that switch is the whole attack.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can flag the scam. Asking "how likely is this, really?" is the question only you can ask in the moment.',
    moves: [
      'The moment you catch yourself planning what to do with the money, stop and force the probability question back in: how likely is it that this is real and about me?',
      'Real settlements are filed through the court-appointed administrator, on a site you find yourself. No legitimate claim needs your banking details through an email link.',
      'Notice the trade the attacker is offering: a big outcome in exchange for you not thinking about the odds. Refuse the trade.',
      'Catastrophe framing works the same way. "All your files will be deleted tonight" is an outcome hiding a near-zero probability. Price the odds, not the drama.',
    ],
  },
};

export default content;
