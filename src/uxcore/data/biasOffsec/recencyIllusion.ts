// Surface is a notification. The lever is the recency illusion: because you
// only just heard of a threat, it feels brand new and cresting now, and that
// felt novelty is used to rush you past your usual checks.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"Brand new threat, act now" works because you only just heard of it. Newness is a feeling, not a reason to skip your usual checks.',
  scenario:
    'A warning tells you to secure your account against a threat. Framed as long-standing advice, you file it under "later". Framed as a threat that "just emerged this week and is spreading fast", it feels urgent and novel, so you act immediately, following its link. The threat is the same either way. Calling it new, right when you first hear of it, makes it feel like a wave breaking now that you must outrun.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Framed as standing advice',
      appName: 'Account Security',
      timestamp: 'now',
      title: 'Reminder: keep your account secure',
      body: 'As always, review your security settings from time to time. No urgency, whenever convenient.',
    },
    after: {
      kind: 'notification',
      tag: 'Framed as just-emerged',
      appName: 'Account Security',
      timestamp: 'now',
      title: 'NEW threat spreading now, secure your account',
      body: 'A new attack emerged this week and is spreading fast. Accounts like yours are being hit right now. Tap to apply emergency protection before it reaches you.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the recency illusion: the moment you first notice something, it feels new to the world, not just new to you. Attackers borrow that feeling. Label an ordinary lure "a threat that just emerged this week" and your first-ever encounter with it reads as the leading edge of a fresh emergency, which demands speed and forgives skipping the usual checks. Novelty manufactures urgency, and urgency is where verification goes to die. The threat is neither new nor cresting. Your awareness of it is, and that is all the framing needs.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team tracks what is actually new. Not confusing "new to me" with "act now" is your part.',
    moves: [
      'Just hearing about something does not make it new or urgent. Separate your awareness of a threat from its real timeline.',
      '"Emerging now, act before it reaches you" is a speed trick. A genuine risk survives you taking the normal careful path.',
      'Apply protections through your settings directly, never through the "emergency" link in the warning.',
      'When a message leans on novelty and speed together, slow down twice as hard. That pairing is the tell.',
    ],
  },
};

export default content;
