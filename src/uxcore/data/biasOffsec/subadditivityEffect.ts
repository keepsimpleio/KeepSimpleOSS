// Surface is a vendor risk review: the same integration, scored once as a
// single combined line versus scored as several separate line items. The
// lever is the subadditivity effect: a whole judged as less than the sum of
// its parts. Split one "Critical" risk into four rows each rated "Low" and the
// reviewer adds them up as "all low, fine" and approves. The underlying risk
// never moved. Only the granularity changed.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'One "Critical" line gets escalated. The same risk chopped into four "Low" lines gets waved through. Watch for a rating that drops the moment someone splits it.',
  scenario:
    'You are signing off a new analytics vendor before it goes live. Assessed as one combined line, the integration reads "Critical" and lands on the security team\'s desk for a hard block. Assessed as four separate line items, each rated "Low", the same integration reads like a routine approval. Nothing about what the vendor can actually do has changed. You scan four green-ish rows, add them up in your head, and click approve.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'diff',
      tag: 'The risk scored as one line',
      label: 'Vendor risk review: Northwind Analytics',
      rows: [
        {
          field: 'Overall integration risk',
          value: 'Critical',
        },
        {
          field: 'Decision',
          value: 'Escalate to security, block until reviewed',
        },
      ],
      note: 'One combined rating, and it reads Critical.',
    },
    after: {
      kind: 'diff',
      tag: 'The identical risk scored line by line',
      label: 'Vendor risk review: Northwind Analytics',
      priorContext:
        'Same vendor, same access, same integration as the combined review. The only change is that the single risk line was broken into its parts before it reached you.',
      rows: [
        { field: 'Customer data access', value: 'Low' },
        { field: 'Third-party data sharing', value: 'Low' },
        { field: 'API key storage', value: 'Low' },
        { field: 'Data retention after offboarding', value: 'Low' },
        { field: 'Decision', value: 'All items Low, approve' },
      ],
      note: 'The same risk split into four separate line items, each rated Low. The whole that was Critical now shows as a row of green.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the subadditivity effect. We judge a whole as less than the sum of its parts, so a risk broken into pieces is rated lower than the same risk stated once. Each line item here is real, and each one alone is genuinely minor. Read together they are the same Critical exposure the combined review flagged, because a vendor that touches customer data, shares it onward, holds your keys, and keeps data after offboarding is exactly the compounding access that earns the top rating. Split across four rows, that compounding disappears from view. You are no longer weighing one serious decision, you are ticking four small ones, and four small yeses feel safer than one big maybe. The attacker, or just the eager vendor, does not need to lower the risk. They need to slice it thin enough that no single row ever looks worth stopping for.',
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
