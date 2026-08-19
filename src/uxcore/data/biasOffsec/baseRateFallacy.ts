// No quoted figures by policy: the base rate stays directional ("nearly
// every", "rare"), never an invented percentage. Before = the browser
// surface: the dry handbook page stating the base rate. After = a push
// notification (not email, by design): one vivid, specific specimen
// that makes the statistic feel inapplicable. The lever is concrete
// detail beating the base rate.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'The handbook says it plainly: nearly every "unusual sign-in, verify now" alert that reaches you is fake. Then one arrives with a city, a timestamp, and your browser’s name, and the statistic quietly steps aside for the story. Details feel like evidence. They are not.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'What you know in the abstract',
      host: 'wiki.internal',
      path: '/security/sign-in-alerts',
      pageHeading: 'Security handbook: sign-in alerts',
      pageBody:
        'Nearly every "unusual sign-in, verify immediately" message that reaches an inbox or a phone is phishing. Genuine alerts are rare, and none of them require logging in through a link inside the message itself.',
    },
    after: {
      kind: 'notification',
      tag: 'What actually lands on your screen',
      appName: 'Account alerts',
      timestamp: '3:41 AM',
      title: 'New sign-in from Istanbul. Was this you?',
      body: 'Device: Chrome on Windows · Location: Istanbul, Türkiye · Time: 3:41 AM. If you do not recognize this activity, verify your identity now to prevent account lockout.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'A base rate is a fact about all alerts like this one. The specimen on your screen is a story about you, and stories win. The city you have never been to, the 3:41 AM timestamp, the correct browser name: together they produce a feeling of "this one is real, the statistic is about other alerts". But specificity is not evidence. Every one of those details is free to fabricate, and the browser name is simply the most common guess. The vividness that makes the alert feel genuine is exactly what phishing kits are built to mass-produce.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'The handbook rule applies most precisely at the moment it feels like it does not. "But this one has details" is the bias talking, not the evidence.',
      'Never verify through the alert itself. Open the service’s site or app the way you always do and check the sign-in activity page there. A real incident will be visible. A fake one will not.',
      'Price the details honestly: a city, a time, and a browser name cost the attacker nothing and come from a template. Only what you can confirm inside your account counts as evidence.',
      'Flip vividness into a signal: the more cinematic and personalized an unsolicited alert feels, the more suspicion it has earned. Drama is a manufacturing choice, not a property of truth.',
    ],
  },
};

export default content;
