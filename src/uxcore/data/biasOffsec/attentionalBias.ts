// No quoted figures by policy. Two surfaces side-by-side on purpose: the
// loud decoy is a phone push (Microsoft Defender lock-screen toast), the
// quiet ask is an email landing in the inbox at the same minute. Mixing
// channels makes the "your attention is the budget" point visible —
// the attacker doesn't care which app delivers the request, only that
// the noisy one absorbs the eye while the quiet one slides past.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Two pings hit you inside the same minute — one a phone push, the other an email. One is loud and demands you act right now. The other is quiet and looks routine. Your attention has a budget — the attacker chose where to spend it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Loud decoy',
      appName: 'Microsoft Defender',
      timestamp: 'now',
      title: 'Unauthorized sign-in from Moscow',
      body: 'Confirm or lock the account before further damage. Tap to review.',
      flagged: true,
    },
    after: {
      kind: 'email',
      tag: 'Quiet ask',
      sender: 'approvals@acme-vendor.com',
      timestamp: '1 min ago',
      subject: 'Acme Vendor updated their bank details',
      preview:
        'New routing + account on file. Same totals, same schedule — approve to keep payments flowing.',
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Attentional bias plus an attacker who has read about it. Your brain does not allocate attention evenly — it sprints toward the loudest, most threat-shaped thing in your field of view. A red banner with the word “unauthorized” captures the budget; a routine bank-details change does not. So you triage the decoy, feel responsible, and never quite see the small one a minute earlier. Two notifications arrived; one paid the attacker.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'When something loud and urgent grabs you, hold for a beat and scan the rest of your screen from the same window. The point of the noisy one might be to make you miss the quiet one.',
      'Anything that touches money, credentials, or vendor banking details deserves a fresh out-of-band confirmation — even when it looks routine, and especially when you are mid-fire on something else.',
      'Treat any “urgent sign-in alert” as a question, not an instruction. Open the affected app from your home screen — never the notification’s deep link — and check the session list yourself.',
      'After you have handled the noisy one, do one more sweep: anything else from that hour that asked you to do something? Decoys travel in pairs.',
    ],
  },
};

export default content;
