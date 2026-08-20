// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the message as it lands on the victim. The lever is prejudice: judging by
// group, affiliation or authority cues instead of evidence. The attacker wears
// the badge the target already defers to, so the affiliation buys the trust
// the message itself never has to earn.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'If a message earns trust by claiming an affiliation you defer to, not by anything it proves, the badge is doing the work. Affiliation is a claim, not a credential.',
  scenario:
    'A notice lands claiming to be from a government tax office, formal and official, telling you a filing needs correcting through the link provided. You do not judge the content, you judge the sender-group, and that group is one you have been trained your whole life to obey. The attacker never proved they are the agency. They borrowed the crest, because for most people the crest ends the question. The affiliation pays for a trust the message could not have earned on its own.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: borrow the badge they defer to',
      steps: [
        {
          label: 'Pick an affiliation the target obeys on reflex',
          note: 'A government office, a regulator, a "we are on your side" body. Choose the group whose name ends questions.',
          active: true,
        },
        {
          label: 'Dress the message in that identity',
          note: 'Official tone, a crest, reference numbers, formal deadlines. The costume signals the group, not the person.',
        },
        {
          label: 'Let the affiliation replace the evidence',
          note: 'The reader checks who it claims to be from, not whether it is real, and stops there.',
        },
        {
          label: 'Attach the ask to the deference',
          note: 'Correct a filing, verify an identity, settle a charge. The badge already bought the compliance.',
        },
      ],
      footer:
        'The crest does the persuading. Nobody checks whether it is real.',
    },
    after: {
      kind: 'notification',
      tag: 'The plan, as it lands on you',
      appName: 'Mail',
      timestamp: 'now',
      title: 'Tax Office: action required on your filing',
      body: 'A discrepancy was found in your latest submission. Correct your details within 3 working days through the secure portal to avoid a penalty. Reference: TR-40928.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is prejudice as a security failure. Prejudice is judging by group or affiliation before weighing evidence, and it runs in both directions: instant distrust of an out-group, instant deference to an authority-group. The attacker exploits the deference side. They wrap an ordinary phishing ask in the identity of a body you were raised to obey, and your mind checks the affiliation instead of the message, then treats the affiliation as the verification. A crest, an official register and a formal deadline are cheap to counterfeit and expensive to doubt, because doubting an authority feels like the risky move. The compliance was bought by the group name before the content was ever read. That is why the fix is to make the sender prove they are the body they claim, since the badge itself proves nothing.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Real agencies have real channels you can reach independently. Refusing to let a badge stand in for proof is the part only you can do.',
    moves: [
      'Judge the request, not the crest. Ask what this message actually proves about its origin, separate from the authority it claims to speak for.',
      'Reach the claimed body through a number or address you find yourself, never a link or number inside the message. A real agency survives you contacting it directly.',
      'Official pressure, deadlines and penalties are the costume, not evidence. Genuine bodies give you time and a verifiable case reference you can look up on their own site.',
      'Notice the moment you defer because of who it claims to be from. That reflex is the lever, and it is exactly what the borrowed badge was chosen to pull.',
    ],
  },
};

export default content;
