// Surface is a routine shared-document notice. The lever is perceptual
// filtering: the same phishing artifact is scrutinized when it arrives out
// of context, but when it matches the routine you always expect, your
// frame fills in the details and you never actually see the wrong sender.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When a message looks exactly like the thing you get every week, you stop reading it and start recognizing it. That gap is the attack.',
  scenario:
    'Every Monday your team shares the weekly metrics deck through the same tool. A phishing email copies that exact artifact. Land it on a random Thursday and the odd sender and link jump out. Land it Monday at 9 AM, right where the real one always sits, and you read "the weekly deck is ready" and click, never actually seeing that the address is wrong.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Out of its expected slot',
      sender: 'no-reply@team-metrics-share.com',
      timestamp: 'Thu, 3:20 PM',
      subject: 'A document has been shared with you',
      preview:
        'Someone shared "Weekly Metrics" with you. Sign in to view. On an ordinary Thursday, the unfamiliar sender and the sign-in ask make you pause and squint at the address.',
    },
    after: {
      kind: 'email',
      tag: 'Exactly where you expect it',
      sender: 'no-reply@team-metrics-share.com',
      timestamp: 'Mon, 9:00 AM',
      priorContext:
        'It is Monday morning. The weekly metrics deck always lands about now, from a tool that looks just like this. You are already reaching for it.',
      subject: 'Weekly Metrics is ready to view',
      preview:
        'Your weekly deck has been shared. Sign in to open it. You register "the Monday deck", not the address it came from, and click before a single detail registers.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is selective perception. Expectations do not just bias what you conclude, they filter what you actually notice. When something matches a frame you are already holding, "the Monday deck", your eyes confirm the pattern and skip the particulars. You look straight at the wrong sender address and read the name you expected to see, because your brain is recognizing a routine, not inspecting an email. The attacker does not hide the tells. They just deliver the message at the moment your perception is set to wave that shape through.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team tunes the filters. Catching what you filter out yourself is the harder half.',
    moves: [
      'The more routine a message feels, the more deliberately you should check the sender and link. Familiarity is exactly when perception goes on autopilot.',
      'Open recurring documents from the tool or bookmark you already use, not from the notification, even when the notification looks perfect.',
      'Slow down for the messages you were expecting anyway. "Right on schedule" is a thing attackers can fake on purpose.',
      'Read the full address, not the display name. Your frame supplies the name, only your eyes can supply the domain.',
    ],
  },
};

export default content;
