# Risk compensation in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/risk-compensation
- Bias entry: https://keepsimple.io/uxcore/78-risk-compensation
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A "verified safe" badge or "scanned and cleared" banner sitting inside the message that carries it was written by the sender, not by anything that inspected the file. The safety claim rides along with the risk it pretends to have checked.

## Scenario

An invoice email arrives with a green "verified safe, scanned and cleared" badge across the top of the message, put there by the same sender who attached the file. The badge does not change one byte of the attachment. What it changes is you: feeling covered, you open a document you would have looked at twice a moment ago. The felt safety spends the caution you would normally apply, and the attacker only needed you to feel protected, never to actually be.

## Why it works

This is risk compensation, the well-studied effect where a safety signal makes people behave more dangerously because they feel protected. Drivers with better brakes follow closer, and someone who believes an email was verified safe opens its attachment faster. The trick is that the reassurance and the risk arrive together: the "scanned and cleared" badge is written into the very message that carries the payload, so the attacker never has to make the file look safe, only make you feel safe. Your caution is a budget, and a self-applied badge spends it for you before you reach the attachment. The stronger the sense of coverage, the more risk you unconsciously take on to use it up, which is precisely backwards from what the words seem to promise.

## Defense

Real scanning happens silently in your mail gateway and endpoint tools. Distrusting a safety claim that travels next to the risky file is the move only you can make.

- A safety label attached to the thing it vouches for is a lure. Real protection verdicts live in your security tooling, never as a badge inside the message or on the site itself.
- Feeling protected is not being protected. Apply the same sender and file checks you would use if no badge or banner had appeared.
- Watch your own reasoning for "it says it was verified, so I can skip checking". That trade is the attack landing.
- Macro-enabled or executable attachments deserve the same scrutiny whether or not something on the page claims they were cleared. The claim costs the attacker nothing to add.
