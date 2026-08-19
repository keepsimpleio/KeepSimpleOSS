// Surface is a helpdesk chat. The lever is contrast: the same
// "install this remote-access agent" ask is refused on its own, but feels
// mild and reasonable when it follows a much scarier demand.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Someone claiming to be from IT, "ServiceDesk", messages you to install a remote-support tool so they can get into your machine. Cold, you would say no. But if they open by telling you your laptop is flagged for a full wipe and reimage today, and then offer the tool as the gentler alternative, "just the quick agent instead", the agent suddenly sounds like the reasonable choice. Same tool, same access.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'The ask, alone',
      senderName: 'ServiceDesk',
      senderHandle: 'IT Support · new chat',
      timestamp: '2:31 PM',
      body: 'Hi, we need to run a quick fix on your machine. Please install this remote-support agent so I can connect: rs-desk-connect.com/agent',
    },
    after: {
      kind: 'chat',
      tag: 'The ask, after a worse one',
      senderName: 'ServiceDesk',
      senderHandle: 'IT Support · new chat',
      timestamp: '2:31 PM',
      priorContext:
        'First message: "Your laptop is flagged for a full wipe and reimage this afternoon, you would lose everything stored locally." Then this arrives as the merciful option.',
      body: 'Actually, to save you the wipe, I can just run a quick support agent and fix it in place. Much easier. Install it here and I will sort it now: rs-desk-connect.com/agent',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the contrast effect. You do not judge an option on its own, you judge it against whatever sits beside it. Park "install remote-access software for a stranger" next to "lose your entire laptop today" and the install reads as the safe, kind, sensible path. Nothing about the tool changed. The scary option was never real, it was scenery, placed there to make the dangerous ask look like relief. This is door-in-the-face running in reverse: frighten first, then offer the thing you actually wanted all along.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team runs the real helpdesk. Telling it apart from a fake one is on you.',
    moves: [
      'When a scary option makes a second option feel easy, notice that both came from the same mouth. The threat exists to sell the "solution".',
      'Judge the actual ask on its own: a stranger wants remote control of your machine. Would you say yes to that, cold? Then say no here.',
      'Real IT does not threaten to destroy your laptop and then offer a shortcut link. That shape is the scam, not the fix.',
      'Stop and verify through the helpdesk channel you already know. A genuine ticket survives you hanging up and calling back.',
    ],
  },
};

export default content;
