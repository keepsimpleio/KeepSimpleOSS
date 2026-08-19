// Surface is a delivery text. The lever is a belief you already hold: the
// same "parcel held, pay a fee" scam is dismissed when nothing is on the
// way, and clicked when you happen to be waiting on a delivery.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A text from "ParcelLine" says your delivery is held and a small fee is needed to release it. If you are not expecting anything, it is obvious junk and you delete it. If you happen to be waiting on a package this week, the identical text lands as confirmation of something you already believe, and you tap the link before the doubt arrives.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Against no expectation',
      senderName: 'ParcelLine',
      senderHandle: 'SMS · unknown number',
      timestamp: 'Wed, 1:05 PM',
      body: 'Your parcel is held at our depot. A redelivery fee is required to release it: parcelline-redelivery.com/pay',
    },
    after: {
      kind: 'chat',
      tag: 'Against an expectation you hold',
      senderName: 'ParcelLine',
      senderHandle: 'SMS · unknown number',
      timestamp: 'Wed, 1:05 PM',
      priorContext:
        'You ordered something days ago and have been refreshing the tracking. You are, right now, a person waiting for a parcel.',
      body: 'Your parcel is held at our depot. A redelivery fee is required to release it: parcelline-redelivery.com/pay',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is confirmation bias. We wave through what fits what we already believe and scrutinize what does not. When the lure lands on an expectation you are already holding, a parcel you are genuinely waiting for, the verification step feels redundant, because the message is only telling you what you already "know". The attacker did not need to know your order. They played the odds that on any given day, someone is always expecting a package, a payment, an invoice, or a reply, and let your own expectation supply the trust.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team filters what it can. The message that fits your day gets through to you.',
    moves: [
      'An expectation is not evidence a message is real. "I was waiting for this" is exactly the feeling being exploited.',
      'Track deliveries from the courier’s own app or site using your own order reference, never the link in the text.',
      'Real couriers do not take redelivery fees by SMS link. A payment request in a tracking message is the scam itself.',
      'The messages that "happen to" match what you are waiting for deserve the most suspicion, not the least. That fit is the whole trick.',
    ],
  },
};

export default content;
