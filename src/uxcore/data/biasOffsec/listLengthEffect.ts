// Mode: live (cascade). The items stream in one by one. In `before` the list
// is short and the odd line stands out at once; in `after` the same malicious
// line is buried in a long stream where recognition collapses. The lever is
// the list-length effect: the longer a list, the worse you recognise or recall
// any single item in it, so volume alone hides the one line that matters.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a single dangerous line is sitting inside a long stream of routine ones, length is the camouflage. The more items scroll past, the less any one of them registers.',
  scenario:
    'Your security tool shows connected apps and recent access grants. In a short list, an unfamiliar app with full mailbox access jumps out and you revoke it in seconds. Now picture the same line inside a stream of forty routine notifications, sign-ins, sync confirmations, calendar updates, all landing one after another. The malicious grant is still right there, unchanged, but it is one line among many, and the longer the stream runs the less any single entry registers. The attacker did not hide the line. They drowned it in volume.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'live',
      variant: 'cascade',
      tag: 'A short list, the odd one stands out',
      items: [
        { title: 'New sign-in from your usual device' },
        {
          title: 'Unknown app granted full mailbox access',
          body: 'MailSync Pro can now read and send your email.',
          flaggedItem: true,
        },
        { title: 'Calendar synced successfully' },
      ],
      caption:
        'With only three items, the one grant that matters is impossible to miss. You spot it and revoke it at once.',
    },
    after: {
      kind: 'live',
      variant: 'cascade',
      tag: 'A long stream, the odd one drowns',
      priorContext:
        'A busy morning: dozens of routine notifications land back to back, the dangerous one among them.',
      items: [
        { title: 'New sign-in from your usual device' },
        { title: 'Calendar synced successfully' },
        { title: 'Weekly digest is ready' },
        { title: 'Storage backup completed' },
        { title: 'Password expires in 14 days' },
        {
          title: 'Unknown app granted full mailbox access',
          body: 'MailSync Pro can now read and send your email.',
          flaggedItem: true,
        },
        { title: 'Two files shared with you' },
        { title: 'App updated to the latest version' },
        { title: 'Meeting starts in 30 minutes' },
        { title: 'Time-off request approved' },
      ],
      caption:
        'Same grant, same words, now buried in a long stream. As the list grows, recognition of any one line collapses and the dangerous entry slides past unread.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the list-length effect. The more items a list holds, the lower your odds of recognising or recalling any particular one of them, because attention and memory are split thinner across every added entry. A dangerous grant that would leap out of a three-line list becomes nearly invisible in a forty-line stream, not because it was disguised but because the volume around it starved it of scrutiny. The attacker weaponizes ordinary noise: they let the malicious line arrive amid a flood of genuine, boring notifications, and the length itself does the concealing. You scroll, your eyes glaze, and the one entry that hands over your mailbox scrolls by with the same weight as a calendar sync. That is why the fix is to stop reading long security lists linearly and instead query them for the categories that actually carry risk.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your platform lets you filter and sort what a raw stream buries. Refusing to trust a linear skim of a long list is the part only you can do.',
    moves: [
      'Never clear a long notification or access list by scrolling it once. Length guarantees you will miss the one line that matters, so filter instead of skim.',
      'Query for the risk category directly. Sort connected apps by permission and review anything with mail, send, pay or delete scope, regardless of how many benign entries surround it.',
      'Treat a sudden flood of routine alerts as a possible cover, not just a busy morning. Volume is exactly the condition under which a single bad entry hides best.',
      'Audit access grants on a fixed schedule from a clean, sorted view, not reactively from the live stream. A deliberate short list restores the recognition a long one destroys.',
    ],
  },
};

export default content;
