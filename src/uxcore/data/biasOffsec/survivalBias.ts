// Surface is a horizontal bar chart of investment returns, one bar flagged
// as the product being sold to you. The lever is survival bias: you rate a
// fund, tool, or track record by the winners still on the board, because the
// ones that blew up were quietly dropped from the chart. Same dataset both
// ways. Only the survivorship filtering changes: the honest chart draws the
// dead entries as ghost bars, the flagged one deletes them.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A track record where every entry points up did not happen. It was edited. The failures were removed before you saw the chart, and the one bar left standing is the one they want your money on.',
  scenario:
    'A "high-return strategy" is pitched to you with a chart of its cohort. The honest version of that chart also plots the funds in the same cohort that closed or lost, drawn faded because they did not survive, and next to them the winner looks like ordinary luck. The version you are actually shown has those losers deleted. Every remaining bar climbs, the flagged one climbs highest, and a coin flip that happened to land well reads as a repeatable edge.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chart',
      tag: 'The full cohort, survivors and failures',
      title: 'Strategy cohort, 3-year return',
      bars: [
        { label: 'Fund A (closed)', value: -22, display: '-22%', ghost: true },
        { label: 'Fund B (closed)', value: -14, display: '-14%', ghost: true },
        { label: 'Fund C', value: 18, display: '+18%' },
        {
          label: 'Fund D (wound down)',
          value: -9,
          display: '-9%',
          ghost: true,
        },
        { label: 'Fund E', value: 24, display: '+24%' },
        { label: 'Meridian Alpha', value: 31, display: '+31%' },
      ],
      caption:
        'The faded bars are the funds that did not make it. Against the full field, the top performer is one draw among many.',
    },
    after: {
      kind: 'chart',
      tag: 'The same cohort, losers omitted',
      title: 'Strategy cohort, 3-year return',
      priorContext:
        'This is the exact same set of funds. The three that closed have simply been left off the slide before it reached you.',
      bars: [
        { label: 'Fund C', value: 18, display: '+18%' },
        { label: 'Fund E', value: 24, display: '+24%' },
        { label: 'Meridian Alpha', value: 31, display: '+31%', flagged: true },
      ],
      caption:
        'The losers are gone from the chart. Every remaining bar climbs, and the flagged one climbs highest.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is survival bias. You judge a category by the members still standing, because the ones that failed left the sample and stopped generating evidence you could see. The dataset is identical across both charts. The only change is that the failed funds are plotted as ghost bars in one and erased in the other, and that single edit flips your read from "this was a coin flip" to "this is a strategy". A record built only from winners shows who has not lost yet, and says nothing about skill or about who falls next. Attackers and bad salespeople love it because they do not have to forge a single number. They just choose which real numbers you never see. The bar they flag is the survivor, dressed as the rule.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your firm can demand full disclosure in writing. Asking where the losers went is the part only you can do in the room.',
    moves: [
      'For any track record, ask for the denominator. How many started in this cohort, and how many of them are being shown to you now?',
      'A chart where every bar points up is a filtered chart. Assume the excluded entries exist and ask to see them before you weigh the ones that remain.',
      'Separate a survivor from a strategy. One outcome that landed well is a data point, not a method you can count on repeating.',
      'When a "proven" pitch cannot name a single failure in its own category, treat that silence as the most important number on the slide.',
    ],
  },
};

export default content;
