// Surface is a fake renewal page. The lever is nominal framing: the same
// real cost, and the same card-harvesting form, is scrutinized as a big
// yearly figure and waved through as a trivial-sounding daily one.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A page says your mailbox storage is expiring and asks for your card to renew. Priced as a yearly total it makes you stop and question the whole thing. Priced as a few cents a day it feels like nothing, and your card details are typed before you have really decided. It is the same amount of money, on the same fake page.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Priced by the year',
      host: 'mailvault-renew-center.com',
      path: '/storage',
      pageHeading: 'Renew your mailbox storage',
      pageBody:
        'Your storage plan is expiring. Renew now for $348 per year, billed today, to avoid losing access to your mailbox. Enter your card to continue.',
      cta: 'Pay $348 now',
    },
    after: {
      kind: 'browser',
      tag: 'Priced by the day',
      host: 'mailvault-renew-center.com',
      path: '/storage',
      pageHeading: 'Keep your mailbox for less than a coffee',
      pageBody:
        'Your storage plan is expiring. Keep it for just $0.95 a day, cancel anytime, no commitment. Enter your card to keep your mailbox active.',
      cta: 'Keep my mailbox, $0.95/day',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is money illusion. We react to the face value of a number, not the real magnitude behind it. "$0.95 a day" reads as pocket change even though it is the exact same $348 that made you flinch a moment earlier. The small nominal figure slips under the threshold where you would normally stop and check the page. And the price was never the real cost anyway. The real cost is your card details on a lookalike domain, which the tiny, friendly number is there to rush you past.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team watches the money leaving. Reading the price for what it is stays yours.',
    moves: [
      'Convert every "per day" or "per coffee" price back to its real total and period before you react. The small unit is a selling trick.',
      'On a payment page, the number is a distraction. The real question is whether you sought this page out or it ambushed you.',
      'Renew services from the provider’s own site that you navigate to yourself, never from a link in an expiry warning.',
      'A card field on a page you did not go looking for is the actual risk. Close the tab, the price does not matter.',
    ],
  },
};

export default content;
