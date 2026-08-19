// Surface is a reward email. The lever is the just-world fallacy: framing a
// windfall as deserved ("your loyalty earned this") slips past the healthy
// suspicion that an unexplained reward would normally trigger.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"You have earned this" is built to skip the question "why me?". Deserving a reward is not evidence the reward is real.',
  scenario:
    'An email says you have been selected for a valuable reward. Unexplained, "you won, claim now", your first instinct is "why me?" and you smell a scam. Reframed as earned, "as one of our most loyal customers this year, you have qualified for this thank-you", it fits a comforting belief that good things come to those who deserve them, and you reach to claim what feels rightfully yours.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Unexplained reward',
      sender: 'rewards@member-benefits-desk.com',
      timestamp: '1:10 PM',
      subject: 'You have been selected for a reward',
      preview:
        'You have won a reward. Claim it now by confirming your details.',
    },
    after: {
      kind: 'email',
      tag: 'Reward framed as deserved',
      sender: 'rewards@member-benefits-desk.com',
      timestamp: '1:10 PM',
      subject: 'Your loyalty earned this, claim your reward',
      preview:
        'As one of our most loyal members this year, you have qualified for a special thank-you. You have more than earned it. Confirm your details to claim what is rightfully yours.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the just-world fallacy, the deep-seated belief that people get what they deserve. An unexplained reward triggers a useful alarm, "why would this come to me?", but reframe it as earned and that alarm goes quiet, because "I deserve good things" is a story we are all primed to accept. Told your loyalty qualified you, you stop asking whether the prize is real and start feeling entitled to it. The attacker has not given you a reason the reward exists, only a reason you deserve one, and that is enough to walk you past the question that would have saved you.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can spot a bait reward. Keeping "why me?" switched on is your part.',
    moves: [
      'Feeling you deserve a reward says nothing about whether it is real. Keep asking why this exists and how they reached you.',
      'A genuine reward never needs your login or banking details to "claim" it. That step is the whole point of the message.',
      '"You have earned this" is doing a job: replacing your suspicion with entitlement. Notice the swap.',
      'The same lever runs in reverse after a scam, when victims feel they must have done something to deserve it. Report it anyway.',
    ],
  },
};

export default content;
