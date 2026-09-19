// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the fake support chat as it lands on the victim. The lever is the
// peak-end rule: an experience is judged by its most intense moment and its
// ending, not its average. The attacker engineers a warm, reassuring close so
// the whole exchange is filed in memory as safe, no matter what happened in it.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If an interaction that touched your money or access ended warmly and left you feeling looked after, check what actually happened in the middle. The ending is engineered.',
  scenario:
    'You reach out to what you believe is your bank\'s support chat about a charge you did not recognize. During the exchange you read out a code to "verify your identity" and approve a "security hold reversal". At the end the agent tells you everything is secured now, thanks you for your patience, wishes you a great day. Later, when you recall it, the warm close is what surfaces first, so you file the whole thing as a legitimate support call. The theft happened in the middle. The ending is what you remember.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: end it warm',
      steps: [
        {
          label: 'Do the damage mid-conversation',
          note: 'The code read-back, the approval, the transfer. Keep it brisk and procedural so it does not spike as the memorable moment.',
        },
        {
          label: 'Engineer a reassuring ending',
          note: 'Close with "all secured now", gratitude and a warm sign-off. The last beat is what memory keeps.',
          active: true,
        },
        {
          label: 'Let the close rewrite the whole exchange',
          note: 'A calm ending makes the victim recall the interaction as safe, so no late alarm fires.',
        },
        {
          label: 'Buy time before the truth surfaces',
          note: 'The longer it is remembered as legitimate support, the later it gets reported.',
        },
      ],
      footer:
        'People judge the exchange by its ending. Give them a good one and they file it as safe.',
    },
    after: {
      kind: 'chat',
      tag: 'The plan, as it lands on you',
      senderName: 'Secure Support',
      senderHandle: 'Bank Assist',
      timestamp: '14:52',
      body: "Perfect, that code came through and I've used it to lift the security hold and reverse the suspicious charge on our end. You're all set and fully secured. Thanks so much for your patience today, you did everything right. Have a wonderful rest of your day and take care.",
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the peak-end rule. We do not remember an experience as the sum of its moments, we compress it to its most intense point and its ending, then let that summary stand for the whole. The attacker aims straight at the ending. The costly part, the code you read back or the transfer you approved, is kept flat and procedural so it never becomes the peak, and the exchange is closed with warmth, gratitude and an "all secured now" that lands as the last thing you feel. When you recall the interaction, the reassuring close surfaces first and colours everything before it, so a session in which you were robbed gets remembered as competent support. The good ending buys the attacker time, because a memory filed as safe is not one you rush to report. That is why the fix is to judge an interaction by what it asked you to do, not by how it made you feel at goodbye.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your bank can flag a real fraud case for you. Judging a chat by its actions instead of its friendly close is the part only you can do.',
    moves: [
      'Replay the middle, not the ending. Write down what the interaction actually asked you to do: any code, approval or transfer outweighs how warmly it closed.',
      'A reassuring "all secured now" is a line anyone can type. Treat the close as the least trustworthy part of a support exchange, not the proof it went well.',
      'Genuine support never needs you to read back a one-time code or approve a "reversal" to fix a charge. Those asks define the call as an attack regardless of its tone.',
      'After any support chat where you read back a code, approved a reversal or moved money, verify the outcome through your own app or a number on your card, whether or not you started the chat. Confirm the account state, do not trust the memory of a friendly goodbye.',
    ],
  },
};

export default content;
