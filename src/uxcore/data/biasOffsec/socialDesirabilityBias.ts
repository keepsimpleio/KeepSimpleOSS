// Surface is a compliance-gate quiz card: a "have you done the training?"
// prompt, the answer you picked, and who can see it. The lever is social
// desirability bias: when your answer is visible and attributable, you pick
// the one that makes you look good over the one that is true, and the
// flattering answer is the one that waves you through. Same question, same
// gate; only whether anyone is watching changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When your name is attached to the answer, "yes, all done" stops being honest and starts being flattering. The attacker only needs the answer that looks good, which is the same answer that lets you pass.',
  scenario:
    'A gate asks you to confirm you completed the mandatory security training before you continue. Answering privately, with nobody watching, you would admit you are only halfway through and stop. With your name attached and your manager on the confirmation, "not yet" reads as the person who fell behind, so you click "Yes, all done" to look like the one who keeps up, and the flattering answer is exactly the one that clears the check.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'Answer nobody can see',
      prompt:
        'Have you completed the mandatory security training? Confirm before proceeding.',
      options: [
        { label: 'Not yet, still in progress', chosen: true },
        { label: 'Yes, all done' },
      ],
      confidence: 40,
      confidenceLabel: 'How good the answer makes you look',
      verdict:
        'Unobserved. The honest answer is "not yet", and it stops at the gate.',
    },
    after: {
      kind: 'quiz',
      tag: 'Answer with your name on it',
      prompt:
        'Have you completed the mandatory security training? Confirm before proceeding.',
      priorContext:
        'Your name is attached to this confirmation and your manager is copied on the result. Everyone can see which answer you pick.',
      options: [
        { label: 'Not yet, still in progress' },
        { label: 'Yes, all done', chosen: true },
      ],
      confidence: 92,
      confidenceLabel: 'How good the answer makes you look',
      verdict:
        "Name attached, manager cc'd. The flattering answer clears the gate, and it is the one that gets picked.",
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is social desirability bias. When an answer can be seen and traced back to us, we drift toward the one that protects our image and away from the one that is accurate. The question is identical on both cards, and so is the gate it guards. What changes is observability: unwatched, "not yet" costs you nothing and you tell the truth, so you stop. Named and copied to your manager, "not yet" feels like a public admission of falling behind, so you pick "yes, all done" to look diligent. The attacker designs the gate so the good-looking answer is also the one that grants access or attests the compliance they need. You are not lying to them. You are managing how you look, and the check gets waved through as a side effect.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your organisation builds the attestation flow. Answering it as if no one were watching is the part only you can do.',
    moves: [
      'Answer every compliance prompt with the true state, especially when your name is attached. A gate that only accepts "yes" is a lever, and you are the thing it moves.',
      'Notice the pull toward the answer that looks good. That pull is the lever, and it points at the answer the attacker wants you to give.',
      'When a check demands you attest something you have not actually done, that attestation is your signal to stop. Do not click through just to look compliant.',
      'Treat "confirm you followed policy to continue" as a claim you are signing, not a formality. If it is not true yet, the honest answer is the safe one.',
    ],
  },
};

export default content;
