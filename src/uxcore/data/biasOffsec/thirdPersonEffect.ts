// Surface pair: the security-awareness poster itself, then a chat where a
// colleague forwards a photo of it with a joke. The lever is the third-person
// effect: warnings are assumed to be aimed at other, more gullible people.
// The poster never changes. The flagged card renders the dismissive read as
// its own artifact: the message that files the warning under "for the folks
// who click everything" and exempts the sender from the habit it teaches.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The awareness poster is not aimed at the naive people down the hall. It is aimed at you, and the moment you decide it is about someone else is the moment it stops protecting you.',
  scenario:
    'A poster by the coffee machine warns that credential-harvesting QR codes look exactly like real sign-in prompts and tells you to verify before you scan. Read as "this could be me", it installs a habit. Read as material for a joke about the sales team, it installs nothing: the person laughing files themselves as the exception, feels briefly superior, and scans the next lookalike code without the pause the poster tried to give them. The self-exemption, not the code, is what gets them.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'poster',
      tag: 'The warning, as printed',
      heading: 'That sign-in QR could be harvesting your password.',
      body: 'Fake login codes look identical to real ones. Before you scan, confirm where it goes. It only takes one rushed morning, and it happens to careful people too.',
      qrCaption: 'Verify the destination before you scan. Yes, you.',
    },
    after: {
      kind: 'chat',
      tag: 'The warning, as read',
      senderName: 'Teammate',
      senderHandle: '#general',
      timestamp: '9:12 AM',
      attachment: '📷 kitchen-poster.jpg',
      body: 'lol they papered the whole floor with these. good, finally something for the people who click everything 😅',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the third-person effect. People consistently believe persuasion, propaganda, and scams hit others harder than themselves, so a warning aimed at everyone gets silently rerouted to "everyone but me". The poster in both cards is the same. What the chat shows is the rerouting happening in public: the warning arrives, gets assigned to an imagined gullible audience, and bounces off the one person it just reached. That is the trap, because "I would never fall for this" is exactly the state that stops you checking, and not checking is the whole vulnerability. Attackers do not need you to be foolish. They need you to be sure the message is for the foolish, so the one instruction that would have saved you slides straight past.',
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
