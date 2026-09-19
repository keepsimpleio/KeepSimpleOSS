// Mode: interactive. The reader clicks, and overvaluing what is already theirs
// does the work. Surface: a notice that a handle or account you own, one you
// have held for years, is being recycled for inactivity, and you can keep what
// is yours by signing in. The lever is the endowment effect: you value a thing
// far more once it feels like yours, so the prospect of your own handle being
// released pulls you to authenticate on the attacker's page. No countdown, no
// second lever. The pull is ownership itself. The sign-in is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A notice that a handle or account you own is being recycled and you can keep it by signing in through the link is trading on how much you value what is yours, not warning you about a real policy.',
  scenario:
    'An email says the username you have held for years is scheduled to be released because the account has been inactive, and you can keep it by signing in. The handle is worth little to anyone else, but it is yours, and that alone makes losing it feel wrong. That surge of "this is mine, I am keeping it" is what carries you to the linked sign-in page, which exists to collect the login you give up defending something that was never actually at risk.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'email',
      sender: 'Platform Accounts <accounts@platform-id-check.com>',
      timestamp: 'now',
      subject: 'Your username is scheduled to be released',
      preview:
        'Inactive handles are being recycled and made available to new users. @yourname is on the list. Sign in to keep the handle that is yours.',
    },
    question:
      'The handle that is yours is up for release. Do you sign in to keep it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Sign in on the linked page to keep my handle',
        trap: true,
        outcome:
          'Trap. It is yours, so keeping it felt like the obvious move, and that feeling walked you past the only question that mattered: is this page actually my platform? It is a credential harvester. Your handle was never being recycled. Ownership was in no danger until you tried to defend it here, and now the attacker has your login.',
      },
      {
        label: 'Sign in just to confirm whether it is really being recycled',
        outcome:
          'The same page, reached by a softer excuse. "I will just check that my handle is safe" lands you on the harvester exactly as the direct pull would. Confirming through the link the notice provided is not confirming anything. It is authenticating where the attacker wants you.',
      },
      {
        label:
          'Ignore the link and check my account through the platform directly',
        safe: true,
        outcome:
          'Safe. Whatever happens to your own handle is managed inside your account settings, reached through your own bookmark, never through a link telling you it is slipping away. You open the platform yourself and find the account and the handle exactly as you left them. The feeling that something yours was being taken was manufactured to move you onto their page.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the endowment effect: we value a thing more highly simply because we own it, well beyond what we would pay to acquire the same thing fresh. A username, a legacy account, an old handle can be worth almost nothing on the open market and still feel irreplaceable once it is yours. An attacker does not offer you something new, which is easy to decline. He tells you something you already own is about to be taken back, and the disproportionate pull of ownership does the rest. "Keep what is yours" reads as defending property rather than surrendering a password, so you rush to authenticate exactly where the attacker wants. The more personal and long-held the thing feels, the less you scrutinize the page asking you to protect it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can filter these recycle-and-reclaim notices. Refusing to authenticate through a link that says something yours is being taken is the part only you can do.',
    moves: [
      'Anything about your own handle, account, or access is settled inside the platform, reached through your own bookmark or typed address, never through the link in the notice.',
      'A message that tells you something you own is being reclaimed is working the pull of ownership. Treat that jolt of "but it is mine" as the cue to slow down.',
      'Value follows ownership, not reality. The handle that feels irreplaceable the moment it is threatened is usually worth exactly what it was worth this morning.',
      'If you genuinely wonder whether a real reclaim policy exists, go to the platform yourself and read its account and inactivity settings there.',
    ],
  },
};

export default content;
