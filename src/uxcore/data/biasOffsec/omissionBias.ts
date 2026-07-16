// No quoted figures by policy. Both sides are the security-center
// notification surface, one decision apart. Before = the report prompt,
// framed the way the mind frames it: reporting feels like an act that
// creates blame. After = the dialog dismissed, the "safe" nothing that
// leaves the attacker their foothold. The lever: harm from inaction
// feels less blameworthy than harm from action.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'You clicked something you should not have. A prompt offers one honest minute: report it. Reporting feels like an action, visible and attributable, maybe embarrassing. Closing the dialog feels like nothing at all. That "nothing" is the most consequential choice in the whole incident.',
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
      body: 'Nothing visible happened, and that is the problem. Whatever left with that click is still valid, still in use, and working on time nobody is counting.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'The mind keeps two accounts: harm you cause by doing something, and harm you allow by doing nothing. The second one always feels cheaper. Reporting your own click feels like signing a confession, an act with your name on it. Dismissing the dialog files itself under "no action taken", as if not reporting were not also a decision with consequences. Attackers count on exactly this silence. Their playbook assumes a gap between the click and the alarm, and every victim who chooses the comfortable nothing donates them that gap personally.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Reframe it once and keep it: after a bad click, silence is the harmful act and the report is the neutral one. You are not confessing a failure. You are cutting the attacker’s time short.',
      'Report the "probably nothing" cases too. You cannot see what a click actually did. The security team can, but only after you tell them it happened.',
      'Speed beats dignity. A click reported immediately is routine cleanup. The same click surfacing weeks later through its consequences is an incident with your unreported decision inside it.',
      'If you lead a team: make the reporter the hero of the story, every time, publicly. The moment reporting a click costs someone status, you have trained the whole floor to choose silence.',
    ],
  },
};

export default content;
