// Mode: interactive. The reader clicks, and a small, tidy request judged on
// its own beats what a fuller disclosure would earn. Surface: an app consent
// screen with a single, plainly worded permission that reads as considerate
// precisely because it is short. The lever is the less-is-better effect: a
// minimal-looking ask, evaluated in isolation, feels safer than it is, and
// would rate far worse if you saw everything it actually grants side by side.
// Granting it is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A permission worded as one small, tidy line is asking you to judge how it looks, not what it grants. Read it as though it were spelled out in full.',
  scenario:
    'An app you found for cleaning up your inbox asks to connect. Its consent screen is strikingly short: one permission, worded plainly, with a note that it keeps access minimal. Most apps you connect throw a wall of scopes at you. This one fits on a single line.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'permission',
      appName: 'InboxTidy',
      appGlyph: 'IT',
      subtitle: 'Wants minimal access. Just one permission, nothing more.',
      scopes: [{ label: 'Let InboxTidy manage your inbox for you' }],
      cta: 'Allow',
    },
    question: 'Do you allow it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Allow it, one plainly worded permission is about as modest as an app can ask',
        trap: true,
        outcome:
          'Trap. "Manage your inbox for you" is a single friendly line for a scope that grants full read, send, and delete on your mailbox, including the password-reset emails for your other accounts. On its own the line read as restraint. Spelled out beside everything it allows, you would have rated it alarming. You judged how the request looked, not what it does.',
      },
      {
        label:
          'Open the permission details to see what "manage your inbox" actually grants, then deny it',
        safe: true,
        outcome:
          'Safe. You made the short line show its full length. "Manage your inbox" expands to reading every message, sending as you, and deleting anything, which is total mailbox control no tidy-up tool needs. The brevity was the trick: a single modest-sounding scope, sized to slip past as good manners.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the less-is-better effect: judged on its own, a smaller, cleaner-looking option can win over a fuller one, and the ranking flips the moment you put them side by side. A consent screen that offers "just one permission" invites evaluation in isolation, where a single plainly worded line reads as modest and considerate. You never lay that one scope next to the full disclosure of what it grants, reading every message, sending as you, deleting anything, reaching the password resets for your other accounts. Seen alone it looks restrained; seen in that joint comparison it would look worse than a longer, honest list. The framing swaps the useful question ("what can this app actually do?") for a flattering one ("isn\'t it nice they ask so little?"), and one well-chosen broad scope beats a long honest one because the eye rewards the short request.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can restrict which apps may connect. Reading a scope for what it grants, not how little it looks like, is the part only you can do at the prompt.',
    moves: [
      'A short permission list is not a safe one. Expand each scope and judge it by the power it hands over, not by how few lines it fills.',
      'Treat "minimal access" and "just one permission" as marketing copy, not as a safety rating.',
      'Picture the same request written out in full. If "manage your inbox" spelled out as "read, send, and delete all your mail" would stop you, the short version should too.',
      'A tidy, single-line ask is engineered to be waved through. That is exactly when to slow down and read what the one line means.',
    ],
  },
};

export default content;
