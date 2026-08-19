// Surface is an account-security notification. The lever is negative
// weighting: the same "sign in to verify" ask goes from a neutral,
// keep-your-benefits tone to an imminent-loss threat, and the fear does
// the work the neutral version could not.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A countdown attached to a threatened loss is the attack itself, and the fear is the payload. The harder a message makes your stomach drop, the slower your next move should be.',
  scenario:
    'Your bank, Harborline, seems to want the same thing twice: you, signing in to "verify". The first message offers it as good housekeeping. The second warns your account is hours from suspension and the matter is being escalated. Same link, same fake login. Only one of them makes your stomach drop.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Neutral framing',
      appName: 'Harborline',
      timestamp: 'now',
      title: 'Please verify your account',
      body: 'A routine review is due. Sign in when you have a moment to keep your account features active.',
    },
    after: {
      kind: 'notification',
      tag: 'Loss and threat',
      appName: 'Harborline',
      timestamp: 'now',
      title: 'Final notice: account access suspended in 24 hours',
      body: 'Your account is scheduled for suspension and the case has been referred for review. Sign in within 24 hours to stop the process and avoid losing access to your funds.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is negativity bias. A threatened loss weighs far more than an equivalent gain, and the brain treats it as a threat to survive, not a claim to evaluate. The word "suspended", the countdown, the hint of consequences: they pull blood away from the part of you that checks URLs. Fear compresses the gap between reading and clicking until there is no room left to think. The neutral version asked for the exact same thing and got a shrug, because nothing was at stake. The threat manufactures the stake.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'The network is defended for you. Your own panic is defended by you.',
    moves: [
      'A countdown and a threat of loss are the tell, not the emergency. Real institutions do not delete your account through a link in a scary message.',
      'The bigger the fear a message triggers, the more deliberately slow your next move should be. That surge is the attack landing.',
      'Do not use the link. Open the bank’s app or type the address you already know, and check whether anything is actually wrong.',
      'Forward it to your security team or the bank’s fraud line. If it was a real deadline, they will tell you, and it almost never is.',
    ],
  },
};

export default content;
