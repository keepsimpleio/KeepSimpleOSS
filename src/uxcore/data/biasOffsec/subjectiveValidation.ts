// Surface is a "personalized security scan". The lever is subjective
// validation: vague statements that could fit almost anyone feel written
// specifically about you, and that felt accuracy buys the tool your trust.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A "personal" report that could describe almost anyone, yet feels written about you, is fishing for your trust, not measuring your risk.',
  scenario:
    'A page offers a free scan of your account security. One version returns a flat, generic result. The other returns a "personalized risk profile": you reuse a password somewhere, you have clicked a risky link recently, someone in your circle has been breached. All true of nearly everyone, yet it feels uncannily about you, and that feeling makes you trust the "fix it now" button that follows.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Generic result',
      host: 'secure-scan-checkup.com',
      path: '/result',
      pageHeading: 'Scan complete',
      pageBody:
        'General recommendation: keep your software updated and use strong passwords. No account-specific findings to display.',
      cta: 'Apply my fixes',
    },
    after: {
      kind: 'browser',
      tag: 'Feels written about you',
      host: 'secure-scan-checkup.com',
      path: '/result',
      pageHeading: 'Your personal risk profile is ready',
      pageBody:
        'We found signs that match your habits: a password reused across sites, a risky link opened recently, and exposure linked to people you know. Your profile needs attention. Sign in to apply your personalized fixes now.',
      cta: 'Apply my fixes',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is subjective validation, the same engine behind horoscopes and cold reading. A statement broad enough to fit almost anyone gets read as a precise hit about you, because you supply the specifics from your own life. "You reuse a password somewhere" is true of nearly every person alive, yet it lands as if the scanner truly knows you. That felt accuracy is not evidence the tool works, it is evidence it was written to feel personal. Once it seems to understand you, its instructions inherit the trust, and the "fix" is the payload.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team runs the real scans. Noticing a fake one flattering you is on you.',
    moves: [
      'Ask whether a "finding" could be said to anyone. If it fits everyone, it is a script, not a scan.',
      'A tool feeling like it "gets" you is a persuasion result, not a security result. Trust the method, not the vibe.',
      'Never apply fixes or sign in from an unsolicited scan page. Run checks through tools your organization actually issued.',
      'The more personal a cold, unrequested report feels, the more deliberately you should distrust it. That resonance was manufactured.',
    ],
  },
};

export default content;
