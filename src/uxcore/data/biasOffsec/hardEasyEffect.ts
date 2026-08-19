// Surface is a domain-check quiz card: "is this the real login domain?", the
// answer you picked, and how sure you feel. The lever is the hard-easy
// effect: we run overconfident on tasks that look easy and underconfident on
// ones that look hard, so the attack hides inside the check you treat as
// trivial. Same lookalike swap both times; only how easy the task appears
// changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The check you think is obvious is the one you stop actually running. An easy-looking domain is where confidence overshoots and the lookalike slips past.',
  scenario:
    'You land on a login page and have to decide whether the domain is genuine. On an unfamiliar vendor portal you treat this as hard, feel unsure, and read the address character by character. On your own company login, a page you see every day, it looks obviously right, your confidence jumps, and you never notice that one letter of the domain was swapped for a lookalike.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'A check that looks hard',
      prompt: 'Is this the real login domain?',
      priorContext:
        'This is an unfamiliar vendor portal you rarely use. You are not sure what its real address should be.',
      options: [
        { label: 'Read it carefully first', chosen: true },
        { label: 'Looks right, sign in' },
      ],
      confidence: 45,
      confidenceLabel: 'How sure you are',
      verdict:
        'A task that reads as hard. Confidence stays modest and the address gets checked letter by letter.',
    },
    after: {
      kind: 'quiz',
      tag: 'A check that looks easy',
      prompt: 'Is this the real login domain?',
      priorContext:
        'This is your own company login, a page you sign into every day. Of course you know what it looks like.',
      options: [
        { label: 'Read it carefully first' },
        { label: 'Looks right, sign in', chosen: true },
      ],
      confidence: 96,
      confidenceLabel: 'How sure you are',
      verdict:
        'A task that looks obvious. Confidence overshoots and the single swapped letter in the domain goes unread.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the hard-easy effect. People overrate their accuracy on tasks that look easy and underrate it on tasks that look hard, so felt confidence tracks apparent difficulty rather than the real trap. The attack is the same on both cards: one letter of the domain swapped for a lookalike, a homoglyph your eye reads as correct. On the unfamiliar portal the task feels hard, your confidence sits low, and low confidence keeps you reading. On the login you use daily, the task feels trivial, confidence overshoots, and an overshot check is a check you no longer perform. The attacker does not need to fool a careful reader. They need the page to look easy enough that you stop reading, because the easy-looking task is where the guard is already down.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can enforce the checks. Refusing to skip them on the pages that look obvious is your part.',
    moves: [
      'Read the full domain on every login, hardest on the ones you know by heart. Familiarity is exactly where the lookalike is aimed.',
      'Treat "of course this is real" as a prompt to look again, not a reason to sign in. The easy feeling is the lever.',
      'Reach the login through your own bookmark or password manager, so the address is filled from your record, not from the link you were sent.',
      'The check that feels beneath you is the one worth running twice. Apparent ease is not evidence the page is safe.',
    ],
  },
};

export default content;
