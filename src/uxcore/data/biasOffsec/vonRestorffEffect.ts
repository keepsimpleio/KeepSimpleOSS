// Surface is a stream of MFA push approvals. The lever is pure visual
// distinctiveness: before and after carry the exact same rogue approval,
// and the only thing that changes is whether it blends into the day's
// identical prompts or is engineered to be the one that stands out.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'All week your Authenticator app buzzes with the same grey "approve sign-in" prompts, and you tap them half-awake. One of them is not yours: an attacker holds your password and is knocking. Whether you catch it comes down to one thing, whether that rogue prompt looks like all the others or like nothing else on your screen.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Lost in the stream',
      appName: 'Authenticator',
      timestamp: '11:14 AM',
      title: 'Approve sign-in request',
      body: 'A sign-in is waiting for approval. Tap to review the request.',
    },
    after: {
      kind: 'notification',
      tag: 'Built to stand out',
      appName: 'Authenticator',
      timestamp: '2:03 AM',
      priorContext:
        'Buried in a day of identical grey approvals, this one arrives alone in the middle of the night, loud where the others were quiet.',
      title: '⚠ CRITICAL: unrecognized sign-in, approve now to secure account',
      body: 'Unusual access detected. Approve immediately to lock out the intruder before your account is compromised.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the Von Restorff effect, the isolation effect. When one item breaks the pattern around it, your attention snaps to it and your memory keeps it. Everything about the loud prompt is designed to be the exception: the hour, the red, the word "critical". Your brain reads "different" as "important" and rewards it with the tap the quiet prompts never earned. The distinctiveness is doing the persuading, not the content. The same request, styled like all the others, would have died in the noise.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'The perimeter is your security team’s job. Reading your own prompts is yours.',
    moves: [
      'A prompt that breaks the pattern is not more trustworthy, it is more designed. The urgency and the styling are the manipulation, treat "this one looks different" as a reason to slow down.',
      'Only ever approve a request you personally started seconds ago. An approval you did not trigger is someone else trying your password, deny it.',
      'Prefer number-matching or a hardware key over one-tap approve. A prompt you have to actively answer is far harder to fatigue you into.',
      'A single unexpected approval means your password is already known. Report it and change that password, the knock will come again.',
    ],
  },
};

export default content;
