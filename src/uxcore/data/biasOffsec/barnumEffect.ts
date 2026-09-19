// Surface is an identity card presented as a "personal security profile" a
// service generated about you. Before is a flat generic profile you ignore;
// after is a set of vague-universal traits that feel uncannily personal. The
// lever is the Barnum effect: statements true of almost anyone read as written
// specifically about you, and that felt accuracy buys trust for the "fix".

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A profile that feels uncannily accurate about you may just be describing everyone. Statements that fit almost anyone feel personal, and that feeling is what sells the fix.',
  scenario:
    'A "free security scan" returns a personal risk profile. The generic version, a flat line about "potential account exposure", you close without reading. The second version lists traits that land: you reuse a password somewhere, you pick convenience over friction, someone in your circle has already been breached. Each one is true of nearly everyone, but read together they feel written about you specifically, and that shock of recognition is what makes you trust the same service when it offers to "secure your account" through its link. The underlying pitch is identical to any phishing scan. What changed is that this one feels personal.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'profile',
      tag: 'A flat, generic profile',
      name: 'Your security profile',
      initial: 'SP',
      title: 'Automated risk summary',
      badges: ['Potential account exposure detected', 'Review recommended'],
      note: 'Bland and impersonal. Nothing on it points to any one person.',
    },
    after: {
      kind: 'profile',
      tag: 'A profile that feels written about you',
      priorContext:
        'Same free scan, same service, same "secure your account" link at the end. Only the wording of the findings changed, from generic to uncannily personal.',
      name: 'Your security profile',
      initial: 'SP',
      title: 'Personalised risk summary, prepared for you',
      badges: [
        'You reuse a password somewhere you should not',
        'You value convenience over friction',
        'Someone in your circle has already been breached',
      ],
      note: 'Every line is true of almost anyone, yet the set reads as a personal portrait. The "how do they know this" jolt is the hook for the fix on offer.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the Barnum effect. We accept vague, broadly true statements as precise, personal insight, especially when they arrive framed as tailored just for us. "You reuse a password somewhere" and "someone in your circle has been breached" apply to nearly everyone alive, but the mind fills the blanks with its own specifics and reads the result as uncanny accuracy. That felt precision is the lever. The trust comes from a sense that the service already knows you, and that manufactured recognition is what makes its recommended fix seem worth following. Attackers write the "findings" to be universally true and personally styled, because a target who feels seen is a target who trusts the link, and the personal resonance costs the attacker nothing to fake.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team runs the real security tooling. Not mistaking a feeling of being seen for actual evidence is your part.',
    moves: [
      'Ask whether each "finding" is true of almost everyone. If it is, it is describing the population, not you, and it proves nothing about the sender.',
      'Separate the diagnosis from the fix. Feeling accurately described is not a reason to trust whatever link or download comes attached.',
      'Distrust unsolicited scans that already seem to know you personally. Real assessments come from tools you or your team chose, not a pop-up that flatters your recognition.',
      'When a profile gives you that "how do they know" jolt, slow down. That reaction is the persuasion working, not confirmation that it is genuine.',
    ],
  },
};

export default content;
