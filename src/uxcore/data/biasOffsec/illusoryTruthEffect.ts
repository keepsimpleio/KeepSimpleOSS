// No quoted figures by policy. Surface here is a chat DM (LinkedIn /
// Slack-style), not email — multi-touch grooming is more legible as a
// thread where the second and third messages feel like a relationship
// you already have.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A new contact spent two weeks softly introducing themselves over LinkedIn — small notes, no asks. By week three, when they finally request a wire change, the name in your DMs already feels familiar enough to trust.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Cold ask',
      senderName: 'Klaus Lange',
      senderHandle: 'Acme Supplier · finance',
      timestamp: 'Thu, 9:30 AM',
      body: 'Hello — I’m Klaus from Acme Supplier finance. We’ve changed our account details, please update before the next payment run.',
    },
    after: {
      kind: 'chat',
      tag: 'Third touch',
      senderName: 'Klaus Lange',
      senderHandle: 'Acme Supplier · finance',
      timestamp: 'Thu, 9:30 AM',
      priorContext: '2 messages this month — last seen yesterday',
      body: 'Hi again — as mentioned last week, our account moved. Sending the final details now so payment lands on the new IBAN. Appreciate the quick turnaround 🙌',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Illusory truth effect — the brain treats fluency as evidence. The first time you saw this person’s name, it felt new and needed scrutiny. By the third touch, processing is cheap; cheap feels familiar; familiar feels true. The two prior messages carried no ask at all — that’s the point. They were a deposit into your credibility account. The third withdraws.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Thread length is not verification. Two friendly notes followed by a money ask is a pattern, not a coincidence — the prior messages were the setup.',
      'Any time a sender first asks for money, credentials, or bank details, treat them as new — no matter how familiar the chat history makes them feel. Verify out of band, every time, even on the fifth message.',
      'Watch for relationship-builders that never ask for anything. Cheerful check-ins from someone you have never met outside this app should raise the question — what is this conversation actually for?',
      'Cross-check the contact against records you keep elsewhere — CRM, signed contracts, a colleague who knows them. If they exist only inside this DM thread, the familiarity is staged.',
    ],
  },
};

export default content;
