// Surface is a "verification session" stepper: the same sequence of steps,
// shown as a progress card, walking you toward handing over a credential.
// The lever is the illusion of transparency: you overestimate how visible
// your inner state is, so you feel your hesitation and nerves are obvious to
// the agent and push through to avoid looking guilty. The steps are
// identical; only your felt exposure separates the two cards.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: "Your nervousness is far less visible than it feels. When you push through a check just so you will not look suspicious, the fear of being read is doing the attacker's work.",
  scenario:
    'A caller from "account security" walks you through a live verification session to clear a flagged login. Every step feels routine until you hesitate. On a calm day you would pause here, hang up, and call the number on your card, no worry about how the stall looks. Convinced the agent can hear you stalling and will read it as guilt, you keep going to seem cooperative, and the final step is reading back a one-time code.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'progress',
      tag: 'A session you can pause',
      title: 'Account verification',
      steps: [
        { label: 'Confirm the account is yours', state: 'done' },
        { label: 'Review the flagged login', state: 'done' },
        { label: 'Answer the security question', state: 'active' },
        { label: 'Read back the code we texted you', state: 'pending' },
      ],
      percent: 50,
      caption:
        'A session that can pause at any step for a callback on your own number. How the wait looks to the agent is not part of the picture.',
    },
    after: {
      kind: 'progress',
      tag: 'A session you feel exposed in',
      title: 'Account verification',
      priorContext:
        'Same session, same steps. This time you hesitate, and you are sure the agent can hear it and is already reading you as the guilty one.',
      steps: [
        { label: 'Confirm the account is yours', state: 'done' },
        { label: 'Review the flagged login', state: 'done' },
        { label: 'Answer the security question', state: 'active' },
        { label: 'Read back the code we texted you', state: 'pending' },
      ],
      percent: 50,
      caption:
        'The same session, now carrying a felt sense that every second of hesitation is on show. The code step is the next one waiting.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of transparency. We overestimate how much of our inner state leaks out, so a private flicker of doubt feels like a neon sign the other person is reading in real time. On a security call that misfires badly. Your hesitation, which is the healthy signal telling you to stop, gets reframed as something you must hide, and the fastest way to hide it feels like pushing through the step you should refuse. The steps are identical in both cards. What changes is the belief that the agent can see your reluctance and will score it as guilt. The attacker does not need to overcome your caution. They need you to feel your caution showing, because a person trying not to look suspicious complies faster than a person who is calm.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your bank and IT set the real verification channels. Not performing calm for a stranger is your part.',
    moves: [
      'A real institution never needs you to read back a one-time code. That step is the tell, no matter how cooperative you feel pressured to look.',
      'Hesitation is not evidence against you. A caller cannot see your nerves, and a legitimate one does not care that you paused to check.',
      'End the call and dial the number on your card or statement. Looking cautious to a stranger costs nothing. Handing them a code costs the account.',
      'Notice the urge to seem cooperative so you do not look suspicious. That felt exposure is the lever, so let it stop you rather than speed you up.',
    ],
  },
};

export default content;
