// Surface is a support chat during a screen-share. The lever is the
// spotlight effect: you overestimate how much of an audience is watching and
// judging you, so the attacker installs one. The ask is identical in both
// cards: run the "diagnostic" they sent. The flagged card adds an invoked
// audience, a bridge call full of people supposedly waiting on your screen,
// and the fear of fumbling in front of them replaces the pause that would
// have caught the ask.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A stranger who tells you an audience is watching your screen is installing a spotlight. Nobody on that bridge is grading your pace, and the bridge itself is probably empty.',
  scenario:
    'A "support engineer" is on a screen-share for an issue you reported and asks you to run a diagnostic tool they sent. Asked one on one, you take your time, look at what the file actually is, and decline to run unknown software. Told that the incident bridge is watching your screen and fourteen people are waiting on this one step, the same ask lands differently: every second you spend inspecting the file feels like public fumbling, and running it fast feels like the way to stop being the spectacle.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'One on one, no audience',
      senderName: 'Desk 12, Support',
      senderHandle: 'support chat · screen-share active',
      timestamp: '2:14 PM',
      body: 'Whenever you are ready, run the diagnostic I sent over and tell me what it reports. No rush on this.',
    },
    after: {
      kind: 'chat',
      tag: 'An audience you can feel',
      senderName: 'Desk 12, Support',
      senderHandle: 'support chat · screen-share active',
      timestamp: '2:14 PM',
      body: 'Quick heads-up, the incident bridge is viewing your screen with me, fourteen people waiting on this step. Run the diagnostic I sent over and read out what it reports, everyone is ready when you are.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the spotlight effect. We badly overestimate how much other people watch and judge us, and the feeling of being observed changes behaviour even when the observation is fictional. The ask is the same in both messages: run unknown software. One on one, there is room to inspect it, and inspection kills it. With fourteen imagined pairs of eyes on your cursor, hesitation starts to feel like a public confession of incompetence, and the fastest way out of the spotlight is to comply. The attacker never has to argue that the file is safe. They just have to make careful feel embarrassing, and the audience they typed into existence does that for them.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'IT decides who may run tools on your machine. Refusing to trade that for how you look on a call is your part.',
    moves: [
      'Running software someone sent you is worth looking slow over, every time, whoever is claimed to be watching.',
      'An invoked audience is a pressure tool. The more people supposedly waiting on your click, the more suspicious the click deserves to be.',
      'Verify unsolicited support through your own IT channel before sharing a screen, and never run files from a session you did not initiate.',
      'Notice the urge to hurry so you do not look foolish. That imagined spotlight is the lever, so let it stop you rather than push you on.',
    ],
  },
};

export default content;
