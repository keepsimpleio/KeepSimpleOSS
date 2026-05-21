// No quoted figures in this file by policy (see
// feedback_offsec_no_mocked_numbers). The pattern — paired noisy decoy
// plus quiet real ask — is a long-documented social-engineering
// technique; the specific success rate is not the point.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Two emails arrive in the same minute. One is loud and demands you act now. The other is quiet and looks routine. Your attention has a budget — the attacker chose where to spend it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      tag: 'Loud decoy',
      sender: 'security-alert@acme-corp-mail.com',
      timestamp: 'Wed, 2:13 PM',
      subject: 'URGENT: sign-in from Moscow — confirm or lock account',
      preview:
        'We detected an unauthorized sign-in attempt. Review and lock your account before further damage.',
      flagged: true,
    },
    after: {
      tag: 'Quiet ask',
      sender: 'ap@acme-vendor.com',
      timestamp: 'Wed, 2:14 PM',
      subject: 'Updated wire details for May invoices',
      preview:
        'Heads up — our bank changed last week. New routing and account below. Same totals, same schedule.',
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Attentional bias plus an attacker who has read about it. Your brain does not allocate attention evenly — it sprints toward the loudest, most threat-shaped thing in your field of view. A red banner with the word “urgent” captures the budget; a quiet bank-detail change does not. So you triage the decoy, feel responsible, and never quite see the small one a minute earlier. Two emails arrived; one paid the attacker.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'When something loud and urgent grabs you, hold for a beat and scan the rest of the inbox from the same window. The point of the noisy one might be to make you miss the quiet one.',
      'Anything that touches money, credentials, or vendor bank details deserves a fresh out-of-band confirmation — even if it looks routine and especially when you’re mid-fire on something else.',
      'Treat any “urgent sign-in alert” as a question, not an instruction. Open your account from a bookmark or app — not the link in the email — and check the actual session list yourself.',
      'After you’ve handled the noisy one, do one more sweep: anything else from that hour that asked you to do something? Decoys travel in pairs.',
    ],
  },
};

export default content;
