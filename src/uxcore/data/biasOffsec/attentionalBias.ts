// No quoted figures by policy. Surface here is push notifications, not
// email — attentional-bias attacks land wherever multiple things compete
// for your eyes (lock-screen, OS toasts, browser pop-ups), and the
// mechanism is unrelated to the inbox.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Two notifications arrive on your phone within the same minute. One is loud and demands you act right now. The other is quiet and looks routine. Your attention has a budget — the attacker chose where to spend it.',
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
      kind: 'notification',
      tag: 'Quiet ask',
      appName: 'Wire Approvals',
      timestamp: '1 min ago',
      title: 'Acme Vendor updated their bank details',
      body: 'New routing + account on file. Same totals, same schedule — approve to keep payments flowing.',
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
