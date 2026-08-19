// Surface is a printed security-awareness poster with a QR code. The lever
// is the third-person effect: you assume scams and persuasion work on other,
// more gullible people but never on you, so the warning bounces off and you
// stay the one who clicks. The poster is identical both ways. Only the read
// changes: "this could be me" versus "this is for the folks who fall for
// stuff", and the second read exempts you from the very habit it teaches.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The awareness poster is not aimed at the naive people down the hall. It is aimed at you, and the moment you decide it is about someone else is the moment it stops protecting you.',
  scenario:
    'The same poster is taped by the coffee machine: a warning that credential-harvesting QR codes look exactly like normal sign-in prompts, and a line telling you to verify the link before you scan. Read as "this could be me", it lands and you build the habit of checking. Read as "this is a reminder for the sales team, who fall for anything", you nod, feel briefly superior, and scan the next lookalike code without the pause the poster just tried to give you. The self-exemption, not the code, is what gets you.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'poster',
      tag: 'Read as "this could be me"',
      heading: 'That sign-in QR could be harvesting your password.',
      body: 'Fake login codes look identical to real ones. Before you scan, confirm where it goes. It only takes one rushed morning, and it happens to careful people too.',
      qrCaption: 'Verify the destination before you scan. Yes, you.',
    },
    after: {
      kind: 'poster',
      tag: 'Read as "this is for the gullible ones"',
      priorContext:
        'Same poster, same words. You just read it on behalf of other people, the ones you assume actually fall for this, and quietly filed yourself as the exception.',
      heading: 'That sign-in QR could be harvesting your password.',
      body: 'Fake login codes look identical to real ones. Before you scan, confirm where it goes. It only takes one rushed morning, and it happens to careful people too.',
      qrCaption: 'Verify the destination before you scan. Yes, you.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the third-person effect. People consistently believe persuasion, propaganda, and scams hit others harder than themselves, so a warning aimed at everyone gets silently rerouted to "everyone but me". The poster is word-for-word identical in both cards. The only thing that moves is who you picture it addressing, and picturing someone else is enough to switch off the habit it was trying to install. That is the trap, because the belief "I would never fall for this" is exactly the state that stops you checking, and not checking is the whole vulnerability. Attackers do not need you to be foolish. They need you to be sure the message is for the foolish, so the one instruction that would have saved you slides straight past. The person most certain the warning is not about them is the easiest one to catch.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your company can paper the walls with warnings. Reading them as if they are addressed to you is the part only you can do.',
    moves: [
      'When a security warning makes you think of a specific gullible colleague, redirect it to yourself first. The habit it teaches is for you, not for them.',
      'Treat "I could never fall for this" as a warning light. That certainty is the exact condition the attack needs, so let it trigger the check instead of skipping it.',
      'Run the habit the poster asks for on your own next action, today, not as a favour to the less careful people you imagine it is really for.',
      'Assume you are inside the target group of every awareness message. The moment you exempt yourself, you have volunteered to be the one who clicks.',
    ],
  },
};

export default content;
