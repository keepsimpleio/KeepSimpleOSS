// Surface is a phone call. The lever is the illusion of validity: a few
// coherent, consistent details make you feel certain a caller is genuine,
// and that felt certainty has nothing to do with whether they are.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Feeling certain is not the same as being right. A caller whose story all fits together has rehearsed it, not proven it.',
  scenario:
    'Your bank’s fraud line calls. In one version the caller is vague and you stay wary. In the other, everything lines up: they know your name, the last four digits of your card, they reference a transaction you actually made, their tone is calm and professional. It all coheres, so you feel sure they are real, and that certainty, not any actual verification, is what makes you read out the code they ask for.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'call',
      tag: 'Incoherent, so you doubt',
      callerName: 'Caller claiming to be your bank',
      callerLabel: 'Unknown number',
      timestamp: 'now',
      transcript:
        'Um, hello, this is, uh, the bank. There is a problem with, your account. I need you to, confirm some things. What is your card number? (Vague and clumsy. You hang up.)',
    },
    after: {
      kind: 'call',
      tag: 'Coherent, so you feel sure',
      callerName: 'Caller claiming to be your bank',
      callerLabel: 'Caller ID shows your bank’s name',
      timestamp: 'now',
      transcript:
        'Good afternoon, this is the fraud team at your bank. I am calling about a card ending 4471 and a payment to a coffee shop this morning that we have flagged. To secure the account, please read back the code we just texted you.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of validity. When details fit together into a smooth, consistent story, we feel confident it is true, even though coherence and truth are different things entirely. Your name, your card’s last four digits, a real transaction, a calm professional tone: none of that is hard for an attacker to gather or fake, yet stacked together they produce a powerful sense of "this is obviously legitimate". The certainty is real. What it rests on is not. A well-rehearsed script feels exactly like a genuine one, which is the point.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your bank’s real fraud team will wait while you call back. The fake one needs you to stay on the line.',
    moves: [
      'Knowing your details is not proof of identity. Names, card digits, and recent transactions leak and get bought.',
      'Never read back a code or password to an inbound caller. A genuine bank will never ask you to.',
      'Hang up and call the number on your card yourself. Certainty that survives a callback is the only kind worth having.',
      'The smoother and more consistent an unexpected call feels, the more it is worth verifying independently, not less.',
    ],
  },
};

export default content;
