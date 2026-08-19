// Surface is an identity card. Before is one distinct internal colleague you
// know by face; after is a grid of near-identical outside-contractor avatars.
// The lever is out-group homogeneity: you tell your own people apart at a
// glance but every external face blurs into one, so a scam persona you already
// burned reappears as "just another vendor" and you never recognise the repeat.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'You would spot a swapped teammate instantly, yet every outside contractor looks like the last one. A burned scammer only has to come back wearing a slightly different name.',
  scenario:
    'Three weeks ago a "delivery contractor" tried to talk you into resetting a shipping credential and you shut it down. Today another external contractor asks for the same thing. It is the same person running the same script, but they sit in a wall of interchangeable outside faces you never really distinguish, so the repeat never registers. If a colleague from your own team had been quietly replaced, you would have noticed in a second.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'profile',
      tag: 'Someone from your own team',
      name: 'Priya Venkatesan',
      initial: 'PV',
      title: 'Logistics, desk two rows over',
      note: 'A known colleague. Her face, her voice, and the way she phrases a request are all familiar, and a swap would show at once.',
    },
    after: {
      kind: 'profile',
      tag: 'One of many outside contractors',
      priorContext:
        'Three weeks ago an external "delivery contractor" tried to get you to reset a shipping credential. You refused. The face and name meant nothing to you then and mean nothing now.',
      group: [
        { initial: 'DL', label: 'Delivery partner' },
        { initial: 'DM', label: 'Delivery partner' },
        { initial: 'DR', label: 'Delivery partner' },
        { initial: 'DK', label: 'Delivery partner' },
        { initial: 'DN', label: 'Delivery partner' },
        { initial: 'DS', label: 'Delivery partner' },
      ],
      note: 'Six outside delivery partners, interchangeable at a glance. The persona already refused once is somewhere in this grid, asking again, and it looks exactly like the rest.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is out-group homogeneity. We encode people in our own group as distinct individuals and flatten everyone outside it into a single undifferentiated type: "them", who all look alike. Your teammates get full individual detail, so a substitution jumps out. External contractors get one shared template, so a repeat visitor slides in unrecognised. The request is identical in risk to the one you already refused, but because the second face never separated from the first in your memory, the pattern that should scream "this again" stays silent. Attackers exploit this by recycling the same play across a category you never resolve into individuals, knowing the crowd of near-identical outsiders is exactly where a burned persona can hide in plain sight.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets vendor verification. Refusing to let "just another contractor" collapse into one anonymous blur is your part.',
    moves: [
      'Log external requests against a stable identifier (company, contract, ticket), not a face or a first name. The record remembers the repeat your memory drops.',
      'When an outside party asks for a credential or access change, check whether this exact ask has come before, even if the name looks new.',
      'Treat "all these vendors look the same" as a warning, not a convenience. That blur is the cover a returning attacker counts on.',
      'Give an unfamiliar outsider the same individual scrutiny you would give a teammate acting out of character. Out-group does not mean low risk.',
    ],
  },
};

export default content;
