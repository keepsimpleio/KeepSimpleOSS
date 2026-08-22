# Weber fechner law in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/weber-fechner-law
- Bias entry: https://keepsimple.io/uxcore/24-weber-fechner-law
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A charge small enough to ignore was sized that way on purpose. Query the odd $40 the way you would query an odd $40,000, because the small one is usually a test of whether the card still works.

## Scenario

A single unfamiliar charge, "Northwind API, $40", sits on your company card statement. On a nearly empty statement it jumps out and you query it in seconds. On a busy month stacked with five-figure lines, the very same $40 disappears into the scroll. Same charge, same test of whether someone else is already spending your money.

## Why it works

This is the Weber-Fechner law. We perceive change in proportion to the starting magnitude, not in absolute terms. Forty dollars against a fifty-dollar total is enormous and screams; forty dollars against seventy thousand is a whisper you never hear. Attackers know this, so they size the theft to the noise around it, not to your alarm. The small "test charge" is often a probe, checking whether the stolen card or access works before it is used for something larger. Its whole design is to be too small to chase.

## Defense

Your team watches the big flows. Catching the small ones is where you come in.

- Reconcile every line regardless of the total. The charge that is "too small to bother with" is small on purpose.
- A tiny unexplained charge is often a test, not the theft. It confirms the card or account works before the real hit lands.
- Do not let perception be the control. Set alerts and automated checks that flag any unknown line, no matter the size.
- Query the odd $40 the same way you would query an odd $40,000. To an attacker, the first one is just reconnaissance for the second.
