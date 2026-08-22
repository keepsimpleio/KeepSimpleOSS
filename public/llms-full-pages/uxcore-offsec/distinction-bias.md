# Distinction bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/distinction-bias
- Bias entry: https://keepsimple.io/uxcore/21-distinction-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A comparison someone else built is a funnel. Once you catch yourself picking between their two options, ask whether you would take the winning one if it stood there alone.

## Scenario

A page claims your access is suspended and you must verify your identity. On its own, the "verify instantly" button reads as a trap. But present it as a choice, Option A: wait three to five business days locked out, or Option B: verify instantly and keep working, and Option B stops looking like a risk and starts looking like the obvious move. Same button, same harvested password.

## Why it works

This is distinction bias. Options judged side by side get compared on their differences, and small gaps get magnified into decisive ones. Alone, "verify instantly" invites the question "should I be doing this at all?". Beside a slow, painful Option A, your mind quietly swaps that question for a smaller one: "which of these two is better?". You were never meant to choose Option A. It exists to be the loser, so the trap can win a race you would never have entered on its own.

## Defense

Your team owns the real login flow. Spotting a fake fork in the road is on you.

- A comparison someone else built is a funnel, not a favour. The "obviously better" option is the one they need you to pick.
- Judge the risky choice as if it stood alone. Would you enter your password here with no Option A next to it? That is your real answer.
- The slow, boring, "standard" option is usually the safe one. Attackers make it painful precisely so you flee it.
- There is no legitimate "instant bypass" of a security review. If speed is the whole pitch, treat the page as hostile and leave.
