// No quoted figures by policy. Before = the document surface: the
// verification rule you signed in a cold, calm state, "no exceptions".
// After = the call surface: Friday evening, a cloned executive voice,
// a closing deal. Same rule, same person, but a hot state is deciding
// now. The lever is the state switch, not new information.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The rule you wrote calmly gets tested on the worst evening of your quarter, by a version of you who did not write it. Make the check mechanical so it survives a state you cannot imagine while calm.',
  scenario:
    'On a calm Tuesday you sign the rule: every payment change gets a callback, no exceptions, including management. On Friday at 6:52 PM a voice that sounds exactly like your CEO is boarding a plane, the deal "dies tonight", and the person deciding whether the rule still applies is not the person who signed it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'The rule, signed in a cold state',
      docLabel: 'Signed procedure',
      title: 'Payment release: verification rule',
      meta: 'Finance operations · acknowledged and signed by you',
      body: 'Any change to payment instructions (amount, account, or urgency) is confirmed by a callback to the number on file before release. This applies to all requests without exception, including those from senior management.',
      footer:
        'Signed on a quiet morning, certain you would never need reminding.',
    },
    after: {
      kind: 'call',
      tag: 'The same rule at 6:52 PM Friday',
      callerName: 'Your CEO, or a voice wearing him',
      callerLabel: 'Mobile · caller ID says his name',
      timestamp: 'Fri, 6:52 PM',
      transcript:
        'I am boarding, I have thirty seconds. The escrow on the acquisition closes tonight. Wire the retainer now and I will sign everything when I land. I picked you because you get things done. Do not let this die in paperwork.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'When you are calm, you cannot really predict how you will act under pressure. That is the empathy gap. The rule felt easy to keep on a quiet morning, so you never prepared for the moment when it would not be. The attacker does not try to beat your judgment. They swap out which version of you is judging: tired, rushed, flattered, afraid of killing a deal. The cloned voice supplies authority, the deadline supplies pressure, and the flattery gives you a reason to make an exception. Hot and stressed, you conclude that the rule was written for smaller situations than this one.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Decide now what the panicked future version of you will do, and make it mechanical: one callback number, from the file, used every single time. A rule that leaves room for judgment will lose to a bad enough Friday evening.',
      'Script the sentence in advance and rehearse it: "I will call you right back on the number we have on file, two minutes." Real executives survive two minutes. Scripts survive pressure; intentions do not.',
      'A voice is not an identity. Cloning a voice from public recordings is cheap and common now. The more a caller sounds exactly like the boss, the less that proves.',
      'Treat resistance to the callback as the strongest signal in the whole exchange. Anyone who fights a two-minute check on a money transfer has just told you what the call is.',
    ],
  },
};

export default content;
