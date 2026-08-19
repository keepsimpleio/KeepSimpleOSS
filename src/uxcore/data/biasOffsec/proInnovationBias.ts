// Surface is an OAuth consent screen: an app header plus a list of
// permission scopes. The lever is pro-innovation bias: excitement about a
// shiny new tool makes you grant access you would refuse a boring one. The
// broad grant is identical across both cards. Only the app's novelty and
// hype change, a dull utility you scrutinise versus the AI assistant
// everyone is talking about, waved through on the wave of the new.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The same broad grant feels reckless from a boring tool and reasonable from an exciting one. Novelty is not a safety credential, but it reads like one.',
  scenario:
    'A plain PDF merger asks for full read and write access to your inbox and drive. You hesitate, because why would a merge tool need all that. Weeks later the AI assistant your whole feed is raving about asks for the exact same scopes, and you grant them in one tap, because a tool this clever obviously needs the reach to be clever. Same access, opposite decision, and the only variable was how new and impressive the app felt.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'permission',
      tag: 'A dull tool asking for a lot',
      appName: 'PDF Merger Pro',
      appGlyph: '📄',
      subtitle: 'wants access to your account',
      scopes: [
        { label: 'Read and send email as you', risky: true },
        { label: 'Read, edit, and delete all your files', risky: true },
        { label: 'Access your contacts' },
      ],
      cta: 'Allow access',
    },
    after: {
      kind: 'permission',
      flagged: true,
      tag: 'The same ask, riding the hype',
      appName: 'Nova AI Assistant',
      appGlyph: '✨',
      subtitle:
        'the assistant everyone is talking about wants access to your account',
      priorContext:
        'Three colleagues sent you the launch this week. You have been waiting to try it. The excitement is already in the room before you read a single scope.',
      scopes: [
        { label: 'Read and send email as you', risky: true },
        { label: 'Read, edit, and delete all your files', risky: true },
        { label: 'Access your contacts' },
      ],
      cta: 'Allow access',
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is pro-innovation bias. We systematically overweight the upside of something new and underweight its costs and risks, and the shinier the innovation, the wider the blind spot. The dull PDF merger triggers a fair question: why does merging files need my whole inbox. The hyped AI assistant suppresses that same question, because novelty gets read as capability and capability gets read as a reason for the reach. The grant is identical in both cards. What changed is the halo: excitement lowers the bar you would otherwise hold, and the app that arrives on a wave of talk gets the access the boring one had to justify. Attackers know the launch-week feeling does the persuading, so they wrap an over-broad grant in the newest, most talked-about wrapper they can build.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your organisation can vet which apps are allowed at all. Judging the scopes, not the excitement, is your part.',
    moves: [
      'Read the scopes as if the app were boring. If you would balk at a plain utility asking for this, balk here too.',
      'Novelty is not a security property. "Everyone is using it" tells you it is popular, not that it is safe to hand your inbox.',
      'Let a hyped tool prove itself on narrow access first. Real capability survives a smaller grant while you watch how it behaves.',
      'Name what the app genuinely needs to do its one job, then refuse anything past that line however clever the pitch.',
    ],
  },
};

export default content;
