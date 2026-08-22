# Congruence bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/congruence-bias
- Bias entry: https://keepsimple.io/uxcore/26-congruence-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

If a warning hands you the way to check whether it is real, that check runs on the attacker’s turf and can only ever pass.

## Scenario

A fraud alert claims someone is draining your Kestrel Bank account. Version one just says so, and you instinctively open your banking app to see for yourself. Version two adds "to confirm this is really us, call the number below or tap Verify". You take the test it offers, the test can only confirm, and the one check that could expose it, contacting the bank through a channel you already trust, is the one you skip.

## Why it works

This is congruence bias. When you form a hypothesis, "maybe this is real", you tend to test it only in ways that could confirm it, and you skip the tests that could prove it false. The attacker exploits that by handing you a confirming test on a plate: a number they answer, a Verify button they built. You run it, it passes, and your suspicion is "resolved". The one experiment that would actually settle it, an independent check they do not control, is exactly the one their helpfulness steers you around. A test that cannot fail is not verification, it is theatre.

## Defense

Your team can chase real fraud. It cannot help once you have "confirmed" the fake yourself.

- Only trust a check you chose. A phone number or button supplied by the message is part of the message, not proof of it.
- A real test is one that could show the thing is fake. If the check can only ever say "yes, legit", it proves nothing.
- Verify through a channel you already hold: the number on the back of your card, the app you installed yourself, never the contact in the alert.
- When a warning praises your suspicion and then hands you the way to lay it to rest, that is the trap doing its smoothest work.
