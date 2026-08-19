// Surface is a chat DM. The lever is anecdotal evidence: a single vivid
// story overrides caution that dry facts could not, so the recovery
// "success story" sells the scam the plain pitch never could.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'One vivid story is not evidence. The more moving the testimonial, the harder it is working to skip your judgment.',
  scenario:
    'You lost access to a wallet, and someone in a forum offers a "recovery service". As a flat claim, "we can recover lost funds", you dismiss it. Wrapped in a story, "Sarah thought her savings were gone, she was in tears, then this team recovered every cent in two days, here is her thank-you message", the same offer suddenly feels trustworthy. Nothing was proven. A story just walked past the guard that data could not.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'A dry claim',
      senderName: 'RecoverySupport',
      senderHandle: 'forum DM',
      timestamp: '5:03 PM',
      body: 'We offer fund recovery services for lost or stolen crypto. Success rates vary. Contact us to begin. (Flat and unconvincing, you scroll past.)',
    },
    after: {
      kind: 'chat',
      tag: 'The same claim, as a story',
      senderName: 'RecoverySupport',
      senderHandle: 'forum DM',
      timestamp: '5:03 PM',
      body: 'Sarah had given up. Life savings, gone, she was in tears. Our team traced it and recovered every cent in 48 hours. She sent us this: "You saved my family." We can do the same for you, just cover the upfront tracing fee.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the pull of anecdotal evidence. A single vivid, emotional story lands harder than any statistic, because your mind is built to learn from concrete cases, not base rates. "Sarah cried, then got it all back" is easy to picture and impossible to verify, and the tears do the persuading while the missing proof goes unnoticed. One unverifiable story tells you nothing about whether the service is real, how often it works, or whether Sarah exists. But it feels like proof, and feeling like proof is all the attacker needs to get your upfront fee.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team deals in evidence. Refusing to be moved by a story instead is your part.',
    moves: [
      'A testimonial is a story, not data. Ask what you could actually check, then notice you can check none of it.',
      'The stronger the emotional pull, the more suspicious the claim deserves to be. Feeling is being used in place of proof.',
      'Any service asking for an upfront fee to recover lost funds is the second scam after the first. Real recovery does not work this way.',
      'Swap the story for the numbers. If the offer cannot survive without Sarah’s tears, it has nothing behind it.',
    ],
  },
};

export default content;
