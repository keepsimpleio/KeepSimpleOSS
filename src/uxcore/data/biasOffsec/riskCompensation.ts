// Mode: interactive. The surface is an email that vouches for itself: a green
// "verified safe, scanned and cleared" badge sitting inside the message,
// applied by the same sender who wrote it. The lever is risk compensation: a
// safety signal makes you take a risk you would not take without it. The badge
// checks nothing about the attachment. What it changes is you, dropping the
// caution you would otherwise apply, which is precisely the behaviour the
// attacker needs.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A "verified safe" badge or "scanned and cleared" banner sitting inside the message that carries it was written by the sender, not by anything that inspected the file. The safety claim rides along with the risk it pretends to have checked.',
  scenario:
    'An invoice email arrives with a green "verified safe, scanned and cleared" badge across the top of the message, put there by the same sender who attached the file. The badge does not change one byte of the attachment. What it changes is you: feeling covered, you open a document you would have looked at twice a moment ago. The felt safety spends the caution you would normally apply, and the attacker only needed you to feel protected, never to actually be.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'email',
      sender: 'Billing <billing@invoice-portal-mail.com>',
      timestamp: '09:12',
      subject: 'Invoice #4471 ready for review',
      preview:
        '✓ Verified safe, scanned and cleared by SecureMail. Your invoice is attached. Please review and confirm payment.',
      attachment: 'Invoice_4471_final.docm',
    },
    question:
      'The message says it is verified safe. Do you open the attachment?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Open it right away, the message says it was verified safe',
        trap: true,
        outcome:
          'Trap. The "verified safe" badge did the persuading, and you opened a macro-enabled document you would normally have questioned. The badge was part of the lure, written into the same email that carried the file, not a verdict from anything that inspected it. The macro runs. The feeling of being covered is exactly what let it in.',
      },
      {
        label: 'Open it, the badge means the risky part is already handled',
        outcome:
          'That reasoning is the whole attack. A safety label the message applied to itself lowered the bar you would normally hold, so you skipped the check you know to do. The file is exactly as risky with a green badge on the email as without one.',
      },
      {
        label:
          'Ignore the badge and verify the sender and file through a channel I trust',
        safe: true,
        outcome:
          'Safe. You treated the attachment as unproven no matter what the email claimed about itself. A real scan verdict lives in your security tooling, not in a banner riding on the message it vouches for. The badge changed nothing about the file, so you let it change nothing about you, and you confirmed the invoice through a number you already had.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is risk compensation, the well-studied effect where a safety signal makes people behave more dangerously because they feel protected. Drivers with better brakes follow closer, and someone who believes an email was verified safe opens its attachment faster. The trick is that the reassurance and the risk arrive together: the "scanned and cleared" badge is written into the very message that carries the payload, so the attacker never has to make the file look safe, only make you feel safe. Your caution is a budget, and a self-applied badge spends it for you before you reach the attachment. The stronger the sense of coverage, the more risk you unconsciously take on to use it up, which is precisely backwards from what the words seem to promise.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Real scanning happens silently in your mail gateway and endpoint tools. Distrusting a safety claim that travels next to the risky file is the move only you can make.',
    moves: [
      'A safety label attached to the thing it vouches for is a lure. Real protection verdicts live in your security tooling, never as a badge inside the message or on the site itself.',
      'Feeling protected is not being protected. Apply the same sender and file checks you would use if no badge or banner had appeared.',
      'Watch your own reasoning for "it says it was verified, so I can skip checking". That trade is the attack landing.',
      'Macro-enabled or executable attachments deserve the same scrutiny whether or not something on the page claims they were cleared. The claim costs the attacker nothing to add.',
    ],
  },
};

export default content;
