// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the consent screen as it lands on the victim. The lever is the
// serial-position effect: the first and last items in a list are remembered
// and scrutinized, the middle is lost. The attacker places the dangerous
// permission in the middle, flanked by mundane ones, where attention is weakest.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a consent list opens and closes with harmless items, read the middle twice. The risky line is placed where memory and scrutiny are weakest, between the mundane ones.',
  scenario:
    'An app asks for permissions to connect to your calendar. The list runs seven items long. The first line is ordinary, view your basic profile. The last line is ordinary, view your language and region. Dead in the middle, where your eyes glide and your memory drops off, sits the one that matters: read and send mail on your behalf, flanked on both sides by boring scopes. You approve the screen and later recall granting something reasonable, because the parts you remember, the first and the last, were reasonable. The attacker did not hide the dangerous scope. They positioned it where you would not hold onto it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: bury it in the middle',
      steps: [
        {
          label: 'Open with a harmless item',
          note: 'View basic profile. The first line is remembered and it reads as safe, setting the tone.',
        },
        {
          label: 'Bury the dangerous scope dead center',
          note: 'Read and send mail on your behalf, dropped into the middle of a seven-item list where recall and scrutiny bottom out.',
          active: true,
        },
        {
          label: 'Flank it with more mundane items',
          note: 'Surround the risky line with boring, unremarkable scopes so nothing about it stands out and it never reads as risky.',
        },
        {
          label: 'Close with another harmless item',
          note: 'View your language and region. The last line is remembered too, so the whole list feels tame.',
        },
      ],
      footer: 'First and last are what they keep. Hide the cost between them.',
    },
    after: {
      kind: 'permission',
      tag: 'The plan, as it lands on you',
      appName: 'CalendarSync',
      appGlyph: '📅',
      subtitle: 'wants access to your account',
      scopes: [
        { label: 'View your basic profile' },
        { label: 'See your email address' },
        { label: 'See your calendar events' },
        { label: 'Read and send mail on your behalf' },
        { label: 'See your contacts list' },
        { label: 'Read your calendar settings' },
        { label: 'View your language and region' },
      ],
      cta: 'Allow',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the serial-position effect. In any list, the first items get primacy and the last get recency, so both ends are attended to and remembered while the middle sags into a blind spot. The attacker maps the permission screen onto that curve deliberately: harmless scopes anchor the top and the bottom, the two positions you will actually process and recall, and the one scope that hands over control, sending mail as you, is set in the middle where your attention is thinnest. You are not tricked by a hidden line, the dangerous scope is right there in plain text. You are tricked by placement, because after you approve, the items your memory kept are the innocuous ends, so you file the grant as reasonable. That is why the defense is to read a consent list against its curve, giving the middle the scrutiny it never gets on its own.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'The platform shows you every scope in plain text. Reading the middle as hard as the ends is the part only you can do.',
    moves: [
      'Read a permission list from the middle out, not top to bottom. The risky scope is placed where your attention naturally dips, so give the center the scrutiny the ends get for free.',
      'Judge each scope against what the app actually needs. A calendar tool has no reason to read and send your mail, and that mismatch is the whole tell.',
      'Any single scope that grants "act on your behalf", send, post, pay or delete, outweighs every harmless line around it. One dangerous grant is enough to reject the screen.',
      'If you cannot recall every permission a second after approving, you did not evaluate the list, you skimmed its edges. Reopen it and read it in full before you allow.',
    ],
  },
};

export default content;
