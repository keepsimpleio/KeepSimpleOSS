# Serial recall in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/serial-recall
- Bias entry: https://keepsimple.io/uxcore/102-serial-recall
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

If a request feels legitimate because it arrived in the order you expected, the order is the disguise. A real sequence proves the steps were memorized, not that the caller is real.

## Scenario

A caller runs you through a security check exactly the way your bank does: confirm your name, confirm the last transaction, confirm your address. Three steps you recognize, in the order you have heard before. Then comes step four: read back the code we just texted you. It rides the momentum of the three real steps that primed you, so it feels like the natural next beat instead of the theft it is. The attacker did not need to fake authority. They needed to copy the sequence.

## Why it works

This is serial recall. We store and trust processes as ordered sequences, and once the steps arrive in the order our memory expects, the mind stops judging each one on its own merits and accepts it because it landed in the right slot. This is not about a first item that impressed us; it is about the sequence matching the pattern of a real process we already know. The attacker copies the genuine verification in the exact order it normally runs: name, then last transaction, then address, three steps that occupy the slots you expect. By the time the fourth step arrives, it is accepted because the position matches, not because anyone weighed what it actually asks. Reading back a one-time code would ring alarms in isolation, but delivered as step four of a familiar four-step order it reads as simply the next thing on the checklist. The order did the vouching, not the content. That is why the one step that ever leaks control, the code read-back, has to be judged alone, no matter how correctly the sequence ran up to it.

## Defense

Your bank set the real process, and it never includes reading a code to an inbound caller. Judging the dangerous step on its own is the part only you can do.

- A correct sequence proves the caller studied the process, not that they are your bank. Real name and transaction details leak from breaches and receipts.
- One step never belongs to any verification: reading back a code sent to your phone. That single step ends the call regardless of how right the ones before it were.
- Break the cadence on purpose. Say you will call back on the number on your card, then do. A genuine process survives you hanging up and dialing the official line.
- Notice when a request feels fine because it came in the order you expected. Familiar order is the disguise the attacker built, not evidence the caller is real.
