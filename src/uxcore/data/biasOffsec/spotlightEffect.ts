// Surface is a screen-share "support session" stepper: the same remote-help
// steps, shown as a progress card, walking you toward granting remote
// control. The lever is the spotlight effect: you overestimate how much the
// agent is watching and judging you, so the fear of looking incompetent
// keeps you going rather than declining. The steps are identical; only the
// imagined scrutiny separates the two cards.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: "The agent is not studying how slow or confused you look. When fear of seeming incompetent keeps you clicking, the imagined spotlight is doing the attacker's work.",
  scenario:
    'A "support engineer" opens a screen-share to fix an issue you reported, then asks to take remote control to "speed things up". On a normal day you would decline partway through, say you will handle the rest yourself, and end the call. Feeling like every fumble is being watched and judged, you keep going and grant control rather than look slow or foolish in front of someone who does this all day.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'progress',
      tag: 'A session you can decline',
      title: 'Remote support session',
      steps: [
        { label: 'Describe the issue', state: 'done' },
        { label: 'Share your screen', state: 'done' },
        { label: 'Follow the fix together', state: 'active' },
        { label: 'Grant remote control', state: 'pending' },
      ],
      percent: 55,
      caption:
        'A support session that can end with "I will take it from here". The agent\'s opinion of your pace is not in view.',
    },
    after: {
      kind: 'progress',
      tag: 'A session under a spotlight',
      title: 'Remote support session',
      priorContext:
        'Same session, same steps. This time every hesitation feels like it is under a spotlight the agent is judging you by.',
      steps: [
        { label: 'Describe the issue', state: 'done' },
        { label: 'Share your screen', state: 'done' },
        { label: 'Follow the fix together', state: 'active' },
        { label: 'Grant remote control', state: 'pending' },
      ],
      percent: 55,
      caption:
        'The same session, now under a felt spotlight where every pause seems to mark you as slow. The next step is granting remote control.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the spotlight effect. We badly overestimate how much other people notice and judge our stumbles, and act as if a spotlight is trained on us when the other person is barely tracking it. On a support call that misjudgement is expensive. Declining, which is the safe move, starts to feel like a public admission that you are the slow one who cannot manage a simple fix. The steps are identical in both cards. What changes is the sense that the agent is watching every hesitation and scoring your competence. The attacker does not need to argue you into granting control. They need you to feel watched, because a person managing how they look grants access a calm person would refuse.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'IT sets who is allowed to take remote control. Not trading access for how you look is your part.',
    moves: [
      'Granting remote control hands over your machine. That decision is worth looking slow over, every time, no matter who is on the call.',
      'The agent is not grading your speed. Real support does not think less of you for saying you will finish it yourself.',
      'Verify unsolicited support through your own IT channel before sharing a screen, and never grant control on a call you did not initiate.',
      'Notice the urge to keep up so you do not look foolish. That imagined spotlight is the lever, so let it stop you rather than push you on.',
    ],
  },
};

export default content;
