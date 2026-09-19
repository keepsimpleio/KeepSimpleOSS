// Surface is a browser check screen. The lever is automation bias: a
// verdict stamped as an automated or "AI" result is trusted over your own
// judgment, and the green automated pass can be the attacker's own.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"The system says it is safe" is still just something someone programmed to say that. A green automated check can be the attacker’s own.',
  scenario:
    'A page asks you to download and run a file. Framed as one person’s say-so, "trust me, this is fine", you hesitate. Framed as the verdict of an automated scanner, "Automated Security Check: PASSED, no threats found, safe to run", you relax and click. The file is identical. A machine-shaped stamp of approval, which the attacker printed themselves, overrode the caution a human claim left intact.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'A human vouches',
      host: 'file-share-portal.example',
      path: '/download',
      pageHeading: 'Download ready',
      pageBody:
        'The uploader says this file is safe to run. Download it below.',
      cta: 'Download file',
    },
    after: {
      kind: 'browser',
      tag: 'A "system" vouches',
      host: 'file-share-portal.example',
      path: '/download',
      pageHeading: 'Automated Security Check: PASSED ✓',
      pageBody:
        'Our AI security engine scanned this file: 0 threats detected, verified safe. No action needed on your part. Click to run the verified file.',
      cta: 'Run verified file',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is automation bias: our tendency to trust an automated or algorithmic verdict over our own judgment, and to relax the moment a machine appears to have checked. "Automated Security Check: PASSED" and a reassuring "AI engine" feel objective and authoritative, so the healthy hesitation a human claim left in place quietly switches off. But the green check is just text and an icon the attacker placed on their own page. It measured nothing. By dressing their approval as a system output, they borrow the credibility of automation to wave through the exact file a real scanner would flag.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team runs the real scanners. Knowing a page cannot vouch for itself is your part.',
    moves: [
      'A "passed" badge on the page offering the file is not a scan, it is a picture. The page cannot certify its own safety.',
      'Trust security verdicts only from tools your organization runs, not from labels printed by the site hosting the download.',
      '"AI verified" and "automated check passed" are persuasion phrases here, not evidence. The more official the stamp, the more you check.',
      'When a machine seems to have decided for you, put your own judgment back in. That hand-off is exactly the lever.',
    ],
  },
};

export default content;
