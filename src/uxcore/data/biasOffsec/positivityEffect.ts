// Surface is a security dashboard: a grid of metric tiles, most green, one
// bad. The lever is the positivity effect: attention and memory skew toward
// the good numbers, so a board that leads with uptime and patch health and
// tucks the one alarming metric among the greens gets read as "all well".
// The tiles carry identical numbers across both cards; only the emphasis,
// which tile is loud and which is dimmed, changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A dashboard that opens with good news buys the benefit of the doubt for the one number that should scare you. The bad tile did not go away, it just stopped being the thing you looked at.',
  scenario:
    'Your security board shows a spike in failed logins alongside the usual health metrics. Presented plainly, the 412 failed logins sit up front and you open an investigation. Presented as a wall of green with uptime and patch status leading, the same 412 gets dimmed and slotted below the reassuring tiles, and your eye settles on "all systems healthy" before it ever reaches the one line that is on fire.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'stats',
      tag: 'The bad number, shown plainly',
      title: 'Security overview',
      tiles: [
        {
          label: 'Failed logins (24h)',
          value: '412',
          trend: 'up',
          flagged: true,
        },
        { label: 'Uptime', value: '99.9%', trend: 'flat' },
        { label: 'Patches current', value: '100%', trend: 'flat' },
        { label: 'Open tickets', value: '3', trend: 'down' },
      ],
      note: 'The failed-login spike leads the board, top of the grid and flagged.',
    },
    after: {
      kind: 'stats',
      tag: 'The same number, smoothed over',
      title: 'Security overview',
      priorContext:
        'The board has looked green for months. It opens on the wins, and you have learned to skim it the same way every morning.',
      tiles: [
        { label: 'Uptime', value: '99.9%', trend: 'flat' },
        { label: 'Patches current', value: '100%', trend: 'flat' },
        { label: 'Open tickets', value: '3', trend: 'down' },
        {
          label: 'Failed logins (24h)',
          value: '412',
          trend: 'up',
          muted: true,
        },
      ],
      note: 'The identical 412, now dimmed and last, sitting under three green tiles.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the positivity effect. Attention and memory both skew toward positive information, so a screen that leads with good numbers sets the mood before the bad one arrives, and the bad one has to fight uphill to be noticed. The data is the same in both cards: 412 failed logins, up. What changes is where the number sits and how loud it is. Placed first, it reads as an alert. Dimmed and buried under uptime and patch health, it reads as noise you can skip. An attacker running credential-stuffing does not need to hide the spike, they only need it framed as one green tile among many, because the positive frame does the smoothing for them. The breach signal is right there on the board. Your bias is what decides it does not count.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team designs the dashboards and sets the thresholds. Reading past the green to the one tile that moved is your part.',
    moves: [
      'Read the worst tile first, on purpose. Whatever the board leads with is a design choice, not a ranking of what matters.',
      'Treat a dimmed or downplayed metric as the one to open, not the one to skip. Emphasis is not severity.',
      'Set alerts on the numbers that should scare you, so a failed-login spike pages you instead of waiting to be noticed under three green tiles.',
      'When a board feels reassuring, ask what single number would change that feeling, then go find it and read it directly.',
    ],
  },
};

export default content;
