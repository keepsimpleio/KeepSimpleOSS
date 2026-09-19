// Surface is an official-looking document. The lever is stereotyping: the
// trappings we expect of an official notice (crest, jargon, formal tone)
// trigger category-based trust regardless of whether any authority is real.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Looking the part is not being the part. A crest, jargon, and a formal tone are the cheapest things for an attacker to copy.',
  scenario:
    'A notice claims you owe a tax penalty and must pay to avoid escalation. Written plainly, you would question it. Dressed in everything you expect an official demand to wear, a government-style crest, a reference number, cold bureaucratic language, legal citations, it matches your mental picture of "official" so exactly that you reach for your card before asking whether the sender has any authority at all.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'Plain, so you question it',
      docLabel: 'Message',
      title: 'You owe a payment',
      body: 'You have an outstanding amount. Pay soon to avoid problems. Use the payment link below.',
    },
    after: {
      kind: 'document',
      tag: 'Dressed as officialdom',
      docLabel: 'Official notice',
      logo: '🏛️',
      title: 'FINAL NOTICE OF TAX PENALTY',
      meta: 'Ref TX-2026-88157 · Enforcement Division',
      body: 'Pursuant to statutory provisions, an outstanding penalty is recorded against your file. Failure to remit within 72 hours may result in enforcement action and referral. Settle immediately via the secure portal below.',
      footer:
        'This is an official communication. Quote your reference when paying.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is stereotyping applied to trust. We carry a mental template of what an "official" demand looks like, a crest, a reference number, stiff legal language, and when a message matches the template closely enough, we grant it the authority of the category without checking the actual source. None of those trappings prove anything: a logo is an image, a reference number is invented, legalese is a writing style. But they hit the pattern your brain files under "real government notice", and the category’s authority transfers to a stranger who simply dressed for the part.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can confirm a real demand. Not being convinced by costume alone is your part.',
    moves: [
      'Official-looking is not official. Crests, reference numbers, and legal phrasing are trivial to copy and prove nothing.',
      'Verify any demand through the agency’s own published contact details, never the portal or number in the notice.',
      'Real authorities rarely demand urgent payment via a link with a countdown. That pressure contradicts the officialdom it wears.',
      'The more perfectly a message matches your picture of "official", the more deliberately you should confirm who actually sent it.',
    ],
  },
};

export default content;
