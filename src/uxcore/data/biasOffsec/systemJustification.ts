// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is system
// justification: people defend the existing order and "how things are done
// here". Impersonate the established process or policy and the target defends
// the status quo rather than question the request that hides inside it.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When a request wears the uniform of "official policy", the urge to comply comes from defending the system, not from checking the sender. The uniform is the attack.',
  scenario:
    'An email cites a company policy by name and tells you the required step. Because it invokes the established process, the reflex is to comply, not to question. Challenging it would feel like challenging "how things are done here", and most people are wired to uphold the system they work inside rather than poke holes in it. The attacker never had to sound threatening. They just wore the uniform of the existing order, and your instinct to defend that order did the rest.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: wear the uniform of the process',
      steps: [
        {
          label: 'Invoke the established policy',
          note: 'Name a real-sounding procedure and cite it. Speak as the system, not as a person.',
          active: true,
        },
        {
          label: 'Make compliance the default',
          note: 'Frame the step as routine and required, the way things are already done here.',
        },
        {
          label: 'Turn questioning into deviance',
          note: 'Challenging the ask now feels like breaking process, so the target defends it instead.',
        },
        {
          label: 'Keep the tone administrative',
          note: 'No threats, no urgency. Bureaucratic calm reads as authentic bureaucracy.',
        },
      ],
      footer:
        'The status quo does the coercing. The policy header is the whole con.',
    },
    after: {
      kind: 'email',
      tag: 'The plan, as it lands on you',
      sender: 'it-compliance@company-workspace-admin.com',
      timestamp: 'Tue, 09:15',
      subject: 'Action required: annual access recertification (Policy IT-114)',
      preview:
        'Per Policy IT-114, all staff must recertify workspace access this quarter. This is a standard compliance step. Please confirm your identity at the recertification portal linked below by end of week to keep your account in good standing. No action means temporary suspension per the same policy.',
      attachment: '📎 Recertification-IT-114.pdf',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is system justification, the tendency to defend and uphold the existing order, the rules and processes of the world you already live in, even against your own interest. An attacker borrows that loyalty by dressing the request as the process itself: a named policy, a routine recertification, an administrative tone. Once the ask reads as "how things are done here", questioning it stops feeling like caution and starts feeling like deviance, like being the one who breaks procedure. So the target complies to stay inside the system rather than step outside it to check whether the system actually sent this. The attacker needed no urgency and no threat. They only had to sound like the institution, because the instinct to defend the institution is already running. Legitimacy was impersonated, not earned.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Real policy survives being checked. Verify the process through the org, never through the message that invokes it.',
    moves: [
      'A cited policy number proves someone knows the format, not that they own the process. Look the policy up through the intranet yourself before acting on it.',
      'Separate the institution from the email claiming to speak for it. Confirm any access or recertification step directly with IT through a channel you already hold.',
      'Notice when you almost complied to avoid breaking process. That reflex is exactly what the attacker rented. Checking is not deviance.',
      'Genuine internal compliance steps do not route through an outside domain or a one-week suspension threat. Both are the tell under the administrative calm.',
    ],
  },
};

export default content;
