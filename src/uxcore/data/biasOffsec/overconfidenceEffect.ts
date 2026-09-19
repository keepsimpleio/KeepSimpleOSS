// Surface is a self-assessment quiz card: a senior engineer deciding whether
// to pull a dependency straight into the production build, the option picked,
// and a confidence meter. The lever is the overconfidence effect: felt
// certainty runs well ahead of actual accuracy, and the gap is widest where
// you feel most expert. The decision and the package are identical across
// both cards; only how sure the engineer feels separates them, and the stakes
// are a poisoned build shipping to every customer.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Being sure and being right are different things. The engineer most certain they can eyeball malicious code is the one who skips the scan that would have caught it.',
  scenario:
    'A popular library ships a new release your service needs, and a typo-similar package sits next to it in the registry. You are about to pull it into the production build that deploys to every customer. Asked to actually rate your certainty, you would land at a cautious middle: probably the real one, but the lockfile hash and the publisher are worth thirty seconds. Feeling like the senior who has read a thousand diffs and never been fooled, you jump to certain, wave it in, and ship. The typosquatted build runs its install script on every machine it lands on.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'Confidence matched to reality',
      prompt: 'Pull this dependency straight into the production build?',
      options: [
        { label: 'Verify publisher and hash first', chosen: true },
        { label: 'Looks legit, ship it' },
      ],
      confidence: 55,
      confidenceLabel: 'How sure you are',
      verdict:
        'Unsure enough to check the publisher, the download count, and the lockfile hash before it merges.',
    },
    after: {
      kind: 'quiz',
      tag: 'Confidence far past reality',
      prompt: 'Pull this dependency straight into the production build?',
      priorContext:
        'You are the staff engineer the team trusts to catch this exact thing in review. You never have been fooled. You are sure you never will be.',
      options: [
        { label: 'Verify publisher and hash first' },
        { label: 'Looks legit, ship it', chosen: true },
      ],
      confidence: 98,
      confidenceLabel: 'How sure you are',
      verdict:
        'Too sure to run a single check. The typosquatted package merges and its install script fires across production.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the overconfidence effect. Across almost every domain, people rate their own judgement as more accurate than it actually is, and the gap is widest exactly where they feel most expert. The decision is identical in both cards: the same package, the same production build. What changes is the meter. At a cautious 55 you still run the publisher check and the hash compare that expose a typosquat instantly. At a certain 98 those checks feel beneath you, because confidence feels identical to competence from the inside and quietly replaces the verification that competence would actually run. A supply-chain attacker does not need the whole team to be careless. They need the one person with merge rights to be certain, because certainty is what switches the checking off, and one waved-through package ships to everyone downstream.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your pipeline can enforce the checks. Not trusting your own certainty enough to skip them is the part only you can do.',
    moves: [
      'Treat high confidence as the trigger to verify, not the reason to skip it. On anything that reaches production, the surer you feel, the more the thirty-second check earns its place.',
      'Make dependency and artifact verification a pipeline gate, not a judgement call. A hash pin and a publisher check run even when the reviewer is certain by eye.',
      'The belief "I would spot it in review" is a risk state, not a control. It is the precondition for merging the thing you would have caught, not protection against it.',
      'The more senior you are, the more your single approval ships to everyone downstream. Apply the checks hardest exactly where your judgement is trusted most.',
    ],
  },
};

export default content;
