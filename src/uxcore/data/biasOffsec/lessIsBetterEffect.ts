// Mode: interactive. The reader clicks, and a smaller, cleaner set judged on
// its own beats a fuller one. Surface: an app consent screen asking for a short
// "minimal" list of scopes that reads as safe precisely because it is short,
// though the single scope it asks is the dangerous one. The lever is the
// less-is-better effect: evaluated alone, the tidy short list feels trustworthy.
// Granting it is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A consent screen bragging that it asks for "only one" permission is steering you to judge the count, not the scope; a short list is not a safe list.',
  scenario:
    'An app asks to connect and shows a deliberately short permission list: just one item, framed as respectfully minimal compared to apps that want everything. Seen on its own, one small scope feels safe and considerate. But the single scope it requests is full access to your mailbox, and its shortness is what makes you wave it through.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'permission',
      appName: 'InboxTidy',
      appGlyph: 'IT',
      subtitle: 'Wants minimal access. We only ask for one permission.',
      scopes: [{ label: 'Read, send, and delete all your email', risky: true }],
      cta: 'Allow',
    },
    question:
      'It asks for only one permission and calls itself minimal. Do you allow it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Allow it, one permission is about as minimal and safe as it gets',
        trap: true,
        outcome:
          'Trap. The single scope is full control of your mailbox: read, send, and delete everything, including password resets for your other accounts. You judged the list by its length, not its contents. "Only one permission" felt modest next to greedier apps, and that comparison, not the actual power you granted, is what earned the click.',
      },
      {
        label: 'Read the actual scope, decide it is too much, and deny it',
        outcome:
          'Safe. A short list is not a safe list; judge the scope, not the count. You ignored the "minimal" framing and read the one line: total mailbox control, which no tidy-up tool needs. The brevity was the trick, engineered so a single catastrophic permission would slip past as restraint.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the less-is-better effect: when we judge an option on its own rather than side by side, a smaller, cleaner-looking set can be preferred over a larger one, even when the larger one is objectively better or the smaller one hides the real danger. A consent screen that asks for "only one" permission invites you to evaluate it in isolation, where one short line reads as modest and respectful. You never compare that single scope to what it actually allows; you compare it to your image of greedy apps demanding a dozen scopes, and it wins by looking restrained. The framing swaps the useful question ("what can this app do?") for a flattering one ("isn\'t it nice they ask for so little?"). One well-chosen dangerous scope beats a long honest list, because the eye rewards the short one.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can restrict which apps may connect. Reading the scope instead of counting the list is the part only you can do at the prompt.',
    moves: [
      'Judge each permission by what it grants, not by how few there are. One line can hand over your whole mailbox.',
      'Treat "minimal access" and "we only ask for one thing" as marketing, not as a safety rating.',
      'Full read, send, and delete on your email is total control; almost no utility legitimately needs it.',
      'A short consent list is designed to be waved through. That is exactly when to stop and read every word of it.',
    ],
  },
};

export default content;
