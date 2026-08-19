// Surface is a chat DM asking for a public share link. The lever is
// consensus bias (false consensus): you project the habits of your own small
// circle onto everyone, so an ask that matches how your team happens to work
// reads as how the whole world works. The ask is identical in both cards.
// What changes is the yardstick it gets measured against: the actual policy,
// or your circle's habit assumed to be universal.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: "The way your team happens to do things is not the way everyone does things. An ask that fits your circle's habits still has to clear policy, and attackers shape asks to fit habits.",
  scenario:
    'An "auditor" from a vendor asks you to share the Q3 client folder as a public link, "easiest for our review". Measured against the actual data policy, the ask fails instantly: client files never leave the tenant, audits go through the access-controlled portal. Measured against your own daily routine, where you and your teammates trade public links for everything because it is quick, the ask sounds like how work simply gets done everywhere. That projection, my circle does it so everyone does, is what dresses an exfiltration request as a normal Tuesday favour.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Measured against the policy',
      senderName: 'R. Okafor',
      senderHandle: 'external · vendor audit',
      timestamp: '11:40 AM',
      body: 'Hi! For the audit, could you share the Q3 client folder as a public link? Easiest way for our side to review it this week.',
    },
    after: {
      kind: 'chat',
      tag: 'Measured against your own habit',
      senderName: 'R. Okafor',
      senderHandle: 'external · vendor audit',
      timestamp: '11:40 AM',
      priorContext:
        'On your team, public links are how everything moves: decks, drafts, whole folders. It is hard to imagine anyone working differently.',
      body: 'Hi! For the audit, could you share the Q3 client folder as a public link? Easiest way for our side to review it this week.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    "This is consensus bias, the false-consensus effect. We treat our own circle's behaviour as the human default: if everyone around me shares files by public link, then surely that is how companies work, how audits work, how this vendor works. The message is identical in both cards. Against the written policy it is an obvious violation, because client data never travels by open link. Against the projected norm it is a reasonable person asking for the standard thing, and refusing feels pedantic. The attacker does not need to know your policy. They need to phrase the ask in the shape of a common bad habit, and the false consensus of everyone who shares that habit supplies the legitimacy for free.",
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team writes the data-handling policy. Not substituting your own habits for it is your part.',
    moves: [
      '"This is how everyone works" is a guess built from the few people you sit next to. Check the ask against the written rule, never against the office routine.',
      'Client data leaves through access-controlled channels with named recipients. A public link has no recipient, which is exactly why an exfiltrator asks for one.',
      'The more natural an unusual request feels, the more likely it was shaped to match a habit. Fit is a design choice, and attackers do the fitting.',
      'When a request needs the policy bent "just this once for convenience", that is the moment to verify the requester through a channel you already trust.',
    ],
  },
};

export default content;
