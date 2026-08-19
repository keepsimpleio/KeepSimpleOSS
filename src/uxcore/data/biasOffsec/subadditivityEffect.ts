// Surface is a vendor risk review, rendered as a checklist: the same
// integration scored once as a single combined line versus scored as four
// separate line items. The lever is the subadditivity effect: judgments made
// piece by piece never re-add to the rating the whole deserves. One Critical
// row becomes four Low rows with green ticks, and the compounding access
// disappears from view. The underlying risk never moved.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'One "Critical" line gets escalated. The same risk chopped into four "Low" lines gets waved through. Watch for a rating that drops the moment someone splits it.',
  scenario:
    'You are signing off a new analytics vendor before it goes live. Assessed as one combined line, the integration reads "Critical" and lands on the security team\'s desk for a hard block. Assessed as four separate line items, each rated "Low", the same integration reads like a routine approval. Nothing about what the vendor can actually do has changed. You scan four green rows, none of them worth stopping for, and click approve.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'checklist',
      tag: 'The risk scored as one line',
      title: 'Vendor risk review: Northwind Analytics',
      items: [
        {
          label:
            'Combined integration risk (data access, onward sharing, key storage, retention): Critical',
          state: 'warn',
        },
      ],
      footer: 'Decision: escalate to security, block until reviewed.',
    },
    after: {
      kind: 'checklist',
      tag: 'The identical risk scored line by line',
      title: 'Vendor risk review: Northwind Analytics',
      priorContext:
        'Same vendor, same access, same integration as the combined review. The only change is that the single risk line was broken into its parts before it reached you.',
      items: [
        { label: 'Customer data access: Low', state: 'ok' },
        { label: 'Third-party data sharing: Low', state: 'ok' },
        { label: 'API key storage: Low', state: 'ok' },
        { label: 'Data retention after offboarding: Low', state: 'ok' },
      ],
      footer: 'Decision: all items Low, approved for go-live.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the subadditivity effect: judgments do not add up the way arithmetic does. Rated piece by piece, the parts never re-combine into the rating the whole deserves, so the same exposure lands lower when it arrives pre-sliced. Each line item here is real, and each one alone is genuinely minor. Read together they are the Critical the combined review flagged, because a vendor that touches customer data, shares it onward, holds your keys, and keeps data after offboarding is exactly the compounding access that earns the top rating. Split across four rows, that compounding disappears from view. You are no longer weighing one serious decision, you are ticking four small ones, and four small yeses feel safer than one big maybe. The eager vendor, or the attacker behind it, does not need to lower the risk. They need to slice it thin enough that no single row ever looks worth stopping for.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your process sets how vendors get scored. Reassembling the pieces before you sign is your part.',
    moves: [
      'Score the integration as a whole at least once. A risk that is only ever presented line by line has never been rated as the thing it actually is.',
      'When every row reads Low, ask what the combined access adds up to. Data access plus sharing plus key storage is a different rating than any one of them.',
      'Treat a risk that drops the moment it is broken into parts as a signal to recombine it, not as good news.',
      'Fix the top-line rating before the breakdown, so the granular view has to argue the whole risk down instead of quietly hiding it.',
    ],
  },
};

export default content;
