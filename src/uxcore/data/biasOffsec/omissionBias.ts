// No quoted figures by policy. Both sides are the security-center
// notification surface, one decision apart. Before = the report prompt,
// framed the way the mind frames it: reporting feels like an *act* that
// creates blame. After = the dialog dismissed — the "safe" nothing that
// quietly leaves the attacker their foothold. The lever is that harm by
// inaction feels less culpable than harm by action.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'You clicked something you shouldn’t have. A prompt offers one honest minute: report it. Reporting feels like an action — visible, attributable, maybe embarrassing. Closing the dialog feels like nothing at all. That “nothing” is the most consequential choice in the whole incident.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'The action that feels risky',
      appName: 'Security Center',
      timestamp: 'now',
      title: 'Report suspicious message?',
      body: 'You interacted with a link flagged as potentially malicious. Reporting alerts the security team immediately and takes under a minute. Your report helps protect everyone on the network.',
    },
    after: {
      kind: 'notification',
      tag: 'The inaction that feels safe',
      appName: 'Security Center',
      timestamp: 'later',
      priorContext:
        'Dialog closed. No report sent. On your screen, the incident is over.',
      title: 'No report was filed',
      body: 'Nothing visible happened — which is the problem. Whatever left with that click is still valid, still in use, and now working on borrowed time nobody is counting.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'The mind keeps two ledgers: harm you cause by doing something, and harm you allow by doing nothing — and it bills the second at a discount. Reporting your own click feels like authoring a confession: an act with your name on it, inviting judgment. Dismissing the dialog files itself under “no action taken,” as if not-reporting weren’t also a decision with consequences. Attackers budget for exactly this silence. Their playbook assumes a window between the click and the alarm; every victim who chooses the comfortable nothing personally donates them that window.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Reframe it once and keep it: after a bad click, silence is the harmful act, and the report is the neutral one. You’re not confessing a failure — you’re cutting the attacker’s time short.',
      'Report the “probably nothing” cases too. You have no visibility into what a click actually did; the security team does — but only after you tell them it happened.',
      'Speed beats dignity. A click reported immediately is a routine cleanup; the same click surfacing weeks later through its consequences is an incident with your unreported decision inside it.',
      'If you lead a team: make the reporter the hero of the story, every time, publicly. The moment reporting a click costs someone status, you’ve trained the whole floor to choose silence for you.',
    ],
  },
};

export default content;
