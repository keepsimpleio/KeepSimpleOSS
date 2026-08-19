// Surface is a pair of gauges around the same moment: mid-call, you hesitate
// before reading back a one-time code. The lever is the illusion of
// transparency: you overestimate how much of your inner state leaks out. The
// before card measures what the caller can actually read from a pause on a
// phone line. The after card measures how exposed that same pause feels, and
// the gap between the two meters is the whole attack surface.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: "Your nervousness is far less visible than it feels. When you push through a check just so you will not look suspicious, the fear of being read is doing the attacker's work.",
  scenario:
    'A caller from "account security" is walking you through a verification and asks you to read back the code just texted to you. You hesitate, which is the healthy signal firing. What the caller actually perceives is a quiet phone line for two seconds. What you feel is that your doubt is broadcast in high definition and that stalling makes you sound guilty. People act on the felt version: to stop seeming suspicious, they read the code out, and the pause that should have saved the account becomes the reason it is lost.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'What the caller can actually read',
      prompt:
        'Mid-call, you go quiet for two seconds before reading back the one-time code.',
      confidence: 8,
      confidenceLabel: 'How much of your doubt crosses the line',
      verdict:
        'A pause on a phone line reads as a pause. Nothing else crosses.',
    },
    after: {
      kind: 'quiz',
      tag: 'What the same pause feels like',
      prompt:
        'Mid-call, you go quiet for two seconds before reading back the one-time code.',
      priorContext:
        'The caller is waiting. Every half-second of silence feels louder than the last.',
      confidence: 92,
      confidenceLabel: 'How exposed the hesitation feels',
      verdict:
        'The doubt feels broadcast, and reading the code out feels like the only way to stop looking guilty.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of transparency. We overestimate how much of our inner state other people can perceive, so a private flicker of doubt feels like a neon sign the caller is reading in real time. The moment is identical in both cards: the same two-second pause. Down the wire it is almost nothing, a beat of silence. From the inside it feels like a confession in progress, and the instinct is to smother it by acting cooperative, which on this call means handing over the code. The attacker does not need to overcome your caution. They need you to feel your caution showing, because a person trying not to look suspicious complies faster than a calm one.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your bank and IT set the real verification channels. Not performing calm for a stranger is your part.',
    moves: [
      'A real institution never needs you to read back a one-time code. That step is the tell, no matter how cooperative you feel pressured to look.',
      'Hesitation is not evidence against you. A caller cannot see your nerves, and a legitimate one does not care that you paused to check.',
      'End the call and dial the number on your card or statement. Looking cautious to a stranger costs nothing. Handing them a code costs the account.',
      'Notice the urge to seem cooperative so you do not look suspicious. That felt exposure is the lever, so let it stop you rather than speed you up.',
    ],
  },
};

export default content;
