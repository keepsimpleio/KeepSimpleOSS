// Mode: interactive. The surface is a notification from a security tool
// claiming an attachment is "protected" and therefore safe to open. The
// lever is risk compensation: a safety measure makes you take a risk you
// would not take without it. The felt protection, not any real check on the
// file, is what moves your finger to the open button.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A promise that "you are protected, so this is safe" is aimed at your caution, not the file. The shield does not read the attachment before you do.',
  scenario:
    'A notification tells you the file that just arrived was scanned and cleared by your protection, so it is safe to open. The words do not change one byte of the file. What they change is you: feeling covered, you open something you would have hesitated over a moment ago. The protection did not vet the file, it vetted your reluctance out of the way.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'notification',
      appName: 'Mailbox Protection',
      title: 'Attachment scanned and cleared',
      body: 'Your advanced protection checked this attachment and found no threats. It is safe to open. Invoice_Q3_final.docm is ready.',
    },
    question: 'Do you open it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Open the attachment right away, since protection already cleared it',
        trap: true,
        outcome:
          'Trap. The "cleared by protection" banner did the persuading, and you opened a macro-enabled document you would normally have looked at twice. The banner was part of the lure, not a real verdict from your security stack. The file runs its macro. The sense of being covered is exactly what let it in.',
      },
      {
        label:
          'Open it, but you would have checked the sender first if the banner were not there',
        outcome:
          'That "if the banner were not there" is the whole attack. The claim of protection lowered the bar you would normally apply, so you skipped the check you know to do. A file is exactly as risky with a reassuring banner as without one.',
      },
      {
        label:
          'Ignore the reassurance and verify the sender and the file through a channel you trust',
        outcome:
          'Safe. You treated the file as unproven regardless of what the notification claimed about it. A protection layer worth trusting speaks inside your real security console, not in a banner riding on the message it is vouching for. The reassurance changed nothing about the file, so you let it change nothing about you.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is risk compensation, the well-studied effect where a safety measure makes people behave more dangerously because they feel protected. Drivers with better brakes follow closer, and people who believe an attachment was scanned open it faster. The attacker does not have to make the file look safe, they only have to make you feel safe, and a single "cleared by protection" line does that. Your caution is a budget, and the promise of a safety net spends it for you before you reach the file. The protection claim is often the payload\'s delivery vehicle: it arrives with the very message it pretends to have inspected. The stronger the sense of coverage, the more risk you unconsciously take on to use it up, which is precisely backwards from what the words seem to promise.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Real scanning happens silently in your mail gateway and endpoint tools. Distrusting a reassurance that travels next to the risky file is the move only you can make.',
    moves: [
      'A safety claim attached to the thing it vouches for is a lure. Genuine protection verdicts live in your security console, not in a banner on the message itself.',
      'Feeling protected is not being protected. Apply the same sender and file checks you would use if no reassurance had appeared.',
      'Watch your own reasoning for "it said it was scanned, so I can skip checking". That trade is the attack landing.',
      'Macro-enabled or executable attachments deserve the same scrutiny whether or not something claims they were cleared. The claim costs the attacker nothing to add.',
    ],
  },
};

export default content;
