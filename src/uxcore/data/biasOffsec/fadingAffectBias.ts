// Mode: live (counter). The counter climbs the days since a scare while the
// meter reads the wrong way: your caution decays as the memory cools. The
// lever is the fading affect bias: the sting of a bad memory fades faster than
// neutral or good feelings, so the vigilance you swore to keep after an
// incident quietly erodes. before = the day after the scare, caution high and
// steady; after = weeks later, caution decayed, the attacker back with the
// same trick.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a close call taught you a rule you no longer feel strongly about, the lesson faded before the threat did. The attacker is waiting for exactly that.',
  scenario:
    'A phishing attempt nearly caught you. For a day or two afterward you were sharp: you double-checked senders, you hovered every link, you swore you would never click one of those again. Weeks pass. The fear that made the rule stick cools faster than the routine around it, so the vigilance slides back to baseline while the habit of clicking returns. Then the same style of message arrives again, and the caution that would have stopped it has quietly drained away. The attacker did not need a better trick. They needed to wait.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'live',
      variant: 'counter',
      tag: 'The day after the scare',
      counterValue: '1',
      counterLabel: 'days since the incident',
      meterLabel: 'Your caution',
      meterFrom: 92,
      meterTo: 92,
      priorContext:
        'Yesterday: a phishing email, "Your account was flagged, confirm your login," slipped past the filter and almost got a click.',
      caption:
        'Day 1. The flagged message is still pinned at the top of the inbox and the caution meter reads 92.',
    },
    after: {
      kind: 'live',
      variant: 'counter',
      tag: 'Weeks later, same trick returns',
      priorContext:
        'Inbox, this morning: "Security alert: confirm your login to avoid suspension," from a near-match of the sender that caught you last month. Already opened, not flagged.',
      counterValue: '38',
      counterLabel: 'days since the incident',
      meterLabel: 'Your caution',
      meterFrom: 92,
      meterTo: 24,
      caption:
        'Day 38. The lookalike above is already open and unmarked. The caution meter has slid from 92 to 24 as the counter kept climbing.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the fading affect bias. The emotional charge attached to an unpleasant memory dims faster over time than the charge on neutral or positive ones, so a scare that felt vivid and instructive this week is a flat fact next month. After a near-miss you set a rule, check the sender, never click that kind of link, and the rule holds only as long as the fear that fused it stays warm. As the sting cools the rule loses its enforcer, vigilance slides back toward the convenient baseline, and the cautious behavior quietly lapses even though nothing about the threat changed. The attacker does not have to out-think your lesson, they only have to outlast its emotional half-life and return with the same bait once the alarm has gone quiet. That is why the durable defense is a habit or a control that does not depend on still feeling afraid.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your tools can enforce a rule long after the fear that inspired it fades. Turning a scare into something that does not rely on memory is the part only you can do.',
    moves: [
      'Convert the lesson into a standing habit the day after the scare, while it still stings: a fixed rule you follow every time, not a feeling you hope persists.',
      'Lean on controls that do not decay with your mood. A password manager that will not autofill on a lookalike domain, or mandatory two-step approval, keeps guarding after the fear is gone.',
      'Expect the attacker to come back once the alarm cools. The return of an old trick weeks later is the pattern, not bad luck.',
      'Schedule a cold review of what nearly caught you, on a date far enough out that the emotion has already faded. Re-reading it deliberately reloads the guard the memory dropped.',
    ],
  },
};

export default content;
