// Surface is the fake "payment confirmation" an invoice-fraud crew sends
// right after the victim pays. The lever is post-decision reassurance: the
// wire went to swapped bank details and is still recallable for a short
// window, so the attacker floods that window with praise to stop the
// second-guessing that would trigger a re-check and a recall.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A payment confirmation that praises your decision is closing the window in which the wire can still be recalled. Real receipts do not flatter.',
  scenario:
    'An attacker hijacked your supplier’s email thread and sent you their usual invoice with one change: the bank account. You paid it. Moments later the attacker’s "confirmation" lands. The flat version leaves your doubt alive, you re-check the details with the supplier and the bank recalls the wire in time. The flattering version congratulates you, hands you perks and next steps, and keeps you feeling too good about the payment to re-check it until the recall window is gone.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'A plain receipt',
      sender: 'billing@brightwater-supplies.com',
      timestamp: '4:47 PM',
      subject: 'Payment received',
      preview:
        'We have received your payment of $18,400. Reference 4821. This confirms the transaction. Thank you.',
    },
    after: {
      kind: 'email',
      tag: 'A receipt that flatters the decision',
      sender: 'billing@brightwater-supplies.com',
      timestamp: '4:47 PM',
      subject: 'Great call! Your payment is confirmed 🎉',
      preview:
        'Smart move, you are all set. Your $18,400 payment is confirmed, reference 4821. You have joined hundreds of teams who trust Brightwater. Here is your VIP receipt, a priority support line, and a head-start guide. You made the right decision today.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is post-purchase rationalization, weaponized for invoice fraud. The moment right after a payment is when doubt is loudest, and the mind reaches for anything that says the choice was right. An attacker who has just been paid into swapped bank details does not want you revisiting the transfer, so they flood that exact window with praise, social proof, and exclusive perks. Each one hands you a reason to feel good instead of a reason to check. The plain receipt leaves room for the uneasy second thought that gets a fraudulent wire recalled in time. The flattering one closes that window while the transfer is still reversible.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can claw back a fast report. Noticing the flattery is what buys them the time.',
    moves: [
      'Warmth and praise arriving right after a payment is a pattern worth distrusting. Real receipts are boring, con artists are charming.',
      'The uneasy feeling after you send money is a signal, not weakness. Act on it before the reassurance talks you out of it.',
      'Verify any payment against the vendor and the bank details you already hold, especially when the follow-up works this hard to feel good.',
      'Speed beats embarrassment. A wire questioned in the first hour can often be recalled, one you sat on for a day usually cannot.',
    ],
  },
};

export default content;
