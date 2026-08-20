// Mode: interactive. The reader clicks, and the pull of eliminating one narrow
// risk entirely does the work. Surface: a browser extension that promises to
// make you 100% safe from phishing, zero phishing risk, in exchange for the
// broad "read and change all your data on every site" permission. The lever is
// zero-risk bias: a clean, total elimination of a single risk outshines a
// larger real reduction, so the perfect zero on one narrow thing beats the
// boring broad control that lowers more risk overall. Granting the scope is
// the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A tool that promises to take one specific risk all the way to zero, in exchange for broad access, is selling the grant. Real defenses reduce risk in layers; a guaranteed zero on one narrow thing is the lure.',
  scenario:
    'A browser extension offers to end phishing for you completely: zero phishing risk, every fake site blocked, guaranteed. To do it, it asks to read and change your data on every website you visit. That clean, total zero on the one risk you worry about outshines the boring, partial work of a password manager and multi-factor, even though the broad, dull option lowers far more of your total risk. The extension holding read-and-change over every site is the compromise you are about to install.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'permission',
      appName: 'PhishZero',
      appGlyph: '🛡',
      subtitle:
        'Blocks 100% of phishing sites. Zero phishing risk, guaranteed.',
      scopes: [
        { label: 'Show notifications' },
        { label: 'Read your browsing history' },
        {
          label: 'Read and change all your data on every website you visit',
          risky: true,
        },
      ],
      cta: 'Add to browser',
    },
    question: 'It promises to take your phishing risk to zero. Do you add it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Add it and grant the access to reach zero phishing risk',
        trap: true,
        outcome:
          'Trap. The extension now reads and changes your data on every site, which is the exact access an attacker needs to sit between you and your accounts. You did not weigh "unknown extension with total access" against "my current, mostly-fine setup". You chased the perfect zero on one risk, and the promise of erasing it was worth more to you than the far larger risk you just granted.',
      },
      {
        label: 'Add it now and review its permissions later',
        outcome:
          'The grant is what matters, and you already gave it. The moment you add it, the read-and-change-everything scope is live. "Review later" inspects a tool that is already inside every page you load. The clean zero got the one dangerous permission waved through.',
      },
      {
        label:
          'Skip the perfect-score promise and harden with multi-factor and a password manager',
        safe: true,
        outcome:
          'Safe. "Zero risk, guaranteed" is the bait, and no real defense sells a total zero on anything. You turned on multi-factor and a password manager through your accounts directly. Each is a partial, unglamorous gain, and together they cut far more of your actual risk than one extension claiming to erase a single category while it reads every page you open.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is zero-risk bias: we overvalue the complete elimination of one risk over a larger reduction of overall risk, because a clean zero feels certain while a partial improvement still leaves something to worry about. An attacker frames the payload as the thing that takes one specific fear all the way to nothing, and that framing beats the honest, layered defenses that would protect you more. You stop comparing options on total safety and start chasing the comfort of "this one thing can never happen to me now". The narrow, absolute promise is the shape no real security has, which is exactly why it is attractive and exactly why it demands a dangerous grant to deliver. The bias makes the impossible guarantee the most appealing option on the screen.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can restrict which extensions and tools can be installed. Distrusting a guaranteed zero, especially one that wants broad access, is the part only you can do in the moment.',
    moves: [
      'Treat "100% safe" and "zero risk" as tells. Genuine security speaks in layers and reductions, never in absolutes on a single category.',
      'Weigh the access a tool demands against the risk it claims to remove. Broad read-and-change permission almost always adds more exposure than any one guarantee erases.',
      'Compare on total risk, not on the comfort of one clean number. A dull, partial control across many risks beats a perfect zero on one.',
      'The extension or tool promising to end a whole risk in one grant is usually the one opening the largest new door.',
    ],
  },
};

export default content;
