// Surface is a systems-status board: a grid of tiles that mostly read
// "Normal". The lever is normality bias: you assume things will keep
// working the way they always have, so a real anomaly parked among a wall
// of "Normal / Normal / Normal" gets read as routine and dismissed. The
// tiles carry the identical anomaly across both cards; only the surrounding
// normality framing changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A board that says "normal" everywhere trains you to read the one abnormal line as normal too. The anomaly did not blend in on its own, the wall of green did the blending.',
  scenario:
    'A domain controller starts sending outbound traffic to an address it has never talked to. Flagged clearly on its own, you escalate and someone investigates within the hour. Surrounded by a wall of "Normal" tiles on the morning board, the same anomaly reads as one more line in a page that always looks fine, and you scroll past it because nothing here has ever meant anything before.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'stats',
      tag: 'The anomaly on its own screen',
      title: 'Alert: first-contact outbound',
      tiles: [
        {
          label: 'DC-02 outbound',
          value: 'New host',
          trend: 'up',
          flagged: true,
        },
        { label: 'Destination seen before', value: 'Never' },
        { label: 'First seen', value: '03:12' },
        { label: 'Volume since', value: '2.1 GB', trend: 'up' },
      ],
      note: 'One exception, one screen. Nothing around it to blend into.',
    },
    after: {
      kind: 'stats',
      tag: 'The same anomaly, one line in the wall',
      title: 'Systems status, morning board',
      priorContext:
        'This board has said "Normal" every morning for two years. You check it the way you check the weather, expecting nothing.',
      tiles: [
        { label: 'Auth service', value: 'Normal' },
        { label: 'Mail gateway', value: 'Normal' },
        { label: 'VPN concentrator', value: 'Normal' },
        { label: 'DC-01 outbound', value: 'Normal' },
        { label: 'DC-02 outbound', value: 'New host' },
        { label: 'Backup job', value: 'Normal' },
        { label: 'Endpoint agents', value: 'Normal' },
        { label: 'Patch status', value: 'Current' },
      ],
      note: 'The identical anomaly sits mid-grid, styled like every tile around it.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is normality bias. We expect the near future to look like the recent past, and a system that has been fine for years builds a strong prior that it will stay fine, which quietly raises the bar for what counts as worth reacting to. The anomaly is identical in both cards: DC-02 reaching a host it has never contacted. What changes is the company it keeps. Alone on an alert screen, it is an exception that demands a look. Dressed like its neighbours in a wall of "Normal", it inherits their calm and gets filed as more of the same. An attacker who has moved laterally and is exfiltrating does not need the board to hide the beacon, they only need it to sit among enough normal lines that your assumption of continuity does the dismissing. The signal is on the screen. The bias is what tells you it is nothing.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team tunes the alerts and baselines. Refusing to let a page of "Normal" answer for the one line that is not is your part.',
    moves: [
      'Read each line against its own baseline, not against the mood of the board. A new outbound host is abnormal whether or not everything around it is calm.',
      'Treat "it has always been fine" as the reason to look harder at the one thing that changed, not permission to skip it.',
      'Make anomalies page you out of the status board entirely, so a first-seen destination does not have to survive a wall of green to get noticed.',
      'When a screen feels reassuring, name the single line that would matter if it were real, then check whether that line is actually normal or just surrounded by normal.',
    ],
  },
};

export default content;
