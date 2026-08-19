// Surface is an email thread. The lever is a belief you already hold:
// the same changed-bank-details ask is scrutinized when it arrives cold,
// but slips through when it lands as a reply inside a months-long thread
// you have already decided is legitimate.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Your supplier Halden Studios wants their invoices paid to a new bank account. Version one is a fresh email from Halden saying so. Version two is a reply, three messages deep, inside the invoice thread you have been running with them since spring. Same request, same new account number. You interrogate the first one. You barely blink at the second.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Cold, new message',
      sender: 'accounts@halden-studios.com',
      timestamp: 'Tue, 10:40 AM',
      subject: 'Updated banking details for future payments',
      preview:
        'Hello, please note our bank account has changed. Kindly use the new details below for all future invoice payments.',
    },
    after: {
      kind: 'email',
      tag: 'Reply inside the trusted thread',
      sender: 'accounts@halden-studios.com',
      timestamp: 'Tue, 10:40 AM',
      priorContext:
        'This lands as "Re: Re: Halden invoices, Q1 to Q3", under six months of real back-and-forth you have already decided is safe.',
      subject: 'Re: Re: Halden invoices, Q1 to Q3',
      preview:
        'Thanks as always. Quick note before the next run: our bank account has changed, new details below. Same as ever otherwise, appreciate you.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is conservatism, the way we cling to an existing belief and underweight evidence that should revise it. Once you have decided "this thread is legitimate", a red flag inside it has to fight that verdict, and it usually loses. The changed-account request is identical in both, but in the trusted thread your prior belief absorbs it as just another friendly message. The context you trust is exactly the cover the attacker wants, whether they hijacked the thread, spoofed the reply, or sit inside a compromised mailbox.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team hardens the mailboxes. Updating your own beliefs is your job.',
    moves: [
      'A thread you trust can be hijacked or sent from an inbox that is already owned. Familiar context is not proof of who is typing.',
      'Any change to bank details gets an out-of-band callback to a number you already have, every time, no matter how routine the thread feels.',
      'Treat "our account has changed" as the single highest-risk sentence in business email. It is the whole payload of invoice fraud.',
      'Let a new fact actually move you. If something is off, the six months of history before it do not make it right.',
    ],
  },
};

export default content;
