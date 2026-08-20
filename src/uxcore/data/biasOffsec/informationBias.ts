// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is information bias:
// the craving for more information even when it cannot change the decision.
// Offer endless verification detail so the target keeps digging and engaging,
// and each extra layer deepens commitment instead of prompting them to stop.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A page that keeps offering "more verification" is not proving itself. It is keeping you busy, and every extra click is you committing further, not checking harder.',
  scenario:
    'A security page offers layer after layer of detail: click to see the sign-in location, click to see the device, click to see the risk report. None of it changes what you should do, which is leave. But the mind craves more information before deciding, so you keep clicking, and each click pulls you deeper into the flow. The attacker is not trying to convince you with any single fact. They are feeding your appetite for detail so you stay engaged, because as long as you are still gathering, you have not yet walked away.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: drown them in verification',
      steps: [
        {
          label: 'Offer endless detail',
          note: 'Layer after layer of "more info": location, device, risk report. Feed the craving to know more.',
          active: true,
        },
        {
          label: 'Keep the next click one tap away',
          note: 'Every answer opens another question. The flow never resolves; it only continues.',
        },
        {
          label: 'Let digging deepen commitment',
          note: 'Each extra detail is another step in. The more they gather, the more invested they feel.',
        },
        {
          label: 'Never give a reason to stop',
          note: 'None of the detail changes the right move, which is to leave. Volume hides that.',
        },
      ],
      footer:
        'The craving to know more does the trapping. Every extra layer is the con.',
    },
    after: {
      kind: 'browser',
      tag: 'The plan, as it lands on you',
      protocol: 'https',
      host: 'account-security-review.co',
      path: '/verify/step-3',
      pageHeading: 'Suspicious sign-in flagged. Review the details.',
      pageBody:
        'We blocked a sign-in on your account. Click to see the location. Click to see the device fingerprint. Click to see the full risk report. Click to see previous attempts. Complete each step to confirm this was not you and secure your account.',
      cta: 'See more verification',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is information bias, the appetite for more information even when the extra data cannot change what you should do. Faced with a decision, the mind feels safer gathering than acting, so a flow that keeps promising one more detail keeps you in it. An attacker weaponizes that by making verification bottomless: location, then device, then risk report, then history, each click answering nothing that matters and opening the next. The right move never changes, which is to close the tab and check through your real account, but the stream of detail keeps that decision permanently one step away. Worse, each layer you open is a small act of commitment, so digging in makes leaving feel like wasting the effort already spent. The attacker does not need to convince you with a fact. They only need you to keep asking for the next one.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'More detail is not more proof. If the extra information would not change your action, stop gathering it.',
    moves: [
      'Ask what the next click could possibly change. If the safe move is "leave and check my real account" no matter what the detail says, take it now.',
      'Treat a flow that keeps offering "more verification" as the warning itself. Legitimate security tells you the outcome, it does not sell you a tour of evidence.',
      'Do not let clicks already spent talk you into the next one. Sunk effort is not a reason to finish a hostile flow.',
      'Close the page and verify sign-ins from the service directly. A real blocked login is visible there without any of the layers.',
    ],
  },
};

export default content;
