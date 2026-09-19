// Mode: playbook. `before` is a page from the attacker's own manual; `after`
// is the victim's screen where the plan lands. The lever is the primacy
// effect: the first item in a sequence anchors judgement and is remembered
// best, so the attacker front-loads the trust. Whatever leads the message
// sets how everything after it is read, including the ask buried further down.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Whatever comes first sets how you read everything after it. An attacker who leads with something true and reassuring has already framed the ask you have not reached yet.',
  scenario:
    'An email opens with two lines you can personally verify as true: a real project name, a real recent event. By the time the actual request arrives further down, it is being read by someone who decided in the first sentence that this message is legitimate. The attacker did not hide the ask. They just made sure the first thing you saw was the thing that earns trust, because the opening sets the frame for the rest.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'playbook',
      tag: "The attacker's plan",
      docTitle: 'Playbook: front-load the trust',
      steps: [
        {
          label: 'Open with a verifiable truth',
          note: 'Name the real project and a real event. The reader confirms it and relaxes.',
          active: true,
        },
        {
          label: 'Ride the frame',
          note: 'Once the first line reads as legitimate, everything after inherits that judgement.',
        },
        {
          label: 'Bury the ask in the middle',
          note: 'The payment change or credential link goes below the trust, never at the top.',
        },
        {
          label: 'Close warm',
          note: 'A friendly sign-off, nothing alarming, so no late doubt fires.',
        },
      ],
      footer: 'Primacy does the vouching. The first line is the whole con.',
    },
    after: {
      kind: 'email',
      tag: 'The plan, as it lands on you',
      sender: 'finance@nordvik-components-billing.com',
      timestamp: 'Thu, 11:20',
      subject: 'Helios project, Q3 invoice',
      preview:
        "Hi, following up on the Helios rollout we discussed at last week's review. Great work from your side on it. Quick note: our bank details have changed, please use the updated account on the attached invoice for this payment. Thanks again, speak soon.",
      attachment: 'Helios-Q3-invoice.pdf',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the primacy effect. The first item in a sequence carries more weight than the ones that follow: it anchors your impression and colours how you read everything after it. Open with a checkable truth, a real project, a real meeting, and the reader confirms it and files the whole message under "legitimate" before reaching the part that matters. The bank-detail change then arrives to a mind that already decided this sender is real, so it gets a nod instead of a callback. The attacker is not hiding the ask. They are ordering the message so your judgement is made on the trustworthy opening and merely applied to the dangerous middle. First impressions are cheap to manufacture and expensive to overturn.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team verifies payment changes out of band. Not letting a strong opening pre-approve the rest is your part.',
    moves: [
      'Read a message for its ask first, not its opening. Skip to what it actually wants, then decide, so a warm first line cannot pre-approve the request below it.',
      'A verifiable true detail proves the sender did their homework, not that they are who they claim. Real project names leak from calendars, signatures and chat.',
      'Any change to bank details or a credential request resets trust to zero, no matter how legitimate the lines above it read. Verify that one line through a channel you already hold.',
      'Notice when you decided a message was safe. If it was in the first sentence, you judged the framing, not the ask.',
    ],
  },
};

export default content;
