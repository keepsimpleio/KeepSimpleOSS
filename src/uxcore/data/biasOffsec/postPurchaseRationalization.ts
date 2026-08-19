// Surface is a confirmation email that lands right after money moves. The
// lever is post-decision reassurance: the same receipt goes from a bare
// line to a warm chorus of praise, and the praise is there to stop you
// second-guessing a payment that already left.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  technique: {
    label: 'Fraud after-care',
    tell: 'A vendor gushing about how smart your payment was, seconds after the money leaves, is buying your silence, not thanking you.',
  },
  scenario:
    'You just paid an invoice to Brightwater Supplies. Moments later a confirmation lands. One version is a flat receipt. The other congratulates you, calls it the smart move, and hands you perks and next steps. Same payment, already gone. Only one of them makes you feel too good about it to go back and check.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'A plain receipt',
      sender: 'billing@brightwater-supplies.com',
      timestamp: '4:47 PM',
      subject: 'Payment received',
      preview:
        'We have received your payment. Reference 4821. This confirms the transaction. Thank you.',
    },
    after: {
      kind: 'email',
      tag: 'A receipt that flatters the decision',
      sender: 'billing@brightwater-supplies.com',
      timestamp: '4:47 PM',
      subject: 'Great call! Your payment is confirmed 🎉',
      preview:
        'Smart move, you are all set. You have joined hundreds of teams who trust Brightwater. Here is your VIP receipt, a priority support line, and a head-start guide. You made the right decision today.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is post-purchase rationalization. The moment right after a decision is when doubt is loudest, and the mind reaches for anything that says the choice was right. An attacker who has already taken the money does not want you revisiting it, so they flood that exact window with praise, social proof, and exclusive perks. Each one hands you a reason to feel good instead of a reason to check. The plain receipt leaves room for the uneasy second thought that gets fraud reported in time. The flattering one closes that window while the transfer is still reversible.',
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
