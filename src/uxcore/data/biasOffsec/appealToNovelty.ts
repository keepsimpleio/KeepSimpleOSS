// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the appeal to
// novelty: "new" reads as "better" and "safer", so scrutiny drops on anything
// freshly launched. Brand the tool as brand-new and AI-powered and the reader
// grants it the benefit of the doubt they would deny an established name.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The word "new" is not a security property. An attacker who leads with "just launched" and "AI-powered" is spending your curiosity to buy down your scrutiny.',
  scenario:
    'A consent screen for a tool you have never seen asks for broad access to your mail, files and calendar. Because it is branded as brand-new and AI-powered, the part of you that would slow down for an unknown vendor instead leans in to try it. Novelty reframes the risk as opportunity. The same permission list under a boring, familiar name would make you pause. Wrapped in "just launched", it reads as being early to something good rather than first to be burned.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: sell it as brand-new',
      steps: [
        {
          label: 'Lead with novelty',
          note: 'Badge it "just launched" and "AI-powered". New reads as better and safer before any check runs.',
          active: true,
        },
        {
          label: 'Frame access as the price of being early',
          note: 'Broad scopes become the cost of the shiny new capability, not a red flag.',
        },
        {
          label: 'Push curiosity over caution',
          note: 'The target wants to try it. Wanting to try it beats wanting to vet it.',
        },
        {
          label: 'Skip the track record question',
          note: 'Something with no history has nothing bad on record. Absence of a record reads as a clean one.',
        },
      ],
      footer: 'Novelty does the disarming. "New" is the whole pitch.',
    },
    after: {
      kind: 'permission',
      tag: 'The plan, as it lands on you',
      appName: 'Nova Assistant',
      appGlyph: '✨',
      subtitle: 'New AI assistant. Just launched. Connect to get started.',
      scopes: [
        { label: 'Read your name and profile photo' },
        { label: 'Read, send and delete all your email', risky: true },
        { label: 'Read and write all files in your drive', risky: true },
        { label: 'Manage your calendar and invites' },
      ],
      cta: 'Try the new assistant',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the appeal to novelty. The mind treats "new" as a proxy for "improved", and by extension for "trustworthy", even though newness says nothing about safety. A freshly launched tool has no track record, which should raise scrutiny, yet the absence of history reads as the absence of problems. AI-powered branding stacks on top: it signals the frontier, and nobody wants to be the one who missed the frontier. So the same broad access that would stop you cold under a familiar vendor gets waved through under a shiny name, because curiosity to try it has quietly replaced the impulse to vet it. The attacker is not hiding the permission list. They are making you want the thing badly enough not to read it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Newness is a marketing claim, not a trust signal. Judge the access request, never the launch date.',
    moves: [
      'Read the scopes as if the tool were boring and old. If "read, send and delete all your email" would stop you from a plain vendor, it stops you here too.',
      'Treat no track record as a reason to wait, not a reason to be first. Let someone else be the early data point.',
      'Separate the capability from the access. Wanting to try an AI assistant does not require granting it your whole mailbox and drive.',
      'A tool with real backing survives you saying "next quarter". Pressure to connect right now because it "just launched" is the tell, not the feature.',
    ],
  },
};

export default content;
