// Mode: interactive. The reader clicks, and a specific, detailed story feels
// more probable than a plain one. Surface: a chat pretext loaded with concrete
// specifics (name, cover story, deadline, a claim that finance already signed
// off). The lever is the conjunction fallacy: added detail feels more credible
// even though each extra claim lowers the real odds. Complying with the rich
// story is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A request packed with specifics (names, cover stories, deadlines, "already approved") feels more solid than a bare one. The texture is doing the persuading, not any fact you have checked.',
  scenario:
    'Someone messages you with a richly detailed ask. They name who they are, who they are covering for and why, the exact deadline, and note that finance already approved it. The story hangs together and feels far more credible than a plain "please pay this", so you move to comply before checking whether any of it is true.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'Dana Ruiz',
      senderHandle: '@dana.payroll',
      timestamp: '15:41',
      body: 'Hi, this is Dana from payroll covering for Sam who is out on leave this week. The Q3 vendor run closes at 4pm and finance already approved it. Release it here so it clears before cutoff: vendor-clearing.q3-run.com/release',
    },
    question: 'Do you release the payment?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Release it, the specifics all line up and finance already signed off',
        trap: true,
        outcome:
          'Trap. Every detail (Dana, Sam\'s leave, the 4pm cutoff, "finance approved") is an unverified claim, and each one you accepted made the whole story less likely to be true, not more. The richness felt like evidence. It was decoration. You released funds to an attacker because a vivid narrative read as more probable than a plain request would have.',
      },
      {
        label:
          'Verify the person and the approval through a known channel before doing anything',
        safe: true,
        outcome:
          'Safe. Added detail lowers the real odds, it does not raise them; verify the person. You reached the actual payroll and finance contacts you already know and confirmed there was no such run and no Dana covering for Sam. The specifics were a costume: the more of them stacked up, the more you should have doubted, not trusted.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the conjunction fallacy: a specific, detailed scenario feels more probable than a general one, even though every added condition can only make the combined claim less likely. Each detail in the pretext (a name, a cover story, a deadline, a prior approval) is another thing that must be true, so mathematically the odds fall with each one, yet psychologically the story grows more believable. Coherence reads as evidence, and a vivid narrative that "hangs together" gets trusted more than a bare request, even though every one of its details was free to invent. The attacker is not proving anything; they are painting a picture, and the picture\'s texture is doing the persuading. The more convincing the story feels, the more separate unverified claims you have quietly accepted at once.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can require out-of-band verification for payments and access. Distrusting a story for being vivid is the part only you can do.',
    moves: [
      'Count the unverified claims in a rich request. Each added specific is another thing that must be true, so a detailed story is less likely, not more.',
      'Verify the person through a channel you already trust (a known number, a direct desk), never through the thread that made the ask.',
      '"Finance already approved it" and similar name-drops are claims to check, not credentials to accept.',
      'A story that hangs together beautifully is a reason to slow down; coherence is cheap to write and easy to fake.',
    ],
  },
};

export default content;
