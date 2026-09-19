// Surface is an identity card. Before is a plain unadorned profile making a
// specific access request you scrutinise; after is the identical request from a
// profile wrapped in a verified tick, a big-name title, and credential badges.
// The lever is the halo effect: one impressive trait radiates into unearned
// trust in the whole person, so the same ask rides the glow past your checks.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'One shiny credential does not vouch for the request attached to it. The verified tick and the famous title tell you nothing about whether the ask is safe.',
  scenario:
    'Someone asks you to export a client contact list and send it over so they can "prep an integration". From a plain profile you would push back: who authorised this, why the whole list, why now. The exact same message arrives from a profile with a blue tick, a "Partner Solutions Lead, McKinley & Roe" title, and a row of certification badges. Nothing about the request changed. The polish did, and suddenly it feels like a person at that level would not be asking for anything they should not have.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'profile',
      tag: 'The ask, with no polish',
      name: 'Adrian Cole',
      handle: '@adrian.cole',
      initial: 'AC',
      title: 'Requesting the full client contact export',
      note: 'A plain profile and a specific ask: authorise a data export. Nothing vouches for it but the request itself.',
    },
    after: {
      kind: 'profile',
      tag: 'The same ask, dressed up',
      priorContext:
        'Identical request, identical account, identical export. The only thing added is the credentials around the name.',
      name: 'Adrian Cole',
      handle: '@adrian.cole',
      initial: 'AC',
      verified: true,
      title: 'Partner Solutions Lead, McKinley & Roe',
      badges: ['Verified partner', 'ISO 27001 certified', 'Ex-Big Four'],
      note: 'The same export request, now behind a verified tick, a name-brand title, and a wall of credentials.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the halo effect. One salient positive trait, prestige, a verification mark, an impressive title, bleeds into our overall judgement of a person and colours everything else about them. We infer competence, honesty, and authority from a badge that certifies none of those things. The request is identical across both cards, but the credentialled version borrows trust it never earned: the tick proves an account was verified, not that this ask is legitimate, and a famous employer says nothing about whether this person should receive your client list. Attackers assemble the glow deliberately, because it is cheaper to look impressive than to actually hold the authority, and the halo does the rest by making you scrutinise the polish instead of the payload.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team decides who is allowed what. Judging the request instead of the credentials around it is your part.',
    moves: [
      'Evaluate the ask on its own terms: what is being requested, by what authority, and why. A verified tick answers none of those.',
      'Treat prestige signals as identity claims, not authorisation. A famous title still needs the same approval a plain one would.',
      'When impressive credentials make you want to skip a check, run the check anyway. That pull is the halo working, not a reason to relax.',
      'Confirm entitlements against your own access records, not against how senior or certified the requester appears to be.',
    ],
  },
};

export default content;
