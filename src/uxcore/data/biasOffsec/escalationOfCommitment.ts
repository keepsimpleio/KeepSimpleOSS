// Mode: interactive. The surface is a chat from an "agent" mid-scam: you
// already paid a processing fee to release a transfer, and now one final
// small fee will release everything. The lever is escalation of commitment,
// the sunk-cost trap. Quitting feels like wasting what you already spent, so
// you pay again, and "one more fee" is a door that never runs out of fees.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The money you already paid is gone whether you pay again or not. "One last fee to release everything" is the same sentence you heard last fee.',
  scenario:
    'You are partway into a process that already cost you a "processing fee" to unlock a payout or a refund. Now there is a final small fee, and then everything releases. Stopping means the first fee was wasted, so paying the second feels like protecting the first. It is not. Each fee only buys the request for the next one, and the payout at the end does not exist.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'Settlements Agent',
      senderHandle: 'case #48120',
      body: 'Good news, your funds cleared verification. There is one final release fee of 40 to unlock the full amount to your account. This is the last step. Once it is paid, everything is released immediately.',
    },
    question: 'What do you do?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Pay the final fee so the money you already spent is not wasted',
        trap: true,
        outcome:
          'Trap. You paid to protect the earlier payment, which is the exact reasoning the script is built on. There is no "final" fee. The moment this one clears, a new obstacle appears with a new fee, because your willingness to keep paying is the only thing being unlocked. The first fee was gone the instant you sent it, and now the second is too.',
      },
      {
        label:
          'Ask them to take the final fee out of the payout before releasing it',
        outcome:
          'They will refuse, and that refusal is the tell. A real payout can always net a fee against itself. Demanding new money from you before releasing your money means there is no money to release. The request itself proves the payout is not real.',
      },
      {
        label:
          'Stop paying, report the account, and accept the earlier fee as a loss',
        outcome:
          'Safe. You separated the money already gone from the decision in front of you. The first fee is lost no matter what you do next, so it cannot be a reason to send a second. You cut the chain at the only place it can be cut: refusing the next fee. Everything before this was sunk, and you stopped adding to it.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is escalation of commitment, driven by the sunk-cost fallacy. Once you have invested money or effort, quitting forces you to book that investment as a pure loss, and people will pay more to avoid admitting a loss than they would ever pay fresh. The scam is engineered as a staircase of small fees precisely so each new payment feels like protecting the last one rather than a standalone decision. Rationally, money already spent is irrelevant to the next choice, but emotionally it becomes the main reason to continue. The attacker never asks for a large sum, they ask for one more small step, over and over, each framed as the last. The payout dangled at the end is the anchor that keeps the earlier spending feeling recoverable, which is what makes walking away feel like the wasteful option when it is the only sane one.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Payment blocks and fraud reporting can stop the transfers your team sees. Refusing to let past spending justify the next payment is the decision only you can make in the moment.',
    moves: [
      'Judge each new payment on its own, as if you had spent nothing yet. Money already sent cannot be recovered by sending more.',
      'A legitimate payout is netted against its own fees. Anyone demanding fresh money to "release" money you are owed is describing a scam.',
      '"One final fee" that keeps being followed by another final fee is the entire mechanism. The staircase has no top.',
      'The hardest and most protective move is to book the earlier loss and stop. Reporting it also helps stop the next request in its tracks.',
    ],
  },
};

export default content;
