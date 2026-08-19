// No quoted figures by policy. Before = the first, single mention of a
// tool that does not exist: mildly interesting, instantly forgotten.
// After = the timeline surface: the same name resurfacing across the
// week through seeded channels, ending in the credential ask. The lever
// is the pattern. Each sighting is worthless alone; together they fake
// market presence.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Monday, a tool called Relayo gets mentioned once and you shrug. By the next week you have "seen it everywhere", so when an invite asks you to set a password, it feels like joining something established. Nobody checked that every sighting traces back to the same hand.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'One mention, noise',
      senderName: 'Marta Ilyes',
      senderHandle: '#random · community Slack',
      timestamp: 'Mon, 2:17 PM',
      body: 'Anyone tried Relayo for client handoffs? Keep seeing the name pop up lately.',
    },
    after: {
      kind: 'timeline',
      tag: 'A week of sightings, "everywhere"',
      items: [
        {
          label: 'Day 1',
          source: 'Forwarded newsletter',
          text: 'A roundup blurb lists Relayo among "tools teams are adopting".',
        },
        {
          label: 'Day 3',
          source: 'LinkedIn comment',
          text: 'A stranger under an industry post: "We moved handoffs to Relayo, night and day."',
        },
        {
          label: 'Day 6',
          source: 'Community Slack',
          text: '"Anyone tried Relayo for client handoffs?" Sounds like organic buzz.',
        },
        {
          label: 'Day 8',
          source: 'Your inbox',
          text: '"Your team invited you to Relayo. Set your password to join the workspace."',
          flagged: true,
        },
      ],
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Once you notice something, your brain starts flagging every recurrence and reads the growing count as importance. Three mentions in a week feels like a trend, and a trend feels legitimate: surely a tool everyone discusses is real, funded, vetted. But frequency is the cheapest signal to fake. A newsletter blurb, one LinkedIn comment, one Slack question. Three plants, days apart, and your own pattern-matching does the rest. By the time the password invite arrives, it is not a stranger asking for credentials. It is a familiar name finally making its move.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      '"I keep seeing it everywhere" is a feeling, not due diligence. Count independent sources, not sightings. Three mentions from strangers you cannot verify are one source wearing three coats.',
      'Verify a "your team invited you" message with the team, out loud, in a channel you already trust. Never by clicking through. If nobody at your company bought the tool, nobody invited you.',
      'Setting a password on an unknown service is the whole game, because most people reuse one. If you do sign up somewhere new, that password must be unique. Assume the form exists to harvest it.',
      'Notice when a name is introduced to you gradually, with no ask. Real products pitch you once, openly. A slow drip of casual mentions that ends in a login form was a runway, not a coincidence.',
    ],
  },
};

export default content;
