# Hyperbolic discounting in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/hyperbolic-discounting
- Bias entry: https://keepsimple.io/uxcore/79-hyperbolic-discounting
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A page that gives you the reward the moment you approve and promises the security check "later" is betting that acting now grants the access before you ever run the check. Later is the attacker.

## Scenario

You followed a link for something you want right now: early access, a shared workspace, a bonus already sitting in your name. The page says approve the pending sign-in to start immediately and it will run the security verification afterward. The access is in front of you and the check is postponed, so the future loses. The catch is that the sign-in waiting on your phone is the attacker trying to get in, and approving it now is what lets them.

## Why it works

This is hyperbolic discounting, the way people steeply undervalue costs and rewards the further off they sit. A benefit available right now feels enormously larger than a cost due later, even when the later cost is far worse. The attacker builds the flow around that curve: the access is immediate and vivid while the verification is abstract and postponed, so the trade your gut runs comes out lopsided. What makes this version sharp is that approving now is not a shortcut you can walk back. The approval is the attack. Granting access first and verifying second means the attacker is already through the door by the time the deferred step would have run. The bias supplies the impatience; the attacker collects the live session.

## Defense

Policy can require verification before any access is granted so the choice never reaches the tired individual. Refusing to approve first and check later is the personal half.

- Never approve a sign-in or grant to unlock a reward faster. If a step verifies who is logging in, it comes before the access, never after.
- Notice the shape: reward now, security check postponed. Approving now with the check deferred means the access is already granted before anything is verified.
- A sign-in prompt you did not personally start is a request from someone else. Deny it and check the device and location, do not clear it to move on.
- When a page makes you approve something to get to what you want this second, that hurry is the product. Slow down; the flow was built to profit from it.
