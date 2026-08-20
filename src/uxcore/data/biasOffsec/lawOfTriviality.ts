// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the law of
// triviality (bikeshedding): attention pours into small, understandable
// details and skips the one hard, important thing. Pad the request with tiny
// fixable items and the reviewer spends scrutiny there, waving the real change
// through untouched.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A change request full of tiny things to nitpick is not sloppy. The trivia is bait, drawing your scrutiny away from the one line that matters.',
  scenario:
    'A supplier sends an updated invoice with a dozen small things to check: a rounding fix, a typo in the address, a corrected PO number, a reformatted date. You catch and fix the little errors, feel diligent, and approve. Buried among them, the bank account number quietly changed. Attention flows to the details you can easily understand and correct, and the one field that actually matters rides through under cover of all that busywork. The padding is not carelessness. It is where your scrutiny was meant to go.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: bury the real change in trivia',
      steps: [
        {
          label: 'Pad with tiny fixable details',
          note: 'A typo, a rounding error, a date format. Small, obvious, satisfying to catch.',
        },
        {
          label: 'Slip the real change in among them',
          note: 'Swap the bank account line where the eye least expects the important item to sit.',
          active: true,
        },
        {
          label: 'Let scrutiny drain into the small stuff',
          note: 'The reviewer fixes what they understand and feels diligent for it.',
        },
        {
          label: 'Ride the sense of a job done',
          note: 'Having corrected the trivia, they approve the whole thing without a second look.',
        },
      ],
      footer: 'The trivia does the hiding. The busywork is the whole cover.',
    },
    after: {
      kind: 'diff',
      tag: 'The plan, as it lands on you',
      label: 'Supplier invoice INV-4471, updated version',
      rows: [
        {
          field: 'Billing address',
          value: '14 Harbour Rd (typo fixed)',
          was: '14 Harbor Rd',
          changed: true,
        },
        {
          field: 'PO number',
          value: 'PO-88213',
          was: 'PO-88123',
          changed: true,
        },
        {
          field: 'Invoice date',
          value: '2026-08-18',
          was: '18/08/26',
          changed: true,
        },
        {
          field: 'Line subtotal',
          value: '$12,480.00 (rounded)',
          was: '$12,479.96',
          changed: true,
        },
        {
          field: 'Bank account',
          value: 'IBAN GB29 **** 8847',
          was: 'IBAN GB29 **** 2210',
          changed: true,
        },
        { field: 'Amount due', value: '$12,480.00', was: '$12,479.96' },
      ],
      note: 'Updated version of supplier invoice INV-4471, revised fields shown against the original.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the law of triviality, also called bikeshedding: attention flows to the small, understandable details and away from the one hard thing that actually matters. A reviewer faced with a typo, a rounding error and a bank-account change engages the items they can fully grasp and fix, because catching them is easy and feels like diligence. The account number, the only field with real consequences, demands out-of-band effort to verify, so it gets less scrutiny precisely because it deserves more. An attacker pads a change request with trivia on purpose, giving your attention a comfortable place to land and a satisfying sense of a job well done. By the time you approve, you have audited everything except the line that empties the payment. The busywork was never noise. It was the cover.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'The number of small fixes is a distraction budget. Spend your scrutiny on the one field that moves money or access.',
    moves: [
      'Before touching the small stuff, find the highest-stakes field, the bank account, the payee, the permission, and verify that one first, out of band.',
      'Treat a change set padded with trivial corrections as a reason for more suspicion, not less. Easy fixes are where attention is meant to pool.',
      'Confirm any bank-detail change with the supplier through a phone number you already hold, never one on the updated document.',
      'Notice the feeling of "I checked it thoroughly". Diligence on the trivia can stand in for diligence on the thing that mattered.',
    ],
  },
};

export default content;
