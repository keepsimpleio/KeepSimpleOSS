// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the processing
// difficulty effect: cognitive effort creates a stronger memory trace and
// forces deeper engagement, so work you perform by hand feels like proof. The
// attacker hands the victim effortful manual steps to complete, and the labor
// itself breeds commitment and belief.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Work you do by hand feels like proof. The more steps an attacker makes you complete yourself, the more you believe the thing you just built and the more clearly you remember doing it.',
  scenario:
    'A support page tells you to fix a flagged security issue by opening your terminal and typing a specific command yourself, then reading back the confirmation it prints. It is deliberately effortful: a long string, exact syntax, no shortcut. None of that work verifies anything, but performing it changes how you feel about it. You engaged deeply, you did every step, so the mind credits the effort as evidence: I did all that, it must be legitimate. And because it took real work, you remember doing it clearly and defend the decision afterward. The command was the attack. The effort was the persuasion.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: make them do the work by hand',
      steps: [
        {
          label: 'Hand them real work to perform',
          note: 'A long command to type out, a manual config to run, a code to transcribe. No copy-paste shortcut, so completing it takes attention.',
          active: true,
        },
        {
          label: 'Make the steps exact and effortful',
          note: 'Precise syntax, an order to follow, an output to read back. The friction is the point, not a flaw.',
        },
        {
          label: 'Let the effort become the proof',
          note: 'The labor they put in reads as verification. "I did all that, it must be real" does the convincing.',
        },
        {
          label: 'Cement it in memory',
          note: 'Because it took effort, they remember doing it vividly and defend the choice later instead of doubting it.',
        },
      ],
      footer:
        'The effort does the persuading. The work they do by hand is the con.',
    },
    after: {
      kind: 'browser',
      tag: 'The plan, as it lands on you',
      protocol: 'https',
      host: 'workspace-security-fix.co',
      path: '/resolve/manual',
      pageHeading: 'Resolve the flagged sign-in manually',
      pageBody:
        'Our automated fix could not run on your device, so please complete it by hand. Open your terminal and type the following command exactly, then press Enter: setup-trust --grant device --token 8842-QK. When it prints a six-character confirmation, type that code into the box below to close the alert.',
      cta: 'I have run the command',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the processing difficulty effect. Effortful, disfluent material forces deeper engagement and lays down a stronger memory trace than something you skim, which is why a hard-won conclusion feels more owned than an easy one. That is genuinely useful when the effort is spent on real understanding. An attacker turns it against you by manufacturing effort that verifies nothing: a long command you type by hand, a manual config you run, a code you transcribe. The labor is real, so your mind treats it as proof and rewards it with commitment, and because you worked for it you remember the steps clearly and defend them if challenged. This is not fluency, where ease reads as truth. It is the opposite face of the same coin, where the sweat of doing something by hand is mistaken for having verified it. The command did the damage. The effort you spent on it is exactly why you trusted it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Effort is not verification. The fact that a fix was hard to perform tells you nothing about whether it was real.',
    moves: [
      'Never run a command, config or script that a message tells you to type or paste, no matter how official the page looks. The instruction to do it by hand is the attack, not the fix.',
      'Notice when you trust something because you worked for it. The labor you put in is not evidence the task was legitimate; an attacker chose the effort precisely to make it feel that way.',
      'A real security fix does not route through you typing commands into a terminal from an outside page. Genuine remediation happens inside the service, initiated by you.',
      'Stop and verify the flagged issue through the service directly, from a session you opened yourself. If the alert is not there, the manual steps were the whole con.',
    ],
  },
};

export default content;
