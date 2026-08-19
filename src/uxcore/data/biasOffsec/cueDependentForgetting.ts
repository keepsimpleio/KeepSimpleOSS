// No quoted figures by policy. One email, two renderings. Before = the
// desktop client, where the full sender address is visible: the cue the
// training anchored to, so the knowledge fires. After = the phone's
// mail notification, which shows only the display name "IT Support".
// The cue is gone and the trained caution never activates. The lever is
// cue removal, not a different message. Email is the natural surface
// here: the whole case is about how the same email renders on two
// devices.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Your training worked: on the desktop you spot the fake address instantly. The same email opened on your phone shows only "IT Support", and the knowledge that saved you an hour ago simply does not wake up. It was not forgotten. It lost its trigger.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'On your desktop, cue visible',
      sender: 'it-support@helpdesk-mailstorage-portal.com',
      timestamp: 'Mon, 10:12 AM',
      subject: 'Mailbox storage limit reached',
      preview:
        'Your mailbox is almost full. To keep receiving messages, review your storage settings via the link below within 24 hours.',
    },
    after: {
      kind: 'notification',
      tag: 'On your phone, cue stripped',
      appName: 'Mail',
      timestamp: 'now',
      priorContext:
        'The same email, opened on your phone in the elevator. The app shows the display name. The address that gave it away is one tap deeper than anyone goes.',
      title: 'IT Support',
      body: 'Mailbox storage limit reached. Review your storage settings to keep receiving mail.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Memory does not work like a database you can query at will. Knowledge fires when its trigger appears, and stays silent when it does not. Your phishing training did not teach you to be suspicious in general. It taught you to be suspicious when the sender address looks off. That rule is tied to one specific cue: seeing the address. Desktop mail shows it, the rule fires, you are safe. The phone shows a friendly display name and hides the address behind a tap. The cue never appears, so the rule never runs. Attackers do not need you untrained. They need you on the device where your training cannot hear its own alarm.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'On mobile, tap the sender name before acting. Every mail app can show the real address; it just never does it by default. Make the tap a habit.',
      'Know which cues your caution depends on. If your alarm needs a visible address, a hover preview, or a big screen, then on a phone you are effectively untrained. Plan for that.',
      'Anything with a deadline or a login link waits until you are at a real screen. If it cannot wait twenty minutes, that urgency is itself the tell.',
      'If you run security training: test people on their phones. A team that passes drills on desktop has not been tested where the attack will actually land.',
    ],
  },
};

export default content;
