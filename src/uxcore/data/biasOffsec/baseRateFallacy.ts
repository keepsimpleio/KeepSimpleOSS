// No quoted figures by policy — the base rate is expressed
// directionally ("nearly every", "rare"), never as an invented
// percentage. Before = the browser surface: the dry handbook page
// stating the base rate. After = the email surface: one vivid,
// specific specimen that makes the abstract statistic feel
// inapplicable. The lever is concrete detail crushing the base rate.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'The handbook says it plainly: nearly every “unusual sign-in, verify now” email that reaches an inbox is fake. Then one arrives with a city, a timestamp, and your browser’s name — and the statistic quietly steps aside for the story. Details feel like evidence. They aren’t.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'What you know in the abstract',
      host: 'wiki.internal',
      path: '/security/sign-in-alerts',
      pageHeading: 'Security handbook — sign-in alerts',
      pageBody:
        'Nearly every “unusual sign-in — verify immediately” message that reaches an inbox is phishing. Genuine alerts are rare, and none of them require logging in through a link inside the message itself.',
    },
    after: {
      kind: 'email',
      tag: 'What actually lands in your inbox',
      sender: 'security-noreply@account-signin-shield.com',
      timestamp: 'Today, 3:41 AM',
      subject: 'New sign-in from Istanbul — was this you?',
      preview:
        'Device: Chrome on Windows · Location: Istanbul, Türkiye · Time: 3:41 AM. If you do not recognize this activity, verify your identity now using the secure link below to prevent account lockout.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'A base rate is a fact about the whole population of emails like this one; the specimen in front of you is a story about you — and stories win. The city you’ve never been to, the 3:41 AM timestamp, the correct browser name all produce a feeling of “this one is real, this one is my case, the statistic is about other emails.” But specificity is not evidence: every one of those details is free to fabricate, and the browser name is simply the most common one guessed. The vividness that makes the alert feel like the rare genuine article is exactly the property phishing kits are built to mass-produce.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'The handbook rule applies most precisely at the moment it feels like it doesn’t. “But this one has details” is the bias speaking, not the evidence.',
      'Never verify through the alert itself. Open the service’s site or app the way you always do and check the sign-in activity page there — a real incident will be visible; a fake one won’t.',
      'Price the details honestly: a city, a time, and a browser name cost the attacker nothing and are copied from a template. Only what you can confirm inside your account counts as evidence.',
      'Flip vividness into a signal: the more cinematic and personalized an unsolicited alert feels, the more suspicion it has earned — drama is a manufacturing choice, not a property of truth.',
    ],
  },
};

export default content;
