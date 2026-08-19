// No quoted figures by policy. Surface is a chat DM (LinkedIn /
// Slack-style). The lever here is the repeated CLAIM ("our account
// changed"), not the sender's familiarity; that's the sibling case,
// mere-exposure. Before = the claim heard for the first time; after =
// the identical claim on its third repetition, still with zero proof.
// `priorContext` must spell out that the earlier messages repeated the
// claim, not that they built rapport.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Klaus from the finance team of your supplier Nordvik Components writes the same sentence, third week in a row: "our bank account has changed." No document, no confirmation, no proof. Yet somewhere between the first message and the third, the claim quietly stopped feeling like it needed any.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'First time you read it',
      senderName: 'Klaus Lange',
      senderHandle: 'Nordvik Components · finance',
      timestamp: 'Thu, 9:30 AM',
      body: 'Hello, I’m Klaus from Nordvik Components finance. We’ve changed our account details, please update before the next payment run.',
    },
    after: {
      kind: 'chat',
      tag: 'Third time you read it',
      senderName: 'Klaus Lange',
      senderHandle: 'Nordvik Components · finance',
      timestamp: 'Thu, 9:30 AM',
      priorContext:
        'Two earlier notes this month mentioned the account move in passing. No documents, no details, no ask. Just the claim, twice.',
      body: 'Hi again, as mentioned in my last two notes, our account moved. Sending the final details now so payment lands on the new IBAN. Appreciate the quick turnaround 🙌',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'In the first message, a stranger claims their bank account changed, and your proof reflex fires instantly. In the second, the exact same claim arrives for the third time, and the reflex stays quiet. That is the illusory truth effect: the brain uses ease of processing as a stand-in for truth. A sentence you have already read twice goes down smoothly, and smooth feels true. No evidence required, just repetition. Notice what actually changed: not your trust in Klaus, but your belief in his sentence. The first two messages were not small talk. They were rehearsals of the lie.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Repetition is not evidence. Hearing a claim three times gives you exactly as much proof as hearing it once: none. If it was not verified the first time, it still is not.',
      'A bank-details change is a documents-and-callback event, never a chat message. Call the number from the signed contract, not one the sender gives you, and ask them to confirm.',
      'Watch for claims introduced "in passing". A real account change arrives once, formally, with paperwork. A lie gets mentioned casually several times first. It is being rehearsed on you.',
      'Track where you first learned a "fact". If every mention of the new IBAN traces back to the same chat thread, you do not have three confirmations. You have one unverified source, repeated.',
    ],
  },
};

export default content;
