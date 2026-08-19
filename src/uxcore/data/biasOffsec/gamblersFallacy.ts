// Surface is a notification landing just after a company incident. The
// lever is the gambler's fallacy: people believe independent events are
// "due" or "not due", so "we just got hit, surely not again so soon"
// drops the guard exactly when follow-on attacks spike.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Independent events have no memory. "We just got hit, we will not again so soon" is exactly when the follow-on attack lands.',
  scenario:
    'A phishing email asks you to reset your credentials. In a normal week you weigh it carefully. But days after your company survived a real, well-publicized breach, a quiet voice says "lightning does not strike twice, we already had ours", and the same email slides through on the feeling that another hit is simply not due yet. Attackers time the follow-up for precisely that lull.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'A normal week',
      appName: 'IT Security',
      timestamp: 'now',
      title: 'Reset your credentials',
      body: 'A password reset is required for your account. Follow the link to set a new password.',
    },
    after: {
      kind: 'notification',
      tag: 'Days after the last incident',
      appName: 'IT Security',
      timestamp: 'now',
      priorContext:
        'The company got breached last week. It was all-hands, exhausting, and it is "behind us". Surely another attack is not due so soon.',
      title: 'Reset your credentials',
      body: 'A password reset is required for your account. Follow the link to set a new password.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the gambler’s fallacy: the belief that independent events are somehow "due" or "used up" based on what just happened. After a breach, the odds of the next attack do not drop, they often rise, as copycats and follow-on campaigns pile onto a name in the news. But the mind treats risk like a roulette wheel that owes you a quiet spell, and "we already had ours" feels like protection. That false sense of being paid up is when guards come down across a whole organization at once, which is exactly the window an attacker aims for.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team knows attacks cluster after an incident. Not relaxing on "we are due for calm" is your part.',
    moves: [
      'A recent incident does not lower your near-term risk, it usually raises it. Follow-on and copycat attacks chase the headline.',
      '"Surely not again so soon" is a feeling about odds that do not work that way. Keep your checks exactly as tight, or tighter.',
      'Verify credential resets through your known IT channel regardless of what happened last week.',
      'The calm you feel after surviving one attack is not safety, it is the lull the next one is built to exploit.',
    ],
  },
};

export default content;
