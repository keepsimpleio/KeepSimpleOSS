// Surface is a "quick verification" stepper: the exact same process, shown
// once with its true length and once sold as a two-minute job. The lever is
// the planning fallacy: you underestimate how long and how many steps
// something will take, so a "quick 2-minute verification" that keeps adding
// steps keeps you committed past the point you would have refused up front.
// The steps are identical; only how the effort is framed separates the cards.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A task honestly sized gets declined. The same task sold as "almost done" keeps you clicking. When effort is framed shorter than it is, sunk time does the attacker\'s work.',
  scenario:
    'A message says your account needs a "quick 2-minute verification" to avoid a lockout. Shown the real process up front, seven steps across roughly fifteen minutes, you would decline before you started. Sold as one quick step with a bar already near the end, you begin, and each screen adds another step. Because you feel almost done, you keep going through the credential and one-time-code steps you would have refused had you seen them coming.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'progress',
      tag: 'Effort shown honestly',
      title: 'Account verification',
      steps: [
        { label: 'Confirm your email', state: 'active' },
        { label: 'Re-enter your password', state: 'pending' },
        { label: 'Answer two security questions', state: 'pending' },
        { label: 'Read back a one-time code', state: 'pending' },
        { label: 'Re-link your authenticator app', state: 'pending' },
        { label: 'Confirm a backup phone', state: 'pending' },
        { label: 'Review recent devices', state: 'pending' },
      ],
      percent: 8,
      caption:
        'Seven steps, roughly fifteen minutes, a credential and a code handed over along the way. The full length is shown up front.',
    },
    after: {
      kind: 'progress',
      tag: 'Effort framed as almost done',
      title: 'Quick verification (about 2 minutes)',
      priorContext:
        'Same seven steps. This time each is revealed only as you finish the last, and the bar starts near the end so it always feels almost over.',
      steps: [
        { label: 'Confirm your email', state: 'done' },
        { label: 'Re-enter your password', state: 'done' },
        { label: 'Answer two security questions', state: 'done' },
        { label: 'Read back a one-time code', state: 'active' },
        { label: 'Almost done, just one more', state: 'pending' },
      ],
      percent: 85,
      caption:
        'The bar reads "almost done" the whole way while the steps keep arriving. The code step sits near the end, well past the "two minutes" implied.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the planning fallacy. We routinely underestimate how long a task will run and how many steps it hides, even when we have done it before. Attackers weaponise that by selling a long, dangerous process as a quick one. The true version, seven steps and real minutes, is easy to refuse because you can see the cost up front. The framed version shows you one step at a time behind a bar that always reads "almost done", so the cost stays hidden until you are already committed. Once you feel most of the way there, quitting feels like wasting the effort you already spent, so you push through the exact steps you would have rejected cold. The process is identical in both cards. What changes is that the real effort is concealed until the sunk cost has you.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets how real verifications work. Refusing to judge a process by a progress bar is your part.',
    moves: [
      'Judge the request by what it asks for, never by how close the bar looks. A password or one-time code step is a stop, at 8 percent or 85.',
      'A "2-minute verification" that keeps adding steps is the tell. The lengthening is the attack, not a glitch.',
      'Sunk time is not a reason to finish. Steps you would have refused at the start are still worth refusing near the end.',
      "Verify any lockout or verification demand through the account's own app or site, not the link that set the clock ticking.",
    ],
  },
};

export default content;
