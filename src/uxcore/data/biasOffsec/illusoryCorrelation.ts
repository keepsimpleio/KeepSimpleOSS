// Surface is a browser pop-up. The lever is illusory correlation: a normal
// symptom is bolted to a scary cause so the invented link ("slow means
// infected") drives you to the attacker's "fix".

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"Your device is slow because you are infected" is a story, not a diagnosis. A scary cause bolted onto a normal symptom is the con.',
  scenario:
    'Your laptop is running slow, which happens for a hundred boring reasons. A pop-up states a plain fact, and you shrug. Then a second version ties that exact slowness to a frightening cause: "Slow performance detected. This is a sign your device is infected." Suddenly the ordinary symptom feels like proof of a breach, and the "clean my device now" button feels like the obvious cure.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'browser',
      tag: 'A symptom, stated plainly',
      host: 'system-status.example',
      path: '/notice',
      pageHeading: 'Your device seems to be running slowly',
      pageBody:
        'Performance is below normal. This can happen for many ordinary reasons, such as too many open tabs or a pending update.',
    },
    after: {
      kind: 'browser',
      tag: 'The symptom, given a scary cause',
      host: 'system-status.example',
      path: '/notice',
      pageHeading: '⚠ Infection detected: your device is running slowly',
      pageBody:
        'Slow performance is a known sign of malware. Your device is likely infected and your data is at risk. Run the cleaner now to remove the threat before it spreads.',
      cta: 'Clean my device now',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is illusory correlation, the mind’s habit of seeing a relationship between two things that are not actually linked. A slow laptop and a malware infection can co-occur, so the brain readily accepts "slow, therefore infected", even though slowness has countless innocent causes and proves nothing. The attacker supplies the missing arrow for free, welding a genuine, observable symptom to a frightening cause you cannot check. Once the link feels real, the fake "cleaner" feels like the natural remedy, and you install the very thing the pop-up pretended to detect.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can actually diagnose a machine. A web page cannot, and you knowing that is the defense.',
    moves: [
      'A website cannot scan your device. Any page claiming to have "detected an infection" is asserting a link it cannot possibly have measured.',
      'Separate the symptom from the story. Slow is common and boring, "therefore infected" is a claim someone bolted on to scare you.',
      'Never install a "cleaner" or "fix" offered by the same pop-up that raised the alarm. That is the attack, not the cure.',
      'Real performance issues go to your IT team or a tool you already trust, not to a button that appeared with the warning.',
    ],
  },
};

export default content;
