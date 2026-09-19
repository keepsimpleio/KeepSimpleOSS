// Surface is a payment-approval diff: the same wire, shown as a row of
// fields, one of them quietly changed. The lever is mental accounting: money
// tagged to a "budget already spent" bucket feels like it is not really your
// money to guard, so a swapped payee on a line you have mentally written off
// gets approved without the scrutiny a fresh spend would trigger.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Money you have already mentally spent stops feeling like money you have to protect. Attackers aim for the payment you have written off, not the one you are watching.',
  scenario:
    'You are releasing the quarterly retainer to Aldwin Studio, a bill you approved weeks ago and mentally filed under "already gone". The payee account on the release screen has been changed. On a fresh, unbudgeted payment you would scrutinise every field. On this one, the amount matches what you expected to lose anyway, so your eye slides past the account number to the approve button.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'diff',
      tag: 'A fresh spend, and the swap is caught',
      label: 'Payment release',
      rows: [
        { field: 'Payee', value: 'Aldwin Studio' },
        {
          field: 'Account',
          value: 'LT12 •••• 9930',
          was: 'GB29 •••• 4471',
          changed: true,
        },
        { field: 'Amount', value: '$12,000' },
        { field: 'Reference', value: 'Ad-hoc licence purchase, unplanned' },
      ],
      note: 'Unbudgeted money leaving, every field read against the record. The account mismatch surfaces on the first pass.',
    },
    after: {
      kind: 'diff',
      tag: 'Money you already wrote off',
      label: 'Payment release',
      priorContext:
        'You approved this retainer weeks ago. In your head the cash is already spent, just waiting to clear.',
      rows: [
        { field: 'Payee', value: 'Aldwin Studio' },
        { field: 'Account', value: 'LT12 •••• 9930' },
        { field: 'Amount', value: '$12,000' },
        { field: 'Reference', value: 'Q3 retainer, as approved' },
      ],
      note: 'The same release, the same swapped account, shown the way the screen actually shows it: one quiet row among four, on a payment that stopped feeling like a decision weeks ago.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is mental accounting. We do not treat all money as one pool. We sort it into buckets, and cash tagged "already committed" gets guarded far more loosely than cash tagged "a new decision". The changed account number is identical in risk to a fresh fraudulent payee, but because the amount matches a loss you already accepted, the spending part of your brain has clocked out. By now it barely feels like deciding whether to send money. It feels like clearing a line you closed weeks ago. The attacker does not need to beat your scrutiny. They need to reach the payment where your scrutiny already went home.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team sets the payment controls. Refusing to autopilot the "already approved" ones is your part.',
    moves: [
      'Verify the account number on every release, hardest on the payments you already feel you have paid. Prior approval covered the amount, never the destination.',
      'A changed payee or account on a familiar bill is the single field worth an out-of-band callback, no matter how routine the total looks.',
      'Notice the feeling of "this money is already gone". That is exactly the state an attacker times the swap for. Let it slow you down, not wave you through.',
      'Match the destination against the bank details you already hold on file, not the ones printed on the request in front of you.',
    ],
  },
};

export default content;
