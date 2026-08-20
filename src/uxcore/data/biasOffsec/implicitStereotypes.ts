// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the message as it lands on the victim. The lever is implicit
// stereotypes: unexamined assumptions attach trust to a role or title before
// the person behind it is checked. The attacker wears the persona the target
// waves through, so the badge does the vouching the individual never earned.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a request feels safe because of who the sender claims to be, not what they actually proved, a persona is doing the persuading. The title is not the person.',
  scenario:
    'A message arrives from someone presenting as your new HR coordinator, warm and procedural, asking you to confirm your details on a portal before payroll cutoff. You do not know this person. What you know is the role, and the role is one your assumptions wave through without a second look. The attacker never had to impersonate a specific human. They picked a costume your own snap judgement approves on sight, then made an ordinary request while wearing it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: wear the trusted role',
      steps: [
        {
          label: 'Pick the persona the target waves through',
          note: 'A helpful HR coordinator, a senior-sounding technical lead. Choose the title their assumptions approve on sight.',
          active: true,
        },
        {
          label: 'Match the register of that role',
          note: 'Procedural and warm for HR, terse and confident for a CTO. The tone sells the costume.',
        },
        {
          label: 'Make an ordinary request in character',
          note: 'Confirm details, approve access, open a portal. Nothing the real role would not plausibly ask.',
        },
        {
          label: 'Let the title carry the trust',
          note: 'The reader vouches for the role, then applies that trust to a person they never verified.',
        },
      ],
      footer:
        'The role gets the trust the person never earned. That gap is the whole con.',
    },
    after: {
      kind: 'email',
      tag: 'The plan, as it lands on you',
      sender: 'people-ops@northwind-hrportal.com',
      timestamp: 'Tue, 09:05',
      subject: 'Quick action before payroll cutoff',
      preview:
        "Hi, I'm the new HR coordinator covering onboarding this quarter. We're reconciling records ahead of Friday's payroll run and I need you to confirm your details on the portal below so your next payment isn't held. Takes two minutes, thanks so much for your help.",
      attachment: '📎 employee-record-confirm.link',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is implicit stereotypes at work. We carry fast, unexamined associations that attach a level of trust or competence to a role the moment we read the title, before we have evaluated the actual person. The attacker does not fight that shortcut, they rent it: a persona your assumptions approve on sight arrives, and the trust owed to the role transfers to a stranger you never verified. An HR coordinator asks for records and it feels routine, a senior technical voice asks for access and it feels authorized, because the title fits a slot your mind already marked safe. The person did nothing to earn that trust, the costume inherited it. That is why the defense is never about which roles deserve respect. It is about noticing that a title is a claim, not a verified identity.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your systems can gate access by real identity. Refusing to let a job title stand in for a verified person is the part only you can do.',
    moves: [
      'Separate the role from the human. Ask what this specific person has proven, not what their claimed title would normally be allowed to do.',
      'A new coordinator, lead or manager you have never met is a claim until an identity you already hold confirms them. Confirm through your directory or their manager, not through the message itself.',
      'Notice when a request feels safe because of a title. That feeling is the shortcut firing, and it is exactly what the persona was chosen to trigger.',
      'Any request touching pay, records or access resets trust to zero regardless of how fitting the sender-role reads. Verify it through a channel the real organization owns.',
    ],
  },
};

export default content;
