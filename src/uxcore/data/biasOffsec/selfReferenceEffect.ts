// Surface is a payroll email. The lever is personal relevance: the same
// credential-harvest ask goes from a generic mass mailer to one wearing
// your name, your manager, and a real project, and nothing else changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Your name, your manager and your project are public and cheap to buy. The more a message seems to know about you, the more carefully you should check who actually sent it.',
  scenario:
    'Two emails ask you to log in and confirm your payroll details. One is addressed to nobody in particular. The other knows your name, knows your manager Priya, and knows you are on the Helios project. The link under both goes to the same fake login page.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Generic blast',
      sender: 'payroll@hr-benefits-update.com',
      timestamp: '8:20 AM',
      subject: 'Action required: update your payroll information',
      preview:
        'Dear employee, our records need updating. Please sign in with your work account to confirm your payroll details.',
    },
    after: {
      kind: 'email',
      tag: 'Made about you',
      sender: 'payroll@hr-benefits-update.com',
      timestamp: '8:20 AM',
      subject: 'Priya approved your Helios bonus, confirm to receive it',
      preview:
        'Hi, Priya signed off on your Helios project bonus this morning. Sign in with your work account to confirm your payroll details so it lands in this cycle.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the self-reference effect. Information about you is encoded more deeply, recalled more easily, and, crucially, trusted more readily than the same information about anyone else. The moment the email names your manager and your project, your brain stops asking "is this real?" and starts feeling "this is about me". Relevance masquerades as authenticity. None of those details are secret: a name, an org chart, a project mentioned on LinkedIn. The personalization is cheap to buy and expensive to doubt.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your security team guards the gates. Guarding your own name is on you.',
    moves: [
      'Knowing your details is not the same as being who they claim. Names, projects, and org charts leak from LinkedIn, signatures, and old breaches.',
      'The more a message seems to know about you, the more it is worth a pause, not less. Precision is a tactic, not a credential.',
      'Never confirm payroll or HR details through a link in a message. Open your known HR portal yourself and check there.',
      'If it references a real person, verify with that person on a channel you already trust. Priya can confirm a bonus in ten seconds on Slack.',
    ],
  },
};

export default content;
