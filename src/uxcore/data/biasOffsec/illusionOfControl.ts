// Mode: interactive. The surface is a fake "security center" browser page
// that hands you the controls: pick your own verification method, set your
// own PIN, choose your own recovery question. The lever is the illusion of
// control. Being allowed to configure the process feels like owning it, so
// you drop your guard and type real credentials into a page you do not own.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Being handed the knobs is not the same as being in control. A page that lets you "set your own security" still gets to keep whatever you type into it.',
  scenario:
    'A page tells you a login attempt was blocked and invites you to secure the account your way. It lets you choose the verification method, set a new PIN, and pick a recovery question. You feel in charge because you are the one making the choices. Every one of those choices is a field on their server, and the account you are "securing" is the one you are handing over.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'account-security-center.com',
      path: '/secure-your-way',
      pageHeading: 'Secure your account, your way',
      pageBody:
        'We blocked a suspicious login. Choose how you want to verify, set a new PIN, and pick a recovery question. You are in control of your security.',
    },
    question: 'How do you respond?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Choose "verify by password", then type your current password to confirm it is you',
        trap: true,
        outcome:
          'Trap. The moment they let you pick the method, you felt like the one running the process, so entering your password read as your decision rather than their request. It was their request all along. The password is now theirs, and the PIN and recovery question you carefully set just told them how to survive your next reset.',
      },
      {
        label:
          'Open the "talk to a security agent" chat on the page and ask them to walk you through it',
        outcome:
          "This still loses. You did not type your password, but you handed the conversation to the attacker's own staff. The chat is theirs, staffed to sound patient and official, and its whole job is to keep you on the page and guide you back to the fields you hesitated over. A real service does not run account recovery through a chat on a page that reached out to you.",
      },
      {
        label:
          'Close the page and open your bank or account from its own app or your saved bookmark',
        safe: true,
        outcome:
          'Safe. You changed nothing on a page that reached out to you. Real account controls live inside the service you already trust, reached the way you always reach it. The feeling of being in control on their page was the product, and you did not buy it.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of control. When you are allowed to make choices inside a process, you feel responsible for its outcome, and that felt ownership lowers your suspicion of the process itself. The attacker does not need to convince you the page is legitimate. They just need to let you configure it, because the act of choosing a method, a PIN, and a question makes the whole flow feel like yours. Control over trivial settings gets mistaken for control over safety, and the one thing that actually matters, whose server receives your password, is the one thing you never got to choose. The more knobs they hand you, the more in charge you feel, and the less you question why you are typing a real password into an unfamiliar site.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can steer these lookalike pages away with filtering and passkeys. The move only you can make is noticing that choosing settings is not the same as being safe.',
    moves: [
      'Real account changes start from you, inside the service you already use. A page that came to you and offers to "secure your account your way" is the attack, no matter how many options it gives you.',
      'Separate control over settings from control over risk. Picking a PIN or a recovery question on an unknown page changes nothing about who receives it.',
      'Never type a current password to "confirm it is you" on a page you did not open yourself from a bookmark or the official app.',
      'When something feels like your decision, ask who built the menu. Feeling in charge is exactly the state this attack manufactures.',
    ],
  },
};

export default content;
