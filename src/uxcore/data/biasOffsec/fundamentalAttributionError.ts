// Surface is a chat with a "helpful" support persona. The lever is the
// fundamental attribution error: you read a warm, helpful act as proof of a
// warm, helpful character, and lower your guard for who they "are".

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A stranger being kind on a chat is playing a role, not revealing a character. Judge the request, not how nice they seem.',
  scenario:
    'Someone messages offering to help you fix an account problem. Curt and transactional, you evaluate the actual request coldly. Warm, patient, calling you by name and worrying about your day, and something shifts: you decide they are simply a kind person, and you grant the access a kind person "surely" would not misuse. The warmth is a costume. You attributed it to who they are.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Cold and transactional',
      senderName: 'Support',
      senderHandle: 'live chat',
      timestamp: '3:22 PM',
      body: 'Account issue noted. Provide your login and the one-time code to proceed. (No warmth, so you weigh the ask on its merits and refuse.)',
    },
    after: {
      kind: 'chat',
      tag: 'Warm and personable',
      senderName: 'Support',
      senderHandle: 'live chat',
      timestamp: '3:22 PM',
      body: 'Oh no, that sounds stressful, I am so sorry you are dealing with this on a Friday! Do not worry, I will stay with you until it is sorted. Whenever you are ready, just pop in your login and the code and I will take it from here 💛',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the fundamental attribution error: we explain other people’s behaviour by their character and underweight the situation driving it. A stranger acts warm, and you conclude they are a warm person who would never harm you, rather than noticing that warmth is exactly what a scripted, incentivized attacker would perform. One kind act becomes a whole trustworthy identity in your head, and you extend that identity a level of access the request itself never earned. The niceness is situational and cheap. The character you inferred from it is imaginary.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team judges requests, not personalities. Doing the same under a charm offensive is your part.',
    moves: [
      'Evaluate the ask, not the demeanour. "They seem lovely" is not a security control, and warmth is trivial to fake.',
      'No genuine support agent, however kind, needs your password or one-time code. The request is wrong regardless of tone.',
      'Notice when someone’s friendliness is doing the persuading. That pull toward "they are clearly a good person" is the lever.',
      'The nicer an unsolicited helper is about an unusual ask, the more the ask deserves an independent check.',
    ],
  },
};

export default content;
