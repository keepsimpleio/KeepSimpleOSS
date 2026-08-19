// Surface is a chat thread: mere exposure is a build-up effect, so the
// attack only reads if you can see that the sender has been around for a
// while. The `priorContext` line carries that warm-up history. The
// baseline is the same ask arriving cold from a stranger (easy to
// refuse); the flagged variant is the identical ask after weeks of
// harmless, friendly pings. No quoted figures by policy (see project
// memory `feedback_offsec_no_mocked_numbers`): familiarity-buys-trust is
// the pattern, not a fabricated conversion rate.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Someone you have been chatting with for weeks finally asks for a small favour. Nothing about the ask changed, but your read on it did, because by now the name feels like a colleague, not a stranger. That warmth is the whole operation.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Cold ask',
      senderName: 'Dana K.',
      senderHandle: '@dana_k',
      timestamp: 'now',
      body: 'Hey! Quick one: can you open this shared doc and sign in with your work account so I can give you edit access?',
    },
    after: {
      kind: 'chat',
      tag: 'Warmed-up ask',
      senderName: 'Dana K.',
      senderHandle: '@dana_k',
      timestamp: 'now',
      priorContext:
        'You and "Dana" have traded friendly, low-stakes messages for three weeks: a meme, a "how was your weekend", a harmless question about the team offsite.',
      body: 'Hey! Quick one: can you open this shared doc and sign in with your work account so I can give you edit access?',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'In the first chat, the ask is easy to refuse: a stranger wants your work login, case closed. In the second, the identical words read like a colleague needing a hand. That is the mere-exposure effect. The more often we encounter someone, the more we like and trust them. No new evidence required, just repeated contact. The attacker spends the early messages buying nothing but familiarity. Each harmless ping nudges "stranger" toward "someone I know", so when the real ask lands, your brain files it under "a contact asking a favour" instead of "an unknown account requesting credentials". Same words, same link. Only the history changed, and the history was manufactured.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Familiarity is not identity. Weeks of friendly chat do not verify who is on the other end. A known-feeling name still has to clear the same bar as a stranger before it gets a credential or a click.',
      'Judge the ask, not the rapport. Strip away the relationship and ask: would I sign in with my work account because a random account told me to? If no when cold, then no when warm.',
      'When a long-running contact suddenly needs you to log in somewhere, confirm it through a channel you set up yourself, not by replying in the same thread that built the trust.',
      'Be wary of relationships that exist only to stay pleasant. A contact who never asks for anything for weeks, then asks for exactly one sensitive thing, is following a script.',
    ],
  },
};

export default content;
