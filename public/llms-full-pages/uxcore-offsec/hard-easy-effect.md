# Hard easy effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/hard-easy-effect
- Bias entry: https://keepsimple.io/uxcore/73-hard-easy-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

The check you think is obvious is the one you stop actually running. An easy-looking domain is where confidence overshoots and the lookalike slips past.

## Scenario

You land on a login page and have to decide whether the domain is genuine. On an unfamiliar vendor portal you treat this as hard, feel unsure, and read the address character by character. On your own company login, a page you see every day, it looks obviously right, your confidence jumps, and you never notice that one letter of the domain was swapped for a lookalike.

## Why it works

This is the hard-easy effect. People overrate their accuracy on tasks that look easy and underrate it on tasks that look hard, so felt confidence tracks apparent difficulty rather than the real trap. The attack is the same on both cards: one letter of the domain swapped for a lookalike, a homoglyph your eye reads as correct. On the unfamiliar portal the task feels hard, your confidence sits low, and low confidence keeps you reading. On the login you use daily, the task feels trivial, confidence overshoots, and an overshot check is a check you no longer perform. The attacker does not need to fool a careful reader. They need the page to look easy enough that you stop reading, because the easy-looking task is where the guard is already down.

## Defense

Your team can enforce the checks. Refusing to skip them on the pages that look obvious is your part.

- Read the full domain on every login, hardest on the ones you know by heart. Familiarity is exactly where the lookalike is aimed.
- Treat "of course this is real" as a prompt to look again, not a reason to sign in. The easy feeling is the lever.
- Reach the login through your own bookmark or password manager, so the address is filled from your record, not from the link you were sent.
- The check that feels beneath you is the one worth running twice. Apparent ease is not evidence the page is safe.
