// Surface is an OAuth consent screen: an app header plus a list of
// permission scopes. The lever is the curse of knowledge: a security-literate
// user assumes they already know what "standard" scopes mean, so dense
// technical phrasing reads as routine boilerplate they wave through without
// actually parsing. The grant is identical across both cards. Only the
// wording register changes, plain language versus expert jargon.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Jargon you recognise is not jargon you read. The more a scope sounds like standard boilerplate, the less an expert actually parses what it grants.',
  scenario:
    'A developer tool asks to connect to your account. In plain words, "sign in to other services as you" makes you stop and ask why a build tool needs that. Rewrite it as "act-as impersonation via delegated token exchange" and the same person, precisely because they know the terms, files it under standard OAuth boilerplate and grants it. The expertise that should protect them is what talks them past the read.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'permission',
      tag: 'Plain language you actually read',
      appName: 'BuildPilot CI',
      appGlyph: '🛠',
      subtitle: 'wants access to your developer account',
      scopes: [
        { label: 'Read your repository list' },
        { label: 'Stay signed in after you close the tab' },
        { label: 'Sign in to other services as you', risky: true },
      ],
      cta: 'Authorize',
    },
    after: {
      kind: 'permission',
      flagged: true,
      tag: 'The same grant, dressed as boilerplate',
      appName: 'BuildPilot CI',
      appGlyph: '🛠',
      subtitle: 'wants access to your developer account',
      priorContext:
        'You have granted a hundred OAuth apps. You know what these words mean, which is exactly why you stop reading them.',
      scopes: [
        { label: 'Repository metadata read scope' },
        { label: 'Offline refresh grant with token rotation' },
        { label: 'Act-as impersonation via delegated token exchange' },
      ],
      cta: 'Authorize',
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the curse of knowledge. Once you know a domain, you cannot easily model not knowing it, and you assume familiar-looking terms carry their familiar, safe meaning. To an expert, "delegated token exchange" and "offline refresh grant" read as the ordinary furniture of every OAuth screen, so the eye certifies them as standard and moves on. The grant is identical in risk to the plain-language version, which the same person would have questioned. The jargon does not add capability, it removes scrutiny, because recognising the words feels like having read them. Attackers do not hide the dangerous scope from the novice here. They hide it from the expert, inside the vocabulary the expert trusts.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your platform names the scopes. Translating each one back into plain intent before you grant is your part.',
    moves: [
      'Say each scope out loud in plain words: what can this app now do to me. If you cannot, you have not read it, you have recognised it.',
      'Treat "impersonation", "act-as", and "delegated" as full stops however routine they sound. They mean the app can be you.',
      'Familiarity is not review. The scopes you have seen a hundred times are the ones worth reading on the hundred-and-first.',
      "Match the grant to the tool's actual job. A build runner reading your repos is expected. A build runner acting as you elsewhere is not.",
    ],
  },
};

export default content;
