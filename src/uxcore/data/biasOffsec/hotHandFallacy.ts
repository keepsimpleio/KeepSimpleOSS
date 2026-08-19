// Surface is an invoice email. The lever is the hot-hand fallacy: a run of
// safe, legitimate transactions makes you believe the next one is safe too,
// so the fraudulent invoice rides the streak straight through.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A run of safe ones does not make the next one safe. Attackers build a streak precisely so you stop checking.',
  scenario:
    'Invoices arrive from a supplier, Larkhill, that you pay every month. A single cold invoice from them, you check carefully. But after a run of five genuine invoices you paid without a hitch, the sixth feels like just another in the streak, and it is the fraudulent one, with a quietly changed account number, waved through on the momentum of the five before it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'A single cold invoice',
      sender: 'accounts@larkhill-supply.com',
      timestamp: 'Mon, 9:00 AM',
      subject: 'Invoice for payment',
      preview:
        'Please find this month’s invoice attached. With no streak behind it, you check the amount, the account, and the sender before paying.',
    },
    after: {
      kind: 'email',
      tag: 'The sixth in a smooth run',
      sender: 'accounts@larkhill-supply.com',
      timestamp: 'Mon, 9:00 AM',
      priorContext:
        'The last five Larkhill invoices were all genuine and paid without issue. This one feels like number six in a safe streak.',
      subject: 'Invoice for payment',
      preview:
        'This month’s invoice, same as ever. The account number is different this time, but riding the run of five clean ones, nobody looks that far down.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the hot-hand fallacy: the belief that a streak carries momentum, that because the last several were fine, the next one is fine too. Each invoice is actually independent, and being legitimate five times says nothing about the sixth, but the mind reads the run as a property of the sender and relaxes. Attackers patiently establish the streak, sometimes sending real invoices, precisely to earn that relaxation, then slip the altered account details into the payment you have stopped inspecting. The safety you feel belongs to the past invoices, not the one in front of you.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can set the controls. Not letting a streak switch them off is your part.',
    moves: [
      'Check every invoice on its own, especially from a supplier you trust. A clean history is not a property of the next payment.',
      'A changed bank account is the single detail to verify out-of-band, no matter how routine the sender has become.',
      'Notice when a run of successes has made you stop looking. That relaxation is exactly what the streak was built to produce.',
      'Fixed verification steps beat judgment here, because judgment is what a smooth streak quietly erodes.',
    ],
  },
};

export default content;
