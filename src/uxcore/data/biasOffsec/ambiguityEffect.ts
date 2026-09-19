// Mode: interactive. The reader clicks, and the aversion to unknown odds does
// the work. Surface: a chat where the attacker's path is laid out in clear,
// confident steps while the safe path (verify it yourself) feels vague and
// effortful. The lever is the ambiguity effect: we avoid the option whose
// outcome feels uncertain and take the one that looks clearly defined. Taking
// the clear instructions is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When one path is spelled out in confident, specific steps and the safe path feels vague, the clarity is a lure. Clear is not the same as correct.',
  scenario:
    'You get a message about a held payment that needs fixing. The sender lays out a precise, numbered path: click here, sign in, confirm, done in two minutes. Checking it yourself through your own systems would take longer and has no clean finish line.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'Accounts Payable',
      senderHandle: '@ap.support',
      timestamp: '14:20',
      body: 'Quick fix for the held invoice: 1) open the link, 2) sign in, 3) click Release, 4) enter the code we texted. Takes two minutes and it clears. If you go through the portal yourself it can take days and may bounce again.',
    },
    question: 'What do you do?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Open the link and run the four steps to release the payment now',
        trap: true,
        outcome:
          'Trap. The clear steps lead to a fake portal and hand over your login and the texted code. You chose them because they were legible and the safe path felt uncertain, not because they were verified. Attackers write in confident, numbered detail precisely because a defined path feels safer than an open one, even when it walks you straight into them.',
      },
      {
        label:
          'Log into the payments portal yourself and check the invoice there',
        safe: true,
        outcome:
          'Safe. Clarity is not correctness; the confident steps lead to the attacker. You accepted the discomfort of the undefined path and checked the invoice through the portal you already use and a known contact. The precise instructions were a costume for a trap, and the "vague" option was just the real one, which rarely comes pre-scripted by a stranger.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    "This is the ambiguity effect: we prefer options whose odds and outcomes feel known and shy away from options that feel uncertain, even when the uncertain one is safer. An attacker exploits this by making their path the clear one, all numbered steps and confident finality, while the correct path (verify independently) feels open-ended and effortful. Faced with a legible route and a fuzzy one, we mistake the comfort of clarity for evidence of safety. The precision itself is the tell: real verification is often messier and slower than a scammer's tidy script. You end up trusting the path you can see the end of, which is the one the attacker drew for you.",
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can publish the real, known-good procedures so the safe path is not the vague one. Choosing verification over legibility is the part only you can do.',
    moves: [
      'When a stranger hands you a crisp numbered path and the safe route feels vague, treat the crispness as a warning, not a comfort.',
      'Clarity is a property of the writing, not of the truth. Confident steps prove effort, not legitimacy.',
      'Verify through the systems and contacts you already trust, even when that route is slower and has no tidy finish line.',
      'Attackers script; real processes rarely arrive pre-packaged in four confident steps from an unexpected sender.',
    ],
  },
};

export default content;
