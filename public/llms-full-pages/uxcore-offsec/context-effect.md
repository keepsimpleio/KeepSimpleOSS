# Context effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/context-effect
- Bias entry: https://keepsimple.io/uxcore/5-context-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A sign-in page that appears exactly where you expected one borrows its credibility from your own click. Expecting a login is no evidence that this login is real.

## Scenario

The same sign-in page, twice. On a random Tuesday tab it looks fake immediately. Ten seconds after you clicked "Join meeting" in a calendar invite, the very same page reads as routine, because now it sits exactly where a sign-in was supposed to be.

## Why it works

Both cards show the identical page. Same address, same copy, same button. What changed is the situation around it. Your brain judges a request against the context it arrives in, not on its own merits. A password prompt with no story is suspicious by default. The same prompt inside a flow you started yourself borrows the trust of that flow: you expected a meeting, a sign-in feels like a normal step, so the page gets a pass it never earned. The attacker did not build a better fake. They built a better moment for it.

## Defense

While your security team handles the perimeter, here is your homework.

- Judge every credentials prompt as if it appeared out of nowhere. The question is not "does this fit the flow?" but "is this the real login page?". Only the address bar answers that.
- A meeting link that lands on a corporate password form is a red flag on its own. Meeting tools may ask for your name or a meeting code. Your work password belongs to your identity provider, not to a meeting page.
- Expected is not verified. Attackers manufacture expectation on purpose: a calendar invite, a shared file, a delivery notice. Each one exists to make the next page feel like a natural step.
- When a sign-in appears mid-flow, break the flow. Open a new tab and reach the service through the address you know. If the meeting is real, it will still be there.
