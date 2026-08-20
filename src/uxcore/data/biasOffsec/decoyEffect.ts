// Mode: interactive. The reader actually picks, and the decoy does its work
// on them. The lever is the decoy effect: a third, deliberately worse option
// exists only to make one of the other two look obviously right. Here a fake
// "security" prompt offers three ways to resolve an alert, and the middle
// option is engineered so the attacker's choice reads as the sensible
// compromise. The click is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When one option is obviously worse and it is right there for comparison, it was put there to steer you. The decoy exists to be rejected, so the choice beside it looks wise.',
  scenario:
    "A pop-up says your session flagged a security risk and offers three ways to resolve it. You are not really choosing between three options. You are choosing between two, because the middle one was built to be rejected, and its only job is to make the attacker's option look like the calm, reasonable middle path.",
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'account-safety-check.com',
      path: '/resolve',
      pageHeading: 'Security risk detected on your session',
      pageBody:
        'To keep your account safe, choose how you would like to resolve this now.',
    },
    question: 'Which option do you choose?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Lock the account and wait 14 days for manual review',
        outcome:
          'This is the decoy. It is real-sounding and deliberately painful: two weeks locked out with no access. Almost nobody picks it, and it was never meant to be picked. Its whole purpose is to sit next to the next option and make it look gentle by comparison.',
      },
      {
        label: 'Install the "Account Guardian" helper to fix it in one click',
        trap: true,
        outcome:
          'Trap. Against the two-week lockout, this reads as the sensible middle path, quick, and you install it. It is the attacker\'s payload. The 14-day option was scenery placed there to make this one feel reasonable. You did not weigh it against "do nothing safely". You weighed it against a punishment.',
      },
      {
        label:
          'Close this and open your account yourself from a trusted device',
        safe: true,
        outcome:
          'Safe. You refused the menu the pop-up built for you. A page cannot detect a risk on your session, and the only options that matter are the ones you reach on your own, through a device and address you already trust. The three-way choice was a frame, and you stepped out of it.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the decoy effect, or asymmetric dominance. Add a third option that is clearly worse than one of the existing two, and it drags your preference toward the option it is worse than, even though the decoy itself is never chosen. The lockout option is the decoy: nobody wants fourteen days locked out, so the "one-click helper" stops looking like "install unknown software from a pop-up" and starts looking like "the quick, reasonable one". Your judgement quietly shifts from "is this safe at all?" to "which of these is best?", which is exactly the question the attacker wants you answering. The decoy costs them nothing to add and reframes their payload as the moderate choice.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can block the pop-ups it sees. Refusing the menu itself is the part only you can do in the moment.',
    moves: [
      'When a prompt gives you a set of options, add the one it left out: "none of these, I leave and check for myself." The absent option is usually the safe one.',
      'A deliberately awful choice sitting next to a convenient one is a tell. It is there to make the convenient one look moderate, not to be chosen.',
      'A web page cannot detect a risk on your session or your device. Any three-way "how would you like to resolve this" is a frame, not a diagnosis.',
      'Judge the option you are drawn to on its own: "install this" or "enter my password" is the same risk whether or not a worse option sits beside it.',
    ],
  },
};

export default content;
