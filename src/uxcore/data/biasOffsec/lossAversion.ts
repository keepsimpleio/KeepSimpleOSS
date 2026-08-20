// Mode: interactive. The surface is an email from what looks like your
// collaboration tool warning that your editing session dropped and unsaved
// changes are about to be cleared. The lever is loss aversion, where a
// threatened loss weighs far more than an equal gain. The fear of losing work
// you already made overrides the check you would normally run. The threatened
// thing is plausible, unsaved work a real service could genuinely lose, and
// the attack rides that instinct to a fake sign-in page.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A message warning that your unsaved work or live session is about to be lost unless you sign in through its link is aiming at the loss you dread, not at any real problem with your account.',
  scenario:
    'An email says your editing session dropped and the unsaved changes in a document you were working on will be cleared soon unless you sign back in. Losing work you already put in hurts far more than an equal gain would please, so your gut pushes you to sign in and save it before it is gone. That push is the product. The link goes to a page that harvests the login the moment the fear of losing your work peaks.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'email',
      sender: 'Docs Workspace <notify@docs-workspace-mail.com>',
      timestamp: 'now',
      subject: 'Your session dropped, unsaved changes at risk',
      preview:
        'We detected your editing session ended unexpectedly. Unsaved changes in "Q3 Plan" have not been synced and will be cleared. Sign in to recover your work.',
    },
    question: 'Your unsaved work looks at risk. How do you react?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Click the link and sign in to save my unsaved changes',
        trap: true,
        outcome:
          "Trap. The thought of losing work you already did overpowered the pause you would normally take. The sign-in page is the attacker's, and it harvests your login the instant the fear peaks. Your real session never dropped and your document is fine. The only thing lost is the password you just entered on their page.",
      },
      {
        label: 'Click through just to check whether the draft is really gone',
        outcome:
          'The fear is steering. "I will just look and make sure my work is safe" is exactly how the page gets you onto it, where the same threat keeps pushing you to sign in. Opening the link is the step the threatened loss was built to rush you into.',
      },
      {
        label: 'Ignore the email and open the document in the tool directly',
        safe: true,
        outcome:
          'Safe. You refused to let a threatened loss set the pace. Opening the tool the normal way shows your session is live and your changes are saved, because the drop never happened. The loss was manufactured to make you authenticate somewhere you never should. Your real work was never in danger.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is loss aversion, the finding that losses loom roughly twice as large as equivalent gains in how they feel. An email offering you something new is easy to ignore, but one threatening to erase work you already made grabs you, because the pain of losing effort you invested is out of proportion to its neutral value. The attacker picks a loss a real service could plausibly cause, an ended session and unsynced changes, so the threat passes the smell test where a fantasy about deleted accounts would not. Then the dread of losing your work crowds out the step where you would ask whether the message is even real. You are not being greedy or careless. You are protecting something you built, and the attack hijacks that instinct and aims it at their sign-in page.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Filtering and a clear internal picture of how your tools actually behave help your team. Refusing to be paced by a threatened loss is the move only you can make when one lands.',
    moves: [
      'A message that says you are about to lose work or access unless you sign in through its link is engineering dread. Go to the tool yourself and check.',
      'When you feel the urge to act before something you own disappears, that urge is the attack. Verifying costs you nothing real, because the loss is almost always fiction.',
      'Never recover a session or a file through the link in the warning. Open the service independently, through the app or your saved address, and look.',
      'The fear of losing what you already made hits harder than it should. Name that feeling when it spikes, then check before you act on it.',
    ],
  },
};

export default content;
