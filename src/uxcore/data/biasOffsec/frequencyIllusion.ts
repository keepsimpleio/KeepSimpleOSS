// No quoted figures by policy. Before = the first, single mention of a
// tool that doesn't exist — mildly interesting, instantly forgotten.
// After = the timeline surface: the same name resurfacing across the
// week through seeded channels, ending in the credential ask. The lever
// is the pattern — each sighting is worthless alone; together they
// counterfeit "market presence."

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Monday, a tool called Relayo gets mentioned once — you shrug. By the next week you’ve “seen it everywhere,” so when the invite lands asking you to set a password, it feels like joining something established. Nobody checked that every single sighting traces back to the same hand.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'One mention — noise',
      senderName: 'Marta Ilyes',
      senderHandle: '#random · community Slack',
      timestamp: 'Mon, 2:17 PM',
      body: 'Anyone tried Relayo for client handoffs? Keep seeing the name pop up lately.',
    },
    after: {
      kind: 'timeline',
      tag: 'A week of sightings — “everywhere”',
      items: [
        {
          label: 'Day 1',
          source: 'Forwarded newsletter',
          text: 'A roundup blurb mentions Relayo among “tools teams are adopting.”',
        },
        {
          label: 'Day 3',
          source: 'LinkedIn comment',
          text: 'A stranger under an industry post: “We moved handoffs to Relayo, night and day.”',
        },
        {
          label: 'Day 6',
          source: 'Community Slack',
          text: '“Anyone tried Relayo for client handoffs?” — sounds like organic buzz.',
        },
        {
          label: 'Day 8',
          source: 'Your inbox',
          text: '“Your team invited you to Relayo — set your password to join the workspace.”',
          flagged: true,
        },
      ],
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'After you notice something once, your brain starts flagging every recurrence — and quietly reads the growing count as significance. Three mentions in a week feels like a trend, and a trend feels like legitimacy: surely a tool “everyone” discusses is real, funded, vetted. But frequency is the cheapest signal there is to fake. A newsletter blurb, one LinkedIn comment, one Slack question — three plants, days apart, and the target’s own pattern-matching does the rest. By the time the password invite arrives, it isn’t a stranger asking for credentials; it’s a familiar name finally making its move.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      '“I keep seeing it everywhere” is a feeling, not due diligence. Count independent sources, not sightings — three mentions that trace to strangers you can’t verify are one source wearing three coats.',
      'A “your team invited you” email is verified with the team, out loud, in a channel you already trust — not by clicking through. If nobody at your company bought the tool, nobody invited you.',
      'Setting a password on an unknown service is the whole game: most people reuse one. If you ever do sign up somewhere new, that password must be unique — assume the form exists to harvest it.',
      'Notice when a name is being introduced to you gradually, with no ask. Legitimate products pitch you once, openly. A slow drip of casual mentions that ends in a login form was a runway, not a coincidence.',
    ],
  },
};

export default content;
