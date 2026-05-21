// No quoted figures by policy (see feedback_offsec_no_mocked_numbers).
// The pattern — multi-touch grooming that converts a cold sender into
// a familiar one before the ask — is a documented BEC technique; the
// specific lift over single-shot phishing is not the point of the page.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A new sender spent two weeks softly introducing themselves — small notes, no asks. By week three, when they finally request a wire change, the name in your inbox already feels familiar enough to trust.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      tag: 'Cold ask',
      sender: 'k.lange@acme-supplier.io',
      timestamp: 'Thu, 9:30 AM',
      subject: 'Vendor banking update',
      preview:
        'Hello — I’m Klaus from Acme Supplier finance. We’ve changed our account details, please update before the next payment run.',
    },
    after: {
      tag: 'Third touch',
      sender: 'k.lange@acme-supplier.io',
      timestamp: 'Thu, 9:30 AM',
      subject: 'Re: Re: quick housekeeping — banking update',
      preview:
        'Hi again — as mentioned last week, our account moved. Sending the final details now so payment lands on the new IBAN. Appreciate the quick turnaround.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Illusory truth effect — the brain treats fluency as evidence. The first time you saw this sender’s name, it felt new and needed scrutiny. By the third touch, processing is cheap; cheap feels familiar; familiar feels true. The two prior emails carried no ask at all — that’s the point. They were a deposit into your credibility account. The third withdraws.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Thread length is not verification. “Re: Re:” in a subject does not mean someone trustworthy sent the first one — attackers reply to themselves to fake history.',
      'Any time a sender first asks for money, credentials, or bank details, treat them as new — no matter how familiar the inbox makes them feel. Verify out of band, every time, even on the fifth email.',
      'Watch for relationship-builders that don’t ask for anything. Three friendly notes in a row from someone you have never met outside this inbox is a pattern, not a coincidence.',
      'Cross-check the sender against contacts you have elsewhere — Slack, CRM, a signed contract. If they only exist inside this email thread, the familiarity is staged.',
    ],
  },
};

export default content;
