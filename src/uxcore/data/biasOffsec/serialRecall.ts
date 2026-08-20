// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the verification sequence as it lands on the victim. The lever is serial
// recall: steps delivered in the familiar order of a real process feel
// trustworthy, so the attacker copies the genuine sequence and slips the
// malicious step into position, where it rides the momentum of the real ones.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a request feels legitimate because it arrived in the order you expected, the order is the disguise. A real sequence proves the steps were memorized, not that the caller is real.',
  scenario:
    'A caller runs you through a security check exactly the way your bank does: confirm your name, confirm the last transaction, confirm your address. Three steps you recognize, in the order you have heard before. Then comes step four: read back the code we just texted you. It rides the momentum of the three real steps that primed you, so it feels like the natural next beat instead of the theft it is. The attacker did not need to fake authority. They needed to copy the sequence.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: copy the real sequence',
      steps: [
        {
          label: 'Reproduce the genuine steps in order',
          note: 'Name, last transaction, address. The exact opening of a real verification, so the reader recognizes the rhythm.',
        },
        {
          label: 'Let familiarity build momentum',
          note: 'Each expected step in the right place lowers scrutiny for the one after it.',
        },
        {
          label: 'Slip the malicious step into position',
          note: 'Read back the one-time code. Placed as step four, it inherits the trust the first three built.',
          active: true,
        },
        {
          label: 'Keep the cadence unbroken',
          note: 'Same tone, same pacing. A break in rhythm is the only thing that would trigger a second thought.',
        },
      ],
      footer:
        'The order carries the trust. Step four is real theft dressed as routine.',
    },
    after: {
      kind: 'call',
      tag: 'The plan, as it lands on you',
      callerName: 'Card Security',
      callerLabel: 'Fraud prevention',
      timestamp: 'Incoming',
      transcript:
        "Good, that's your name confirmed, your last transaction confirmed, and your address on file confirmed. Three checks done. One last step to finish and clear the block: I've just sent a six-digit code to your phone, read it back to me.",
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is serial recall. We store and trust processes as ordered sequences, and once the steps arrive in the order our memory expects, the mind stops judging each one on its own merits and accepts it because it landed in the right slot. This is not about a first item that impressed us; it is about the sequence matching the pattern of a real process we already know. The attacker copies the genuine verification in the exact order it normally runs: name, then last transaction, then address, three steps that occupy the slots you expect. By the time the fourth step arrives, it is accepted because the position matches, not because anyone weighed what it actually asks. Reading back a one-time code would ring alarms in isolation, but delivered as step four of a familiar four-step order it reads as simply the next thing on the checklist. The order did the vouching, not the content. That is why the one step that ever leaks control, the code read-back, has to be judged alone, no matter how correctly the sequence ran up to it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your bank set the real process, and it never includes reading a code to an inbound caller. Judging the dangerous step on its own is the part only you can do.',
    moves: [
      'A correct sequence proves the caller studied the process, not that they are your bank. Real name and transaction details leak from breaches and receipts.',
      'One step never belongs to any verification: reading back a code sent to your phone. That single step ends the call regardless of how right the ones before it were.',
      'Break the cadence on purpose. Say you will call back on the number on your card, then do. A genuine process survives you hanging up and dialing the official line.',
      'Notice when a request feels fine because it came in the order you expected. Familiar order is the disguise the attacker built, not evidence the caller is real.',
    ],
  },
};

export default content;
