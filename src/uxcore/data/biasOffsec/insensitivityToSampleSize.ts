// Surface is an app listing. The lever is insensitivity to sample size: a
// tiny, perfect track record reads as strong proof, and a perfect number
// from a handful of voices is the easiest thing in the world to fake.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"Everyone loves it" from a handful of voices is not a track record. Small perfect numbers are the easiest ones to fake.',
  scenario:
    'You are about to install a security tool, "VaultGuard". One listing shows a modest score across many thousands of reviews. The other shows a flawless five stars, "100% recommend", from a small cluster of glowing reviews posted this week. The perfect record feels safer, but perfection is exactly what a few planted voices can manufacture and a real crowd never quite reaches.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'A large, messy sample',
      host: 'app-directory.example',
      path: '/vaultguard',
      pageHeading: 'VaultGuard',
      pageBody:
        'Rated 4.2 out of 5 across 18,000 reviews. Mixed feedback, some complaints, a long history. Ordinary, and hard to fake at that scale.',
    },
    after: {
      kind: 'browser',
      tag: 'A tiny, perfect sample',
      host: 'app-directory.example',
      path: '/vaultguard-pro',
      pageHeading: 'VaultGuard Pro',
      pageBody:
        '★★★★★ 100% recommend. "Flawless. Life-changing. Instant trust." Every one of its 7 reviews is five stars, all posted in the last few days. Install now, trusted by everyone who has tried it.',
      cta: 'Install VaultGuard Pro',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is insensitivity to sample size. We judge "how good" and ignore "how many", so a perfect score from seven reviews feels stronger than a merely good score from thousands. But statistics run the opposite way: small samples swing to extremes easily, and a flawless record is a warning sign, not a reassurance, because real, large crowds are always messy. Attackers exploit the blind spot by standing up a handful of fake glowing voices, which is cheap, and letting your mind read "100%" as overwhelming proof rather than as a number too clean to be earned.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can vet a tool properly. Not being sold by a tiny perfect number is your part.',
    moves: [
      'Always read the count, not just the score. Seven perfect reviews is a rounding error dressed as a consensus.',
      'A flawless record is suspicious, not comforting. Real history has complaints, edge cases, and time behind it.',
      'Recent, uniform, glowing reviews clustered together are the signature of a plant. Ask when they were posted.',
      'Install security tools only from sources your organization approves, no matter how loved a listing claims they are.',
    ],
  },
};

export default content;
