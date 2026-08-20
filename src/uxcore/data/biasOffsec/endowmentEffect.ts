// Mode: interactive. The reader clicks, and the fear of losing what is already
// theirs does the work. Surface: a message warning that someone is trying to
// take the account or data and demanding you "confirm ownership now to keep
// it". The lever is the endowment effect: once what you own feels threatened,
// you overvalue it and act to defend it, so you authenticate on the attacker's
// page. The confirm is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A message saying your account is being taken and you must "confirm ownership" through their link is the theft, not a warning about one.',
  scenario:
    'An alert says someone is trying to claim your account and transfer your data to another person. To stop it, you must confirm you are the real owner right now by signing in on the linked page. The thought of losing what is yours lands hard, and the page is right there, so you go to prove the account is still yours.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'notification',
      appName: 'Account Security',
      timestamp: 'now',
      title: 'Ownership transfer requested',
      body: 'Someone is trying to take control of your account. Confirm ownership in the next 15 minutes to keep it, or the transfer completes.',
    },
    question:
      'To keep the account that is yours, do you confirm ownership on the linked page?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Sign in on their page to prove the account is mine and block the transfer',
        trap: true,
        outcome:
          'Trap. The "transfer" is fiction; the page is a credential harvester. By defending what felt like yours being taken, you handed your password and code to the attacker. The threat of loss made you skip the one question that mattered: is this page actually my provider? Ownership was never in danger until you tried to confirm it here.',
      },
      {
        label:
          'Ignore the link and check the account through your provider directly',
        outcome:
          "Safe. Ownership is confirmed through your provider, never through a link that tells you it is being taken. You opened the account from your own address and found nothing wrong, because the transfer was bait to make you authenticate on the attacker's page. The feeling of loss was manufactured to rush you past that check.",
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the endowment effect: we value what we already possess more highly the moment it feels at risk of being lost, and that surge of protectiveness crowds out cool judgment. An attacker does not offer you something; they threaten to take something that is already yours, which triggers a stronger, faster reaction than any lure could. The imagined loss of your account makes "confirm ownership now" feel like defense rather than surrender, so you rush to authenticate exactly where the attacker wants. The scarcer and more personal the threatened thing feels, the less you scrutinize the page demanding you protect it. Loss aversion supplies the panic; the fake page collects the credentials.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can filter these takeover alerts. Refusing to authenticate through a loss-threat link is the part only you can do.',
    moves: [
      'Confirm account ownership only inside your provider, reached through your own bookmark or typed address, never through a link that says you are losing it.',
      'A message that manufactures a loss ("someone is taking your account, act now") is engineering panic to skip your checks.',
      'The threat of losing something yours hits harder than any offer. Treat that jolt as the cue to slow down, not to click.',
      'If you fear a real takeover, go straight to the provider and review active sessions and recovery settings there.',
    ],
  },
};

export default content;
