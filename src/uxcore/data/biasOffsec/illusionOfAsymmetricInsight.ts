// Surface is a recruiter DM, twice. The lever is the illusion of asymmetric
// insight: you believe you read other people far better than they read you.
// Attackers exploit it by handing you an easy read on purpose: the same CV
// ask arrives once as a neutral professional message you treat as an unknown,
// and once wrapped in a performed, transparently naive persona. The moment
// you feel you have seen through someone, you stop watching them, and the
// "obvious junior" costume is built precisely to be seen through.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When a stranger is easy to see through, consider that they were built that way. The read you get handed for free is the read that switches your guard off.',
  scenario:
    'A recruiter asks for your current CV with recent project details. Written straight, the message is an unknown quantity: you verify the firm before sharing anything. Written as a flustered rookie, third week on the job, terrified of their manager, begging for the same document, it hands you an instant diagnosis: harmless junior chasing a placement, seen through in one glance. Feeling like the one who reads people, you relax and send the internal project details. The person behind both messages is the same professional, and the naive persona is a script whose only job was to be transparent.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'A stranger you treat as unknown',
      senderName: 'Marcus Feld',
      senderHandle: '@marcus.recruits',
      timestamp: 'Tue, 4:10 PM',
      body: 'Hi, I am recruiting for a senior platform role that matches your background. Could we set up a short call this week? I would also need your current CV with recent project details for the client.',
    },
    after: {
      kind: 'chat',
      tag: 'A stranger you feel you have pegged',
      senderName: 'Marcus Feld',
      senderHandle: '@marcus.recruits',
      timestamp: 'Tue, 4:10 PM',
      body: 'hii sorry to bother you!! 😅 super new to this, week three, and my manager will not let me book a single call until the profile has a current CV with recent project details attached... could you just send yours over? you would honestly be saving my week 🙏',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the illusion of asymmetric insight. We are convinced we read other people better than they read us: their motives feel obvious while our own side feels hidden. The ask is identical in both messages. The straight version gives you nothing to diagnose, so the stranger stays a stranger and the checks stay on. The rookie version hands you a complete, flattering diagnosis in one glance, and a person you have "figured out" no longer feels like a threat worth watching. That felt asymmetry runs exactly backwards. You are reading a costume that was written to be read, while a professional on the other end is reading your real behaviour: what flatters you, what you skip verifying, what you will attach to help someone beneath your level. The easier the read, the more likely someone authored it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can vet firms and requests. Not trusting your own instant diagnosis of a stranger is your part.',
    moves: [
      'Verify the person and the firm through channels you find yourself, especially when your read of them feels complete. Confidence in a diagnosis is not verification.',
      'Treat "obviously harmless" as a property someone can perform. Clumsiness, panic and inexperience are cheap costumes, and they collect the same documents competence would.',
      'Judge the ask, never the persona: a CV with internal project details is sensitive whoever claims to need it, however sympathetic their story reads.',
      'Notice the moment you feel like the smarter party in an exchange with a stranger. That feeling is the product being sold to you, and it is the point where checks usually stop.',
    ],
  },
};

export default content;
