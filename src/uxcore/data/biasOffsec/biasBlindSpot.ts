// Surface is email. The lever is the bias blind spot: you spot the trap
// instantly when it targets someone else, and miss the identical one aimed
// at you, because "I would never fall for this" switches off the checks.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The moment you think "I would never fall for this" is the moment you stop doing the checks that keep it true.',
  scenario:
    'The same phishing email, twice. Forwarded to you as "look what someone sent my colleague", you diagnose it in seconds: wrong domain, fake urgency, obvious. Landing in your own inbox on a busy afternoon, addressed to you, it sails through, because the part of you that would have scrutinized it is busy being certain you are too smart to be targeted.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Aimed at someone else',
      sender: 'it-helpdesk@corp-account-security.com',
      timestamp: '2:40 PM',
      priorContext:
        'A colleague forwarded it to you with one line: "is this legit?"',
      subject: 'FW: Your mailbox will be deactivated, reverify now',
      preview:
        'Action needed: reverify your account within 24 hours to avoid deactivation. Sign in through the secure link below to keep your mailbox active.',
    },
    after: {
      kind: 'email',
      tag: 'Aimed at you',
      sender: 'it-helpdesk@corp-account-security.com',
      timestamp: '2:40 PM',
      priorContext:
        'Same email, now in your own inbox, on a day you are sure you have seen every trick. You are the expert here, so you skim.',
      subject: 'Your mailbox will be deactivated, reverify now',
      preview:
        'Action needed: reverify your account within 24 hours to avoid deactivation. Sign in through the secure link below to keep your mailbox active.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the bias blind spot: we see cognitive traps clearly in other people and are nearly blind to them in ourselves. Diagnosing a colleague’s phishing email is easy because you are inspecting it. Your own arrives while you are inside your certainty, and "I know better" is exactly the state that skips the inspection. The expertise is real, but it protects you only while it is switched on, and the belief that you are immune is what switches it off. Attackers do not need you to be foolish, only confident.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team assumes anyone can be phished. The hardest person to convince of that is you.',
    moves: [
      'Treat your own inbox with the exact suspicion you would apply to a colleague’s forward. Same checks, no exceptions for being clever.',
      'Feeling immune is a risk state, not a safe one. The more sure you are, the more deliberately slow down.',
      'Make verification a fixed habit, not a judgment call. Habits run even when confidence has talked judgment out of the room.',
      'The email that targets you personally is not proof you are special, it is proof you are on a list.',
    ],
  },
};

export default content;
