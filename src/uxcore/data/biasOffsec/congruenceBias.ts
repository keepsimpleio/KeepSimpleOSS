// Surface is a bank fraud alert. The lever is congruence bias: people test
// a suspicion only in ways that can confirm it, never in ways that could
// disprove it. The same alert becomes dangerous the moment it hands you a
// "verify us" test that runs on the attacker's own turf.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a warning hands you the way to check whether it is real, that check runs on the attacker’s turf and can only ever pass.',
  scenario:
    'A fraud alert claims someone is draining your Kestrel Bank account. Version one just says so, and you instinctively open your banking app to see for yourself. Version two adds "to confirm this is really us, call the number below or tap Verify". You take the test it offers, the test can only confirm, and the one check that could expose it, contacting the bank through a channel you already trust, is the one you skip.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'No test supplied',
      appName: 'Kestrel Bank',
      timestamp: 'now',
      title: 'Unusual activity on your account',
      body: 'We have flagged activity that may be fraud. Please check your account.',
    },
    after: {
      kind: 'notification',
      tag: 'A test that can only confirm',
      appName: 'Kestrel Bank',
      timestamp: 'now',
      title: 'Fraud alert: verify it is really us',
      body: 'Worried this is a scam? Good instinct. To confirm you are talking to the real Kestrel Bank, call 0800 555 0182 or tap Verify. Once confirmed, approve the security hold to protect your funds.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is congruence bias. When you form a hypothesis, "maybe this is real", you tend to test it only in ways that could confirm it, and you skip the tests that could prove it false. The attacker exploits that by handing you a confirming test on a plate: a number they answer, a Verify button they built. You run it, it passes, and your suspicion is "resolved". The one experiment that would actually settle it, an independent check they do not control, is exactly the one their helpfulness steers you around. A test that cannot fail is not verification, it is theatre.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can chase real fraud. It cannot help once you have "confirmed" the fake yourself.',
    moves: [
      'Only trust a check you chose. A phone number or button supplied by the message is part of the message, not proof of it.',
      'A real test is one that could show the thing is fake. If the check can only ever say "yes, legit", it proves nothing.',
      'Verify through a channel you already hold: the number on the back of your card, the app you installed yourself, never the contact in the alert.',
      'When a warning praises your suspicion and then hands you the way to lay it to rest, that is the trap doing its smoothest work.',
    ],
  },
};

export default content;
