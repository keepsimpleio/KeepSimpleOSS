// Surface is a refund email. The lever is a planted anchor number: the
// same "send us money" ask becomes reasonable the moment a large, wrong
// figure is dropped first, so returning the difference feels like honesty.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A vendor you use, Meridian, emails to say money needs to move back to them. In the first version they just ask for it. In the second, they say they accidentally paid you far too much and ask you to return the overpayment. It is the same amount leaving your account. One version feels like a scam, the other feels like doing the right thing.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'The bare ask',
      sender: 'billing@meridian-accounts.com',
      timestamp: '3:12 PM',
      subject: 'Payment request',
      preview:
        'Hello, we need you to send $8,100 to the account below today to settle an outstanding item. Details attached.',
    },
    after: {
      kind: 'email',
      tag: 'The ask, anchored',
      sender: 'billing@meridian-accounts.com',
      timestamp: '3:12 PM',
      subject:
        'Refund error: we overpaid you $9,000, please return the difference',
      preview:
        'Our system refunded you $9,000 by mistake instead of the correct $900. Kindly return the $8,100 difference to the account below today so our books reconcile. Apologies for the mix-up.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the anchoring effect. The first number you see sets the reference point, and every judgment after it adjusts from that anchor, never far enough. Drop "$9,000" and suddenly returning "$8,100" reads as fair, even generous, because your mind is measuring against nine thousand, not against zero. The bare ask had no anchor, so it looked like exactly what it was: a stranger asking for money. The overpayment story hands you a number to feel reasonable next to. The anchor is fictional, the loss is real.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team watches the accounts. Watching the numbers people hand you is your job.',
    moves: [
      'A number someone else supplies is not a fact, it is a lever. The "overpayment" is a story you cannot see, so do not price your response against it.',
      'Verify the original transaction in your own system before a cent moves. If there was no $9,000 refund, there is nothing to return.',
      'Never send money to correct a claim that arrived by email. Overpayment refunds are a classic wire-fraud script.',
      'Slow the clock down. "Today" is there precisely to stop you checking. Real reconciliation survives a phone call.',
    ],
  },
};

export default content;
