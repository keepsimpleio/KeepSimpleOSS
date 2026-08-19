// Surface is a judgement-call quiz card: "is this certificate warning safe to
// bypass?", the call you made, and how expert you feel making it. The lever
// is the Dunning-Kruger effect: a little security knowledge reads as mastery,
// so someone who knows just enough feels expert and makes the confident wrong
// call a real expert would pause on. Same decision both times; only the
// self-assessed expertise changes.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The dangerous person is the one who knows a little and feels like an expert. Thin knowledge maxes the confidence and mutes the pause; knowing nothing at least keeps you careful.',
  scenario:
    'A browser certificate warning blocks a payment portal you need to use, and you have to decide whether to click through it. Someone who knows the limits of their own knowledge treats it as above their pay grade, keeps their confidence modest, and asks security before proceeding. Someone who has read a few threads and feels expert waves it off as a routine glitch, clicks through with full confidence, and hands their session to the attacker sitting behind the warning.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'quiz',
      tag: 'Knows the edge of their knowledge',
      prompt:
        'The certificate warning is blocking a payment portal. Safe to bypass?',
      priorContext:
        'You know enough to know this is not your area. You are not sure what a certificate warning really means.',
      options: [
        { label: 'Ask security before proceeding', chosen: true },
        { label: 'Click through, it is a glitch' },
      ],
      confidence: 35,
      confidenceLabel: 'How expert you feel',
      verdict:
        'Modest confidence, room to defer. The call goes to someone who actually knows.',
    },
    after: {
      kind: 'quiz',
      tag: 'Thin knowledge that feels like mastery',
      prompt:
        'The certificate warning is blocking a payment portal. Safe to bypass?',
      priorContext:
        'You have read a few security threads and fixed this kind of thing before. You feel like the expert in the room.',
      options: [
        { label: 'Ask security before proceeding' },
        { label: 'Click through, it is a glitch', chosen: true },
      ],
      confidence: 97,
      confidenceLabel: 'How expert you feel',
      verdict:
        'Confidence maxed, competence thin. The warning gets bypassed and the session behind it handed over.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the Dunning-Kruger effect. The same thin knowledge that makes a task feel simple also hides how much you do not know, so felt expertise runs highest exactly where actual skill runs low. The decision is identical on both cards: bypass a certificate warning or defer it. What changes is self-assessed competence. Someone who sees the edge of their own knowledge stays modest and asks, and that modest confidence is what makes them verify. Someone whose little learning feels like mastery clicks through with certainty, because an expert does not need to ask. A real expert would pause here, since a certificate warning on a payment portal is precisely the case that warrants one. The attacker does not need you ignorant. They need you to feel expert enough to skip the one check that would have caught them.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your organisation can route hard calls to the people equipped for them. Knowing when a call is above your knowledge is your part.',
    moves: [
      'On security warnings you could bypass, ask how you would know you are right. If the honest answer is thin, that is the signal to defer, not to click.',
      'Treat maxed confidence on an unfamiliar call as a warning about your knowledge, not proof of your skill. The gap is widest where you feel most expert.',
      'A certificate or security warning on anything handling money or credentials goes to the people who own it, however routine it feels to you.',
      'Real expertise shows up as more pauses, not fewer. When a decision feels obvious and no one else has checked it, that is the moment to slow down.',
    ],
  },
};

export default content;
