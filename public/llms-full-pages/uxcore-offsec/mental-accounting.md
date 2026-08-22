# Mental accounting in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/mental-accounting
- Bias entry: https://keepsimple.io/uxcore/57-mental-accounting
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Money you have already mentally spent stops feeling like money you have to protect. Attackers aim for the payment you have written off, not the one you are watching.

## Scenario

You are releasing the quarterly retainer to Aldwin Studio, a bill you approved weeks ago and mentally filed under "already gone". The payee account on the release screen has been changed. On a fresh, unbudgeted payment you would scrutinise every field. On this one, the amount matches what you expected to lose anyway, so your eye slides past the account number to the approve button.

## Why it works

This is mental accounting. We do not treat all money as one pool. We sort it into buckets, and cash tagged "already committed" gets guarded far more loosely than cash tagged "a new decision". The changed account number is identical in risk to a fresh fraudulent payee, but because the amount matches a loss you already accepted, the spending part of your brain has clocked out. By now it barely feels like deciding whether to send money. It feels like clearing a line you closed weeks ago. The attacker does not need to beat your scrutiny. They need to reach the payment where your scrutiny already went home.

## Defense

Your team sets the payment controls. Refusing to autopilot the "already approved" ones is your part.

- Verify the account number on every release, hardest on the payments you already feel you have paid. Prior approval covered the amount, never the destination.
- A changed payee or account on a familiar bill is the single field worth an out-of-band callback, no matter how routine the total looks.
- Notice the feeling of "this money is already gone". That is exactly the state an attacker times the swap for. Let it slow you down, not wave you through.
- Match the destination against the bank details you already hold on file, not the ones printed on the request in front of you.
