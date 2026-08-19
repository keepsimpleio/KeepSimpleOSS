// Surface is a vertical timeline of the events that led up to an incident.
// The lever is hindsight bias: once you know the breach happened, scattered
// ambiguous prior events get relabelled as an obvious chain everyone "saw
// coming". Same events both ways. Only the after-the-fact framing changes.
// The flagged version is a post-incident message that reframes noise as
// foreseeable to push a paid remediation and steer the blame.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'After a breach, everything reads as an obvious warning you should have caught. Someone who reframes ordinary noise as a chain you "clearly missed" is manipulating that feeling to sell you a fix or pin the blame.',
  scenario:
    'A week after a minor security incident, you get a message walking you through the "obvious escalation" that led to it: a login alert, a slow morning, a vendor email, each now labelled Step 1, Step 2, Step 3 of an attack anyone could have foreseen. The events are real and you did see them. At the time they were unremarkable background. Reframed as a chain you failed to connect, the shame lands, and the message offers a paid remediation to make sure you never miss the signs again.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'timeline',
      tag: 'The events as they actually looked',
      items: [
        {
          label: 'Tue',
          source: 'Sign-in alert',
          text: 'A login from a new city. You travel, a colleague travels, this fires most weeks. You glance and move on.',
        },
        {
          label: 'Wed',
          source: 'Helpdesk',
          text: 'Someone reports the shared drive felt slow before lunch. It was fine by the afternoon.',
        },
        {
          label: 'Thu',
          source: 'Inbox',
          text: 'A supplier emails asking you to confirm bank details "for our records". Odd phrasing, nothing you act on.',
        },
      ],
    },
    after: {
      kind: 'timeline',
      tag: 'The same events, relabelled after the breach',
      priorContext:
        'These are the identical three events. Nothing new was discovered. Only the labels were added, a week later, by someone who already knows how the story ended.',
      items: [
        {
          label: 'Step 1',
          source: 'Sign-in alert',
          text: 'The initial foothold. The attacker logs in from abroad and the warning is ignored, as attackers count on.',
        },
        {
          label: 'Step 2',
          source: 'Helpdesk',
          text: 'Lateral movement. The "slow drive" was data being staged for exfiltration in plain sight.',
        },
        {
          label: 'Step 3',
          source: 'Inbox',
          text: 'The payload. The breach we all predicted, and the one anyone paying attention would have stopped. Book the paid remediation before it repeats.',
          flagged: true,
        },
      ],
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is hindsight bias. Once you know an outcome, your memory quietly rewrites how predictable it felt beforehand, and the messy, ambiguous run-up collapses into a clean line that "obviously" pointed here. The three events are identical in both timelines. All that changed is that someone who knows the ending added the labels, turning background noise into Step 1, Step 2, and the breach you should have called. Attackers and opportunists exploit the "knew it all along" feeling because it does two useful things at once: it makes you feel culpable, which makes you compliant, and it makes the attacker look like they simply read a pattern you were too careless to see. The shame is the product. It softens you up for whatever they are selling, whether that is a paid fix, a rushed decision, or a quiet reassignment of blame.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: "Your team runs the real post-incident review. Refusing to accept a stranger's tidy story about it is your part.",
    moves: [
      'Ask what was actually knowable at the time, not what is obvious now. A signal only counts if it stood out before you knew the ending.',
      'Distrust any post-incident narrative that arrives with a fix attached. Manufactured hindsight and a payment link in the same message is a sales tactic, not an analysis.',
      'Run the real review internally, with the people who were there, before you accept anyone else\'s labelled chain of "obvious" steps.',
      'Notice the pull to feel you should have seen it coming. That feeling is the lever, and it is aimed at getting you to act fast to make the shame go away.',
    ],
  },
};

export default content;
