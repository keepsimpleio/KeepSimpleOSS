// Surface is the same three log events, twice: as they looked during an
// ordinary week, and replayed in a vendor's "post-incident review" after a
// breach was announced. The lever is hindsight bias: once the ending is
// known, ordinary noise looks like an obvious chain of warnings. The rows
// stay short and parallel; the sales pitch lives outside the log, in the
// context line, so the artifact stays a log.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Once the ending is known, every ordinary event before it looks like an obvious warning. Anyone replaying your past as "you should have seen it" is using knowledge nobody had at the time.',
  scenario:
    'Three moments from an ordinary week: a routine login alert, a slow shared drive, an odd supplier email. Each was checked, resolved, forgotten. Then a breach is announced, and a vendor\'s "post-incident review" replays the same three moments as Step 1, Step 2, Step 3 of a chain anyone should have caught. No new facts, only a known ending, and the ending is what makes the past look obvious. The shame of "you missed it" is the lever: it sells their monitoring, and it works just as well when the three events had nothing to do with the breach at all.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'timeline',
      tag: 'The week, as it looked at the time',
      items: [
        {
          label: 'Tue',
          source: 'Sign-in alert',
          text: 'Login from a new city. Resolved: employee travel.',
        },
        {
          label: 'Wed',
          source: 'Helpdesk',
          text: 'Shared drive slow before lunch. Closed by afternoon.',
        },
        {
          label: 'Thu',
          source: 'Inbox',
          text: 'Supplier email asks to confirm bank details. Marked as spam.',
        },
      ],
    },
    after: {
      kind: 'timeline',
      tag: 'The same week, replayed after the breach',
      priorContext:
        'A week after the incident, a vendor\'s "post-incident review" replays your log with labels written by someone who already knows the ending. The closing page sells their monitoring service.',
      items: [
        {
          label: 'Step 1',
          source: 'Sign-in alert',
          text: 'The foothold. The warning that was ignored.',
          flagged: true,
        },
        {
          label: 'Step 2',
          source: 'Helpdesk',
          text: 'The staging. Data moving in plain sight.',
          flagged: true,
        },
        {
          label: 'Step 3',
          source: 'Inbox',
          text: 'The attacker making contact. Missed again.',
          flagged: true,
        },
      ],
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is hindsight bias. Once you know how a story ended, the events before it stop looking like the noise they were and start looking like a chain of obvious clues, and "it was predictable" replaces the truth, which is that nobody could have told these three moments apart from a thousand identical harmless ones. The log is the same in both cards. The vendor adds no evidence, only labels written with the ending in hand, and the labels do two jobs: they manufacture guilt ("anyone paying attention would have caught this") and they sell the cure for that guilt. The trick needs no connection between the events and the breach. It only needs you to feel, looking backwards, that the signs were always there.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team runs real postmortems with evidence. Refusing manufactured obviousness is your part.',
    moves: [
      'Ask of every "obvious warning sign": obvious compared to what? Count the identical events that week that led to nothing, because that denominator is what the storyteller deleted.',
      'A real postmortem shows how events connect with evidence: logs, timestamps, causality. Labels like "Step 1" are narrative, and narrative is free.',
      'Be suspicious of any retelling that arrives together with a product, a contract, or a person to blame. Hindsight is the cheapest sales pitch in security.',
      'Judge past decisions by what was knowable at the time, not by the ending. That standard protects your team from blame games and you from buying protection against a story.',
    ],
  },
};

export default content;
