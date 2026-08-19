// Surface is a notification. The lever is the bandwagon effect: the same
// action is questioned alone and taken when "everyone else already did it",
// because an unseen crowd is the cheapest pressure to fabricate.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"Everyone else already did it" is the easiest line to type and the hardest to verify. A crowd you cannot see is not a reason to follow.',
  scenario:
    'A prompt tells you to authorize a new "security app" for your work account. On its own, you question it. Wrapped in a crowd, "most of your team has already approved this, you are one of the last", the same authorization feels overdue rather than suspicious, and you tap approve so as not to be the straggler holding things up. You never saw a single one of those colleagues do it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'A solo ask',
      appName: 'Access Manager',
      timestamp: 'now',
      title: 'Authorize a new application?',
      body: 'A new application is requesting access to your work account. Approve or deny.',
    },
    after: {
      kind: 'notification',
      tag: 'Everyone supposedly did it',
      appName: 'Access Manager',
      timestamp: 'now',
      title: 'You are one of the last to approve',
      body: 'Most of your team has already authorized this application. Only a few people, including you, have not completed it yet. Approve now to stay in step with everyone else.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the bandwagon effect: we treat "lots of people are doing it" as evidence it is safe and right, and we feel the social sting of being the odd one out. "Most of your team already approved this" reframes a suspicious authorization as a queue you are late to join, and the urge to conform quietly replaces the urge to verify. The crowd is invisible and unverifiable, which is exactly why it is the attacker’s favourite pressure: a sentence is cheap, and no one pauses an authorization to go poll their colleagues. The herd you cannot see is doing the deciding.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can confirm what it actually rolled out. Not following an unseen crowd is your part.',
    moves: [
      'A claim that "everyone already did this" is unverifiable by design. Being last is not a reason, it is a nudge.',
      'Authorize applications and access only when you can confirm the rollout through an official channel, not a prompt’s peer pressure.',
      'The pressure not to be the straggler is the attack. Being the one who checks is a feature, not a failure.',
      'Numbers you cannot see are free to invent. Treat "most of your team" as marketing, then verify independently.',
    ],
  },
};

export default content;
