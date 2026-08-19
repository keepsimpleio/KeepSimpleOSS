// Surface is a self-assessment quiz card: a "spot the phish" prompt, the
// option you picked, and a confidence meter. The lever is the overconfidence
// effect: your felt certainty runs well ahead of your actual accuracy, and it
// is that gap, high confidence over shaky judgement, that an attacker
// harvests. The prompt and the payload are identical; only how sure you feel
// separates the two cards.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Being sure and being right are different things. The more certain you feel that you could never be phished, the less you check, which is exactly the opening.',
  scenario:
    'A convincing "IT security" email asks you to reauthenticate through a link. Prompted to actually rate it, you would sit at a cautious middle: probably fine, but worth a check. Feeling like the office expert who has never been fooled, you jump straight to certain, mark it safe, and click, because a person who is sure does not verify.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'Confidence matched to reality',
      prompt: 'Is this reauthentication email safe to act on?',
      options: [
        { label: 'Verify first' },
        { label: 'Looks safe', chosen: true },
      ],
      confidence: 55,
      confidenceLabel: 'How sure you are',
      verdict:
        'Confidence low enough to leave room for a check of the sender and link.',
    },
    after: {
      kind: 'quiz',
      tag: 'Confidence far past reality',
      prompt: 'Is this reauthentication email safe to act on?',
      priorContext:
        'You are the person colleagues forward suspicious mail to. You have never been caught. You are sure you never will be.',
      options: [
        { label: 'Verify first' },
        { label: 'Looks safe', chosen: true },
      ],
      confidence: 98,
      confidenceLabel: 'How sure you are',
      verdict:
        'Too sure to run a single check. The link opens before doubt arrives.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the overconfidence effect. Across almost every domain, people rate their own judgement as more accurate than it actually is, and the gap is widest exactly where they feel most expert. The email is identical in both cards. What changes is the meter: at a cautious 55 you leave room to verify, and at a certain 98 verification feels beneath you. Confidence feels identical to competence from the inside, and it quietly replaces the checks that competence would actually run. Attackers do not need you to be careless. They need you to be certain, because certainty is what switches the checking off.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can run the drills. Not trusting your own certainty is the part only you can do.',
    moves: [
      'Treat high confidence as a prompt to verify, not a reason to skip it. The surer you feel, the more the check is worth running.',
      'Make verification a fixed step, not a judgement call. A habit runs even when your confidence has talked your judgement out of the room.',
      'The belief "I could never fall for this" is a risk state. It is the precondition for falling for it, not protection against it.',
      'Being the person others trust to spot phishing means you are a target worth more effort. Apply the same checks to your own inbox that you apply to theirs.',
    ],
  },
};

export default content;
