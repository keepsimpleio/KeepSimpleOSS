// Surface is an approval prompt. The lever is observer-expectancy: when you
// are told what to expect, you read ambiguous evidence to match it and act
// to confirm it. The same rogue prompt is scrutinized when it arrives cold
// and waved through when a caller primed you to expect it seconds earlier.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  technique: {
    label: 'Prompt-priming vishing',
    tell: 'If someone warns you a prompt is about to appear and tells you to just approve it, they are scripting your reaction before the trap arrives.',
  },
  scenario:
    'Your phone is about to show an approval prompt an attacker triggered with your stolen password. Cold, with no warm-up, you would squint at it and deny. But if a caller claiming to be from IT has just told you "I am running a quick check, you will get a prompt in a second, that is normal, go ahead and approve it", the same prompt arrives pre-labeled as routine, and you approve the expectation instead of reading the request.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Arrives cold',
      appName: 'Authenticator',
      timestamp: 'now',
      title: 'Approve sign-in request',
      body: 'A sign-in is waiting for approval. Approve or deny this request.',
    },
    after: {
      kind: 'notification',
      tag: 'Arrives exactly as foretold',
      appName: 'Authenticator',
      timestamp: 'now',
      priorContext:
        'Thirty seconds ago a "technician" on the phone said: "I am pushing a verification now, you will see a prompt, it is completely routine, just approve it for me."',
      title: 'Approve sign-in request',
      body: 'A sign-in is waiting for approval. Approve or deny this request.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the observer-expectancy effect. Once you have been told what you are about to see, you unconsciously interpret whatever arrives to fit that expectation, and you behave in the way that confirms it. The cold prompt is ambiguous, so you would stop and question it. The primed prompt is identical, but it now carries a label the caller installed in your head, "routine, just approve it", and you greet it as the expected event rather than reading it as a fresh request for access. Nothing about the prompt changed. Your expectation, planted by someone else, did the approving for you.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can trace a rogue sign-in. It cannot un-approve the one you were talked into.',
    moves: [
      'No real technician pre-announces an approval prompt and tells you to approve it. That sentence is the attack, not the support.',
      'A prompt you were told to expect deserves more suspicion, not less. Being primed is the manipulation, not a reassurance.',
      'Hang up and reach IT through a channel you already trust before you touch any prompt. A genuine request survives you calling back.',
      'Approve only requests you personally started. If a prompt appears because someone else said it would, deny it and report the call.',
    ],
  },
};

export default content;
