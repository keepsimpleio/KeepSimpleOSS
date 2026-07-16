// No quoted figures by policy. Before = the document surface: the
// verification rule you signed in a cold, calm state — "no exceptions."
// After = the call surface: Friday evening, a cloned executive voice,
// airport noise, a closing deal. Same rule, same person — but a hot
// state is deciding now. The lever is the state switch, not new
// information.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'On a calm Tuesday you sign the rule: every payment change gets a callback, no exceptions, including management. On Friday at 6:52 PM a voice that sounds exactly like your CEO is boarding a plane, the deal “dies tonight,” and the person deciding whether the rule still applies is not the person who signed it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'The rule — signed in a cold state',
      docLabel: 'Signed procedure',
      title: 'Payment release — verification rule',
      meta: 'Finance operations · acknowledged and signed by you',
      body: 'Any change to payment instructions — amount, account, or urgency — is confirmed by a callback to the number on file before release. This applies to all requests without exception, including those from senior management.',
      footer:
        'Signed on a quiet morning, coffee in hand, certain you’d never need reminding.',
    },
    after: {
      kind: 'call',
      tag: 'The same rule at 6:52 PM Friday',
      callerName: 'Your CEO — or a voice wearing him',
      callerLabel: 'Mobile · caller ID says his name',
      timestamp: 'Fri, 6:52 PM',
      transcript:
        'I’m boarding, I have thirty seconds. The escrow on the acquisition closes tonight — wire the retainer now and I’ll sign everything when I land. I picked you because you get things done. Don’t let this die in paperwork.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'In a cold state, you cannot truly simulate what pressure feels like — so the rule you sign feels effortless to keep, and you never build defenses for the moment it won’t be. That’s the empathy gap: calm-you and stressed-you are strangers who happen to share a signature. The attacker’s craft isn’t defeating your judgment; it’s swapping which version of you is judging. Voice cloning supplies the authority, the deadline supplies the heat, the flattery supplies the exit ramp — and hot-you concludes, sincerely, that this one time the rule was written for lesser situations than this.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Decide now what panicked-future-you will do, and make it mechanical: one callback number, from the file, used every single time. A rule with judgment left in it will lose to a sufficiently good Friday evening.',
      'Script the sentence in advance and rehearse it: “I’ll call you right back on the number we have on file — two minutes.” Real executives survive two minutes. Scripts survive pressure; intentions don’t.',
      'A voice is not an identity. Cloning a voice from public recordings is commodity tooling now — the more a caller sounds unmistakably like the boss, the less that proves.',
      'Treat resistance to the callback as the strongest signal in the exchange. Anyone who fights a two-minute verification of a money movement has just told you what the call is.',
    ],
  },
};

export default content;
