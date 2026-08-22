# Loss aversion in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/loss-aversion
- Bias entry: https://keepsimple.io/uxcore/83-loss-aversion
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A message warning that your unsaved work or live session is about to be lost unless you sign in through its link is aiming at the loss you dread, not at any real problem with your account.

## Scenario

An email says your editing session dropped and the unsaved changes in a document you were working on will be cleared soon unless you sign back in. Losing work you already put in hurts far more than an equal gain would please, so your gut pushes you to sign in and save it before it is gone. That push is the product. The link goes to a page that harvests the login the moment the fear of losing your work peaks.

## Why it works

This is loss aversion, the finding that losses loom roughly twice as large as equivalent gains in how they feel. An email offering you something new is easy to ignore, but one threatening to erase work you already made grabs you, because the pain of losing effort you invested is out of proportion to its neutral value. The attacker picks a loss a real service could plausibly cause, an ended session and unsynced changes, so the threat passes the smell test where a fantasy about deleted accounts would not. Then the dread of losing your work crowds out the step where you would ask whether the message is even real. You are not being greedy or careless. You are protecting something you built, and the attack hijacks that instinct and aims it at their sign-in page.

## Defense

Filtering and a clear internal picture of how your tools actually behave help your team. Refusing to be paced by a threatened loss is the move only you can make when one lands.

- A message that says you are about to lose work or access unless you sign in through its link is engineering dread. Go to the tool yourself and check.
- When you feel the urge to act before something you own disappears, that urge is the attack. Verifying costs you nothing real, because the loss is almost always fiction.
- Never recover a session or a file through the link in the warning. Open the service independently, through the app or your saved address, and look.
- The fear of losing what you already made hits harder than it should. Name that feeling when it spikes, then check before you act on it.
