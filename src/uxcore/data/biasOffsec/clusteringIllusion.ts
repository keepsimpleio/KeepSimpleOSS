// Surface is a timeline of events. The lever is the clustering illusion:
// random, unrelated noise is drawn into a "coordinated attack pattern" so
// the manufactured pattern panics you into the action they want.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Three dots do not make a conspiracy. A vendor drawing a line through random events is manufacturing urgency, not detecting an attack.',
  scenario:
    'A "threat intelligence" alert about your account lists a few ordinary events: a login from another city, a password field left blank once, a device you did not recognize. On their own, background noise. Strung together and labelled a "coordinated intrusion pattern", they look like an attack unfolding right now, and the fear pushes you to "authorize emergency lockdown" by signing in where they say.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'timeline',
      tag: 'Loose, unlabelled events',
      items: [
        {
          label: 'Tue',
          source: 'Login',
          text: 'Sign-in from a nearby city.',
        },
        {
          label: 'Wed',
          source: 'Form',
          text: 'A password field submitted blank once, then retried.',
        },
        {
          label: 'Fri',
          source: 'Device',
          text: 'Sign-in from an unrecognized browser.',
        },
      ],
    },
    after: {
      kind: 'timeline',
      tag: 'The same events, "connected"',
      items: [
        {
          label: 'Phase 1',
          source: 'Recon',
          text: 'Attacker probes your account from a remote location.',
        },
        {
          label: 'Phase 2',
          source: 'Credential test',
          text: 'Automated login attempt detected against your password.',
        },
        {
          label: 'Phase 3',
          source: 'Foothold',
          text: 'Unknown device establishes access. Act now to stop Phase 4.',
          flagged: true,
        },
      ],
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the clustering illusion, the mind’s refusal to accept randomness. Scatter a few unrelated events and your brain insists on a line through them, a plot, a campaign, an enemy with a plan. Attackers hand you that line ready-drawn: relabel normal noise as "Phase 1, Phase 2, Phase 3" and a boring week becomes an intrusion in progress. The pattern is not in the events, it is in the framing. And a pattern that feels like an unfolding attack collapses the time you would otherwise spend checking whether any of it is real.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can tell a real campaign from noise. Letting them, instead of a scary alert, is your part.',
    moves: [
      'Ask what each event is on its own before you accept the story tying them together. Most "patterns" dissolve into ordinary noise.',
      'A narrative of escalating "phases" designed to scare you is a persuasion structure, not forensic evidence.',
      'Do not act on a threat story from the alert itself. Take it to your real security team, who can see the actual logs.',
      'Randomness looks like a plot to human eyes. That instinct is exactly the lever, so distrust the tidy story most.',
    ],
  },
};

export default content;
