// Mode: interactive. The surface is an OAuth consent screen at the end of a
// long onboarding where you configured and customised your own workspace. The
// lever is the IKEA effect: you overvalue what you built yourself, so the
// effort you sank into setting it up makes the tool feel trustworthy, and you
// wave through broad permissions you would have questioned on a cold install.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The hours you spent configuring a tool tell you nothing about whether it deserves your data. Effort you put in is not vetting you did.',
  scenario:
    'You spent twenty minutes building a workspace inside a new app: picked a theme, arranged a dashboard, imported your projects. At the end it asks to connect your accounts with wide permissions. Because you built this yourself, it feels like yours, and yours feels safe. The effort you invested has quietly become the reason you trust the tool, even though you never actually checked it.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'permission',
      appName: 'FlowBoard',
      subtitle: 'wants access to your Google account',
      scopes: [
        { label: 'See your basic profile' },
        {
          label: 'Read, send, and permanently delete all your email',
          risky: true,
        },
        { label: 'Manage all files in your Drive', risky: true },
      ],
      cta: 'Allow',
    },
    question: 'Do you grant it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Allow the access, since you have already put real work into setting this up',
        trap: true,
        outcome:
          'Trap. The workspace you built felt like yours, and that ownership stood in for trust you never actually established. On a cold install those scopes would have stopped you: full mail access and control of every file is far more than a task board needs. The effort you invested vetted nothing. It just made you reluctant to walk away.',
      },
      {
        label:
          'Allow it for now, since you can always review the permissions later',
        outcome:
          'This still hands over full mailbox and Drive control the moment you click. "Review later" rarely happens, and the reason you are inclined to grant it at all is the work you sank in, not anything you verified about the app. Broad scopes deserve scrutiny before the grant, not after.',
      },
      {
        label:
          'Stop and question why a task board needs full mail and file access before granting anything',
        outcome:
          'Safe. You judged the request on what it asks for, not on how much of yourself you already put into the setup. A workspace tool does not need to read and delete all your email or manage every file in your Drive. The time you spent configuring it is a cost you paid, not evidence the tool is safe.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    "This is the IKEA effect, the documented tendency to place higher value on things you helped build. Effort creates attachment, and attachment reads as trust. By front-loading a long, hands-on setup, the attacker gets you to invest before they ask for anything, so that by the permission screen the workspace feels like your creation rather than a stranger's app. Something you built yourself does not feel like a threat, which is exactly the misread the design engineers. The labor you put in has nothing to do with whether the developer is honest or the scopes are appropriate, yet it quietly answers the trust question for you. Walking away now also means abandoning your own work, so loss aversion piles onto the attachment. The more you customise, the more it feels like yours, and the less you scrutinise the one screen that actually hands over your data.",
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Admins can restrict which OAuth scopes third-party apps may request across the org. Judging a permission grant on its own terms, no matter how much setup preceded it, is the personal half.',
    moves: [
      'Effort you spent configuring a tool is not verification of the tool. Evaluate a permission request as if you had installed the app cold, one minute ago.',
      'Match the scope to the job. A task board or dashboard has no reason to read, send, or delete all your email or manage every file in your storage.',
      'Notice when abandoning a setup feels like a loss. That reluctance is the IKEA effect and loss aversion working together, and neither one tells you the app is safe.',
      'The dangerous grant usually comes at the end of the investment, when you are most attached and least skeptical. Slow down precisely there.',
    ],
  },
};

export default content;
