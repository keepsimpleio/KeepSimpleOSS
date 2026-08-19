// Surface is an identity card. Before is a profile you treat as a genuine
// unknown, so you verify; after is the same profile you feel you have "pegged"
// as a harmless junior recruiter, so you drop your guard. The lever is the
// illusion of asymmetric insight: you believe you see straight through them
// while they cannot read you, and that false certainty switches off the checks.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The moment you feel you have someone figured out is the moment you stop watching them. Feeling unreadable yourself does not make the other person an open book.',
  scenario:
    'A recruiter messages you asking for a quick call and a copy of your current CV with project details. Reading them as a genuine unknown, you keep your guard up and verify the firm before sharing anything. Reading them as an obvious junior recruiter chasing a commission, someone you feel you have completely pegged, you relax: you are sure you can see exactly what they want and that they cannot see you at all, so you hand over the internal project detail without a second thought. The profile is the same. Your certainty that you have their number is the only thing that changed.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'profile',
      tag: 'A stranger you treat as unknown',
      name: 'Marcus Feld',
      handle: '@marcus.recruits',
      initial: 'MF',
      title: 'Recruiter, reaching out about a role',
      note: 'A genuine unknown. The firm is unverified and nothing sensitive has been shared.',
    },
    after: {
      kind: 'profile',
      tag: 'A stranger you feel you have pegged',
      priorContext:
        'Same profile, same message, same request for your CV and project details. Nothing about them changed. Your read of them did.',
      name: 'Marcus Feld',
      handle: '@marcus.recruits',
      initial: 'MF',
      title: 'Junior Talent Partner, Northgate Recruiting',
      note: 'The same profile, now read as an open book: an obvious junior, harmless, easily seen through. The felt asymmetry (clear to you, blind on their side) is the whole opening.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of asymmetric insight. We consistently believe we know others better than they know us, and better than we actually do. From a few surface cues we build a confident, tidy read of a stranger, "just a junior recruiter", while assuming our own motives stay opaque to them. The profile carries identical risk in both cards, but the felt sense of having someone pegged does the damage: certainty that you can see through a person quietly cancels the verification you would run on someone genuinely unknown. Attackers present exactly the persona you will feel you have figured out, harmless, low-status, easy to read, because a target who is sure they have the measure of you is a target who has stopped checking, which is the whole point.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can set verification rules. Not trusting your own read of a stranger is the part only you can do.',
    moves: [
      'Verify on the request, never on your read of the person. "I can tell exactly what they are" is a feeling, not a fact you can act on.',
      'When you feel you have someone completely figured out, treat that as a cue to slow down. Confident reads of strangers are usually thinner than they feel.',
      'Assume the persona in front of you was chosen for how easily you would dismiss it. Harmless and low-status is a costume, not a clearance.',
      'Run the same identity check on someone you find transparent as on someone who unsettles you. The one you think you have pegged is the one who gets through.',
    ],
  },
};

export default content;
