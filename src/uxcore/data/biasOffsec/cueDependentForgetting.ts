// No quoted figures by policy. One email, two renderings. Before = the
// desktop client, where the full sender address is visible — the cue
// your phishing training anchored to, so the knowledge fires. After =
// the phone's mail notification, which shows only the display name
// "IT Support" — the cue is gone, and with it the trained caution.
// The lever is cue removal, not a different message.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Your training worked: on the desktop you spot the fake address instantly. The same email opened on your phone between meetings shows only “IT Support” — and the knowledge that saved you an hour ago simply doesn’t wake up. It wasn’t forgotten. It just lost its trigger.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'On your desktop — cue visible',
      sender: 'it-support@helpdesk-mailstorage-portal.com',
      timestamp: 'Mon, 10:12 AM',
      subject: 'Mailbox storage limit reached',
      preview:
        'Your mailbox is almost full. To keep receiving messages, review your storage settings via the link below within 24 hours.',
    },
    after: {
      kind: 'notification',
      tag: 'On your phone — cue stripped',
      appName: 'Mail',
      timestamp: 'now',
      priorContext:
        'The same email, opened on your phone in the elevator. The app shows the display name — the address that gave it away is one tap deeper than anyone goes.',
      title: 'IT Support',
      body: 'Mailbox storage limit reached — review your storage settings to keep receiving mail.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Memory isn’t a database you query at will — it’s a set of responses waiting for their triggers. Your phishing training didn’t teach you “be suspicious” in the abstract; it taught you “be suspicious when the sender address looks off.” That rule is welded to a specific cue: seeing the address. Desktop mail shows it, the rule fires, you’re safe. The phone shows a friendly display name and hides the address behind a tap — the cue never appears, so the rule never runs. Attackers don’t need you untrained; they need you on the device where your training can’t hear its own alarm.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'On mobile, tap the sender name before acting — every mail app can reveal the real address; it’s just never shown by default. Make the tap the habit, not the exception.',
      'Know which cues your caution depends on. If your alarm needs a visible address, a hover preview, or a big screen — then on a phone you are, functionally, untrained. Plan for that.',
      'Anything with a deadline or a login link waits until you’re at a real screen. If it can’t wait twenty minutes, that urgency is itself the tell.',
      'If you run security training: test people on their phones. A team that passes drills on desktop hasn’t been tested where the attack will actually land.',
    ],
  },
};

export default content;
