// Surface is a calendar invite. The lever is functional fixedness: a tool
// you only ever think of as "just my calendar" is repurposed to carry the
// attack, and its assumed single use is exactly what hides it.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A tool you trust for one thing can be turned to another. "It came through Calendar, so it is safe" is exactly the gap.',
  scenario:
    'The same phishing link, delivered two ways. As a raw message from a stranger, it looks like what it is and you report it. Auto-added to your calendar as a meeting invite, "Payroll review, join here", it slides in as an ordinary appointment, because you think of your calendar as a scheduling tool, not as a channel an attacker can push content through. The link is identical. Your idea of what a calendar is for hid it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Through an obvious channel',
      senderName: 'unknown',
      senderHandle: 'DM from a stranger',
      timestamp: '10:30 AM',
      body: 'Join the payroll review here: payroll-review-portal.com/join',
    },
    after: {
      kind: 'notification',
      tag: 'Through a tool you trust',
      appName: 'Calendar',
      timestamp: '10:30 AM',
      priorContext:
        'It auto-appeared on your calendar as a real-looking event. You think of Calendar as scheduling, not as something that can deliver a payload.',
      title: 'Payroll review, 11:00 AM',
      body: 'Reminder: your meeting starts soon. Join here: payroll-review-portal.com/join',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is functional fixedness: once you know a tool’s usual purpose, you struggle to see it doing anything else. Your calendar is "for scheduling", your document app is "for docs", so when an attacker pushes a link through one of them, your mind classifies it as a benign appointment or a shared file, not as a delivery channel for a lure. The trusted tool’s assumed single use becomes a blind spot, and the same link you would catch anywhere else glides past because of where it arrived. Attackers pick the everyday tool precisely because you have stopped imagining it as a threat.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can lock down the channels. Remembering that any channel can carry a link is your part.',
    moves: [
      'A link is a link wherever it lands. Calendar invites, doc comments, and shared files can all carry the same lure as an email.',
      '"It came through a tool we use" is not a safety check. Trusted tools are attractive to attackers for exactly that reason.',
      'Do not join meetings or open documents from a link inside the notification. Go to the app or portal you already use.',
      'Auto-added events and unexpected shares from unknown senders deserve the same suspicion as a cold email.',
    ],
  },
};

export default content;
