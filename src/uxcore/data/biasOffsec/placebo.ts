// Surface is a security-status checklist: the same protections, shown as a
// row of green ticks, warnings and grey dashes. The lever is the placebo
// effect: a wall of reassuring green makes you feel protected, and that
// feeling alone makes you drop the caution that was doing the real work.
// The actual protection is identical between the two cards. Only the theatre
// of safety changed, and the theatre is what lowers your guard.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Feeling protected is not the same as being protected. A wall of green ticks that certifies nothing real is built to make you stop checking the things that actually keep you safe.',
  scenario:
    'You install a "web protection" browser extension that promises to guard your browsing. It shows a status panel of solid green ticks: "Protection active". Nothing behind those ticks does anything real, but the panel feels reassuring, so you stop hesitating over sketchy links and download prompts you used to pause on. Your honest status was mixed, some things covered, some not, and that mix kept you careful. The green wall replaced the care.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'checklist',
      tag: 'An honest status that keeps you alert',
      title: 'Your security status',
      items: [
        { label: 'Browser and OS up to date', state: 'ok' },
        { label: 'Password manager in use', state: 'ok' },
        { label: 'Two-factor on your email', state: 'warn' },
        { label: 'Backups verified this month', state: 'off' },
        { label: 'Unknown downloads still reach you', state: 'warn' },
      ],
      footer:
        'Two checks still open. The status is honest about what it does not cover.',
    },
    after: {
      kind: 'checklist',
      tag: 'A green wall that certifies nothing',
      title: 'Protection active',
      priorContext:
        'You just installed a "web protection" extension. Its panel turned everything green the moment it loaded, before it could have checked anything.',
      items: [
        { label: 'Browsing protected', state: 'ok' },
        { label: 'Downloads scanned', state: 'ok' },
        { label: 'Phishing blocked', state: 'ok' },
        { label: 'Identity secured', state: 'ok' },
        { label: 'Threats stopped today: 0', state: 'ok' },
      ],
      footer: 'All systems protected. No action needed.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the placebo effect. A cue that signals safety produces the felt experience of safety, even when nothing behind the cue is doing any work. The row of green ticks certifies nothing real: no scan ran, no threat was blocked, the extension is decoration. But the feeling it manufactures is genuine, and that feeling quietly stands in for actual protection. The caution you were running by hand, pausing on odd links, hesitating over downloads, was the thing keeping you safe, and the green wall convinces you to retire it. Your real exposure is unchanged or worse, while your sense of exposure drops to zero. Attackers do not need to weaken your defences. They need you to believe you already have them, because a person who feels protected stops protecting themselves.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team picks the tools that actually protect you. Refusing to let a reassuring badge replace your own caution is your part.',
    moves: [
      'Judge a security tool by what it verifiably does, not by how green its dashboard is. All-green with no detail is a claim, not a defence.',
      'A seal or badge that turns everything green the instant it loads has checked nothing. Instant certainty is the tell that the reassurance is theatre.',
      'Keep the habits that were protecting you before the tool arrived: pausing on odd links, checking senders, hesitating over downloads. A dashboard does not earn the right to switch them off.',
      'Notice the moment you feel "fully protected, nothing to worry about". That feeling is exactly what an attacker installs, and it is the moment to check harder, not less.',
    ],
  },
};

export default content;
