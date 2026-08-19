// Surface is a source-trust checklist: two competing security notices about
// the same vulnerability, one real external advisory, one homegrown-looking
// internal notice, shown as a row of trust markers. The lever is
// not-invented-here: you distrust the external source for being external and
// over-trust the internal-looking one for looking homegrown. Both notices are
// identical in the two cards. Only which source you believe changed, and the
// invented-here preference is what flips it to the attacker's notice.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A real external warning gets dismissed for being external, while a homegrown-looking notice gets trusted for looking like yours. "Not from our team" is not the same as "not true".',
  scenario:
    'A genuine security advisory from a vetted external source warns that a library you run has a critical flaw and tells you the correct fix. At the same time an internal-looking notice, styled like your own tooling but actually planted by the attacker, tells you to run a different "patch". When you weight the external advisory as the trusted source, you apply the real fix. When you dismiss it for being external and act on the homegrown-looking notice instead, you run the attacker\'s instructions on your own systems.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'checklist',
      tag: 'You trust the source that earned it',
      title: 'Which security notice do you act on?',
      items: [
        {
          label: 'External advisory: vetted source, signed and reproducible',
          state: 'ok',
        },
        {
          label: 'External advisory: fix matches the vendor record',
          state: 'ok',
        },
        {
          label: 'Internal notice: no ticket, no author you can reach',
          state: 'warn',
        },
        {
          label: 'Internal notice: patch link points off your infrastructure',
          state: 'warn',
        },
      ],
      footer:
        'External advisory weighted on its evidence and trusted. The correct fix goes out.',
    },
    after: {
      kind: 'checklist',
      tag: 'You trust the source that looks like yours',
      title: 'Which security notice do you act on?',
      priorContext:
        'Same two notices, same evidence behind each. Only your preference for homegrown over external changed which one you believed.',
      items: [
        {
          label: 'External advisory: dismissed, not from our team',
          state: 'off',
          flagged: true,
        },
        {
          label: 'External advisory: external source, treated as noise',
          state: 'off',
          flagged: true,
        },
        {
          label: 'Internal notice: looks like our tooling, trusted',
          state: 'ok',
          flagged: true,
        },
        {
          label: 'Internal notice: run this patch now',
          state: 'ok',
          flagged: true,
        },
      ],
      footer:
        'External advisory dismissed as outside noise. The homegrown-looking notice trusted and its patch run.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is not-invented-here. We over-trust what looks homegrown and reflexively discount what comes from outside, regardless of which one is actually correct. The two notices carry the same evidence in both cards: the external advisory is vetted, signed and reproducible, and the internal notice has no ticket, no reachable author and a patch link that leaves your infrastructure. What flips is the weighting. The external warning gets marked as noise for the sole crime of being external, and the homegrown-looking notice gets waved in because it wears your own styling. "Not from our team" quietly becomes "not to be believed", which is a different claim entirely. The attacker does not need to out-argue the real advisory. They need to look internal, because your preference for your own kind does the rest and hands them a command line on your systems.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets which external sources are vetted and how internal notices are verified. Weighing a notice by its evidence rather than its origin is your part.',
    moves: [
      'Judge a security notice by whether it is signed, sourced and reproducible, not by whether it came from inside or outside your team.',
      'A genuine external advisory being external is not a reason to dismiss it. Vetted outside sources are often first to the flaw, and discounting them by default is the opening.',
      'An internal-looking notice is trivial to fake with your own styling. Confirm its ticket, its author and where its patch link actually points before running anything.',
      "Notice the pull to trust the homegrown source and distrust the external one before you have read either. That reflex is exactly what routes you onto the attacker's instructions.",
    ],
  },
};

export default content;
