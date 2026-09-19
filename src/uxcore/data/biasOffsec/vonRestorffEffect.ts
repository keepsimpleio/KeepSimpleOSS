// Surface is an inbox, rendered as a timeline of message rows. The lever is
// the Von Restorff (isolation) effect: the one item that breaks the pattern
// captures attention and memory. The phishing email is present in both
// inboxes with the same payload. Styled like the rest of the morning mail it
// dies unread. Styled as the single loud exception in a wall of routine, it
// is the one message that gets opened.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The message that breaks the pattern earned its look from an author, and standing out says nothing about importance. Give the one loud exception in a wall of routine mail more suspicion, never less.',
  scenario:
    'Your morning inbox is five messages of pure routine. A phishing email sits among them. Dressed as one more routine notice, it drowns: skimmed, unread, archived with the rest. Dressed as the one thing that does not look like anything else on the list, warning glyph, capitals, a deadline, it hooks the eye on the first pass, stays in memory through the standup, and becomes the one message you go back and open. Same sender, same link, same payload. The styling did all the work.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'timeline',
      tag: 'Styled to match the routine',
      items: [
        {
          label: '9:02',
          source: 'Newsletter',
          text: 'Weekly industry digest, issue 214',
        },
        {
          label: '9:15',
          source: 'Vendor',
          text: 'Invoice #2231 has been approved',
        },
        {
          label: '9:20',
          source: 'IT notices',
          text: 'Mailbox policy update, no action needed',
        },
        { label: '9:31', source: 'Calendar', text: 'Standup moved to 11:00' },
        {
          label: '9:44',
          source: 'HR',
          text: 'Benefits enrollment closes this month',
        },
      ],
    },
    after: {
      kind: 'timeline',
      tag: 'Styled to be the one you remember',
      items: [
        {
          label: '9:02',
          source: 'Newsletter',
          text: 'Weekly industry digest, issue 214',
        },
        {
          label: '9:15',
          source: 'Vendor',
          text: 'Invoice #2231 has been approved',
        },
        {
          label: '9:20',
          source: 'IT notices',
          text: '⚠ FINAL WARNING: mailbox suspension at noon, verify now',
          flagged: true,
        },
        { label: '9:31', source: 'Calendar', text: 'Standup moved to 11:00' },
        {
          label: '9:44',
          source: 'HR',
          text: 'Benefits enrollment closes this month',
        },
      ],
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the Von Restorff effect, the isolation effect: when one item breaks the pattern around it, attention snaps to it and memory keeps it. Four routine rows train your eye to skim, and the fifth is engineered to snag: the glyph, the capitals, the deadline. Your brain reads "different" as "important" and rewards it with the open that the quiet version never earned. Nothing about the message\'s content or destination changed between the two inboxes. Distinctiveness is doing the persuading, and distinctiveness is free: the attacker chooses exactly how loud to be against the background you see every day.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your filters catch what they can. The message designed to stand out to a human is aimed past them, at you.',
    moves: [
      'Treat "this one looks different" as a reason to slow down. The styling that grabbed you was a choice someone made about your attention.',
      'Judge a message by sender and destination, never by how loudly it announces itself. Urgent dress on routine infrastructure mail is a costume.',
      'Real suspensions and lockouts are verifiable outside the message. Open the service or ask IT through your own channel, not through the loud link.',
      'Notice which single message from today you still remember this afternoon. Memorability is a designed property, and it marks the one to double-check.',
    ],
  },
};

export default content;
