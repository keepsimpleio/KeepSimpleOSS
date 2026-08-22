# Information bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/information-bias
- Bias entry: https://keepsimple.io/uxcore/94-information-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A page that keeps offering "more verification" is not proving itself. It is walking you, one thorough click at a time, to the field where it finally asks for your password.

## Scenario

A security page offers layer after layer of detail: see the sign-in location, see the device, read the risk report, review previous attempts. None of it changes what you should do, which is leave. But the mind craves more information before deciding, so you keep clicking, and each click leaves you feeling more diligent. Then, at the end of the tour, the last step arrives: confirm it is you, enter your password to secure the account. By now you have done so much reviewing that typing it feels like finishing the job you started, not handing your credentials to a stranger.

## Why it works

This is information bias, the appetite for more information even when the extra data cannot change what you should do. Faced with a decision, the mind feels safer gathering than acting, so a flow that keeps promising one more detail keeps you in it. An attacker weaponizes that by making the verification bottomless: location, then device, then risk report, then history, each click answering nothing that matters and opening the next. The stream is not the theft. It is the escort. Every layer you open is a small act of commitment and a growing sense that this is a genuine security review, so by the time the last screen asks for your password, entering it feels like completing a careful process rather than surrendering your login. The right move never changed, which is to close the tab and check through your real account. The detail simply kept that move one step away until the ask arrived.

## Defense

More detail is not more proof. If the extra information would not change your action, stop gathering it before it walks you to a password field.

- Ask what the next click could possibly change. If the safe move is "leave and check my real account" no matter what the detail says, take it now, before the flow reaches its ask.
- Treat a flow that keeps offering "more verification" as the warning itself. Legitimate security tells you the outcome, it does not sell you a tour of evidence and then request your password.
- A page you did not open through your own account should never be the place you type a credential or approve a prompt. The review before the ask does not make the ask safe.
- Close the page and verify sign-ins from the service directly. A real blocked login is visible there without any of the layers, and without asking you to re-enter anything.
