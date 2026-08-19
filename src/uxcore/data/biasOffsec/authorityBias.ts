// Surface is email. The lever is authority bias: the same odd request is
// scrutinized from a peer and obeyed from "the CEO", because rank in the
// From line buys compliance that the request could never earn on its own.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Rank is the easiest thing to put in a From line. The more senior the sender, the more a request deserves an independent check, not less.',
  scenario:
    'A short email asks you to buy gift cards and send the codes, quietly, right away. From a colleague at your own level, the oddness of it stops you cold. From the CEO, the same three lines trigger a different reflex: you want to be responsive to the top, so you act first and question later. The request did not get more sensible. The rank on it got higher.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'From a peer',
      sender: 'sam.rivera@colleague-mail.com',
      timestamp: '5:40 PM',
      subject: 'quick favour',
      preview:
        'Hey, can you grab some gift cards and send me the codes? Keep it between us, I will explain later.',
    },
    after: {
      kind: 'email',
      tag: 'From "the CEO"',
      sender: 'ceo.office@executive-corp-mail.com',
      timestamp: '5:40 PM',
      subject: 'Discreet task, handle now',
      preview:
        'I need you to purchase gift cards for a client and send me the codes. Keep this between us, I am in meetings.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is authority bias, our deep reflex to defer to rank. A request that reads as absurd from a peer becomes an order when it appears to come from the top, because obeying authority is fast, socially safe, and rarely punished. The attacker only needs the trapping of seniority, a name, a title, an "office of the CEO" address, and your instinct to be responsive supplies the rest. The secrecy and urgency ride along to stop you doing the one thing that would break the spell: checking with the actual person whose authority is being worn.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team will back you for verifying a senior request. The fake executive is counting on you not to.',
    moves: [
      'Seniority in a message is a claim, not a credential. A title is trivial to spoof and is doing the pressuring on purpose.',
      'The more senior and urgent and secret a request, the more it demands an out-of-band check with the real person.',
      'No genuine executive asks for gift cards, secret wires, or codes over email. That request is the scam regardless of the name.',
      'Verifying up the chain is not insubordination. Real leaders expect it, and attackers rely on you being too deferential to try.',
    ],
  },
};

export default content;
