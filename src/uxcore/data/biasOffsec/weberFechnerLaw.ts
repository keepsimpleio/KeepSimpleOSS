// Surface is an expense statement. The lever is proportional perception:
// the same small fraudulent line item screams on a near-empty statement
// and vanishes on a large one, so attackers size the theft to the noise.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A single unfamiliar charge, "Northwind API, $40", sits on your company card statement. On a nearly empty statement it jumps out and you query it in seconds. On a busy month stacked with five-figure lines, the very same $40 disappears into the scroll. Same charge, same test of whether someone else is already spending your money.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'On a quiet statement',
      docLabel: 'Card statement',
      title: 'Corporate card, March',
      meta: '2 transactions this period',
      body: 'Coffee subscription: $18.00. Northwind API: $40.00. The forty-dollar line has nothing to hide behind, and it does not match anything you signed up for. You notice it instantly.',
      footer: 'Statement total: $58.00',
    },
    after: {
      kind: 'document',
      tag: 'On a busy statement',
      docLabel: 'Card statement',
      title: 'Corporate card, March',
      meta: '94 transactions this period',
      priorContext:
        'The same $40 Northwind line is now one row among cloud bills, ad spend, travel, and vendor invoices in the tens of thousands.',
      body: 'Cloud hosting: $22,400.00. Ad platform: $17,850.00. Travel: $9,120.00. Northwind API: $40.00. Vendor retainer: $14,000.00. Against those figures, forty dollars reads as a rounding error, and no one queries it.',
      footer: 'Statement total: $71,240.00',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the Weber-Fechner law. We perceive change in proportion to the starting magnitude, not in absolute terms. Forty dollars against a fifty-dollar total is enormous and screams; forty dollars against seventy thousand is a whisper you never hear. Attackers know this, so they size the theft to the noise around it, not to your alarm. The small "test charge" is often a probe, checking whether the stolen card or access works before it is used for something larger. Its whole design is to be too small to chase.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team watches the big flows. Catching the small ones is where you come in.',
    moves: [
      'Reconcile every line regardless of the total. The charge that is "too small to bother with" is small on purpose.',
      'A tiny unexplained charge is often a test, not the theft. It confirms the card or account works before the real hit lands.',
      'Do not let perception be the control. Set alerts and automated checks that flag any unknown line, no matter the size.',
      'Query the odd $40 the same way you would query an odd $40,000. To an attacker, the first one is just reconnaissance for the second.',
    ],
  },
};

export default content;
