// No quoted figures by policy. Two surfaces side-by-side on purpose: the
// loud decoy is a phone push (Microsoft Defender lock-screen toast), the
// quiet ask is a fraudulent-invoice email landing the same minute. This
// case intentionally breaks the usual before/after symmetry: for
// attentional bias the lever IS the second, louder stimulus, so the pair
// shows decoy + payload rather than two variants of one message. The
// `flagged` mark sits on the quiet email: that's the one that costs you.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Two pings hit you inside the same minute. A phone push screams about an unauthorized sign-in and demands you act right now. A quiet supplier email asks to slip an invoice into today’s payment run. Your attention has a budget, and the attacker chose where you spend it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Loud decoy',
      appName: 'Microsoft Defender',
      timestamp: 'now',
      title: 'Unauthorized sign-in from Moscow',
      body: 'Confirm or lock the account before further damage. Tap to review.',
    },
    after: {
      kind: 'email',
      tag: 'The real ask',
      sender: 'invoices@meridian-supplies.com',
      timestamp: '1 min ago',
      subject: 'Invoice #4127, payment due today',
      preview:
        'PO matches, terms unchanged. Please push it into today’s payment run. Cut-off is 5 PM.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'A security scare and a routine invoice land a minute apart. Your brain does not split attention evenly. It sprints to whatever looks most like danger, and the red "unauthorized sign-in" wins instantly. While you scramble to lock down an account that was never at risk, the invoice glides through on autopilot, checked by nobody, because the checking part of you was busy. That is attentional bias: the threat you notice is not the threat that costs you. Two messages arrived. The loud one was the smokescreen. The quiet one was the operation.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'When something loud and urgent grabs you, hold for a beat and scan the rest of your screen in the same window. The point of the noisy one might be to make you miss the quiet one.',
      'Anything that moves money or touches credentials deserves your full attention or none at all. If you cannot give it a clear head right now, park it. "Routine" processed in a panic is exactly what the attacker priced in.',
      'Treat any "urgent sign-in alert" as a question, not an instruction. Open the affected app from your home screen, never from the notification’s link, and check the session list yourself.',
      'After you have handled the noisy one, do one more sweep: anything else from that hour that asked you to do something? Decoys travel in pairs.',
    ],
  },
};

export default content;
