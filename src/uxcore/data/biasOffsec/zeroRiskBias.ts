// Mode: interactive. The reader clicks, and the promise of eliminating one
// risk entirely does the work. Surface: a page offering to make the account
// "100% secure, all risk gone in one click". The lever is zero-risk bias: a
// clean, total elimination of a single risk outshines a larger real reduction,
// so the reader installs or grants to reach the perfect zero. The click is the
// attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Anything selling "zero risk in one click" is selling the click, not the safety. Real security is layered and partial; a promised absolute zero is the bait.',
  scenario:
    'A page says your account still carries some exposure and offers to remove it completely: one button, 100% secure, all risk eliminated. Next to the messy reality of passwords and updates, a clean total zero feels irresistible. The button installs a "protection" tool or grants it broad access.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'total-account-shield.com',
      path: '/secure',
      pageHeading: 'Your account is 92% secure',
      pageBody:
        'Close the remaining gap. Make your account 100% secure and eliminate all risk in one click.',
      cta: 'Eliminate all risk now',
    },
    question: 'The button promises to take your risk to zero. Do you press it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Click to reach 100% and eliminate all remaining risk',
        trap: true,
        outcome:
          'Trap. The button installs the attacker\'s tool with full access to your account and browser. You did not weigh "unknown software with broad permissions" against "my current, mostly-fine setup". You chased the perfect zero, and the promise of eliminating the last sliver of risk was worth more to you than the far larger risk you just took on.',
      },
      {
        label:
          'Ignore the perfect-score promise and harden the account through your provider',
        outcome:
          'Safe. "Zero risk in one click" is the bait; real security is layered and never absolute. You left the page and turned on multi-factor and a password manager through the provider directly, which lowers total risk far more than any single button claiming to erase it. No legitimate tool sells you a guaranteed zero.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is zero-risk bias: we overvalue the complete elimination of one risk over a larger reduction of overall risk, because a clean zero feels certain and a partial improvement still leaves us worrying. An attacker frames their payload as the thing that takes the last percent to zero, and that framing beats the honest, layered defenses that would actually protect you more. You stop comparing options on total safety and start chasing the psychological comfort of "nothing left to fear". The one-click absolute is a shape no real security has, which is exactly why it is attractive and exactly why it is a lie. The bias makes the impossible promise the most appealing option on the page.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can block the fake shields. Distrusting the promise of a perfect zero is the part only you can do in the moment.',
    moves: [
      'Treat "100% secure" and "eliminate all risk" as tells of a scam. Genuine security speaks in layers and reductions, never absolutes.',
      'Compare on total risk, not on the comfort of one clean number. A broad new install almost always adds more risk than it removes.',
      'The button that promises to erase the last percent is usually the one adding the largest new exposure.',
      'Harden through your provider (multi-factor, a password manager, updates), where each layer is a real, partial gain, not a magic zero.',
    ],
  },
};

export default content;
